import cryo
from synthetix import Synthetix
from .constants import CHAIN_CONFIGS
from .clean import clean_data, clean_blocks


def get_synthetix(chain_config):
    if "cannon_config" in chain_config:
        return Synthetix(
            provider_rpc=chain_config["rpc"],
            network_id=chain_config["network_id"],
            cannon_config=chain_config["cannon_config"],
        )
    else:
        return Synthetix(
            provider_rpc=chain_config["rpc"],
            network_id=chain_config["network_id"],
        )


# generalize a function
def extract_data(
    network_id,
    protocol,
    contract_name,
    package_name,
    function_name,
    inputs,
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
    output_dir = f"/parquet-data/extractors/raw/{chain_config['name']}/{protocol}/{function_name}"

    # encode the call data
    contract = snx.contracts[package_name][contract_name]["contract"]
    calls = [
        contract.encodeABI(fn_name=function_name, args=this_input)
        for this_input in inputs
    ]

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
        df_clean = clean_data(chain_config["name"], protocol, contract, function_name)
        return df_clean


def extract_blocks(
    network_id,
    protocol,
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
    output_dir = (
        f"/parquet-data/extractors/raw/{chain_config['name']}/{protocol}/blocks"
    )

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
        df_clean = clean_blocks(chain_config["name"], protocol)
        return df_clean
