import json
import sys
import os
import argparse
import yaml
from synthetix import Synthetix


def get_contract_data(snx, contract_name, package):
    contract = snx.contracts[package][contract_name]
    return {
        "name": contract_name,
        "address": contract["address"],
        "abi": contract["abi"],
    }


def save_abi(abi, filename):
    os.makedirs("abi", exist_ok=True)
    with open(f"abi/{filename}", "w") as file:
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
        contract_config = {
            "name": contract["name"],
            "address": contract["address"],
            "abi": f"./abi/{contract['name']}.json",
            "events": True,
            "functions": False,
        }
        config["contracts"].append(contract_config)
        save_abi(contract["abi"], f"{contract['name']}.json")

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


def load_network_config(network_name):
    with open("networks.yaml", "r") as file:
        networks = yaml.safe_load(file)
    return networks.get(network_name)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate Squid configuration files for a given network"
    )
    parser.add_argument("--network_name", type=str, help="Network name", required=True)
    parser.add_argument("--rpc_endpoint", type=str, help="RPC URL", required=True)
    args = parser.parse_args()

    network_config = load_network_config(args.network_name)

    if not network_config:
        print(f"Network '{args.network_name}' not found in networks.yaml")
        sys.exit(1)

    rpc_endpoint = os.environ.get("RPC_ENDPOINT")
    if not rpc_endpoint:
        print("RPC_ENDPOINT environment variable is not set")
        sys.exit(1)
    archive_url = network_config["archive_url"]
    contracts_to_include = network_config["contracts"]

    print(network_config)
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

    contracts_info = [
        get_contract_data(snx, contract_name, package)
        for contract_name, package in contracts_to_include
    ]

    squidgen_config = create_squidgen_config(rpc_endpoint, archive_url, contracts_info)
    write_yaml(squidgen_config, "squidgen.yaml")

    squid_config = create_squid_config(args.network_name)
    write_yaml(squid_config, "squid.yaml")

    print(
        f"squidgen.yaml, squid.yaml, and ABI files have been generated for {args.network_name}"
    )
