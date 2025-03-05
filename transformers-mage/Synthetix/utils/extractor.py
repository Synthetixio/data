import os
import yaml
from pathlib import Path
import re
import polars as pl
import duckdb
import cryo
from synthetix import Synthetix
from web3._utils.abi import get_abi_output_types, get_abi_input_types
from eth_abi import decode
from eth_utils import decode_hex

# Chain configuration
CHAIN_CONFIGS = {
    1: {
        "name": "eth_mainnet",
        "rpc": os.getenv("NETWORK_1_RPC"),
        "network_id": 1,
        "cannon_config": {
            "package": "synthetix-omnibus",
            "version": "latest",
            "preset": "main"
        }
    },
    10: {
        "name": "optimism_mainnet",
        "rpc": os.getenv("NETWORK_10_RPC"),
        "network_id": 10,
    },
    8453: {
        "name": "base_mainnet",
        "rpc": os.getenv("NETWORK_8453_RPC"),
        "network_id": 8453,
    },
    84532: {
        "name": "base_sepolia",
        "rpc": os.getenv("NETWORK_84532_RPC"),
        "network_id": 84532,
    },
    42161: {
        "name": "arbitrum_mainnet",
        "rpc": os.getenv("NETWORK_42161_RPC"),
        "network_id": 42161,
    },
    421614: {
        "name": "arbitrum_sepolia",
        "rpc": os.getenv("NETWORK_421614_RPC"),
        "network_id": 421614,
    },
}

# Utility functions
def fix_labels(labels):
    return [f"value_{i + 1}" if label == "" else label for i, label in enumerate(labels)]

def ensure_directory_exists(file_path):
    directory = Path(file_path).parent
    directory.mkdir(parents=True, exist_ok=True)

def decode_data(contract, function_name, result, is_input=True):
    func_abi = contract.get_function_by_name(function_name).abi
    if is_input:
        types = get_abi_input_types(func_abi)
    else:
        types = get_abi_output_types(func_abi)
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

    return input_names, output_labels

def get_synthetix(chain_config):
    if "cannon_config" in chain_config:
        return Synthetix(
            provider_rpc=chain_config["rpc"],
            network_id=chain_config["network_id"],
            cannon_config=chain_config["cannon_config"],
        )
    else:
        return Synthetix(
            provider_rpc=chain_config["rpc"],
            network_id=chain_config["network_id"],
        )

# Data processing functions
def clean_data(chain_name, contract, function_name, write=True, parquet_dir="/home/src/parquet-data"):
    input_labels, output_labels = get_labels(contract, function_name)

    # fix labels
    input_labels = fix_labels(input_labels)
    output_labels = fix_labels(output_labels)

    # Try multiple possible paths for the parquet files
    paths_to_try = [
        f"{parquet_dir}/raw/{chain_name}/{function_name}/*.parquet",
        f"/home/src/parquet-data/raw/{chain_name}/{function_name}/*.parquet",
        f"../parquet-data/raw/{chain_name}/{function_name}/*.parquet",
        f"./parquet-data/raw/{chain_name}/{function_name}/*.parquet",
    ]
    
    df = None
    for path in paths_to_try:
        try:
            print(f"Trying to read from: {path}")
            df = duckdb.sql(
                f"""
                SELECT DISTINCT *
                FROM '{path}'
                WHERE
                    call_data IS NOT NULL
                    AND output_data IS NOT NULL
                    AND output_data != '0x'
                ORDER BY block_number
                """
            ).pl()
            if not df.is_empty():
                print(f"Successfully read data from {path}")
                break
        except Exception as e:
            print(f"Error reading from {path}: {e}")
    
    if df is None or df.is_empty():
        print("No data found in any of the tried paths")
        return None

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
            pl.col("decoded_call_data").map_elements(lambda x: None if x is None else x[i]).alias(label)
        )

    # Expand outputs into separate columns based on output_labels
    for i, label in enumerate(output_labels):
        df = df.with_columns(
            pl.col("decoded_output_data").map_elements(lambda x: None if x is None else x[i]).alias(label)
        )

    # Remove the original list columns if no longer needed
    df = df.drop(
        ["call_data", "output_data", "decoded_call_data", "decoded_output_data"]
    )

    # write the data
    if write:
        file_path = f"{parquet_dir}/clean/{chain_name}/{function_name}.parquet"
        ensure_directory_exists(file_path)
        df.write_parquet(file_path)

    return df

def clean_blocks(chain_name, write=True, parquet_dir="/home/src/parquet-data"):
    # Try multiple possible paths for the parquet files
    paths_to_try = [
        f"{parquet_dir}/raw/{chain_name}/blocks/*.parquet",
        f"/home/src/parquet-data/raw/{chain_name}/blocks/*.parquet",
        f"../parquet-data/raw/{chain_name}/blocks/*.parquet",
        f"./parquet-data/raw/{chain_name}/blocks/*.parquet",
    ]
    
    df = None
    for path in paths_to_try:
        try:
            print(f"Trying to read from: {path}")
            df = duckdb.sql(
                f"""
                SELECT DISTINCT
                    CAST(timestamp as BIGINT) as timestamp,
                    CAST(block_number as BIGINT) as block_number
                FROM '{path}'
                ORDER BY block_number
                """
            ).pl()
            if not df.is_empty():
                print(f"Successfully read data from {path}")
                break
        except Exception as e:
            print(f"Error reading from {path}: {e}")
    
    if df is None or df.is_empty():
        print("No data found in any of the tried paths")
        return None

    # write the data
    if write:
        file_path = f"{parquet_dir}/clean/{chain_name}/blocks.parquet"
        ensure_directory_exists(file_path)
        df.write_parquet(file_path)

    return df

# Data extraction functions
def extract_data(
    network_id,
    contract_name,
    package_name,
    function_name,
    inputs,
    clean=True,
    min_block=0,
    requests_per_second=25,
    block_increment=500,
    chunk_size=1000,
    parquet_dir="/home/src/parquet-data"
):
    if network_id not in CHAIN_CONFIGS:
        raise ValueError(f"Network id {network_id} not supported")

    # get synthetix
    chain_config = CHAIN_CONFIGS[network_id]
    snx = get_synthetix(chain_config)
    output_dir = f"{parquet_dir}/raw/{chain_config['name']}/{function_name}"
    
    # Ensure the output directory exists
    ensure_directory_exists(f"{output_dir}/placeholder.txt")

    # encode the call data
    contract = snx.contracts[package_name][contract_name]["contract"]
    calls = [
        contract.encodeABI(fn_name=function_name, args=this_input)
        for this_input in inputs
    ]

    print(f"Extracting {function_name} data from {chain_config['name']} network")
    cryo.freeze(
        "eth_calls",
        contract=[contract.address],
        function=calls,
        blocks=[f"{min_block}:latest:{block_increment}"],
        rpc=snx.provider_rpc,
        requests_per_second=requests_per_second,
        chunk_size=chunk_size,
        output_dir=output_dir,
        hex=True,
        exclude_failed=True,
    )

    if clean:
        print(f"Cleaning {function_name} data")
        df_clean = clean_data(chain_config["name"], contract, function_name, write=True, parquet_dir=parquet_dir)
        return df_clean
    
    return None

def extract_blocks(
    network_id,
    clean=True,
    min_block=0,
    requests_per_second=25,
    block_increment=500,
    chunk_size=1000,
    parquet_dir="/home/src/parquet-data"
):
    if network_id not in CHAIN_CONFIGS:
        raise ValueError(f"Network id {network_id} not supported")

    # get synthetix
    chain_config = CHAIN_CONFIGS[network_id]
    snx = get_synthetix(chain_config)

    # try reading and looking for latest block
    output_dir = f"{parquet_dir}/raw/{chain_config['name']}/blocks"
    
    # Ensure the output directory exists
    ensure_directory_exists(f"{output_dir}/placeholder.txt")

    print(f"Extracting blocks data from {chain_config['name']} network")
    cryo.freeze(
        "blocks",
        blocks=[f"{min_block}:latest:{block_increment}"],
        rpc=snx.provider_rpc,
        requests_per_second=requests_per_second,
        chunk_size=chunk_size,
        output_dir=output_dir,
        hex=True,
        exclude_failed=True,
    )

    if clean:
        print(f"Cleaning blocks data")
        df_clean = clean_blocks(chain_config["name"], write=True, parquet_dir=parquet_dir)
        return df_clean
    
    return None

# Main extractor function for Mage AI
def extractor_table(
    network_name, 
    rpc_env_var, 
    function_name=None, 
    inputs=None,
    min_block=0,
    requests_per_second=25,
    block_increment=500,
    chunk_size=1000,
    parquet_dir="/home/src/parquet-data",
    extract=True,  # Whether to extract fresh data or just read existing data
):
    """
    Extract data from blockchain and return a Polars dataframe
    
    Parameters:
    - network_name: Name of the network (e.g., 'eth_mainnet', 'base_mainnet')
    - rpc_env_var: Environment variable name for the RPC URL (e.g., 'NETWORK_1_RPC')
    - function_name: Optional, name of the function to extract data for (e.g., 'getVaultCollateral')
                    If None, returns blocks data
    - inputs: List of inputs for the function call (required if function_name is provided and extract=True)
    - min_block: Minimum block number to start extraction from
    - requests_per_second: Rate limit for RPC requests
    - block_increment: Number of blocks to process in each increment
    - chunk_size: Number of blocks to process in each batch
    - parquet_dir: Directory where parquet files are stored
    - extract: Whether to extract fresh data or just read existing data
    
    Returns:
    - Polars dataframe with the extracted data
    """
    # Map network name to network ID
    network_id_map = {
        "eth_mainnet": 1,
        "optimism_mainnet": 10,
        "base_mainnet": 8453,
        "base_sepolia": 84532,
        "arbitrum_mainnet": 42161,
        "arbitrum_sepolia": 421614,
    }
    
    network_id = network_id_map.get(network_name)
    if not network_id:
        raise ValueError(f"Network {network_name} not supported")
    
    print(f"Processing request for network: {network_name} (ID: {network_id})")
    
    if extract:
        if function_name is None:
            # Extract blocks data
            return extract_blocks(
                network_id,
                clean=True,
                min_block=min_block,
                requests_per_second=requests_per_second,
                block_increment=block_increment,
                chunk_size=chunk_size,
                parquet_dir=parquet_dir
            )
        else:
            # Extract function call data
            if inputs is None:
                raise ValueError("Inputs must be provided when extracting function call data")
            
            contract_name = "CoreProxy"  # Default for Synthetix
            package_name = "system"      # Default for Synthetix
            
            return extract_data(
                network_id,
                contract_name,
                package_name,
                function_name,
                inputs,
                clean=True,
                min_block=min_block,
                requests_per_second=requests_per_second,
                block_increment=block_increment,
                chunk_size=chunk_size,
                parquet_dir=parquet_dir
            )
    else:
        # Just read existing data without extracting
        chain_config = CHAIN_CONFIGS[network_id]
        snx = get_synthetix(chain_config)
        
        if function_name is None:
            # Read blocks data
            return clean_blocks(chain_config["name"], write=False, parquet_dir=parquet_dir)
        else:
            # Read function call data
            contract = snx.contracts["system"]["CoreProxy"]["contract"]
            return clean_data(chain_config["name"], contract, function_name, write=False, parquet_dir=parquet_dir)