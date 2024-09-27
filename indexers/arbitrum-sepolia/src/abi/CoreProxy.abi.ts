export const ABI_JSON = [
    {
        "type": "error",
        "name": "ImplementationIsSterile",
        "inputs": [
            {
                "type": "address",
                "name": "implementation"
            }
        ]
    },
    {
        "type": "error",
        "name": "NoChange",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotAContract",
        "inputs": [
            {
                "type": "address",
                "name": "contr"
            }
        ]
    },
    {
        "type": "error",
        "name": "NotNominated",
        "inputs": [
            {
                "type": "address",
                "name": "addr"
            }
        ]
    },
    {
        "type": "error",
        "name": "Unauthorized",
        "inputs": [
            {
                "type": "address",
                "name": "addr"
            }
        ]
    },
    {
        "type": "error",
        "name": "UpgradeSimulationFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ZeroAddress",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OwnerChanged",
        "inputs": [
            {
                "type": "address",
                "name": "oldOwner",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newOwner",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OwnerNominated",
        "inputs": [
            {
                "type": "address",
                "name": "newOwner",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Upgraded",
        "inputs": [
            {
                "type": "address",
                "name": "self",
                "indexed": true
            },
            {
                "type": "address",
                "name": "implementation",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "acceptOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getImplementation",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "nominateNewOwner",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newNominatedOwner"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "nominatedOwner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "owner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "renounceNomination",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "simulateUpgradeTo",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newImplementation"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "upgradeTo",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newImplementation"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "ValueAlreadyInSet",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ValueNotInSet",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeatureFlagAllowAllSet",
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "allowAll",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeatureFlagAllowlistAdded",
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeatureFlagAllowlistRemoved",
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeatureFlagDeniersReset",
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature",
                "indexed": true
            },
            {
                "type": "address[]",
                "name": "deniers"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeatureFlagDenyAllSet",
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "denyAll",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "addToFeatureFlagAllowlist",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getDeniers",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeatureFlagAllowAll",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeatureFlagAllowlist",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeatureFlagDenyAll",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "isFeatureAllowed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "removeFromFeatureFlagAllowlist",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDeniers",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            },
            {
                "type": "address[]",
                "name": "deniers"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setFeatureFlagAllowAll",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            },
            {
                "type": "bool",
                "name": "allowAll"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setFeatureFlagDenyAll",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "feature"
            },
            {
                "type": "bool",
                "name": "denyAll"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "FeatureUnavailable",
        "inputs": [
            {
                "type": "bytes32",
                "name": "which"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidAccountId",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidPermission",
        "inputs": [
            {
                "type": "bytes32",
                "name": "permission"
            }
        ]
    },
    {
        "type": "error",
        "name": "OnlyAccountTokenProxy",
        "inputs": [
            {
                "type": "address",
                "name": "origin"
            }
        ]
    },
    {
        "type": "error",
        "name": "PermissionDenied",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "bytes32",
                "name": "permission"
            },
            {
                "type": "address",
                "name": "target"
            }
        ]
    },
    {
        "type": "error",
        "name": "PermissionNotGranted",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "bytes32",
                "name": "permission"
            },
            {
                "type": "address",
                "name": "user"
            }
        ]
    },
    {
        "type": "error",
        "name": "PositionOutOfBounds",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AccountCreated",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PermissionGranted",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "permission",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PermissionRevoked",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "permission",
                "indexed": true
            },
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "createAccount",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
    },
    {
        "type": "function",
        "name": "createAccount",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "requestedAccountId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getAccountLastInteraction",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccountOwner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccountPermissions",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "accountPerms",
                "components": [
                    {
                        "type": "address",
                        "name": "user"
                    },
                    {
                        "type": "bytes32[]",
                        "name": "permissions"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccountTokenAddress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "grantPermission",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "bytes32",
                "name": "permission"
            },
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "hasPermission",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "bytes32",
                "name": "permission"
            },
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "isAuthorized",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "bytes32",
                "name": "permission"
            },
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "notifyAccountTransfer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "to"
            },
            {
                "type": "uint128",
                "name": "accountId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "renouncePermission",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "bytes32",
                "name": "permission"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "revokePermission",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "bytes32",
                "name": "permission"
            },
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "AccountNotFound",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
    },
    {
        "type": "error",
        "name": "EmptyDistribution",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientCollateralRatio",
        "inputs": [
            {
                "type": "uint256",
                "name": "collateralValue"
            },
            {
                "type": "uint256",
                "name": "debt"
            },
            {
                "type": "uint256",
                "name": "ratio"
            },
            {
                "type": "uint256",
                "name": "minRatio"
            }
        ]
    },
    {
        "type": "error",
        "name": "MarketNotFound",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ]
    },
    {
        "type": "error",
        "name": "NotFundedByPool",
        "inputs": [
            {
                "type": "uint256",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "poolId"
            }
        ]
    },
    {
        "type": "error",
        "name": "OverflowInt256ToInt128",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowInt256ToUint256",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint128ToInt128",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint256ToInt256",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint256ToUint128",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DebtAssociated",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "updatedDebt",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "associateDebt",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    },
    {
        "type": "error",
        "name": "MismatchAssociatedSystemKind",
        "inputs": [
            {
                "type": "bytes32",
                "name": "expected"
            },
            {
                "type": "bytes32",
                "name": "actual"
            }
        ]
    },
    {
        "type": "error",
        "name": "MissingAssociatedSystem",
        "inputs": [
            {
                "type": "bytes32",
                "name": "id"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AssociatedSystemSet",
        "inputs": [
            {
                "type": "bytes32",
                "name": "kind",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "id",
                "indexed": true
            },
            {
                "type": "address",
                "name": "proxy",
                "indexed": false
            },
            {
                "type": "address",
                "name": "impl",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "getAssociatedSystem",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "id"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "addr"
            },
            {
                "type": "bytes32",
                "name": "kind"
            }
        ]
    },
    {
        "type": "function",
        "name": "initOrUpgradeNft",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "id"
            },
            {
                "type": "string",
                "name": "name"
            },
            {
                "type": "string",
                "name": "symbol"
            },
            {
                "type": "string",
                "name": "uri"
            },
            {
                "type": "address",
                "name": "impl"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "initOrUpgradeToken",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "id"
            },
            {
                "type": "string",
                "name": "name"
            },
            {
                "type": "string",
                "name": "symbol"
            },
            {
                "type": "uint8",
                "name": "decimals"
            },
            {
                "type": "address",
                "name": "impl"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "registerUnmanagedSystem",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "id"
            },
            {
                "type": "address",
                "name": "endpoint"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "InvalidMessage",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotCcipRouter",
        "inputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "error",
        "name": "UnsupportedNetwork",
        "inputs": [
            {
                "type": "uint64",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "ccipReceive",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "message",
                "components": [
                    {
                        "type": "bytes32",
                        "name": "messageId"
                    },
                    {
                        "type": "uint64",
                        "name": "sourceChainSelector"
                    },
                    {
                        "type": "bytes",
                        "name": "sender"
                    },
                    {
                        "type": "bytes",
                        "name": "data"
                    },
                    {
                        "type": "tuple[]",
                        "name": "tokenAmounts",
                        "components": [
                            {
                                "type": "address",
                                "name": "token"
                            },
                            {
                                "type": "uint256",
                                "name": "amount"
                            }
                        ]
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "AccountActivityTimeoutPending",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint256",
                "name": "currentTime"
            },
            {
                "type": "uint256",
                "name": "requiredTime"
            }
        ]
    },
    {
        "type": "error",
        "name": "CollateralDepositDisabled",
        "inputs": [
            {
                "type": "address",
                "name": "collateralType"
            }
        ]
    },
    {
        "type": "error",
        "name": "CollateralNotFound",
        "inputs": []
    },
    {
        "type": "error",
        "name": "FailedTransfer",
        "inputs": [
            {
                "type": "address",
                "name": "from"
            },
            {
                "type": "address",
                "name": "to"
            },
            {
                "type": "uint256",
                "name": "value"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficentAvailableCollateral",
        "inputs": [
            {
                "type": "uint256",
                "name": "amountAvailableForDelegationD18"
            },
            {
                "type": "uint256",
                "name": "amountD18"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientAccountCollateral",
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientAllowance",
        "inputs": [
            {
                "type": "uint256",
                "name": "required"
            },
            {
                "type": "uint256",
                "name": "existing"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidParameter",
        "inputs": [
            {
                "type": "string",
                "name": "parameter"
            },
            {
                "type": "string",
                "name": "reason"
            }
        ]
    },
    {
        "type": "error",
        "name": "OverflowUint256ToUint64",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PrecisionLost",
        "inputs": [
            {
                "type": "uint256",
                "name": "tokenAmount"
            },
            {
                "type": "uint8",
                "name": "decimals"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollateralLockCreated",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenAmount",
                "indexed": false
            },
            {
                "type": "uint64",
                "name": "expireTimestamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollateralLockExpired",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenAmount",
                "indexed": false
            },
            {
                "type": "uint64",
                "name": "expireTimestamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Deposited",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenAmount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Withdrawn",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenAmount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "cleanExpiredLocks",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "offset"
            },
            {
                "type": "uint256",
                "name": "count"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "cleared"
            }
        ]
    },
    {
        "type": "function",
        "name": "createLock",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint64",
                "name": "expireTimestamp"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "deposit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "tokenAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getAccountAvailableCollateral",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccountCollateral",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "totalDeposited"
            },
            {
                "type": "uint256",
                "name": "totalAssigned"
            },
            {
                "type": "uint256",
                "name": "totalLocked"
            }
        ]
    },
    {
        "type": "function",
        "name": "getLocks",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "offset"
            },
            {
                "type": "uint256",
                "name": "count"
            }
        ],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "locks",
                "components": [
                    {
                        "type": "uint128",
                        "name": "amountD18"
                    },
                    {
                        "type": "uint64",
                        "name": "lockExpirationTime"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "withdraw",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "tokenAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollateralConfigured",
        "inputs": [
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "tuple",
                "name": "config",
                "indexed": false,
                "components": [
                    {
                        "type": "bool",
                        "name": "depositingEnabled"
                    },
                    {
                        "type": "uint256",
                        "name": "issuanceRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRewardD18"
                    },
                    {
                        "type": "bytes32",
                        "name": "oracleNodeId"
                    },
                    {
                        "type": "address",
                        "name": "tokenAddress"
                    },
                    {
                        "type": "uint256",
                        "name": "minDelegationD18"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "configureCollateral",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "config",
                "components": [
                    {
                        "type": "bool",
                        "name": "depositingEnabled"
                    },
                    {
                        "type": "uint256",
                        "name": "issuanceRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRewardD18"
                    },
                    {
                        "type": "bytes32",
                        "name": "oracleNodeId"
                    },
                    {
                        "type": "address",
                        "name": "tokenAddress"
                    },
                    {
                        "type": "uint256",
                        "name": "minDelegationD18"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getCollateralConfiguration",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "bool",
                        "name": "depositingEnabled"
                    },
                    {
                        "type": "uint256",
                        "name": "issuanceRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRewardD18"
                    },
                    {
                        "type": "bytes32",
                        "name": "oracleNodeId"
                    },
                    {
                        "type": "address",
                        "name": "tokenAddress"
                    },
                    {
                        "type": "uint256",
                        "name": "minDelegationD18"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollateralConfigurations",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "hideDisabled"
            }
        ],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "bool",
                        "name": "depositingEnabled"
                    },
                    {
                        "type": "uint256",
                        "name": "issuanceRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRatioD18"
                    },
                    {
                        "type": "uint256",
                        "name": "liquidationRewardD18"
                    },
                    {
                        "type": "bytes32",
                        "name": "oracleNodeId"
                    },
                    {
                        "type": "address",
                        "name": "tokenAddress"
                    },
                    {
                        "type": "uint256",
                        "name": "minDelegationD18"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollateralPrice",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientCcipFee",
        "inputs": [
            {
                "type": "uint256",
                "name": "requiredAmount"
            },
            {
                "type": "uint256",
                "name": "availableAmount"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TransferCrossChainInitiated",
        "inputs": [
            {
                "type": "uint64",
                "name": "destChainId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "transferCrossChain",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "uint64",
                "name": "destChainId"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "gasTokenUsed"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientDebt",
        "inputs": [
            {
                "type": "int256",
                "name": "currentDebt"
            }
        ]
    },
    {
        "type": "error",
        "name": "PoolNotFound",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "IssuanceFeePaid",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "feeAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UsdBurned",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UsdMinted",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "burnUsd",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "mintUsd",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "CannotScaleEmptyMapping",
        "inputs": []
    },
    {
        "type": "error",
        "name": "IneligibleForLiquidation",
        "inputs": [
            {
                "type": "uint256",
                "name": "collateralValue"
            },
            {
                "type": "int256",
                "name": "debt"
            },
            {
                "type": "uint256",
                "name": "currentCRatio"
            },
            {
                "type": "uint256",
                "name": "cratio"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientMappedAmount",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MustBeVaultLiquidated",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowInt128ToUint128",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Liquidation",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "tuple",
                "name": "liquidationData",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "debtLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "collateralLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "amountRewarded"
                    }
                ]
            },
            {
                "type": "uint128",
                "name": "liquidateAsAccountId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "VaultLiquidation",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "tuple",
                "name": "liquidationData",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "debtLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "collateralLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "amountRewarded"
                    }
                ]
            },
            {
                "type": "uint128",
                "name": "liquidateAsAccountId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "isPositionLiquidatable",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "isVaultLiquidatable",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "liquidate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint128",
                "name": "liquidateAsAccountId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "liquidationData",
                "components": [
                    {
                        "type": "uint256",
                        "name": "debtLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "collateralLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "amountRewarded"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "liquidateVault",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint128",
                "name": "liquidateAsAccountId"
            },
            {
                "type": "uint256",
                "name": "maxUsd"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "liquidationData",
                "components": [
                    {
                        "type": "uint256",
                        "name": "debtLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "collateralLiquidated"
                    },
                    {
                        "type": "uint256",
                        "name": "amountRewarded"
                    }
                ]
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientMarketCollateralDepositable",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "tokenAmountToDeposit"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientMarketCollateralWithdrawable",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "tokenAmountToWithdraw"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketCollateralDeposited",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenAmount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "int128",
                "name": "creditCapacity",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "netIssuance",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "depositedCollateralValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "reportedDebt",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketCollateralWithdrawn",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "tokenAmount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "int128",
                "name": "creditCapacity",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "netIssuance",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "depositedCollateralValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "reportedDebt",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MaximumMarketCollateralConfigured",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "systemAmount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "configureMaximumMarketCollateral",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "depositMarketCollateral",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "tokenAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getMarketCollateralAmount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "collateralAmountD18"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketCollateralValue",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMaximumMarketCollateral",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "withdrawMarketCollateral",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "tokenAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "IncorrectMarketInterface",
        "inputs": [
            {
                "type": "address",
                "name": "market"
            }
        ]
    },
    {
        "type": "error",
        "name": "NotEnoughLiquidity",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketRegistered",
        "inputs": [
            {
                "type": "address",
                "name": "market",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketSystemFeePaid",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "feeAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketUsdDeposited",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "target",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "market",
                "indexed": true
            },
            {
                "type": "int128",
                "name": "creditCapacity",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "netIssuance",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "depositedCollateralValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketUsdWithdrawn",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "target",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "market",
                "indexed": true
            },
            {
                "type": "int128",
                "name": "creditCapacity",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "netIssuance",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "depositedCollateralValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetMarketMinLiquidityRatio",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "minLiquidityRatio",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetMinDelegateTime",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint32",
                "name": "minDelegateTime",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "depositMarketUsd",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "target"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "feeAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "distributeDebtToPools",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "maxIter"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketAddress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketCollateral",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketDebtPerShare",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketFees",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": ""
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "depositFeeAmount"
            },
            {
                "type": "uint256",
                "name": "withdrawFeeAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketMinDelegateTime",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketNetIssuance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "int128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketPoolDebtDistribution",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "sharesD18"
            },
            {
                "type": "uint128",
                "name": "totalSharesD18"
            },
            {
                "type": "int128",
                "name": "valuePerShareD27"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketPools",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint128[]",
                "name": "inRangePoolIds"
            },
            {
                "type": "uint128[]",
                "name": "outRangePoolIds"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketReportedDebt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketTotalDebt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMinLiquidityRatio",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getOracleManager",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getUsdToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getWithdrawableMarketUsd",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "isMarketCapacityLocked",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "registerMarket",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "market"
            }
        ],
        "outputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ]
    },
    {
        "type": "function",
        "name": "setMarketMinDelegateTime",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint32",
                "name": "minDelegateTime"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMinLiquidityRatio",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "minLiquidityRatio"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawMarketUsd",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "target"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "feeAmount"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolApprovedAdded",
        "inputs": [
            {
                "type": "uint256",
                "name": "poolId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolApprovedRemoved",
        "inputs": [
            {
                "type": "uint256",
                "name": "poolId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PreferredPoolSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "poolId",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "addApprovedPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getApprovedPools",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getPreferredPool",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "removeApprovedPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPreferredPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "CapacityLocked",
        "inputs": [
            {
                "type": "uint256",
                "name": "marketId"
            }
        ]
    },
    {
        "type": "error",
        "name": "MinDelegationTimeoutPending",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "uint32",
                "name": "timeRemaining"
            }
        ]
    },
    {
        "type": "error",
        "name": "PoolAlreadyExists",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolCollateralConfigurationUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": false
            },
            {
                "type": "tuple",
                "name": "config",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "collateralLimitD18"
                    },
                    {
                        "type": "uint256",
                        "name": "issuanceRatioD18"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolCollateralDisabledByDefaultSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "disabled",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolConfigurationSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "tuple[]",
                "name": "markets",
                "components": [
                    {
                        "type": "uint128",
                        "name": "marketId"
                    },
                    {
                        "type": "uint128",
                        "name": "weightD18"
                    },
                    {
                        "type": "int128",
                        "name": "maxDebtShareValueD18"
                    }
                ]
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolCreated",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolNameUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "string",
                "name": "name",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolNominationRenounced",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolNominationRevoked",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolOwnerNominated",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "nominatedOwner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolOwnershipAccepted",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolOwnershipRenounced",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetMinLiquidityRatio",
        "inputs": [
            {
                "type": "uint256",
                "name": "minLiquidityRatio",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "acceptPoolOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "createPool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "requestedPoolId"
            },
            {
                "type": "address",
                "name": "owner"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getMinLiquidityRatio",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getNominatedPoolOwner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolCollateralConfiguration",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "config",
                "components": [
                    {
                        "type": "uint256",
                        "name": "collateralLimitD18"
                    },
                    {
                        "type": "uint256",
                        "name": "issuanceRatioD18"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolCollateralIssuanceRatio",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateral"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolConfiguration",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "uint128",
                        "name": "marketId"
                    },
                    {
                        "type": "uint128",
                        "name": "weightD18"
                    },
                    {
                        "type": "int128",
                        "name": "maxDebtShareValueD18"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolName",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": "poolName"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolOwner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "nominatePoolOwner",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "nominatedOwner"
            },
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "rebalancePool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "optionalCollateralType"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "renouncePoolNomination",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "renouncePoolOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "revokePoolNomination",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMinLiquidityRatio",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "minLiquidityRatio"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPoolCollateralConfiguration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "tuple",
                "name": "newConfig",
                "components": [
                    {
                        "type": "uint256",
                        "name": "collateralLimitD18"
                    },
                    {
                        "type": "uint256",
                        "name": "issuanceRatioD18"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPoolCollateralDisabledByDefault",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "bool",
                "name": "disabled"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPoolConfiguration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "tuple[]",
                "name": "newMarketConfigurations",
                "components": [
                    {
                        "type": "uint128",
                        "name": "marketId"
                    },
                    {
                        "type": "uint128",
                        "name": "weightD18"
                    },
                    {
                        "type": "int128",
                        "name": "maxDebtShareValueD18"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPoolName",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "string",
                "name": "name"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint256ToUint32",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint32ToInt32",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint64ToInt64",
        "inputs": []
    },
    {
        "type": "error",
        "name": "RewardDistributorNotFound",
        "inputs": []
    },
    {
        "type": "error",
        "name": "RewardUnavailable",
        "inputs": [
            {
                "type": "address",
                "name": "distributor"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardsClaimed",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "address",
                "name": "distributor",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardsDistributed",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "address",
                "name": "distributor",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "start",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "duration",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardsDistributorRegistered",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "address",
                "name": "distributor",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardsDistributorRemoved",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": true
            },
            {
                "type": "address",
                "name": "distributor",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "claimRewards",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "address",
                "name": "distributor"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "distributeRewards",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint64",
                "name": "start"
            },
            {
                "type": "uint32",
                "name": "duration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getAvailableRewards",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "address",
                "name": "distributor"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getRewardRate",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "address",
                "name": "distributor"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "registerRewardsDistributor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "address",
                "name": "distributor"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "removeRewardsDistributor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "address",
                "name": "distributor"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateRewards",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint128",
                "name": "accountId"
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
                "name": ""
            },
            {
                "type": "address[]",
                "name": ""
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewSupportedCrossChainNetwork",
        "inputs": [
            {
                "type": "uint64",
                "name": "newChainId",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "configureChainlinkCrossChain",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "ccipRouter"
            },
            {
                "type": "address",
                "name": "ccipTokenPool"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "configureOracleManager",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "oracleManagerAddress"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getConfig",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "k"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": "v"
            }
        ]
    },
    {
        "type": "function",
        "name": "getConfigAddress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "k"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "v"
            }
        ]
    },
    {
        "type": "function",
        "name": "getConfigUint",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "k"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "v"
            }
        ]
    },
    {
        "type": "function",
        "name": "getTrustedForwarder",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "isTrustedForwarder",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "forwarder"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "setConfig",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "k"
            },
            {
                "type": "bytes32",
                "name": "v"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setSupportedCrossChainNetworks",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint64[]",
                "name": "supportedNetworks"
            },
            {
                "type": "uint64[]",
                "name": "ccipSelectors"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "numRegistered"
            }
        ]
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "interfaceId"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientDelegation",
        "inputs": [
            {
                "type": "uint256",
                "name": "minDelegation"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidCollateralAmount",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidLeverage",
        "inputs": [
            {
                "type": "uint256",
                "name": "leverage"
            }
        ]
    },
    {
        "type": "error",
        "name": "PoolCollateralLimitExceeded",
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "currentCollateral"
            },
            {
                "type": "uint256",
                "name": "maxCollateral"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DelegationUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "poolId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "collateralType",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "leverage",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "delegateCollateral",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            },
            {
                "type": "uint256",
                "name": "newCollateralAmountD18"
            },
            {
                "type": "uint256",
                "name": "leverage"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getPosition",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "collateralAmount"
            },
            {
                "type": "uint256",
                "name": "collateralValue"
            },
            {
                "type": "int256",
                "name": "debt"
            },
            {
                "type": "uint256",
                "name": "collateralizationRatio"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPositionCollateral",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPositionCollateralRatio",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getPositionDebt",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": "debt"
            }
        ]
    },
    {
        "type": "function",
        "name": "getVaultCollateral",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint256",
                "name": "value"
            }
        ]
    },
    {
        "type": "function",
        "name": "getVaultCollateralRatio",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getVaultDebt",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "poolId"
            },
            {
                "type": "address",
                "name": "collateralType"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    }
]
