from src.extract import extract_data

# getVaultCollateral
func_inputs = [
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
        "network_id": 84532,
        "contract_name": "CoreProxy",
        "function_name": "getVaultCollateral",
        "inputs": [
            (1, "0x434Aa3FDb11798EDaB506D4a5e48F70845a66219"),
        ],
        "min_block": "4.5M",
    },
]

for func_input in func_inputs:
    extract_data(**func_input)
