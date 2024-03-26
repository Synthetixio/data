from src.extract import extract_data, extract_blocks

# extract blocks
block_inputs = [
    # base mainnet
    {
        "network_id": 8453,
        "min_block": "7.5M",
    },
    # base sepolia
    {
        "network_id": 84532,
        "min_block": "4.5M",
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
    },
    {
        "network_id": 8453,
        "contract_name": "CoreProxy",
        "function_name": "getVaultDebt",
        "inputs": [
            (1, "0xC74eA762cF06c9151cE074E6a569a5945b6302E7"),
        ],
        "min_block": "7.5M",
    },
    # base sepolia
    {
        "network_id": 84532,
        "contract_name": "CoreProxy",
        "function_name": "getVaultCollateral",
        "inputs": [
            (1, "0x434Aa3FDb11798EDaB506D4a5e48F70845a66219"),
        ],
        "min_block": "4.5M",
    },
    {
        "network_id": 84532,
        "contract_name": "CoreProxy",
        "function_name": "getVaultDebt",
        "inputs": [
            (1, "0x434Aa3FDb11798EDaB506D4a5e48F70845a66219"),
        ],
        "min_block": "4.5M",
    },
]

for func_input in func_inputs:
    extract_data(**func_input)
