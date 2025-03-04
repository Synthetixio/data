import os
import yaml
from pathlib import Path
import polars as pl
from synthetix import Synthetix
from web3._utils.abi import get_abi_output_types, get_abi_input_types
from eth_abi import decode
from eth_utils import decode_hex


def fix_labels(labels):
    return [f"value_{i + 1}" if label == "" else label for i, label in enumerate(labels)]

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
    import re
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

def load_chain_config(network_name, rpc_env_var):
    """Load chain configuration for a specific network"""
    # Define network ID mapping
    network_id_map = {
        "eth_mainnet": 1,
        "base_mainnet": 8453,
        "base_sepolia": 84532,
        "arbitrum_mainnet": 42161,
        "arbitrum_sepolia": 421614,
    }
    
    # Get network ID from the mapping
    network_id = network_id_map.get(network_name)
    
    if not network_id:
        raise ValueError(f"Network {network_name} not supported")
    
    # Set up chain configuration
    chain_config = {
        "name": network_name,
        "rpc": os.getenv(rpc_env_var),
        "network_id": network_id,
    }
    
    # Add cannon config for Ethereum mainnet
    if network_name == "eth_mainnet":
        chain_config["cannon_config"] = {
            "package": "synthetix-omnibus",
            "version": "latest",
            "preset": "main"
        }
    
    return chain_config

def read_parquet_data(chain_name, data_type, parquet_dir="/parquet-data/raw"):
    """Read parquet data from a specific directory"""
    path = Path(f"{parquet_dir}/{chain_name}/{data_type}")
    
    # Check if the path exists and has parquet files
    if not path.exists():
        return None
    
    parquet_files = list(path.glob("*.parquet"))
    if not parquet_files:
        return None
    
    # Read and combine all parquet files
    dfs = []
    for file in parquet_files:
        df = pl.read_parquet(file)
        dfs.append(df)
    
    if not dfs:
        return None
    
    # Combine all dataframes
    return pl.concat(dfs).unique()

def process_eth_call_data(df, contract, function_name):
    """Process Ethereum call data from a raw dataframe"""
    if df is None or df.is_empty():
        return None
    
    input_labels, output_labels = get_labels(contract, function_name)
    
    # Fix labels
    input_labels = fix_labels(input_labels)
    output_labels = fix_labels(output_labels)
    
    # Decode call_data and output_data, then convert lists to multiple columns
    df = df.with_columns([
        pl.col("call_data")
            .map_elements(lambda call: decode_call(contract, function_name, call))
            .alias("decoded_call_data"),
        pl.col("output_data")
            .map_elements(lambda output: decode_output(contract, function_name, output))
            .alias("decoded_output_data"),
        pl.col("block_number").cast(pl.Int64),
    ])
    
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
    df = df.drop(["call_data", "output_data", "decoded_call_data", "decoded_output_data"])
    
    return df

def process_blocks_data(df):
    """Process blocks data from a raw dataframe"""
    if df is None or df.is_empty():
        return None
    
    # Convert timestamp and block_number to appropriate types
    df = df.with_columns([
        pl.col("timestamp").cast(pl.Int64),
        pl.col("block_number").cast(pl.Int64)
    ])
    
    return df

def extractor_table(network_name, rpc_env_var, function_name=None, parquet_dir="/parquet-data/raw"):
    """
    Extract data from blockchain and return a Polars dataframe
    
    Parameters:
    - network_name: Name of the network (e.g., 'eth_mainnet', 'base_mainnet')
    - rpc_env_var: Environment variable name for the RPC URL (e.g., 'NETWORK_1_RPC')
    - function_name: Optional, name of the function to extract data for (e.g., 'getVaultCollateral')
                    If None, returns blocks data
    - parquet_dir: Directory where parquet files are stored
    
    Returns:
    - Polars dataframe with the extracted data
    """
    # Load chain configuration
    chain_config = load_chain_config(network_name, rpc_env_var)
    
    # Initialize Synthetix SDK
    snx = get_synthetix(chain_config)
    
    if function_name is None:
        # Read blocks data
        df = read_parquet_data(network_name, "blocks", parquet_dir)
        return process_blocks_data(df)
    else:
        # Read ETH call data
        df = read_parquet_data(network_name, function_name, parquet_dir)
        
        # Get contract based on function name
        if function_name == "getVaultCollateral" or function_name == "getVaultDebt":
            contract = snx.contracts["system"]["CoreProxy"]["contract"]
        else:
            raise ValueError(f"Function {function_name} not supported")
        
        return process_eth_call_data(df, contract, function_name)

# Example usage:
# blocks_df = extractor_table('eth_mainnet', 'NETWORK_1_RPC')  # Get blocks data
# collateral_df = extractor_table('eth_mainnet', 'NETWORK_1_RPC', 'getVaultCollateral')  # Get vault collateral data
# debt_df = extractor_table('eth_mainnet', 'NETWORK_1_RPC', 'getVaultDebt')  # Get vault debt data