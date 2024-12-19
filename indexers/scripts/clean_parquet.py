import argparse
from pathlib import Path
import pandas as pd
import os
from utils import convert_case

RAW_DATA_PATH = "/parquet-data/indexers/raw"
CLEAN_DATA_PATH = "/parquet-data/indexers/clean"


def clean_parquet_files(network_name: str, protocol_name: str):
    raw_path = Path(f"{RAW_DATA_PATH}/{network_name}/{protocol_name}")
    clean_path = Path(f"{CLEAN_DATA_PATH}/{network_name}/{protocol_name}")

    if not raw_path.exists():
        raise ValueError(f"Source path {raw_path} does not exist")

    clean_path.mkdir(parents=True, exist_ok=True)

    for block_range_dir in sorted(raw_path.iterdir()):
        if not block_range_dir.is_dir():
            continue
        if "temp" in block_range_dir.name:
            continue
        block_range = block_range_dir.name

        empty_files = 0
        written_files = 0
        for parquet_file in block_range_dir.glob("*.parquet"):
            event_name = parquet_file.stem
            event_dir = clean_path / event_name
            output_file = event_dir / f"{event_name}_{block_range}.parquet"
            if output_file.exists():
                continue
            df = pd.read_parquet(parquet_file)
            if df.empty:
                empty_files += 1
                continue
            df.columns = [convert_case(col) for col in df.columns]
            event_dir.mkdir(parents=True, exist_ok=True)
            df.to_parquet(output_file, index=False)
            written_files += 1
        print(
            f"Processed {network_name}.{protocol_name}.{block_range}:\n"
            f"\t empty raw files {empty_files}\n"
            f"\t written files {written_files}"
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network_name", type=str)
    parser.add_argument("--protocol_name", type=str)
    args = parser.parse_args()

    network_name = os.getenv("NETWORK_NAME") or args.network_name
    protocol_name = os.getenv("PROTOCOL_NAME") or args.protocol_name

    print(f"Cleaning {network_name} {protocol_name}")

    if network_name is None or protocol_name is None:
        raise ValueError("Network and protocol must be provided")

    clean_parquet_files(network_name, protocol_name)
