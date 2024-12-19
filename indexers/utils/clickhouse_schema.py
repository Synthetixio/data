import re
from pathlib import Path
from web3._utils.abi import (
    get_abi_input_names,
    get_abi_input_types,
    get_abi_output_types,
)


def to_snake(name):
    snake_name = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return snake_name


def map_to_clickhouse_type(sol_type):
    if sol_type in ["address", "string"] or sol_type.startswith("bytes"):
        return "String"
    elif re.search(r"\(.*\)|\[\[$", sol_type):
        return "JSON"
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
    elif sol_type.endswith("[]"):
        base_type = sol_type[:-2]
        clickhouse_type = f"Array({map_to_clickhouse_type(base_type)})"
        return clickhouse_type
    raise ValueError(f"Type {sol_type} not mapped")


def generate_clickhouse_schema(event_name, fields, network_name, protocol_name):
    query = [
        f"CREATE TABLE IF NOT EXISTS raw_{network_name}.{protocol_name}_{event_name} (",
        " `id` String,",
        " `block_number` UInt64,",
        " `block_timestamp` DateTime64(3, 'UTC'),",
        " `transaction_hash` String,",
        " `contract` String,",
        " `event_name` String,",
    ]
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


def save_clickhouse_schema(path, event_name, schema):
    path = Path(path)
    path.mkdir(parents=True, exist_ok=True)

    schema_file = path / f"{event_name}.sql"
    schema_file.write_text(schema)


def process_abi_schemas(client, abi, path, contract_name, network_name, protocol_name):
    """
    Process an ABI to generate ClickHouse schemas for all events.

    Args:
        abi: The contract ABI
        output_path: Path where schema files will be saved
        contract_name: Name of the contract (used for namespacing)
    """
    # do events
    events = [item for item in abi if item["type"] == "event"]

    for event in events:
        event_name = to_snake(event["name"])
        contract_name = to_snake(contract_name)
        event_name = f"{contract_name}_event_{event_name}"

        input_names = get_abi_input_names(event)
        input_types = get_abi_input_types(event)
        fields = list(zip(input_names, input_types))

        schema = generate_clickhouse_schema(
            event_name=event_name,
            fields=fields,
            network_name=network_name,
            protocol_name=protocol_name,
        )
        client.command(schema)
        save_clickhouse_schema(path=path, event_name=event_name, schema=schema)

    # do functions
    functions = [item for item in abi if item["type"] == "function"]

    for f in functions:
        function_name = to_snake(f["name"])
        contract_name = to_snake(contract_name)
        function_name = f"{contract_name}_function_{function_name}"

        input_types = get_abi_input_types(f)
        input_names = get_abi_input_names(f)
        output_types = get_abi_output_types(f)
        output_names = [
            o["name"] if "name" in o else f"output_{ind}"
            for ind, o in enumerate(f["outputs"])
        ]

        all_names = input_names + output_names
        all_types = input_types + output_types

        no_outputs = len(output_types) == 0
        empty_names = "" in all_names
        type_mismatch = len(all_names) != len(all_types)
        if no_outputs or empty_names or type_mismatch:
            continue
        else:
            print(f"Running query for {function_name}")
        fields = list(zip(all_names, all_types))

        schema = generate_clickhouse_schema(
            event_name=function_name,
            fields=fields,
            network_name=network_name,
            protocol_name=protocol_name,
        )
        client.command(schema)
        save_clickhouse_schema(path=path, event_name=function_name, schema=schema)

    # do the blocks
    block_schema = (
        f"CREATE TABLE IF NOT EXISTS raw_{network_name}.{protocol_name}_block (\n"
        " `number` UInt64,\n"
        " `timestamp` DateTime64(3, 'UTC')\n"
        ") ENGINE = MergeTree() ORDER BY tuple();"
    )
    client.command(block_schema)
    save_clickhouse_schema(path=path, event_name="block", schema=block_schema)
