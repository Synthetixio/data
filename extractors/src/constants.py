import os
from dotenv import load_dotenv

load_dotenv()


CHAIN_CONFIGS = {
    1: {
        "name": "eth_mainnet",
        "rpc": os.getenv("NETWORK_1_RPC"),
        "network_id": 1,
        "cannon_config": {
            "package": "synthetix-omnibus",
            "version": "latest",
            "preset": "main"
        }
    },
    10: {
        "name": "optimism_mainnet",
        "rpc": os.getenv("NETWORK_10_RPC"),
        "network_id": 10,
    },
    8453: {
        "name": "base_mainnet",
        "rpc": os.getenv("NETWORK_8453_RPC"),
        "network_id": 8453,
    },
    84532: {
        "name": "base_sepolia",
        "rpc": os.getenv("NETWORK_84532_RPC"),
        "network_id": 84532,
    },
    42161: {
        "name": "arbitrum_mainnet",
        "rpc": os.getenv("NETWORK_42161_RPC"),
        "network_id": 42161,
    },
    421614: {
        "name": "arbitrum_sepolia",
        "rpc": os.getenv("NETWORK_421614_RPC"),
        "network_id": 421614,
    },
}
