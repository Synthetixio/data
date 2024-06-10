import os
import yaml
import argparse
from dotenv import load_dotenv
from src.extract import extract_blocks, extract_data

# load environment variables
load_dotenv()

# parse command-line arguments
parser = argparse.ArgumentParser(description="Extract data from Ethereum nodes.")
parser.add_argument("config", help="Path to the YAML configuration file")
parser.add_argument("--name", help="Name of the configuration to use (optional)")
args = parser.parse_args()

# load configurations from YAML file
with open(args.config, "r") as f:
    config = yaml.safe_load(f)

block_config = config.get("blocks")
eth_call_configs = config.get("eth_calls", [])

# determine the flow based on the --name argument
if args.name:
    if args.name == block_config.get("name"):
        # run blocks only
        try:
            extract_blocks(**block_config)
        except Exception as e:
            print(f"Error extracting blocks: {e}")
    else:
        # run the specified eth_call only
        eth_call_config = next(
            (ec for ec in eth_call_configs if ec["name"] == args.name), None
        )
        if eth_call_config:
            try:
                extract_data(**eth_call_config)
            except Exception as e:
                print(f"Error extracting eth_call {args.name}: {e}")
        else:
            print(f"No configuration found with name {args.name}")
else:
    # run everything
    try:
        extract_blocks(**block_config)
    except Exception as e:
        print(f"Error extracting blocks: {e}")

    for eth_call_config in eth_call_configs:
        try:
            extract_data(**eth_call_config)
        except Exception as e:
            print(f"Error extracting eth_call {eth_call_config.get('name')}: {e}")
            continue
