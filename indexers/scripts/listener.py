from pathlib import Path
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from utils.constants import DATA_PATH
from utils.clickhouse_utils import ParquetImporter
from utils.log_utils import create_logger

logger = create_logger(__name__, "listener.log")


class FolderEventHandler(FileSystemEventHandler):
    """
    Class to handle new directories in the data path
    """
    def __init__(self):
        super().__init__()
        self.importers = {}

    def on_moved(self, event):
        # Subsquid creates a temp directory for each block range
        # and then renames it once the files are written
        if event.is_directory:
            self._process_new_directory(event.dest_path)

    def _process_new_directory(self, path: str):
        path = Path(path)
        dir_name = path.name
        protocol_name = path.parent.name
        network_name = path.parent.parent.name

        importer_key = f"{network_name}_{protocol_name}"
        if importer_key not in self.importers:
            self.importers[importer_key] = ParquetImporter(
                network_name,
                protocol_name,
            )

        importer = self.importers[importer_key]
        insertions = importer.import_directory(dir_name)

def main():
    data_path = Path(f"{DATA_PATH}")
    if not data_path.exists():
        logger.info(f"Creating source path {data_path}")
        data_path.mkdir(parents=True, exist_ok=True)

    event_handler = FolderEventHandler()
    observer = Observer()
    observer.schedule(event_handler, data_path, recursive=True)

    logger.info(f"Watching {data_path} for new files")
    observer.start()

    while True:
        time.sleep(1)

    observer.join()


if __name__ == "__main__":
    main()
