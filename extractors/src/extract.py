import json
import os
import cryo
from synthetix import Synthetix
from .constants import CHAIN_CONFIGS
from .clean import clean_data, clean_blocks
from dotenv import load_dotenv

load_dotenv()


def get_synthetix(chain_config):
    if "cannon_config" in chain_config:
        return Synthetix(
            provider_rpc=chain_config["rpc"],
            op_mainnet_rpc=os.getenv("NETWORK_10_RPC"),
            network_id=chain_config["network_id"],
            cannon_config=chain_config["cannon_config"],
        )
    else:
        return Synthetix(
            provider_rpc=chain_config["rpc"],
            op_mainnet_rpc=os.getenv("NETWORK_10_RPC"),
            network_id=chain_config["network_id"],
        )


# generalize a function
def extract_data(
    network_id,
    contract_name,
    function_name,
    inputs,
    package_name=None,
    contract_address=None,
    clean=True,
    min_block=0,
    requests_per_second=25,
    block_increment=500,
    chunk_size=1000,
):
    if network_id not in CHAIN_CONFIGS:
        raise ValueError(f"Network id {network_id} not supported")

    # get synthetix
    chain_config = CHAIN_CONFIGS[network_id]
    snx = get_synthetix(chain_config)

    # encode the call data
    if contract_name == "TreasuryProxy":
        abi = json.load(open("abi/TreasuryProxy.json"))
        contract = snx.web3.eth.contract(contract_address, abi=abi)
        calls = [contract.encodeABI(fn_name=function_name)]
        dir_name = f"{function_name}"
    elif contract_name == "ETHVault":
        abi = json.load(open("abi/Vault.json"))
        contract = snx.web3.eth.contract(contract_address, abi=abi)
        calls = [contract.encodeABI(fn_name=function_name)]
        dir_name = f"{function_name}_eth_vault"
    elif contract_name == "BTCVault":
        abi = json.load(open("abi/Vault.json"))
        contract = snx.web3.eth.contract(contract_address, abi=abi)
        calls = [contract.encodeABI(fn_name=function_name)]
        dir_name = f"{function_name}_btc_vault"
    else:
        contract = snx.contracts[package_name][contract_name]["contract"]
        calls = [
            contract.encodeABI(fn_name=function_name, args=this_input)
            for this_input in inputs
        ]
        dir_name = f"{function_name}"

    output_dir = f"/parquet-data/raw/{chain_config['name']}/{dir_name}"

    cryo.freeze(
        "eth_calls",
        contract=[contract.address],
        function=calls,
        blocks=[f"{min_block}:latest:{block_increment}"],
        rpc=snx.provider_rpc,
        requests_per_second=requests_per_second,
        chunk_size=chunk_size,
        output_dir=output_dir,
        hex=True,
        exclude_failed=True,
    )

    if clean:
        df_clean = clean_data(chain_config["name"], contract, function_name, dir_name)


def extract_blocks(
    network_id,
    clean=True,
    min_block=0,
    requests_per_second=25,
    block_increment=500,
    chunk_size=1000,
):
    if network_id not in CHAIN_CONFIGS:
        raise ValueError(f"Network id {network_id} not supported")

    # get synthetix
    chain_config = CHAIN_CONFIGS[network_id]
    snx = get_synthetix(chain_config)

    # try reading and looking for latest block
    output_dir = f"/parquet-data/raw/{chain_config['name']}/blocks"

    cryo.freeze(
        "blocks",
        blocks=[f"{min_block}:latest:{block_increment}"],
        rpc=snx.provider_rpc,
        requests_per_second=requests_per_second,
        chunk_size=chunk_size,
        output_dir=output_dir,
        hex=True,
        exclude_failed=True,
    )

    if clean:
        df_clean = clean_blocks(chain_config["name"])
