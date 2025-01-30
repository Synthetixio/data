import re
import time
from pathlib import Path
from typing import Iterator
from web3._utils.abi import (
    get_abi_input_names,
    get_abi_input_types,
    get_abi_output_types,
)
import clickhouse_connect
from clickhouse_connect.driver.client import Client

from utils.utils import to_snake
from utils.constants import CLICKHOUSE_INTERNAL_PATH, DATA_PATH, SCHEMAS_PATH
from utils.log_utils import create_logger


def map_to_clickhouse_type(sol_type):
    """
    Map a Solidity type to a ClickHouse type
    """
    if sol_type in ["address", "string"] or sol_type.startswith("bytes"):
        return "String"
    elif re.match(r"uint\d+$", sol_type):
        bit_size = int(re.search(r"\d+", sol_type).group())
        if bit_size <= 8:
            return "UInt8"
        elif bit_size <= 16:
            return "UInt16"
        elif bit_size <= 32:
            return "UInt32"
        elif bit_size <= 64:
            return "UInt64"
        elif bit_size <= 128:
            return "UInt128"
        elif bit_size <= 256:
            return "UInt256"
    elif re.match(r"int\d+$", sol_type):
        bit_size = int(re.search(r"\d+", sol_type).group())
        if bit_size <= 8:
            return "Int8"
        elif bit_size <= 16:
            return "Int16"
        elif bit_size <= 32:
            return "Int32"
        elif bit_size <= 64:
            return "Int64"
        elif bit_size <= 128:
            return "Int128"
        elif bit_size <= 256:
            return "Int256"
    elif sol_type == "bool":
        return "Bool"
    elif sol_type.endswith("[]") or re.search(r"\(.*\)|\[\[$", sol_type):
        return "String"
    raise ValueError(f"Type {sol_type} not mapped")


class ClickhouseSchemaManager:
    def __init__(
        self,
        network_name: str,
        protocol_name: str,
        db_prefix: str = "raw",
    ):
        """Initialize ClickhouseSchemaManager to handle schema generation and table creation for
        protocol indexing.

        Creates and manages Clickhouse database schemas for blockchain events and functions.
        The manager generates table definitions, saves them to disk, and creates the corresponding
        tables in Clickhouse. Each table is prefixed with the protocol name and uses the specified
        network database.

        Args:
            network_name: Name of the blockchain network (e.g., "mainnet", "optimism")
            protocol_name: Name of the protocol being indexed (e.g., "synthetix")
            path: Output directory for schema SQL files. Defaults to "schemas"
            db_prefix: Prefix for the database name. Defaults to "raw"
                Final database name will be {db_prefix}_{network_name}
        """
        self.schemas_path = Path(SCHEMAS_PATH) / network_name / protocol_name
        self.schemas_path.mkdir(parents=True, exist_ok=True)
        self.network_name = network_name
        self.protocol_name = protocol_name
        self.db_name = f"{db_prefix}_{network_name}"
        self.schemas: list[tuple[str, str]] = []  # [(table_name, schema_sql)]
        self.client = self._get_clickhouse_client()
        self.logger = create_logger(
            "schema_manager",
            f"clickhouse_{self.network_name}_{self.protocol_name}.log",
        )

    def build_schemas_from_contract(self, abi: list[dict], contract_name: str) -> None:
        """Generate schemas from ABI events and functions

        Args:
            abi: Contract ABI as list of dictionaries
            contract_name: Name of the smart contract
        """
        events = [item for item in abi if item["type"] == "event"]
        functions = [item for item in abi if item["type"] == "function"]
        self._process_abi_items(contract_name, events, item_type="event")
        self._process_abi_items(contract_name, functions, item_type="function")
        self._build_schema_for_block()

    def save_schemas_to_disk(self):
        for schema in self.schemas:
            table_name, schema_sql = schema
            schema_file = self.schemas_path / f"{table_name}.sql"
            try:
                schema_file.write_text(schema_sql)
                self.logger.debug(f"Saved schema for {table_name}")
            except Exception as e:
                self.logger.error(f"Failed to save schema for {table_name}: {e}")
                raise e

    def create_tables_from_schemas(self, from_path: bool = False) -> None:
        """Create tables in ClickHouse from schemas"""
        self.logger.info(
            f"Creating tables for {self.protocol_name} on {self.network_name}"
        )

        schemas = self._get_schemas(from_path)
        for name, sql in schemas:
            try:
                self.client.command(sql)
            except Exception as e:
                self.logger.error(f"Failed to create table {name}: {e}")
                raise e

    def create_database(self) -> None:
        """Create database in ClickHouse if it doesn't exist"""
        try:
            self.client.command(f"CREATE DATABASE IF NOT EXISTS {self.db_name}")
            self.logger.info(f"Created/verified database {self.db_name}")
        except Exception as e:
            self.logger.error(f"Failed to create database {self.db_name}: {e}")
            raise e

    def _get_schemas(self, from_path: bool = False) -> Iterator[tuple[str, str]]:
        """Get schemas from memory or disk"""
        if from_path:
            for schema_file in self.schemas_path.glob("*sql"):
                yield schema_file.name, schema_file.read_text()
        else:
            yield from self.schemas

    def _process_abi_items(
        self, contract_name: str, items: list[dict], item_type: str
    ) -> None:
        """
        Process ABI items (events or functions) and create ClickHouse schemas

        Args:
            contract_name: Name of the contract
            items: List of ABI items (events or functions)
            item_type: Type of the item (event or function)
        """
        for item in items:
            item_name = to_snake(item["name"])
            contract_name = to_snake(contract_name)
            full_name = f"{self.protocol_name}_{contract_name}_{item_type}_{item_name}"

            fields = (
                self._get_event_fields(item)
                if item_type == "event"
                else self._get_function_fields(item)
            )

            if not fields:
                self.logger.debug(f"No fields found for {item_name}")
                continue

            schema = self._build_schema_for_item(
                item_name=full_name,
                item_type=item_type,
                fields=fields,
            )
            self.schemas.append((full_name, schema))

    def _build_schema_for_item(
        self,
        fields: list[tuple[str, str]],
        item_name: str,
        item_type: str = "event",
    ) -> str:
        """
        Generate a ClickHouse schema for an event or function
        """
        if item_type == "event":
            query = [
                f"CREATE TABLE IF NOT EXISTS {self.db_name}.{item_name} (",
                " `id` String,",
                " `block_number` UInt64,",
                " `block_timestamp` DateTime64(3, 'UTC'),",
                " `transaction_hash` String,",
                " `contract` String,",
                " `event_name` String,",
            ]
        elif item_type == "function":
            query = [
                f"CREATE TABLE IF NOT EXISTS {self.db_name}.{item_name} (",
                " `block_number` UInt64,",
                " `contract_address` String,",
                " `chain_id` UInt64,",
                " `file_location` String,",
            ]
        else:
            raise ValueError(f"Unknown item type {item_type}")

        for field_name, field_type in fields:
            if field_name == "id":
                clickhouse_type = "String"
                query.append(" `param_id` String,")
            else:
                clickhouse_type = map_to_clickhouse_type(field_type)
                query.append(f" `{to_snake(field_name)}` {clickhouse_type},")
        query[-1] = query[-1][:-1]
        query.append(") ENGINE = MergeTree() ORDER BY tuple();")
        return "\n".join(query)

    def _build_schema_for_block(self):
        """Generate block schema"""
        block_table_name = f"{self.protocol_name}_block"
        block_table_schema = (
            f"CREATE TABLE IF NOT EXISTS {self.db_name}.{block_table_name} (\n"
            " `id` String,\n"
            " `number` UInt64,\n"
            " `timestamp` DateTime64(3, 'UTC')\n"
            ") ENGINE = MergeTree() ORDER BY tuple();"
        )
        self.schemas.append((block_table_name, block_table_schema))

    def _get_event_fields(self, event: dict) -> list[tuple[str, str]]:
        """Get formatted input fields for an event"""
        input_names = get_abi_input_names(event)
        input_types = get_abi_input_types(event)
        fields = list(zip(input_names, input_types))
        return fields

    def _get_function_fields(self, func: dict) -> list[tuple[str, str]]:
        """Get formatted input and output fields for a function"""
        input_types = get_abi_input_types(func)
        input_names = get_abi_input_names(func)
        input_names = [
            f"input_{ind}" if name == "" else name
            for ind, name in enumerate(input_names)
        ]
        output_types = get_abi_output_types(func)
        output_names = [
            o.get("name", f"output_{ind}") for ind, o in enumerate(func["outputs"])
        ]
        output_names = [
            f"output_{ind}" if name == "" else name
            for ind, name in enumerate(output_names)
        ]

        all_names = input_names + output_names
        all_types = input_types + output_types

        # Check if function has valid outputs and input/output names
        no_outputs = len(output_types) == 0
        empty_names = "" in all_names
        type_mismatch = len(all_names) != len(all_types)
        if no_outputs or empty_names or type_mismatch:
            self.logger.debug(f"No fields found for {func['name']}")
            return []
        else:
            self.logger.debug(f"Running query for {func['name']}")

        fields = list(zip(all_names, all_types))
        return fields

    def _get_clickhouse_client(self) -> Client:
        client = clickhouse_connect.get_client(host="clickhouse", port=8123)
        return client


class ParquetImporter:
    """
    Class to import Parquet data into ClickHouse
    """

    def __init__(self, network_name: str, protocol_name: str, db_prefix: str = "raw"):
        self.network_name = network_name
        self.protocol_name = protocol_name
        self.db_name = f"{db_prefix}_{network_name}"
        self.client = self._get_clickhouse_client()
        self.data_path = Path(DATA_PATH) / network_name / protocol_name
        self.data_path.mkdir(parents=True, exist_ok=True)
        self.clickhouse_internal_path = (
            Path(CLICKHOUSE_INTERNAL_PATH) / network_name / protocol_name
        )
        self.logger = create_logger(
            f"importer.{self.protocol_name}.{self.network_name}",
            f"importer_{self.network_name}_{self.protocol_name}.log",
        )

    def import_directory(self, directory: str) -> int:
        """
        Import data from a single directory into ClickHouse
        """
        data_insertions = 0
        dir_path = self.data_path / directory

        for parquet_file in dir_path.glob("*.parquet"):
            event_name = parquet_file.stem
            if event_name == "transaction":
                continue

            table_name = f"{self.protocol_name}_{event_name}"
            clickhouse_file_path = (
                self.clickhouse_internal_path / directory / f"{event_name}.parquet"
            )

            try:
                self._insert_data_from_path(
                    table_name,
                    clickhouse_file_path,
                    [directory],
                )
                data_insertions += 1
            except Exception as e:
                self.logger.error(
                    f"Error processing {event_name} from {directory}: {e}"
                )
        self.logger.info(f"Processed {data_insertions} insertions for {directory}")
        return data_insertions

    def import_batch(self, batch: list[str]):
        """
        Import a batch of data directories
        """
        any_dir = batch[0]
        dir_path = self.data_path / any_dir
        event_list = []
        for parquet_file in dir_path.glob("*.parquet"):
            event_list.append(parquet_file.stem)

        for event in event_list:
            if event == "transaction":
                continue
            table_name = f"{self.protocol_name}_{event}"
            clickhouse_file_path = (
                self.clickhouse_internal_path / "*" / f"{event}.parquet"
            )
            self._insert_data_from_path(table_name, clickhouse_file_path, batch)
            self.logger.info(f"Inserted {event} from batch")

    def import_data(self, batch_size: int = 100):
        """
        Import all new data in batches of size batch_size
        """
        dirs_to_import = self._get_new_data_directories()
        dirs_to_import_batched = [
            dirs_to_import[i : i + batch_size]
            for i in range(0, len(dirs_to_import), batch_size)
        ]
        total_insertions = 0

        time_start = time.time()
        for dir_batch in dirs_to_import_batched:
            self.import_batch(dir_batch)
        time_end = time.time()
        self.logger.info(f"Time taken: {time_end - time_start} seconds")
    
    def _insert_data_from_path(
        self,
        table_name: str,
        path: str,
        ranges_pattern: list[str] = None,
    ):
        """
        Insert data from a single Parquet file into ClickHouse
        """
        columns_query = f"describe file('{path}', 'Parquet')"
        columns = self.client.query(columns_query).named_results()
        column_mappings = [
            f"{col['name']} as {to_snake(col['name'])}" for col in columns
        ]
        select_expr = ", ".join(column_mappings)
        query = (
            f"insert into {self.db_name}.{table_name} "
            f"select {select_expr} from file('{path}', 'Parquet') "
            f"where _path not like '%-temp-%' "
        )
        if ranges_pattern is not None:
            query += f"and match(_path, '{'|'.join(ranges_pattern)}')"
        self.client.command(query)

    def _get_max_block_number(self):
        """
        Get the maximum block number from the block table
        """
        table_name = f"{self.protocol_name}_block"

        db_exists = self.client.command(f"exists database {self.db_name}")
        if not db_exists:
            raise ValueError(f"Database {self.db_name} does not exist")

        table_exists = self.client.command(f"exists table {self.db_name}.{table_name}")
        if not table_exists:
            self.logger.info(
                f"Table {table_name} does not exist. Indexing from scratch."
            )
            return None

        query = f"select max(number) from {self.db_name}.{table_name} where id != '' and id is not null"
        try:
            result = self.client.command(query)
            return result
        except Exception as e:
            raise ValueError(f"Error getting max block number: {e}")

    def _get_new_data_directories(self):
        """
        Get the new data directories to import
        """
        db_exists = self.client.command(f"exists database {self.db_name}")
        if not db_exists:
            raise ValueError(f"Database {self.db_name} does not exist")

        max_block = self._get_max_block_number()

        new_dirs = []
        for dir_path in self.data_path.iterdir():
            if not dir_path.is_dir():
                continue
            if not re.match(r"^\d+-\d+$", dir_path.name):
                continue
            try:
                start_block = int(dir_path.name.split("-")[0])
                if start_block > max_block or max_block is None:
                    new_dirs.append(dir_path.name)
            except (ValueError, IndexError):
                self.logger.error(
                    f"Error parsing block number from directory name: {dir_path.name}"
                )
                continue
        return sorted(new_dirs, key=lambda x: int(x.split("-")[0]))

    def _get_clickhouse_client(self):
        return clickhouse_connect.get_client(
            host="clickhouse",
            port=8123,
        )
