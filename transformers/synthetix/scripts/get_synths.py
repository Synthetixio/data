import os
import pandas as pd
from synthetix import Synthetix

NETWORK_IDS = {
    1: "eth_mainnet",
    # 11155111: "eth_sepolia",
    8453: "base_mainnet",
    84532: "base_sepolia",
    42161: "arbitrum_mainnet",
    421614: "arbitrum_sepolia",
}


def get_reward_distributors(snx, synth_lookup):
    reward_contracts = {c: snx.contracts[c] for c in snx.contracts if "reward" in c}
    reward_distributors = []
    for contract_name, contract_info in reward_contracts.items():
        reward_type = "liquidation" if "liquidation" in contract_name else "incentive"

        reward_key = list(contract_info.keys())[0]
        reward_contract = contract_info[reward_key]["contract"]
        token_address = reward_contract.functions.token().call()

        synth = synth_lookup.get(token_address)
        if synth is None:
            token_contract = snx.web3.eth.contract(
                address=token_address, abi=snx.contracts["common"]["ERC20"]["abi"]
            )
            token_symbol = token_contract.functions.symbol().call()
            synth_token_address = None
        else:
            token_symbol = synth["token_symbol"]
            synth_token_address = synth["synth_token_address"]

        reward_distributor = {
            "distributor_address": reward_contract.address,
            "token_symbol": token_symbol,
            "synth_token_address": synth_token_address,
            "reward_type": reward_type,
        }

        reward_distributors.append(reward_distributor)

    df_reward_distributors = pd.DataFrame(reward_distributors)
    return df_reward_distributors


def get_synths(network_id):
    network_name = NETWORK_IDS[network_id]

    # start the sdk
    snx = Synthetix(
        provider_rpc=os.getenv(f"NETWORK_{network_id}_RPC"),
        cannon_config={
            "package": "synthetix-omnibus",
            "version": "latest",
            "preset": "andromeda" if "base" in network_name else "main",
        },
    )

    # get the synths
    synths = []
    for idx in snx.spot.markets_by_id:
        market = snx.spot.markets_by_id[idx]
        contract = market["contract"]

        synth_name = contract.functions.name().call()
        token_symbol = market["symbol"] if idx != 0 else "sUSD"
        synths.append(
            {
                "synth_market_id": idx,
                "synth_token_address": contract.address,
                "synth_name": synth_name,
                "synth_symbol": market["market_name"],
                "token_symbol": token_symbol,
            }
        )

    # write it out
    df_synths = pd.DataFrame(synths)
    df_synths.to_csv(f"./seeds/synths/{network_name}_synths.csv", index=False)

    # get reward distributors
    synth_lookup = {synth["synth_token_address"]: synth for synth in synths}
    df_reward_distributors = get_reward_distributors(snx, synth_lookup)
    df_reward_distributors.to_csv(
        f"./seeds/reward_distributors/{network_name}_reward_distributors.csv",
        index=False,
    )


if __name__ == "__main__":
    for network_id in NETWORK_IDS:
        get_synths(network_id)
