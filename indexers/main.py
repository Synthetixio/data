import json
import os
import argparse
from dotenv import load_dotenv
import yaml
import clickhouse_connect
from synthetix import Synthetix
from utils.clickhouse_schema import process_abi_schemas

# load environment variables
load_dotenv()

RAW_DATA_PATH = "/parquet-data/indexers/raw"
SCHEMAS_BASE_PATH = "/parquet-data/indexers/schemas"


def save_abi(abi, contract_name):
    os.makedirs("abi", exist_ok=True)
    with open(f"abi/{contract_name}.json", "w") as file:
        json.dump(abi, file, indent=2)


def create_squidgen_config(
    rpc_url,
    archive_url,
    network_name,
    contracts,
    block_range,
    protocol_name,
    rate_limit=10,
):
    config = {
        "archive": archive_url,
        "chain": {"url": rpc_url, "rateLimit": rate_limit},
        "finalityConfirmation": 1,
        "target": {
            "type": "parquet",
            "path": f"{RAW_DATA_PATH}/{network_name}/{protocol_name}",
        },
        "contracts": [],
    }

    for contract in contracts:
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
        "--protocol_name",
        type=str,
        help="Name of the protocol to index",
        required=True,
    )
    parser.add_argument(
        "--contract_names",
        type=str,
        help="Comma-separated list of contract names to index.",
    )
    parser.add_argument(
        "--block_from",
        type=int,
        help="Block number to start indexing from",
        required=False,
    )
    parser.add_argument(
        "--block_to",
        type=int,
        help="Block number to end indexing at",
        required=False,
    )
    args = parser.parse_args()

    network_name = args.network_name
    protocol_name = args.protocol_name
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
    custom_config = config_file["configs"][protocol_name]

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
    block_range = {}
    if args.block_from is not None:
        block_range["from"] = args.block_from
    else:
        block_range["from"] = custom_config["range"].get("from", 0)
    if args.block_to is not None:
        block_range["to"] = args.block_to
    elif "to" in custom_config["range"]:
        block_range["to"] = custom_config["range"]["to"]

    # Create database in ClickHouse
    client = clickhouse_connect.get_client(
        host="clickhouse",
        port=8123,
        user="default",
        settings={"allow_experimental_json_type": 1},
    )
    client.command(f"CREATE DATABASE IF NOT EXISTS {network_name}")

    # Get contracts from SDK or ABI files
    contracts = []
    schemas_path = f"{SCHEMAS_BASE_PATH}/{network_name}/{protocol_name}"
    if "contracts_from_sdk" in custom_config:
        contracts_from_sdk = custom_config["contracts_from_sdk"]
        for contract in contracts_from_sdk:
            name = contract["name"]
            package = contract["package"]
            contract_data = snx.contracts[package][name]
            abi = contract_data["abi"]
            address = contract_data["address"]
            save_abi(abi, name)
            process_abi_schemas(
                abi=abi,
                path=schemas_path,
                contract_name=name,
                network_name=network_name,
                protocol_name=protocol_name,
                client=client,
            )
            contracts.append({"name": name, "address": address})
    elif "contracts_from_abi" in custom_config:
        contracts_from_abi = custom_config["contracts_from_abi"]
        for contract in contracts_from_abi:
            name = contract["name"]
            abi_name = contract["abi"]
            with open(f"{path}/{abi_name}", "r") as file:
                abi = json.load(file)
            save_abi(abi, name)
            process_abi_schemas(
                abi=abi,
                path=schemas_path,
                contract_name=name,
                network_name=network_name,
                protocol_name=protocol_name,
                client=client,
            )
            contracts.append({"name": name, "address": contract["address"]})
    else:
        message = "No contracts found in network config"
        raise Exception(message)

    # Create squidgen generator config
    rate_limit = custom_config.get("rate_limit", 10)
    squidgen_config = create_squidgen_config(
        rpc_url=rpc_endpoint,
        archive_url=archive_url,
        network_name=network_name,
        contracts=contracts,
        block_range=block_range,
        protocol_name=protocol_name,
        rate_limit=rate_limit,
    )
    write_yaml(squidgen_config, "squidgen.yaml")

    snx.logger.info(
        f"squidgen.yaml and ABI files have been generated for {args.network_name}"
    )
