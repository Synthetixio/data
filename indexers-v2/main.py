import json
import sys
import os
import argparse
import yaml
from synthetix import Synthetix


def save_abi(abi, contract_name):
    os.makedirs("abi", exist_ok=True)
    with open(f"abi/{contract_name}.json", "w") as file:
        json.dump(abi, file, indent=2)


def create_squidgen_config(rpc_url, archive_url, contracts_info):
    config = {
        "archive": archive_url,
        "finalityConfirmation": 1,
        "chain": {"url": rpc_url, "rateLimit": 10},
        "target": {"type": "postgres"},
        "contracts": [],
    }

    for contract in contracts_info:
        name = contract["name"]
        address = contract["address"]
        contract_config = {
            "name": name,
            "address": address,
            "abi": f"./abi/{name}.json",
            "events": True,
            "functions": False,
        }
        config["contracts"].append(contract_config)

    return config


def create_squid_config(network_name):
    return {
        "manifestVersion": "subsquid.io/v0.1",
        "name": network_name,
        "version": 1,
        "description": "A squid indexer generated from an ABI template",
        "build": None,
        "deploy": {
            "addons": {"postgres": None},
            "processor": {"cmd": ["node", "lib/main"]},
            "api": {
                "cmd": [
                    "npx",
                    "squid-graphql-server",
                    "--dumb-cache",
                    "in-memory",
                    "--dumb-cache-ttl",
                    "1000",
                    "--dumb-cache-size",
                    "100",
                    "--dumb-cache-max-age",
                    "1000",
                ]
            },
        },
    }


def write_yaml(config, filename):
    with open(filename, "w") as file:
        yaml.dump(config, file, default_flow_style=False)


def load_network_config(path):
    with open(f"{path}/network_config.yaml", "r") as file:
        return yaml.safe_load(file)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate Squid configuration files for a given network"
    )
    parser.add_argument("--network_name", type=str, help="Network name", required=True)
    parser.add_argument("--rpc_endpoint", type=str, help="RPC URL", required=True)
    args = parser.parse_args()

    network_name = args.network_name
    path = f"networks/{network_name}"
    network_config = load_network_config(path)[network_name]

    if not network_config:
        message = f"Network '{network_name}' not found in {path}/network_config.yaml"
        raise Exception(message)

    rpc_endpoint = args.rpc_endpoint
    if not rpc_endpoint:
        message = "RPC_ENDPOINT environment variable is not set"
        raise Exception(message)

    archive_url = network_config["archive_url"]

    contracts = []

    if "contracts_from_sdk" in network_config:
        contracts_from_sdk = network_config["contracts_from_sdk"]

        if "cannon_config" in network_config:
            snx = Synthetix(
                provider_rpc=rpc_endpoint,
                network_id=network_config["network_id"],
                cannon_config=network_config["cannon_config"],
            )
        else:
            snx = Synthetix(
                provider_rpc=rpc_endpoint,
                network_id=network_config["network_id"],
            )

        for contract in contracts_from_sdk:
            name = contract["name"]
            package = contract["package"]
            contract_data = snx.contracts[package][name]
            if name == "buyback_snx":
                name = "BuybackSnx"
            save_abi(contract_data["abi"], name)
            contracts.append({"name": name, "address": contract_data["address"]})

    if "contracts_from_abi" in network_config:
        contracts_from_abi = network_config["contracts_from_abi"]

        for contract in contracts_from_abi:
            name = contract["name"]
            with open(f"{path}/abi/{name}.json", "r") as file:
                contract_data = json.load(file)
            save_abi(contract_data["abi"], name)
            contracts.append({"name": name, "address": contract_data["address"]})

    squidgen_config = create_squidgen_config(rpc_endpoint, archive_url, contracts)
    write_yaml(squidgen_config, "squidgen.yaml")

    squid_config = create_squid_config(args.network_name)
    write_yaml(squid_config, "squid.yaml")

    print(
        f"squidgen.yaml, squid.yaml, and ABI files have been generated for {args.network_name}"
    )
