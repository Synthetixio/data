import json
import os
import argparse
from dotenv import load_dotenv
import yaml
from synthetix import Synthetix

# load environment variables
load_dotenv()


def save_abi(abi, contract_name):
    os.makedirs("abi", exist_ok=True)
    with open(f"abi/{contract_name}.json", "w") as file:
        json.dump(abi, file, indent=2)


def create_squidgen_config(
    rpc_url,
    archive_url,
    network_name,
    contracts_info,
    block_range,
    config_name,
    rate_limit=10,
):
    config = {
        "archive": archive_url,
        "finalityConfirmation": 1,
        "chain": {"url": rpc_url, "rateLimit": rate_limit},
        "target": {
            "type": "parquet",
            "path": f"/parquet-data/indexers-v2-raw/{network_name}/{config_name}",
        },
        "contracts": [],
    }

    for contract in contracts_info:
        name = contract["name"]
        address = contract["address"]
        contract_config = {
            "name": name,
            "address": address,
            "range": block_range,
            "abi": f"./abi/{name}.json",
            "events": True,
            "functions": False,
        }
        config["contracts"].append(contract_config)

    return config


def create_squid_config(network_name):
    squid_config = {
        "manifestVersion": "subsquid.io/v0.1",
        "name": network_name,
        "version": 1,
        "description": "A squid indexer generated from an ABI template",
        "build": None,
        "deploy": {
            "processor": {"cmd": ["node", "lib/main"]},
        },
    }

    return squid_config


def write_yaml(config, filename):
    with open(filename, "w") as file:
        yaml.dump(config, file, default_flow_style=False)


def load_network_config(path):
    with open(f"{path}/network_config.yaml", "r") as file:
        return yaml.safe_load(file)


if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description="Generate Squid configuration files for a given network"
    )
    parser.add_argument("--network_name", type=str, help="Network name", required=True)
    parser.add_argument(
        "--config_name",
        type=str,
        help="Name of the configuration to use",
        required=True,
    )
    parser.add_argument(
        "--contract_names",
        type=str,
        help="Comma-separated list of contract names to index.",
    )
    args = parser.parse_args()

    network_name = args.network_name
    config_name = args.config_name
    contract_names = args.contract_names

    # Get contract names
    if contract_names is not None:
        parsed_contract_names = [name.strip() for name in contract_names.split(",")]

    # Load network config
    path = f"networks/{network_name}"
    config_file = load_network_config(path)

    # Load shared network-level details
    network_params = config_file["network"]
    if network_params is None:
        message = f"Network '{network_name}' not found in {path}/network_config.yaml"
        raise Exception(message)
    network_id = network_params["network_id"]
    rpc_endpoint = os.getenv(f"NETWORK_{network_id}_RPC")
    archive_url = network_params.get("archive_url", "None")

    # Load custom config
    custom_config = config_file["configs"][config_name]

    # Initialize Synthetix SDK (with optional Cannon config)
    if "cannon_config" in custom_config:
        snx = Synthetix(
            provider_rpc=rpc_endpoint,
            network_id=network_id,
            cannon_config=custom_config["cannon_config"],
        )
    else:
        snx = Synthetix(
            provider_rpc=rpc_endpoint,
            network_id=network_id,
        )

    # Set block range based on config.
    # If "to" is "latest", use the latest block from the RPC endpoint.
    block_range = {}
    block_range["from"] = custom_config["range"].get("from", 0)
    if "to" in custom_config["range"]:
        if custom_config["range"]["to"] == "latest":
            block_range["to"] = snx.web3.eth.block_number
        else:
            block_range["to"] = custom_config["range"]["to"]

    # Get contracts from SDK or ABI files
    contracts = []
    if "contracts_from_sdk" in custom_config:
        contracts_from_sdk = custom_config["contracts_from_sdk"]
        for contract in contracts_from_sdk:
            if contract_names is not None:
                if contract["name"] not in parsed_contract_names:
                    continue
            name = contract["name"]
            package = contract["package"]
            contract_data = snx.contracts[package][name]
            abi = contract_data["abi"]
            address = contract_data["address"]
            save_abi(abi, name)
            contracts.append({"name": name, "address": address})
    elif "contracts_from_abi" in custom_config:
        contracts_from_abi = custom_config["contracts_from_abi"]
        for contract in contracts_from_abi:
            if contract_names is not None:
                if contract["name"] not in parsed_contract_names:
                    continue
            name = contract["name"]
            with open(f"{path}/abi/{name}.json", "r") as file:
                abi = json.load(file)
            save_abi(abi, name)
            contracts.append({"name": name, "address": contract["address"]})
    else:
        message = "No contracts found in network config"
        raise Exception(message)

    # Create squidgen generator config
    rate_limit = custom_config.get("rate_limit", 10)
    squidgen_config = create_squidgen_config(
        rpc_endpoint,
        archive_url,
        network_name,
        contracts,
        block_range,
        config_name,
        rate_limit,
    )
    write_yaml(squidgen_config, "squidgen.yaml")

    squid_config = create_squid_config(args.network_name)
    write_yaml(squid_config, "squid.yaml")

    snx.logger.info(
        f"squidgen.yaml, squid.yaml, and ABI files have been generated for {args.network_name}"
    )
