import os
import argparse
import json
from pathlib import Path
from dotenv import load_dotenv
import yaml
from synthetix import Synthetix

from utils.clickhouse_utils import ClickhouseSchemaManager, ParquetImporter
from utils.constants import DATA_PATH, INDEXER_CONFIG_PATH
from utils.log_utils import create_logger

load_dotenv()


class IndexerGenerator:
    """
    This class handles the generation of a squidgen.yaml codegen-config file & ABI files
    needed to build a Subsquid processor to index blockchain data for a specific network 
    and protocol.

    It supports contract loading both from the Synthetix SDK and from local ABI files.

    :param network_name (str): Name of the blockchain network (e.g. "base_mainnet")
    :param protocol_name (str): Name of the protocol config to use (e.g. "synthetix")
    :param block_from (int, optional): Starting block number for indexing
    :param block_to (int, optional): Ending block number for indexing
    """
    def __init__(
        self,
        network_name,
        protocol_name,
        block_from=None,
        block_to=None,
    ):
        self.network_name = network_name
        self.protocol_name = protocol_name
        self.data_path = Path(DATA_PATH) / network_name / protocol_name
        self.data_path.mkdir(parents=True, exist_ok=True)
        self.config_path = Path(INDEXER_CONFIG_PATH) / network_name
        self.network_id = None
        self.archive_url = None
        self.rpc_endpoint = None
        self.rpc_rate_limit = None
        self.protocol_config = None
        self.block_from = block_from
        self.block_to = block_to
        self.contracts = []
        self.logger = create_logger(
            __name__, 
            f"indexer_{self.network_name}_{self.protocol_name}.log",
        )

    def run(self):
        """
        Main function to run to generate the squidgen.yaml config file & ABI files.

        This function will:
        1. Load the configuration file
        2. Process the contracts (specified in the config file)
        3. Generate and save the squidgen.yaml file
        """
        self.load_config()
        self.process_contracts()
        self.generate_and_save_squidgen_config()
        self.logger.info(f"squidgen.yaml and ABI files have been generated for {self.network_name}")

    def load_config(self):
        """
        Load and parse the network configuration file for the given network and protocol.

        Configuration parameters:
        Network specific params:
            - network_id: id of the network
            - archive_url: url of the archive node
            - rpc_rate_limit: rate limit for the rpc node
            - rpc_endpoint: url of the rpc node (env variable)

        Protocol specific params (saved to self.protocol_config):
            - contracts_from_sdk: list of contracts to fetch using the Synthetix SDK
            - contracts_from_abi: list of contracts to fetch from the abi files
            - range: block range to fetch from
            - cannon_config: cannon deployment config for the Synthetix SDK
        """
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
        """
        Process contracts using either the Synthetix SDK or the provided abi files.

        Populates the self.contracts list with contract information including:
        - name: Contract name
        - address: Contract address
        - abi: Contract ABI
        """
        if "contracts_from_sdk" in self.protocol_config:
            self._process_sdk_contracts()
        if "contracts_from_abi" in self.protocol_config:
            self._process_abi_contracts()
        if not self.contracts:
            raise Exception("No contracts found")

    def generate_and_save_squidgen_config(self):
        """
        Generate and save the squidgen.yaml file.
        
        Creates a YAML configuration with:
        - Subsquid Archive settings
        - Chain RPC configuration
        - Target storage (parquet) configuration
        - Contract specifications including name, address, block range, and ABI path

        The generated file is used by squidgen to create the squid processor.
        """
        config = {
            "archive": self.archive_url,
            "chain": {"url": self.rpc_endpoint, "rateLimit": self.rpc_rate_limit},
            "finalityConfirmation": 1,
            "target": {
                "type": "parquet",
                "path": str(self.data_path),
            },
            "contracts": [
                {
                    "name": contract["name"],
                    "address": contract["address"],
                    "range": self._get_block_range(),
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
        """
        Process contracts using the Synthetix SDK to fetch the abi and address.
        """
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
            self.contracts.append(
                {
                    "name": contract_name,
                    "address": address,
                    "abi": abi,
                }
            )
        
    def _process_abi_contracts(self):
        """
        Process contracts using the provided abi files.
        """
        contracts_from_abi = self.protocol_config["contracts_from_abi"]
        for contract in contracts_from_abi:
            contract_name = contract["name"]
            abi_name = contract["abi"]
            abi_path = f"{self.config_path}/abi/{abi_name}"
            with open(abi_path, "r") as file:
                abi = json.load(file)
            self._save_abi(abi, contract_name)
            self.contracts.append(
                {
                    "name": contract_name,
                    "address": contract["address"],
                    "abi": abi,
                }
            )

    def _get_block_range(self):
        """
        Determines the block range for indexing.

        Returns:
            dict: A dictionary containing 'from' and optionally 'to' block numbers.
                 'from': Uses command line arg if provided, else config value or 0
                 'to': Uses command line arg if provided, else config value or None 
                       (which means the latest block)
        """
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
        """
        Save the abi file to the abi directory used by squidgen to generate
        the squid processor.
        """
        abi_dir = Path("abi")
        abi_dir.mkdir(exist_ok=True)
        abi_file = abi_dir / f"{contract_name}.json"
        try:
            abi_file.write_text(json.dumps(abi, indent=2))
        except Exception as e:
            self.logger.error(f"Error saving ABI for {contract_name}: {e}")
            raise e


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate Squid configuration files for a given network"
    )
    parser.add_argument(
        "--network_name",
        type=str,
        help="Network name",
        required=True,
    )
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

    # Generate the squidgen.yaml file & ABI files
    indexer_generator = IndexerGenerator(
        network_name,
        protocol_name,
        block_from,
        block_to,
    )
    indexer_generator.run()

    # Generate the clickhouse schemas and create the database & tables
    schema_manager = ClickhouseSchemaManager(
        network_name=network_name,
        protocol_name=protocol_name,
    )
    for contract in indexer_generator.contracts:
        schema_manager.build_schemas_from_contract(contract["abi"], contract["name"])
    schema_manager.save_schemas_to_disk()
    schema_manager.create_database()
    schema_manager.create_tables_from_schemas(from_path=True)

    # Import any existing data from the parquet files
    parquet_importer = ParquetImporter(
        network_name=network_name,
        protocol_name=protocol_name,
    )
    parquet_importer.import_data()
