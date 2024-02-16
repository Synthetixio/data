import pandas as pd
import cryo
from synthetix import Synthetix
from .constants import CHAIN_CONFIGS
from .clean import clean_data


def get_synthetix(chain_config):
    return Synthetix(
        provider_rpc=chain_config["rpc"], network_id=chain_config["network_id"]
    )


# generalize a function
def extract_data(
    network_id,
    contract_name,
    function_name,
    inputs,
    clean=True,
    min_block=0,
    block_increment=10000,
):
    if network_id not in CHAIN_CONFIGS:
        raise ValueError(f"Network id {network_id} not supported")

    # get synthetix
    chain_config = CHAIN_CONFIGS[network_id]
    snx = get_synthetix(chain_config)

    # try reading and looking for latest block
    output_dir = f"/parquet-data/raw/{chain_config['name']}/{function_name}"
    try:
        df = pd.read_parquet(output_dir)
        latest_block = df["block_number"].max()
        blocks = f"{latest_block}:latest:{block_increment}"
    except FileNotFoundError:
        blocks = f"{min_block}:latest:{block_increment}"
        pass

    # encode the call data
    contract = snx.contracts[contract_name]["contract"]
    contract_function = contract.functions[function_name]

    calls = [
        contract_function(*this_input).build_transaction()["data"]
        for this_input in inputs
    ]

    cryo.freeze(
        "eth_calls",
        contract=[contract.address],
        function=calls,
        blocks=[blocks],
        rpc=snx.provider_rpc,
        requests_per_second=5,
        output_dir=output_dir,
        hex=True,
    )

    if clean:
        df_clean = clean_data(chain_config["name"], contract, function_name)
