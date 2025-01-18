import re
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

DB_PREFIX = "raw"


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


class ClickhouseManager:
    def __init__(
        self,
        path: Path | str,
        network_name: str,
        protocol_name: str,
    ):
        """Initialize ABI schema generator.
        
        Args:
            path: Output path for schema files
            network_name: Name of the network
            protocol_name: Name of the protocol
        """
        self.path = Path(path)
        self.path.mkdir(parents=True, exist_ok=True)
        self.network_name = network_name
        self.protocol_name = protocol_name
        self.db_name = f"{DB_PREFIX}_{network_name}"
        self.schemas: list[tuple[str, str]] = [] # [(table_name, schema_sql)]
        self.client = self._get_clickhouse_client()

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
            schema_file = self.path / f"{table_name}.sql"
            try:
                schema_file.write_text(schema_sql)
                print(f"Saved schema for {table_name}")
            except Exception as e:
                print(f"Failed to save schema for {table_name}: {e}")
                raise e

    def create_tables_from_schemas(self, from_path: bool = False) -> None:
        """Create tables in ClickHouse from schemas"""
        print(f"Creating tables for {self.protocol_name} on {self.network_name}")

        self.client.command(f"CREATE DATABASE IF NOT EXISTS {self.db_name}")

        schemas = self._get_schemas(from_path)
        for name, sql in schemas:
            try:
                self.client.command(sql)
            except Exception as e:
                print(f"Failed to create table {name}: {e}")
                raise e

    def _get_schemas(self, from_path: bool = False) -> Iterator[tuple[str, str]]:
        """Get schemas from memory or disk"""
        if from_path:
            for schema_file in self.path.glob("*sql"):
                yield schema_file.name, schema_file.read_text()
        else:
            yield from self.schemas

    def _process_abi_items(
        self, 
        contract_name: str, 
        items: list[dict], 
        item_type: str
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
                print(f"No fields found for {item_name}")
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
            o.get("name", f"output_{ind}")
            for ind, o in enumerate(func["outputs"])
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
            print(f"No fields found for {func['name']}")
            return []
        else:
            print(f"Running query for {func['name']}")
        
        fields = list(zip(all_names, all_types))
        return fields

    def _get_clickhouse_client(self) -> Client:
        client = clickhouse_connect.get_client(host="clickhouse", port=8123)
        return client



def insert_data_from_path(
    client: Client,
    db_name: str,
    table_name: str,
    path: str,
    ranges_pattern: list[str] = None,
):
    columns_query = f"describe file('{path}', 'Parquet')"
    columns = client.query(columns_query).named_results()
    column_mappings = [
        f"{col['name']} as {to_snake(col['name'])}"
        for col in columns
    ]
    select_expr = ", ".join(column_mappings)
    query = (
        f"insert into {db_name}.{table_name} "
        f"select {select_expr} from file('{path}', 'Parquet') "
        f"where _path not like '%-temp-%' "
    )
    if ranges_pattern is not None:
        query += f"and match(_path, '{'|'.join(ranges_pattern)}')"
    client.command(query)
