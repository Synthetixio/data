import os
from pathlib import Path
import re
from web3._utils.abi import get_abi_output_types, get_abi_input_types
from eth_abi import decode
from eth_utils import decode_hex
import pandas as pd


def fix_labels(labels):
    return [
        f"value_{i + 1}" if label == "" else label for i, label in enumerate(labels)
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


def camel_to_snake(name):
    name = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name).lower()
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


def clean_data(chain_name, contract, function_name, write=True):
    input_labels, output_labels = get_labels(contract, function_name)

    # fix labels
    input_labels = fix_labels(input_labels)
    output_labels = fix_labels(output_labels)

    # read and dedupe the data
    df = pd.read_parquet(f"/parquet-data/raw/{chain_name}/{function_name}")
    df = df.drop_duplicates()

    # replace all 0x with None
    df = df.applymap(lambda x: None if x == "0x" else x)

    # decode the data
    df[input_labels] = (
        df["call_data"]
        .apply(
            lambda x: (
                (
                    str(i)
                    for i in decode_data(
                        contract, function_name, decode_hex(f"0x{x[10:]}")
                    )
                )
                if x
                else None
            )
        )
        .apply(pd.Series)
    )

    df[output_labels] = (
        df["output_data"]
        .apply(
            lambda x: (
                (
                    str(i)
                    for i in decode_data(
                        contract, function_name, decode_hex(x), is_input=False
                    )
                )
                if x
                else None
            )
        )
        .apply(pd.Series)
    )

    # write the data
    if write:
        file_path = f"/parquet-data/clean/{chain_name}/{function_name}.parquet"

        ensure_directory_exists(file_path)
        df.to_parquet(file_path)

    return df
