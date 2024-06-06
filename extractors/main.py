import os
from dotenv import load_dotenv
from src.extract import extract_data, extract_blocks

# load environment variables
load_dotenv()

REQUESTS_PER_SECOND = int(os.getenv("REQUESTS_PER_SECOND"))

# extract blocks
block_inputs = [
    # base mainnet
    {
        "network_id": 8453,
        "min_block": "7.5M",
        "requests_per_second": REQUESTS_PER_SECOND,
    },
    # base sepolia
    {
        "network_id": 84532,
        "min_block": "8M",
        "requests_per_second": 25,
    },
    # arbitrum sepolia
    {
        "network_id": 421614,
        "min_block": "41M",
        "block_increment": 4000,
    },
    # arbitrum mainnet
    {
        "network_id": 42161,
        "min_block": "218M",
        "block_increment": 4000,
    },
]

for block_input in block_inputs:
    extract_blocks(**block_input)


# extract eth_call data
func_inputs = [
    # base mainnet
    {
        "network_id": 8453,
        "contract_name": "CoreProxy",
        "function_name": "getVaultCollateral",
        "inputs": [
            (1, "0xC74eA762cF06c9151cE074E6a569a5945b6302E7"),
        ],
        "min_block": "7.5M",
        "requests_per_second": REQUESTS_PER_SECOND,
    },
    {
        "network_id": 8453,
        "contract_name": "CoreProxy",
        "function_name": "getVaultDebt",
        "inputs": [
            (1, "0xC74eA762cF06c9151cE074E6a569a5945b6302E7"),
        ],
        "min_block": "7.5M",
        "requests_per_second": REQUESTS_PER_SECOND,
    },
    # base sepolia
    {
        "network_id": 84532,
        "contract_name": "CoreProxy",
        "function_name": "getVaultCollateral",
        "inputs": [
            (1, "0x8069c44244e72443722cfb22DcE5492cba239d39"),
        ],
        "min_block": "8M",
        "requests_per_second": 25,
    },
    {
        "network_id": 84532,
        "contract_name": "CoreProxy",
        "function_name": "getVaultDebt",
        "inputs": [
            (1, "0x8069c44244e72443722cfb22DcE5492cba239d39"),
        ],
        "min_block": "8M",
        "requests_per_second": 25,
    },
    # arbitrum sepolia
    {
        "network_id": 421614,
        "contract_name": "CoreProxy",
        "function_name": "getVaultCollateral",
        "inputs": [
            (1, "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73"),  # WETH
            (1, "0x7b356eEdABc1035834cd1f714658627fcb4820E3"),  # ARB
            (1, "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"),  # USDC
            (1, "0xda7b438d762110083602AbC497b1Ec8Bc6605eC9"),  # DAI
        ],
        "min_block": "41M",
        "requests_per_second": 25,
        "block_increment": 4000,
    },
    {
        "network_id": 421614,
        "contract_name": "CoreProxy",
        "function_name": "getVaultDebt",
        "inputs": [
            (1, "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73"),  # WETH
            (1, "0x7b356eEdABc1035834cd1f714658627fcb4820E3"),  # ARB
            (1, "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"),  # USDC
            (1, "0xda7b438d762110083602AbC497b1Ec8Bc6605eC9"),  # DAI
        ],
        "min_block": "41M",
        "requests_per_second": 25,
        "block_increment": 4000,
    },
    # arbitrum mainnet
    {
        "network_id": 42161,
        "contract_name": "CoreProxy",
        "function_name": "getVaultCollateral",
        "inputs": [
            (1, "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"),  # WETH
            (1, "0x912CE59144191C1204E64559FE8253a0e49E6548"),  # ARB
            (1, "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),  # USDC
        ],
        "min_block": "218M",
        "requests_per_second": 25,
        "block_increment": 4000,
    },
    {
        "network_id": 42161,
        "contract_name": "CoreProxy",
        "function_name": "getVaultDebt",
        "inputs": [
            (1, "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"),  # WETH
            (1, "0x912CE59144191C1204E64559FE8253a0e49E6548"),  # ARB
            (1, "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),  # USDC
        ],
        "min_block": "218M",
        "requests_per_second": 25,
        "block_increment": 4000,
    },
]

for func_input in func_inputs:
    try:
        extract_data(**func_input)
    except Exception as e:
        print(f"Error: {e} for inputs {func_input}")
