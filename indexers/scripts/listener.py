import argparse
import os
from pathlib import Path
import time
import re
import pandas as pd
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import clickhouse_connect
from clickhouse_connect.driver.client import Client

CLICKHOUSE_INTERNAL_PATH = "/var/lib/clickhouse/user_files/parquet-data/indexers/clean"
RAW_DATA_PATH = "/parquet-data/indexers/raw"
CLEAN_DATA_PATH = "/parquet-data/indexers/clean"


def convert_case(name):
    snake_case = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return snake_case


def create_table(
    client: Client,
    network: str,
    protocol: str,
    event: str,
):
    table_name = f"{network}.{protocol}_{convert_case(event)}"
    file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{network}/{protocol}/{event}/*.parquet"
    query = (
        f"create table if not exists {table_name} "
        f"engine = MergeTree order by tuple() as "
        f"select * from file('{file_path}', 'Parquet')"
    )
    client.command(query)


def insert_data(
    client: Client, network: str, protocol: str, event: str, block_range: str
):
    table_name = f"{network}.{protocol}_{convert_case(event)}"
    file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{network}/{protocol}/{event}/{event}_{block_range}.parquet"
    query = f"insert into {table_name} select * from file('{file_path}', 'Parquet')"
    client.command(query)


class FolderEventHandler(FileSystemEventHandler):
    def __init__(self):
        super().__init__()
        self.source_path = Path(f"{RAW_DATA_PATH}")
        self.target_path = Path(f"{CLEAN_DATA_PATH}")
        if not self.source_path.exists():
            print(f"Creating source path {self.source_path}")
            self.source_path.mkdir(parents=True, exist_ok=True)
        if not self.target_path.exists():
            print(f"Creating target path {self.target_path}")
            self.target_path.mkdir(parents=True, exist_ok=True)
        self.client = clickhouse_connect.get_client(
            host="clickhouse", port=8123, user="default"
        )

    def on_moved(self, event):
        # Subsquid creates a temp directory for each block range
        # and then renames it once the files are written
        if event.is_directory:
            self._clean_parquet(event.dest_path)

    def _clean_parquet(self, path: str):
        path = Path(path)
        block_range = path.name
        protocol_name = path.parent.name
        network_name = path.parent.parent.name

        # Initialize counters
        empty_files = 0
        written_files = 0
        tables_created = 0
        data_insertions = 0

        for parquet_file in path.glob("*.parquet"):
            event_name = parquet_file.stem
            event_dir = (
                self.target_path / f"{network_name}" / f"{protocol_name}" / event_name
            )
            output_file = event_dir / f"{event_name}_{block_range}.parquet"
            df = pd.read_parquet(parquet_file)
            if df.empty:
                empty_files += 1
                continue
            output_file.parent.mkdir(parents=True, exist_ok=True)
            df.to_parquet(output_file, index=False)
            written_files += 1

            # import data into clickhouse
            if not self.client.command(
                f"exists {network_name}.{protocol_name}_{event_name}"
            ):
                create_table(self.client, network_name, protocol_name, event_name)
                tables_created += 1
            else:
                insert_data(
                    self.client, network_name, protocol_name, event_name, block_range
                )
                data_insertions += 1

        print(
            f"Processed {block_range}: empty files {empty_files}, written files {written_files}, tables created {tables_created}, data insertions {data_insertions}"
        )


def main():
    event_handler = FolderEventHandler()
    observer = Observer()
    observer.schedule(event_handler, event_handler.source_path, recursive=True)

    print(f"Watching {event_handler.source_path} for new files")
    observer.start()

    while True:
        time.sleep(1)

    observer.join()


if __name__ == "__main__":
    main()
