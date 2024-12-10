"""Main script to extract data from EVM nodes based on a provided configuration."""

import yaml
import argparse
from dotenv import load_dotenv
from src.extract import extract_blocks, extract_data

# load environment variables
load_dotenv()

# parse command-line arguments
parser = argparse.ArgumentParser(description="Extract data from EVM nodes.")
parser.add_argument("config", help="Path to a YAML configuration file")
parser.add_argument("--name", help="Name of the configuration to use (optional)")
args = parser.parse_args()

# load configurations from YAML file
with open(args.config, "r") as f:
    config = yaml.safe_load(f)

network_id = config.get("network_id")
block_config = config.get("blocks")
protocol = config.get("protocol")
eth_call_configs = config.get("eth_calls", [])

# determine the flow based on the --name argument
if args.name:
    if args.name == "blocks":
        # run blocks only
        extract_blocks(network_id=network_id, protocol=protocol, **block_config)
    else:
        # run the specified eth_call only
        eth_call_config = next(
            (ec for ec in eth_call_configs if ec["function_name"] == args.name), None
        )
        if eth_call_config:
            extract_data(network_id=network_id, protocol=protocol, **eth_call_config)
        else:
            print(f"No configuration found with name {args.name}")
else:
    # run everything
    exceptions = []
    try:
        extract_blocks(network_id=network_id, protocol=protocol, **block_config)
    except Exception as e:
        exceptions.append(e)
        print(f"Error extracting blocks: {e}")

    for eth_call_config in eth_call_configs:
        try:
            extract_data(network_id=network_id, protocol=protocol, **eth_call_config)
        except Exception as e:
            exceptions.append(e)
            print(f"Error extracting eth_call {eth_call_config.get('name')}: {e}")
            continue

    # if there are any exceptions, raise the first one
    if len(exceptions) > 0:
        raise Exception(exceptions[0])
