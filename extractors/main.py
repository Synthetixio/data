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
        "min_block": "20M",
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
]

for func_input in func_inputs:
    try:
        extract_data(**func_input)
    except Exception as e:
        print(f"Error: {e} for inputs {func_input}")
