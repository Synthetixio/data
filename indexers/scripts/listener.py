from pathlib import Path
import time
import pandas as pd
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import clickhouse_connect

from utils.clickhouse_utils import (
    create_table_from_path, 
    insert_data_from_path, 
)
from utils.utils import (
    to_snake,
)

CLICKHOUSE_INTERNAL_PATH = "/var/lib/clickhouse/user_files/parquet-data/indexers/clean"
RAW_DATA_PATH = "/parquet-data/indexers/raw"
CLEAN_DATA_PATH = "/parquet-data/indexers/clean"


class FolderEventHandler(FileSystemEventHandler):
    def __init__(self):
        super().__init__()
        self.source_path = Path(f"{RAW_DATA_PATH}")
        self.target_path = Path(f"{CLEAN_DATA_PATH}")
        self.clickhouse_path = Path(f"{CLICKHOUSE_INTERNAL_PATH}")
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
        db_name = f"raw_{network_name}"

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
            output_file.parent.mkdir(parents=True, exist_ok=True)

            # Move file to target directory
            df = pd.read_parquet(parquet_file)
            if df.empty:
                empty_files += 1
                continue
            df.columns = [to_snake(col) for col in df.columns]
            df.to_parquet(output_file, index=False)
            written_files += 1

            # Import data into clickhouse
            table_name = f"{protocol_name}_{event_name}"
            clickhouse_file_path = f"{self.clickhouse_path}/{network_name}/{protocol_name}/{event_name}/{event_name}_{block_range}.parquet"
            if not self.client.command(f"exists {db_name}.{table_name}"):
                create_table_from_path(
                    self.client, db_name, table_name, clickhouse_file_path
                )
                tables_created += 1
            else:
                insert_data_from_path(
                    self.client, db_name, table_name, clickhouse_file_path
                )
                data_insertions += 1

        print(
            f"Processed {network_name}.{protocol_name}.{block_range}: "
            f"empty files {empty_files}, written files {written_files}, "
            f"tables created {tables_created}, data insertions {data_insertions}"
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
