from pathlib import Path
import time
import pandas as pd
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import clickhouse_connect

from utils.clickhouse_utils import (
    insert_data_from_path,
    init_tables_from_schemas,
)

CLICKHOUSE_INTERNAL_PATH = "/var/lib/clickhouse/user_files/parquet-data/indexers/raw"
DATA_PATH = "/parquet-data/indexers/raw"


class FolderEventHandler(FileSystemEventHandler):
    def __init__(self):
        super().__init__()
        self.data_path = Path(f"{DATA_PATH}")
        self.clickhouse_path = Path(f"{CLICKHOUSE_INTERNAL_PATH}")
        if not self.data_path.exists():
            print(f"Creating source path {self.data_path}")
            self.data_path.mkdir(parents=True, exist_ok=True)
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

        data_insertions = 0

        for parquet_file in path.glob("*.parquet"):
            event_name = parquet_file.stem
            if event_name == "transaction":
                continue

            # Import data into clickhouse
            table_name = f"{protocol_name}_{event_name}"
            clickhouse_file_path = f"{self.clickhouse_path}/{network_name}/{protocol_name}/{block_range}/{event_name}.parquet"

            insert_data_from_path(
                self.client, db_name, table_name, clickhouse_file_path
            )
            data_insertions += 1

        print(
            f"Processed {network_name}.{protocol_name}.{block_range}: {data_insertions}"
        )


def main():
    event_handler = FolderEventHandler()
    observer = Observer()
    observer.schedule(event_handler, event_handler.data_path, recursive=True)

    print(f"Watching {event_handler.data_path} for new files")
    observer.start()

    while True:
        time.sleep(1)

    observer.join()


if __name__ == "__main__":
    main()
