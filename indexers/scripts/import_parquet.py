import argparse

from utils.clickhouse_utils import ParquetImporter


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network", type=str, required=True)
    parser.add_argument("--protocol", type=str, required=True)
    args = parser.parse_args()

    importer = ParquetImporter(args.network, args.protocol)
    importer.import_data()
