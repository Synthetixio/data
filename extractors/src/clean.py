from pathlib import Path
import re
from web3._utils.abi import get_abi_output_types, get_abi_input_types
from eth_abi import decode
from eth_utils import decode_hex
import polars as pl
import duckdb
from .insert import insert_data, insert_blocks


def fix_labels(labels, default_label="value"):
    return [
        f"{default_label}_{i}" if label == "" else label
        for i, label in enumerate(labels)
    ]


def ensure_directory_exists(file_path):
    # Use pathlib to handle path operations
    directory = Path(file_path).parent
    # Create the directory if it does not exist
    directory.mkdir(parents=True, exist_ok=True)


def decode_data(contract, function_name, result, is_input=True):
    # get the function abi
    func_abi = contract.get_function_by_name(function_name).abi
    if is_input:
        types = get_abi_input_types(func_abi)
    else:
        types = get_abi_output_types(func_abi)

    # decode the result
    return decode(types, result)


def decode_call(contract, function_name, call):
    if call is None or call == "0x":
        return None
    else:
        decoded = [
            str(i)
            for i in decode_data(
                contract, function_name, decode_hex(f"0x{call[10:]}"), is_input=True
            )
        ]
        return decoded


def decode_output(contract, function_name, call):
    if call is None or call == "0x":
        return None
    else:
        return [
            str(i)
            for i in decode_data(
                contract, function_name, decode_hex(call), is_input=False
            )
        ]


def camel_to_snake(name):
    name = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return name


def get_labels(contract, function_name):
    functions = contract.find_functions_by_name(function_name)
    if len(functions) > 0:
        function = functions[0]
    else:
        raise ValueError(f"Function {function_name} not found in contract")

    input_names = [camel_to_snake(i["name"]) for i in function.abi["inputs"]]
    output_names = [camel_to_snake(i["name"]) for i in function.abi["outputs"]]

    return input_names, output_names


def clean_data(
    chain_name, protocol, contract, contract_name, function_name, write=True
):
    function_name_snake = camel_to_snake(function_name)
    contract_name_snake = camel_to_snake(contract_name)
    directory_name = f"{contract_name_snake}_function_{function_name_snake}"
    input_labels, output_labels = get_labels(contract, function_name)

    # fix labels
    input_labels = fix_labels(input_labels, default_label="input")
    output_labels = fix_labels(output_labels, default_label="output")

    # read and dedupe the data
    df = duckdb.sql(
        f"""
        SELECT DISTINCT *
        FROM '../parquet-data/extractors/raw/{chain_name}/{protocol}/{directory_name}/*.parquet'
        WHERE
            call_data IS NOT NULL
            AND output_data IS NOT NULL
            AND output_data != '0x'
        ORDER BY block_number
    """
    ).pl()

    # Decode call_data and output_data, then convert lists to multiple columns
    df = df.with_columns(
        [
            pl.col("call_data")
            .map_elements(lambda call: decode_call(contract, function_name, call))
            .alias("decoded_call_data"),
            pl.col("output_data")
            .map_elements(lambda output: decode_output(contract, function_name, output))
            .alias("decoded_output_data"),
            pl.col("block_number").cast(pl.Int64),
        ]
    )

    # Expand decoded_call_data into separate columns based on input_labels
    for i, label in enumerate(input_labels):
        df = df.with_columns(
            pl.col("decoded_call_data").map_elements(lambda x: x[i]).alias(label)
        )

    # Expand outputs into separate columns based on output_labels
    for i, label in enumerate(output_labels):
        df = df.with_columns(
            pl.col("decoded_output_data").map_elements(lambda x: x[i]).alias(label)
        )

    # Remove the original list columns if no longer needed
    df = df.drop(
        ["call_data", "output_data", "decoded_call_data", "decoded_output_data"]
    )

    # write the data
    if write:
        file_path = f"../parquet-data/extractors/clean/{chain_name}/{protocol}/{directory_name}/{directory_name}.parquet"

        ensure_directory_exists(file_path)
        # write the data
        duckdb.sql(
            f"""
            COPY df to '{file_path}' (FORMAT PARQUET, OVERWRITE_OR_IGNORE)
        """
        )

        # insert to clickhouse
        insert_data(chain_name, protocol, contract_name_snake, function_name_snake)

    return df


def clean_blocks(chain_name, protocol, write=True):
    # read the data
    df = duckdb.sql(
        f"""
        SELECT DISTINCT
            CAST(timestamp as BIGINT) as timestamp,
            CAST(block_number as BIGINT) as block_number
        FROM '/parquet-data/extractors/raw/{chain_name}/{protocol}/blocks/*.parquet'
        ORDER BY block_number
    """
    )

    # write the data
    if write:
        file_path = (
            f"/parquet-data/extractors/clean/{chain_name}/{protocol}/blocks.parquet"
        )

        ensure_directory_exists(file_path)

        # write the data
        duckdb.sql(
            f"""
            COPY df to '{file_path}' (FORMAT PARQUET, OVERWRITE_OR_IGNORE)
        """
        )

        insert_blocks(chain_name, protocol)

    return df
