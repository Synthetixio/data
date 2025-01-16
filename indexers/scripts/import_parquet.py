import argparse
import os
import time
import re
import sys
from pathlib import Path
import clickhouse_connect
import logging
from datetime import datetime

from utils.clickhouse_utils import (
    init_tables_from_schemas,
    insert_data_from_path,
)
from utils.utils import get_event_list_from_file_names

CLICKHOUSE_INTERNAL_PATH = "/var/lib/clickhouse/user_files/parquet-data/indexers/raw"
DATA_PATH = "/parquet-data/indexers/raw"
SCHEMAS_PATH = "/parquet-data/indexers/schemas"


def setup_logging(network_name: str, protocol_name: str):
    log_dir = Path("logs") / network_name / protocol_name
    log_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    log_file = log_dir / f"import_parquet_{timestamp}.log"

    # Create a formatter to be used by both handlers
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    # Get the root logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Clear any existing handlers
    logger.handlers.clear()

    # File handler
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Console handler (will show in Docker logs)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    logging.info(f"Logging setup complete. Writing to {log_file}")

def get_max_block_number(client, network_name: str, protocol_name: str):
    db_name = f"raw_{network_name}"
    table_name = f"{protocol_name}_block"

    db_exists = client.command(f"exists database {db_name}")
    if not db_exists:
        raise ValueError(f"Database {db_name} does not exist")

    table_exists = client.command(f"exists table {db_name}.{table_name}")
    if not table_exists:
        logging.info(f"Table {table_name} does not exist. Indexing from scratch.")
        return None

    query = f"select max(number) from {db_name}.{table_name}"
    try:
        result = client.command(query)
        return result
    except Exception as e:
        raise ValueError(f"Error getting max block number: {e}")


def get_new_data_directories(client, network_name: str, protocol_name: str):
    db_name = f"raw_{network_name}"
    db_exists = client.command(f"exists database {db_name}")
    if not db_exists:
        raise ValueError(f"Database {db_name} does not exist")

    max_block = get_max_block_number(client, network_name, protocol_name)
    data_path = Path(f"{DATA_PATH}/{network_name}/{protocol_name}")

    new_dirs = []
    for dir_path in data_path.iterdir():
        if not dir_path.is_dir():
            continue
        if not re.match(r'^\d+-\d+$', dir_path.name):
            continue
        try:
            start_block = int(dir_path.name.split("-")[0])
            if start_block > max_block or max_block is None:
                new_dirs.append(dir_path.name)
        except (ValueError, IndexError):
            print(f"Error parsing block number from directory name: {dir_path.name}")
            continue
    return sorted(new_dirs, key=lambda x: int(x.split("-")[0]))


def import_parquet_files(client, network_name: str, protocol_name: str, batch_size: int = 100):
    print(f"Inserting {network_name} {protocol_name} data into tables")
    raw_path = Path(f"{DATA_PATH}/{network_name}/{protocol_name}")
    db_name = f"raw_{network_name}"

    event_list = get_event_list_from_file_names(raw_path, network_name, raw_path)

    dirs_to_import = get_new_data_directories(client, network_name, protocol_name)
    dirs_to_import_batched = [
        dirs_to_import[i : i + batch_size] for i in range(0, len(dirs_to_import), batch_size)
    ]

    time_start = time.time()
    for event_name in event_list:
        table_name = f"{protocol_name}_{event_name}"
        file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{network_name}/{protocol_name}/*/{event_name}.parquet"

        for dir_batch in dirs_to_import_batched:
            try:
                insert_data_from_path(client, db_name, table_name, file_path, dir_batch)
                logging.info(f"Processed {len(dir_batch)} directories into {table_name}")
            except Exception as e:
                logging.error(f"Error inserting data into {table_name}: {e}")
    time_end = time.time()
    print(f"Time taken: {time_end - time_start} seconds")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network_name", type=str)
    parser.add_argument("--protocol_name", type=str)
    args = parser.parse_args()

    network_name = os.getenv("NETWORK_NAME") or args.network_name
    protocol_name = os.getenv("PROTOCOL_NAME") or args.protocol_name

    if network_name is None or protocol_name is None:
        raise ValueError("Network and protocol must be provided")

    client = clickhouse_connect.get_client(
        host="clickhouse",
        port=8123,
        username="default",
    )

    db_name = f"raw_{network_name}"
    client.command(f"CREATE DATABASE IF NOT EXISTS {db_name}")

    setup_logging(network_name, protocol_name)

    init_tables_from_schemas(client, network_name, protocol_name, SCHEMAS_PATH)
    import_parquet_files(client, network_name, protocol_name)
