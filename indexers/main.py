import os
import argparse
import json
from pathlib import Path
from dotenv import load_dotenv
import yaml
from synthetix import Synthetix
from utils.clickhouse_utils import process_abi_schemas

# load environment variables
load_dotenv()

RAW_DATA_PATH = "/parquet-data/indexers/raw"
SCHEMAS_BASE_PATH = "/parquet-data/indexers/schemas"
CONFIG_PATH = "networks"


class IndexerGenerator:
    """
    Class to generate Squid configuration files for a given network and protocol
    """
    def __init__(self, network_name, protocol_name, block_from=None, block_to=None):
        self.network_name = network_name
        self.protocol_name = protocol_name
        self.schemas_path = f"{SCHEMAS_BASE_PATH}/{network_name}/{protocol_name}"
        self.config_path = f"{CONFIG_PATH}/{network_name}"
        self.network_id = None
        self.archive_url = None
        self.rpc_endpoint = None
        self.rpc_rate_limit = None
        self.protocol_config = None
        self.block_from = block_from
        self.block_to = block_to
        self.contracts = []

    def run(self):
        self.load_config()
        self.process_contracts()
        self.generate_and_save_squidgen_config()
        print(f"squidgen.yaml and ABI files have been generated for {self.network_name}")

    def load_config(self):
        path = f"{self.config_path}/network_config.yaml"
        with open(path, "r") as file:
            config_file = yaml.safe_load(file)
        
        network_params = config_file["network"]
        if network_params is None:
            err_msg = f"Network '{self.network_name}' not found in {path}/network_config.yaml"
            raise Exception(err_msg)
        self.network_id = network_params["network_id"]
        self.archive_url = network_params.get("archive_url", "None")
        self.rpc_endpoint = os.getenv(f"NETWORK_{self.network_id}_RPC")
        self.rpc_rate_limit = network_params.get("rpc_rate_limit", 10)
        self.protocol_config = config_file["protocols"][self.protocol_name]

    def process_contracts(self):
        if "contracts_from_sdk" in self.protocol_config:
            self._process_sdk_contracts()
        if "contracts_from_abi" in self.protocol_config:
            self._process_abi_contracts()
        if not self.contracts:
            raise Exception("No contracts found")

    def generate_and_save_squidgen_config(self):
        config = {
            "archive": self.archive_url,
            "chain": {"url": self.rpc_endpoint, "rateLimit": self.rpc_rate_limit},
            "finalityConfirmation": 1,
            "target": {
                "type": "parquet",
                "path": f"{RAW_DATA_PATH}/{self.network_name}/{self.protocol_name}",
            },
            "contracts": [
                {
                    "name": contract["name"],
                    "address": contract["address"],
                    "range": self.get_block_range(),
                    "abi": f"./abi/{contract['name']}.json",
                    "events": True,
                    "functions": False,
                }
                for contract in self.contracts
            ],
        }
        with open("squidgen.yaml", "w") as file:
            yaml.dump(config, file, default_flow_style=False)

    def _process_sdk_contracts(self):
        contracts_from_sdk = self.protocol_config["contracts_from_sdk"]
        if "cannon_config" in self.protocol_config:
            snx = Synthetix(
                provider_rpc=self.rpc_endpoint,
                network_id=self.network_id,
                cannon_config=self.protocol_config["cannon_config"],
            )
        else:
            snx = Synthetix(
                provider_rpc=self.rpc_endpoint,
                network_id=self.network_id,
            )
        for contract in contracts_from_sdk:
            contract_name = contract["name"]
            package = contract["package"]
            contract_data = snx.contracts[package][contract_name]
            abi = contract_data["abi"]
            address = contract_data["address"]
            self._save_abi(abi, contract_name)
            self.contracts.append({"name": contract_name, "address": address})
        
    def _process_abi_contracts(self):
        contracts_from_abi = self.protocol_config["contracts_from_abi"]
        for contract in contracts_from_abi:
            contract_name = contract["name"]
            abi_name = contract["abi"]
            abi_path = f"{self.config_path}/abi/{abi_name}"
            with open(abi_path, "r") as file:
                abi = json.load(file)
            self._save_abi(abi, contract_name)
            self.contracts.append({"name": contract_name, "address": contract["address"]})

    def _get_block_range(self):
        block_range = {}
        if self.block_from is not None:
            block_range["from"] = self.block_from
        else:
            block_range["from"] = self.protocol_config["range"].get("from", 0)
        if self.block_to is not None:
            block_range["to"] = self.block_to
        elif "to" in self.protocol_config["range"]:
            block_range["to"] = self.protocol_config["range"]["to"]
        return block_range

    def _save_abi(self, abi, contract_name):
        abi_dir = Path("abi")
        abi_dir.mkdir(exist_ok=True)
        abi_file = abi_dir / f"{contract_name}.json"
        try:
            abi_file.write_text(json.dumps(abi, indent=2))
        except Exception as e:
            print(f"Error saving ABI for {contract_name}: {e}")
            raise e


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
    block_from = args.block_from
    block_to = args.block_to

    indexer_generator = IndexerGenerator(network_name, protocol_name, block_from, block_to)
    indexer_generator.run()
