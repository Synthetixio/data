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


def get_synths(network_id):
    network_name = NETWORK_IDS[network_id]

    # start the sdk
    snx = Synthetix(provider_rpc=os.getenv(f"NETWORK_{network_id}_RPC"))

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


if __name__ == "__main__":
    for network_id in NETWORK_IDS:
        get_synths(network_id)
