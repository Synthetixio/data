import argparse

from utils.clickhouse_utils import ParquetImporter, ClickhouseSchemaManager
from utils.log_utils import create_logger

logger = create_logger(__name__, "import_parquet.log")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network", type=str, required=True)
    parser.add_argument("--protocol", type=str, required=True)
    args = parser.parse_args()

    schema_manager = ClickhouseSchemaManager(args.network, args.protocol)
    schema_manager.create_database()
    schema_manager.create_tables_from_schemas(from_path=True)

    importer = ParquetImporter(args.network, args.protocol)
    importer.import_data()
    logger.info("Data imported successfully")