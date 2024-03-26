import os
from dotenv import load_dotenv

load_dotenv()


CHAIN_CONFIGS = {
    10: {
        "name": "optimism_mainnet",
        "rpc": os.getenv("OP_MAINNET_RPC"),
        "network_id": 10,
    },
    8453: {
        "name": "base_mainnet",
        "rpc": os.getenv("BASE_MAINNET_RPC"),
        "network_id": 8453,
    },
    84532: {
        "name": "base_sepolia",
        "rpc": os.getenv("BASE_SEPOLIA_RPC"),
        "network_id": 84532,
    },
    421614: {
        "name": "arbitrum_sepolia",
        "rpc": os.getenv("ARBITRUM_SEPOLIA_RPC"),
        "network_id": 421614,
        "cannon_config": {
            "package": "synthetix-omnibus",
            "version": "latest",
            "preset": "arbthetix",
        },
    },
}
