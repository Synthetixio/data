import argparse
from pathlib import Path
import pandas as pd
import os


def clean_parquet_files(network_name: str, protocol: str):
    source_base = f"parquet-data/indexers/raw/{network_name}/{protocol}"
    target_base = f"parquet-data/indexers/clean/{network_name}/{protocol}"

    protocol_path = Path(source_base)
    if not protocol_path.exists():
        raise ValueError(f"Source path {source_base} does not exist")
    Path(target_base).mkdir(parents=True, exist_ok=True)

    for block_range_dir in protocol_path.iterdir():
        if not block_range_dir.is_dir():
            continue
        block_range = block_range_dir.name

        for parquet_file in block_range_dir.glob("*.parquet"):
            event_name = parquet_file.stem
            event_dir = Path(target_base) / event_name
            output_file = event_dir / f"{event_name}_{block_range}.parquet"

            # Skip if file already exists
            if output_file.exists():
                continue

            df = pd.read_parquet(parquet_file)
            event_dir.mkdir(parents=True, exist_ok=True)
            df.to_parquet(output_file, index=False)
        print(f"Processed {protocol} {block_range}")


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
