import os
import polars as pl
import duckdb
from pathlib import Path
from typing import List, Dict, Any, Optional, Union
import cryo
from synthetix import Synthetix
import re
from web3._utils.abi import get_abi_output_types, get_abi_input_types
from eth_abi import decode as eth_decode
from eth_utils import decode_hex

# ================================
# NETWORK CONFIGURATIONS
# ================================

# Built-in network configurations with pre-configured addresses and parameters
NETWORK_CONFIGS = {
    "eth_mainnet": {
        "network_id": 1,
        "rpc_env_var": "NETWORK_1_RPC",
        "blocks": {
            "min_block": "20000000",
            "requests_per_second": 25,
            "block_increment": 150,
            "chunk_size": 50
        },
        "functions": {
            "getVaultCollateral": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"]
                ],
                "min_block": "20000000",
                "requests_per_second": 25,
                "block_increment": 150,
                "chunk_size": 50
            },
            "getVaultDebt": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"]
                ],
                "min_block": "20000000",
                "requests_per_second": 25,
                "block_increment": 150,
                "chunk_size": 50
            }
        },
        "cannon_config": {
            "package": "synthetix-omnibus",
            "version": "latest",
            "preset": "main"
        }
    },
    
    "base_mainnet": {
        "network_id": 8453,
        "rpc_env_var": "NETWORK_8453_RPC",
        "blocks": {
            "min_block": "7.5M",
            "requests_per_second": 25,
            "block_increment": 500,
            "chunk_size": 80
        },
        "functions": {
            "getVaultCollateral": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0xC74eA762cF06c9151cE074E6a569a5945b6302E7"],
                    [1, "0x729Ef31D86d31440ecBF49f27F7cD7c16c6616d2"]
                ],
                "min_block": "7.5M",
                "requests_per_second": 25,
                "block_increment": 500,
                "chunk_size": 80
            },
            "getVaultDebt": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0xC74eA762cF06c9151cE074E6a569a5945b6302E7"],
                    [1, "0x729Ef31D86d31440ecBF49f27F7cD7c16c6616d2"]
                ],
                "min_block": "7.5M",
                "requests_per_second": 25,
                "block_increment": 500,
                "chunk_size": 80
            }
        }
    },
    
    "base_sepolia": {
        "network_id": 84532,
        "rpc_env_var": "NETWORK_84532_RPC",
        "blocks": {
            "min_block": "8M",
            "requests_per_second": 25,
            "block_increment": 500,
            "chunk_size": 80
        },
        "functions": {
            "getVaultCollateral": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0x8069c44244e72443722cfb22DcE5492cba239d39"]
                ],
                "min_block": "8M",
                "requests_per_second": 25,
                "block_increment": 500,
                "chunk_size": 80
            },
            "getVaultDebt": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0x8069c44244e72443722cfb22DcE5492cba239d39"]
                ],
                "min_block": "8M",
                "requests_per_second": 25,
                "block_increment": 500,
                "chunk_size": 80
            }
        }
    },
    
    "arbitrum_sepolia": {
        "network_id": 421614,
        "rpc_env_var": "NETWORK_421614_RPC",
        "blocks": {
            "min_block": "41M",
            "requests_per_second": 25,
            "block_increment": 4000,
            "chunk_size": 80
        },
        "functions": {
            "getVaultCollateral": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73"],
                    [1, "0x7b356eEdABc1035834cd1f714658627fcb4820E3"],
                    [1, "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"],
                    [1, "0xda7b438d762110083602AbC497b1Ec8Bc6605eC9"],
                    [1, "0x54664815B709252dDC99dB3CB91e2d584717DbfC"],
                    [1, "0x4159018C381e5AEB9A95AB27c26726fBc4671f08"],
                    [1, "0x7FcAD85b378D9a13733dD5c715ef318F45cd7699"]
                ],
                "min_block": "41M",
                "requests_per_second": 25,
                "block_increment": 4000,
                "chunk_size": 80
            },
            "getVaultDebt": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73"],
                    [1, "0x7b356eEdABc1035834cd1f714658627fcb4820E3"],
                    [1, "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"],
                    [1, "0xda7b438d762110083602AbC497b1Ec8Bc6605eC9"],
                    [1, "0x54664815B709252dDC99dB3CB91e2d584717DbfC"],
                    [1, "0x4159018C381e5AEB9A95AB27c26726fBc4671f08"],
                    [1, "0x7FcAD85b378D9a13733dD5c715ef318F45cd7699"]
                ],
                "min_block": "41M",
                "requests_per_second": 25,
                "block_increment": 4000,
                "chunk_size": 80
            }
        }
    },
    
    "arbitrum_mainnet": {
        "network_id": 42161,
        "rpc_env_var": "NETWORK_42161_RPC",
        "blocks": {
            "min_block": "232500000",
            "requests_per_second": 25,
            "block_increment": 4000,
            "chunk_size": 80
        },
        "functions": {
            "getVaultCollateral": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"],
                    [1, "0x912CE59144191C1204E64559FE8253a0e49E6548"],
                    [1, "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"],
                    [1, "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"],
                    [1, "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe"],
                    [1, "0x5979D7b546E38E414F7E9822514be443A4800529"],
                    [1, "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"]
                ],
                "min_block": "218M",
                "requests_per_second": 25,
                "block_increment": 4000,
                "chunk_size": 80
            },
            "getVaultDebt": {
                "contract_name": "CoreProxy",
                "package_name": "system",
                "inputs": [
                    [1, "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"],
                    [1, "0x912CE59144191C1204E64559FE8253a0e49E6548"],
                    [1, "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"],
                    [1, "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"],
                    [1, "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe"],
                    [1, "0x5979D7b546E38E414F7E9822514be443A4800529"],
                    [1, "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"]
                ],
                "min_block": "218M",
                "requests_per_second": 25,
                "block_increment": 4000,
                "chunk_size": 80
            }
        }
    },
}

# ================================
# UTILITY FUNCTIONS 
# ================================

def ensure_directory_exists(file_path: str) -> None:
    """Create directory if it doesn't exist"""
    directory = Path(file_path).parent
    directory.mkdir(parents=True, exist_ok=True)

def get_synthetix(network_name: str) -> Synthetix:
    """Get a Synthetix instance for the specified network"""
    if network_name not in NETWORK_CONFIGS:
        raise ValueError(f"Unknown network: {network_name}")
    
    config = NETWORK_CONFIGS[network_name]
    
    # Get RPC URL from environment variable
    rpc_url = os.getenv(config["rpc_env_var"])
    if not rpc_url:
        raise ValueError(f"Missing RPC URL in environment variable {config['rpc_env_var']}")
    
    # Create Synthetix instance
    if "cannon_config" in config:
        return Synthetix(
            provider_rpc=rpc_url,
            network_id=config["network_id"],
            cannon_config=config["cannon_config"]
        )
    else:
        return Synthetix(
            provider_rpc=rpc_url,
            network_id=config["network_id"]
        )

def get_data_locations(base_dirs: List[str], network_name: str, function_name: Optional[str] = None) -> Dict[str, str]:
    """Get the locations for raw and clean data files"""
    file_name = "blocks" if function_name is None else function_name
    
    # Try each base directory and find one that works
    for base_dir in base_dirs:
        raw_dir = f"{base_dir}/raw/{network_name}/{file_name}"
        clean_path = f"{base_dir}/clean/{network_name}/{file_name}.parquet"
        
        # Check if directory exists or can be created
        try:
            Path(raw_dir).mkdir(parents=True, exist_ok=True)
            Path(clean_path).parent.mkdir(parents=True, exist_ok=True)
            return {
                "base_dir": base_dir,
                "raw_dir": raw_dir,
                "clean_path": clean_path
            }
        except Exception:
            continue
    
    # If we get here, none of the base directories worked
    raise OSError(f"Could not find or create directories for {network_name}/{file_name}")

# ================================
# DECODING FUNCTIONS
# ================================

def camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case"""
    name = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", name).lower()

def fix_labels(labels: List[str]) -> List[str]:
    """Fix empty labels by giving them a default name"""
    return [f"value_{i + 1}" if label == "" else label for i, label in enumerate(labels)]

def get_labels(contract, function_name: str) -> tuple:
    """Get input and output parameter names from contract ABI"""
    functions = contract.find_functions_by_name(function_name)
    if len(functions) > 0:
        function = functions[0]
    else:
        raise ValueError(f"Function {function_name} not found in contract")

    input_names = [camel_to_snake(i["name"]) for i in function.abi["inputs"]]
    output_names = [camel_to_snake(i["name"]) for i in function.abi["outputs"]]

    return fix_labels(input_names), fix_labels(output_names)

def decode_data(contract, function_name: str, data, is_input: bool = True):
    """Decode ABI-encoded data"""
    func_abi = contract.get_function_by_name(function_name).abi
    types = get_abi_input_types(func_abi) if is_input else get_abi_output_types(func_abi)
    try:
        return eth_decode(types, data)
    except Exception as e:
        print(f"Error decoding data: {e}")
        return None

def decode_call(contract, function_name: str, call_data: str):
    """Decode function call data"""
    if call_data is None or call_data == "0x":
        return None
    try:
        # Remove function signature (first 10 characters after 0x)
        call_data_no_sig = call_data[10:] if call_data.startswith("0x") else call_data
        decoded = decode_data(
            contract, 
            function_name, 
            decode_hex(f"0x{call_data_no_sig}"), 
            is_input=True
        )
        return [str(item) for item in decoded] if decoded else None
    except Exception as e:
        print(f"Error decoding call data: {e}")
        return None

def decode_output(contract, function_name: str, output_data: str):
    """Decode function output data"""
    if output_data is None or output_data == "0x":
        return None
    try:
        decoded = decode_data(
            contract, 
            function_name, 
            decode_hex(output_data), 
            is_input=False
        )
        return [str(item) for item in decoded] if decoded else None
    except Exception as e:
        print(f"Error decoding output data: {e}")
        return None

# ================================
# MAIN EXTRACTION FUNCTIONS
# ================================

def extract_blocks(
    network_name: str,
    base_dirs: List[str] = ["/parquet-data", "/home/src/parquet-data", "../parquet-data", "./parquet-data"],
    extract_new: bool = False,
    **kwargs
) -> pl.DataFrame:
    """
    Extract and/or read block data for a network
    
    Args:
        network_name: Name of the network (e.g., 'eth_mainnet')
        base_dirs: List of base directories to try for storage
        extract_new: Whether to extract fresh data
        **kwargs: Optional parameters to override defaults
    
    Returns:
        Polars DataFrame with block data
    """
    if network_name not in NETWORK_CONFIGS:
        raise ValueError(f"Unknown network: {network_name}")
    
    # Get network configuration
    network_config = NETWORK_CONFIGS[network_name]
    block_config = network_config["blocks"]
    
    # Get data locations
    locations = get_data_locations(base_dirs, network_name)
    
    # Extract fresh data if requested
    if extract_new:
        print(f"Extracting blocks data for {network_name}")
        
        # Get extraction parameters (use defaults or override with kwargs)
        min_block = kwargs.get("min_block", block_config["min_block"])
        requests_per_second = kwargs.get("requests_per_second", block_config["requests_per_second"])
        block_increment = kwargs.get("block_increment", block_config["block_increment"])
        chunk_size = kwargs.get("chunk_size", block_config["chunk_size"])
        
        # Get Synthetix instance
        snx = get_synthetix(network_name)
        
        # Extract blocks using cryo
        cryo.freeze(
            "blocks",
            blocks=[f"{min_block}:latest:{block_increment}"],
            rpc=snx.provider_rpc,
            requests_per_second=requests_per_second,
            chunk_size=chunk_size,
            output_dir=locations["raw_dir"],
            hex=True,
            exclude_failed=True
        )
        
        # Process and save the cleaned data
        raw_path = f"{locations['raw_dir']}/*.parquet"
        df = duckdb.sql(
            f"""
            SELECT DISTINCT
                CAST(timestamp as BIGINT) as timestamp,
                CAST(block_number as BIGINT) as block_number
            FROM '{raw_path}'
            ORDER BY block_number
            """
        ).pl()
        
        # Save the cleaned data
        df.write_parquet(locations["clean_path"])
        print(f"Saved cleaned blocks data to {locations['clean_path']}")
    
    # Read and return the data
    try:
        df = pl.read_parquet(locations["clean_path"])
        print(f"Read {len(df)} rows from {locations['clean_path']}")
        return df
    except Exception as e:
        if extract_new:
            raise RuntimeError(f"Failed to read extracted data: {e}")
        else:
            print(f"No existing data found, extracting fresh data")
            return extract_blocks(network_name, base_dirs, extract_new=True, **kwargs)

def extract_function_data(
    network_name: str,
    function_name: str,
    base_dirs: List[str] = ["/parquet-data", "/home/src/parquet-data", "../parquet-data", "./parquet-data"],
    extract_new: bool = False,
    inputs: Optional[List[List[Any]]] = None,
    **kwargs
) -> pl.DataFrame:
    """
    Extract and/or read function call data for a network
    
    Args:
        network_name: Name of the network (e.g., 'eth_mainnet')
        function_name: Name of the function (e.g., 'getVaultCollateral')
        base_dirs: List of base directories to try for storage
        extract_new: Whether to extract fresh data
        inputs: Optional list of inputs for function calls (overrides defaults)
        **kwargs: Optional parameters to override defaults
    
    Returns:
        Polars DataFrame with function call data
    """
    if network_name not in NETWORK_CONFIGS:
        raise ValueError(f"Unknown network: {network_name}")
    
    if function_name not in NETWORK_CONFIGS[network_name]["functions"]:
        raise ValueError(f"Unknown function: {function_name} for network: {network_name}")
    
    # Get network and function configuration
    network_config = NETWORK_CONFIGS[network_name]
    function_config = network_config["functions"][function_name]
    
    # Get data locations
    locations = get_data_locations(base_dirs, network_name, function_name)
    
    # Extract fresh data if requested
    if extract_new:
        print(f"Extracting {function_name} data for {network_name}")
        
        # Get extraction parameters (use defaults or override with kwargs)
        min_block = kwargs.get("min_block", function_config["min_block"])
        requests_per_second = kwargs.get("requests_per_second", function_config["requests_per_second"])
        block_increment = kwargs.get("block_increment", function_config["block_increment"])
        chunk_size = kwargs.get("chunk_size", function_config["chunk_size"])
        contract_name = kwargs.get("contract_name", function_config["contract_name"])
        package_name = kwargs.get("package_name", function_config["package_name"])
        
        # Use provided inputs or default ones
        function_inputs = inputs if inputs is not None else function_config["inputs"]
        
        # Get Synthetix instance
        snx = get_synthetix(network_name)
        
        # Get contract and encode calls
        contract = snx.contracts[package_name][contract_name]["contract"]
        calls = [
            contract.encodeABI(fn_name=function_name, args=input_args)
            for input_args in function_inputs
        ]
        
        # Extract data using cryo
        cryo.freeze(
            "eth_calls",
            contract=[contract.address],
            function=calls,
            blocks=[f"{min_block}:latest:{block_increment}"],
            rpc=snx.provider_rpc,
            requests_per_second=requests_per_second,
            chunk_size=chunk_size,
            output_dir=locations["raw_dir"],
            hex=True,
            exclude_failed=True
        )
        
        # Process the extracted data with proper decoding
        raw_path = f"{locations['raw_dir']}/*.parquet"
        df = duckdb.sql(
            f"""
            SELECT DISTINCT *
            FROM '{raw_path}'
            WHERE
                call_data IS NOT NULL
                AND output_data IS NOT NULL
                AND output_data != '0x'
            ORDER BY block_number
            """
        ).pl()
        
        # Now properly decode the data
        # First, get the contract to use for decoding
        contract = snx.contracts[package_name][contract_name]["contract"]
        
        # Then, get the labels for input and output
        input_labels, output_labels = get_labels(contract, function_name)
        
        # Decode call_data and output_data
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
                pl.col("decoded_call_data")
                   .map_elements(lambda x: None if x is None else (x[i] if i < len(x) else None))
                   .alias(label)
            )
        
        # Expand decoded_output_data into separate columns based on output_labels
        for i, label in enumerate(output_labels):
            df = df.with_columns(
                pl.col("decoded_output_data")
                   .map_elements(lambda x: None if x is None else (x[i] if i < len(x) else None))
                   .alias(label)
            )
        
        # Remove the temporary columns
        df = df.drop(["decoded_call_data", "decoded_output_data"])
        
        # Save the cleaned data
        df.write_parquet(locations["clean_path"])
        print(f"Saved cleaned {function_name} data to {locations['clean_path']}")
    
    # Read and return the data
    try:
        df = pl.read_parquet(locations["clean_path"])
        print(f"Read {len(df)} rows from {locations['clean_path']}")
        return df
    except Exception as e:
        if extract_new:
            raise RuntimeError(f"Failed to read extracted data: {e}")
        else:
            print(f"No existing data found, extracting fresh data")
            return extract_function_data(
                network_name, 
                function_name, 
                base_dirs, 
                extract_new=True, 
                inputs=inputs, 
                **kwargs
            )

def extract_table(
    network_name: str,
    table_name: str = "blocks",
    extract_new: bool = False,
    inputs: Optional[List[List[Any]]] = None,
    **kwargs
) -> pl.DataFrame:
    """
    Main function to extract blockchain data as a Polars dataframe
    
    Args:
        network_name: Name of the network (e.g., 'eth_mainnet', 'base_mainnet')
        table_name: Name of the table/function (default: 'blocks')
                    Can be 'blocks', 'getVaultCollateral', 'getVaultDebt', etc.
        extract_new: Whether to extract fresh data (default: False)
        inputs: Optional list of inputs for function calls (overrides defaults)
        **kwargs: Additional arguments for extraction
    
    Returns:
        Polars dataframe with the extracted data
    """
    if table_name.lower() == "blocks":
        return extract_blocks(network_name, extract_new=extract_new, **kwargs)
    else:
        return extract_function_data(
            network_name, 
            table_name,
            extract_new=extract_new,
            inputs=inputs,
            **kwargs
        )

# ================================
# HELPER FUNCTIONS
# ================================

def list_networks() -> List[str]:
    """List all available networks"""
    return list(NETWORK_CONFIGS.keys())

def list_functions(network_name: str) -> List[str]:
    """List all available functions for a network"""
    if network_name not in NETWORK_CONFIGS:
        raise ValueError(f"Unknown network: {network_name}")
    
    return list(NETWORK_CONFIGS[network_name]["functions"].keys()) + ["blocks"]

def get_function_info(network_name: str, function_name: str) -> Dict[str, Any]:
    """Get detailed information about a function"""
    if network_name not in NETWORK_CONFIGS:
        raise ValueError(f"Unknown network: {network_name}")
    
    if function_name.lower() == "blocks":
        return NETWORK_CONFIGS[network_name]["blocks"]
    
    if function_name not in NETWORK_CONFIGS[network_name]["functions"]:
        raise ValueError(f"Unknown function: {function_name} for network: {network_name}")
    
    return NETWORK_CONFIGS[network_name]["functions"][function_name]