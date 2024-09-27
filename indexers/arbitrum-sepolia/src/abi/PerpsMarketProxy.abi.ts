export const ABI_JSON = [
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
        "type": "error",
        "name": "ZeroAddress",
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
        "name": "UpgradeSimulationFailed",
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
        "name": "InvalidMarket",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
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
        "name": "OverflowInt256ToUint256",
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
        "type": "error",
        "name": "PerpsMarketAlreadyInitialized",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PerpsMarketNotInitialized",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FactoryInitialized",
        "inputs": [
            {
                "type": "uint128",
                "name": "globalPerpsMarketId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketCreated",
        "inputs": [
            {
                "type": "uint128",
                "name": "perpsMarketId",
                "indexed": true
            },
            {
                "type": "string",
                "name": "marketName",
                "indexed": false
            },
            {
                "type": "string",
                "name": "marketSymbol",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "createMarket",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "requestedMarketId"
            },
            {
                "type": "string",
                "name": "marketName"
            },
            {
                "type": "string",
                "name": "marketSymbol"
            }
        ],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "initializeFactory",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "synthetix"
            },
            {
                "type": "address",
                "name": "spotMarket"
            }
        ],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "interestRate",
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
        "name": "minimumCredit",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "perpsMarketId"
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
        "name": "name",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "perpsMarketId"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "reportedDebt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "perpsMarketId"
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
        "name": "setPerpsMarketName",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "marketName"
            }
        ],
        "outputs": []
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
        "type": "function",
        "name": "utilizationRate",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "rate"
            },
            {
                "type": "uint256",
                "name": "delegatedCollateral"
            },
            {
                "type": "uint256",
                "name": "lockedCredit"
            }
        ]
    },
    {
        "type": "error",
        "name": "AccountLiquidatable",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
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
        "name": "InsufficientCollateral",
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            },
            {
                "type": "uint256",
                "name": "collateralAmount"
            },
            {
                "type": "uint256",
                "name": "withdrawAmount"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientCollateralAvailableForWithdraw",
        "inputs": [
            {
                "type": "int256",
                "name": "withdrawableMarginUsd"
            },
            {
                "type": "uint256",
                "name": "requestedMarginUsd"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientSynthCollateral",
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            },
            {
                "type": "uint256",
                "name": "collateralAmount"
            },
            {
                "type": "uint256",
                "name": "withdrawAmount"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidAmountDelta",
        "inputs": [
            {
                "type": "int256",
                "name": "amountDelta"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidId",
        "inputs": [
            {
                "type": "uint128",
                "name": "id"
            }
        ]
    },
    {
        "type": "error",
        "name": "KeeperCostsNotSet",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MaxCollateralExceeded",
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            },
            {
                "type": "uint256",
                "name": "maxAmount"
            },
            {
                "type": "uint256",
                "name": "collateralAmount"
            },
            {
                "type": "uint256",
                "name": "depositAmount"
            }
        ]
    },
    {
        "type": "error",
        "name": "MaxCollateralsPerAccountReached",
        "inputs": [
            {
                "type": "uint128",
                "name": "maxCollateralsPerAccount"
            }
        ]
    },
    {
        "type": "error",
        "name": "NonexistentDebt",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
    },
    {
        "type": "error",
        "name": "OverflowUint128ToInt128",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PendingOrderExists",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PriceFeedNotSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ]
    },
    {
        "type": "error",
        "name": "SynthNotEnabledForCollateral",
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollateralModified",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "collateralId",
                "indexed": true
            },
            {
                "type": "int256",
                "name": "amountDelta",
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
        "name": "DebtPaid",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
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
        "name": "InterestRateUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "superMarketId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "interestRate",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "debt",
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
                "name": "accountDebt"
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccountCollateralIds",
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
                "type": "uint256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccountOpenPositions",
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
                "type": "uint256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getAvailableMargin",
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
                "type": "int256",
                "name": "availableMargin"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollateralAmount",
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
                "name": "collateralId"
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
        "name": "getOpenPosition",
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
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": "totalPnl"
            },
            {
                "type": "int256",
                "name": "accruedFunding"
            },
            {
                "type": "int128",
                "name": "positionSize"
            },
            {
                "type": "uint256",
                "name": "owedInterest"
            }
        ]
    },
    {
        "type": "function",
        "name": "getOpenPositionSize",
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
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "int128",
                "name": "positionSize"
            }
        ]
    },
    {
        "type": "function",
        "name": "getRequiredMargins",
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
                "name": "requiredInitialMargin"
            },
            {
                "type": "uint256",
                "name": "requiredMaintenanceMargin"
            },
            {
                "type": "uint256",
                "name": "maxLiquidationReward"
            }
        ]
    },
    {
        "type": "function",
        "name": "getWithdrawableMargin",
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
                "type": "int256",
                "name": "withdrawableMargin"
            }
        ]
    },
    {
        "type": "function",
        "name": "modifyCollateral",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            },
            {
                "type": "uint128",
                "name": "collateralId"
            },
            {
                "type": "int256",
                "name": "amountDelta"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "payDebt",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
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
        "name": "totalAccountOpenInterest",
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
        "name": "totalCollateralValue",
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
        "name": "currentFundingRate",
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
        "name": "currentFundingVelocity",
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
        "name": "fillPrice",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "int128",
                "name": "orderSize"
            },
            {
                "type": "uint256",
                "name": "price"
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
        "name": "getMarketSummary",
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
                "type": "tuple",
                "name": "summary",
                "components": [
                    {
                        "type": "int256",
                        "name": "skew"
                    },
                    {
                        "type": "uint256",
                        "name": "size"
                    },
                    {
                        "type": "uint256",
                        "name": "maxOpenInterest"
                    },
                    {
                        "type": "int256",
                        "name": "currentFundingRate"
                    },
                    {
                        "type": "int256",
                        "name": "currentFundingVelocity"
                    },
                    {
                        "type": "uint256",
                        "name": "indexPrice"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "indexPrice",
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
        "name": "maxOpenInterest",
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
        "name": "metadata",
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
                "type": "string",
                "name": "name"
            },
            {
                "type": "string",
                "name": "symbol"
            }
        ]
    },
    {
        "type": "function",
        "name": "size",
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
        "name": "skew",
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
        "type": "error",
        "name": "ExceedsMarketCreditCapacity",
        "inputs": [
            {
                "type": "int256",
                "name": "delegatedCollateral"
            },
            {
                "type": "int256",
                "name": "newLockedCredit"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientMargin",
        "inputs": [
            {
                "type": "int256",
                "name": "availableMargin"
            },
            {
                "type": "uint256",
                "name": "minMargin"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidSettlementStrategy",
        "inputs": [
            {
                "type": "uint256",
                "name": "settlementStrategyId"
            }
        ]
    },
    {
        "type": "error",
        "name": "MaxOpenInterestReached",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "maxMarketSize"
            },
            {
                "type": "int256",
                "name": "newSideSize"
            }
        ]
    },
    {
        "type": "error",
        "name": "MaxPositionsPerAccountReached",
        "inputs": [
            {
                "type": "uint128",
                "name": "maxPositionsPerAccount"
            }
        ]
    },
    {
        "type": "error",
        "name": "MaxUSDOpenInterestReached",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "maxMarketValue"
            },
            {
                "type": "int256",
                "name": "newSideSize"
            },
            {
                "type": "uint256",
                "name": "price"
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
        "name": "ZeroSizeOrder",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OrderCommitted",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint8",
                "name": "orderType",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "sizeDelta",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "acceptablePrice",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "commitmentTime",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "expectedPriceTime",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "settlementTime",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "expirationTime",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "trackingCode",
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
        "name": "PreviousOrderExpired",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "int128",
                "name": "sizeDelta",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "acceptablePrice",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "commitmentTime",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "trackingCode",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "commitOrder",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "commitment",
                "components": [
                    {
                        "type": "uint128",
                        "name": "marketId"
                    },
                    {
                        "type": "uint128",
                        "name": "accountId"
                    },
                    {
                        "type": "int128",
                        "name": "sizeDelta"
                    },
                    {
                        "type": "uint128",
                        "name": "settlementStrategyId"
                    },
                    {
                        "type": "uint256",
                        "name": "acceptablePrice"
                    },
                    {
                        "type": "bytes32",
                        "name": "trackingCode"
                    },
                    {
                        "type": "address",
                        "name": "referrer"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "retOrder",
                "components": [
                    {
                        "type": "uint256",
                        "name": "commitmentTime"
                    },
                    {
                        "type": "tuple",
                        "name": "request",
                        "components": [
                            {
                                "type": "uint128",
                                "name": "marketId"
                            },
                            {
                                "type": "uint128",
                                "name": "accountId"
                            },
                            {
                                "type": "int128",
                                "name": "sizeDelta"
                            },
                            {
                                "type": "uint128",
                                "name": "settlementStrategyId"
                            },
                            {
                                "type": "uint256",
                                "name": "acceptablePrice"
                            },
                            {
                                "type": "bytes32",
                                "name": "trackingCode"
                            },
                            {
                                "type": "address",
                                "name": "referrer"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "fees"
            }
        ]
    },
    {
        "type": "function",
        "name": "computeOrderFees",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "int128",
                "name": "sizeDelta"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "orderFees"
            },
            {
                "type": "uint256",
                "name": "fillPrice"
            }
        ]
    },
    {
        "type": "function",
        "name": "computeOrderFeesWithPrice",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "int128",
                "name": "sizeDelta"
            },
            {
                "type": "uint256",
                "name": "price"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "orderFees"
            },
            {
                "type": "uint256",
                "name": "fillPrice"
            }
        ]
    },
    {
        "type": "function",
        "name": "getOrder",
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
                "type": "tuple",
                "name": "order",
                "components": [
                    {
                        "type": "uint256",
                        "name": "commitmentTime"
                    },
                    {
                        "type": "tuple",
                        "name": "request",
                        "components": [
                            {
                                "type": "uint128",
                                "name": "marketId"
                            },
                            {
                                "type": "uint128",
                                "name": "accountId"
                            },
                            {
                                "type": "int128",
                                "name": "sizeDelta"
                            },
                            {
                                "type": "uint128",
                                "name": "settlementStrategyId"
                            },
                            {
                                "type": "uint256",
                                "name": "acceptablePrice"
                            },
                            {
                                "type": "bytes32",
                                "name": "trackingCode"
                            },
                            {
                                "type": "address",
                                "name": "referrer"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getSettlementRewardCost",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint128",
                "name": "settlementStrategyId"
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
        "name": "requiredMarginForOrder",
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
                "name": "marketId"
            },
            {
                "type": "int128",
                "name": "sizeDelta"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "requiredMargin"
            }
        ]
    },
    {
        "type": "function",
        "name": "requiredMarginForOrderWithPrice",
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
                "name": "marketId"
            },
            {
                "type": "int128",
                "name": "sizeDelta"
            },
            {
                "type": "uint256",
                "name": "price"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "requiredMargin"
            }
        ]
    },
    {
        "type": "error",
        "name": "AcceptablePriceExceeded",
        "inputs": [
            {
                "type": "uint256",
                "name": "fillPrice"
            },
            {
                "type": "uint256",
                "name": "acceptablePrice"
            }
        ]
    },
    {
        "type": "error",
        "name": "OrderNotValid",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowInt128ToUint128",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint256ToUint64",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SettlementStrategyNotFound",
        "inputs": [
            {
                "type": "uint8",
                "name": "strategyType"
            }
        ]
    },
    {
        "type": "error",
        "name": "SettlementWindowExpired",
        "inputs": [
            {
                "type": "uint256",
                "name": "timestamp"
            },
            {
                "type": "uint256",
                "name": "settlementTime"
            },
            {
                "type": "uint256",
                "name": "settlementExpiration"
            }
        ]
    },
    {
        "type": "error",
        "name": "SettlementWindowNotOpen",
        "inputs": [
            {
                "type": "uint256",
                "name": "timestamp"
            },
            {
                "type": "uint256",
                "name": "settlementTime"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AccountCharged",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "accountDebt",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "InterestCharged",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "interest",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "skew",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "size",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "sizeDelta",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "currentFundingRate",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "currentFundingVelocity",
                "indexed": false
            },
            {
                "type": "uint128",
                "name": "interestRate",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OrderSettled",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "fillPrice",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "pnl",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "accruedFunding",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "sizeDelta",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "newSize",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "totalFees",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "referralFees",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "collectedFees",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "settlementReward",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "trackingCode",
                "indexed": true
            },
            {
                "type": "address",
                "name": "settler",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "settleOrder",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "AcceptablePriceNotExceeded",
        "inputs": [
            {
                "type": "uint256",
                "name": "fillPrice"
            },
            {
                "type": "uint256",
                "name": "acceptablePrice"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OrderCancelled",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "desiredPrice",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "fillPrice",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "sizeDelta",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "settlementReward",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "trackingCode",
                "indexed": true
            },
            {
                "type": "address",
                "name": "settler",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "cancelOrder",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ],
        "outputs": []
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
        "name": "AccountHasOpenPositions",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidDistributor",
        "inputs": [
            {
                "type": "uint128",
                "name": "id"
            },
            {
                "type": "address",
                "name": "distributor"
            }
        ]
    },
    {
        "type": "error",
        "name": "NotEligibleForLiquidation",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
    },
    {
        "type": "error",
        "name": "NotEligibleForMarginLiquidation",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AccountFlaggedForLiquidation",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "int256",
                "name": "availableMargin",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "requiredMaintenanceMargin",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "liquidationReward",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "flagReward",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AccountLiquidationAttempt",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "reward",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "fullLiquidation",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AccountMarginLiquidation",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "seizedMarginValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "liquidationReward",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PositionLiquidated",
        "inputs": [
            {
                "type": "uint128",
                "name": "accountId",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amountLiquidated",
                "indexed": false
            },
            {
                "type": "int128",
                "name": "currentPositionSize",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "canLiquidate",
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
                "type": "bool",
                "name": "isEligible"
            }
        ]
    },
    {
        "type": "function",
        "name": "canLiquidateMarginOnly",
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
                "type": "bool",
                "name": "isEligible"
            }
        ]
    },
    {
        "type": "function",
        "name": "flaggedAccounts",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[]",
                "name": "accountIds"
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
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "liquidationReward"
            }
        ]
    },
    {
        "type": "function",
        "name": "liquidateFlagged",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "maxNumberOfAccounts"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "liquidationReward"
            }
        ]
    },
    {
        "type": "function",
        "name": "liquidateFlaggedAccounts",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128[]",
                "name": "accountIds"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "liquidationReward"
            }
        ]
    },
    {
        "type": "function",
        "name": "liquidateMarginOnly",
        "constant": false,
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
                "name": "liquidationReward"
            }
        ]
    },
    {
        "type": "function",
        "name": "liquidationCapacity",
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
                "name": "capacity"
            },
            {
                "type": "uint256",
                "name": "maxLiquidationInWindow"
            },
            {
                "type": "uint256",
                "name": "latestLiquidationTimestamp"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidSettlementWindowDuration",
        "inputs": [
            {
                "type": "uint256",
                "name": "duration"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FundingParametersSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "skewScale",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "maxFundingVelocity",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "LiquidationParametersSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "initialMarginRatioD18",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "maintenanceMarginRatioD18",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "minimumInitialMarginRatioD18",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "flagRewardRatioD18",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "minimumPositionMargin",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "LockedOiRatioSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "lockedOiRatioD18",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketPriceDataUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "feedId",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "strictStalenessTolerance",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MaxLiquidationParametersSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "maxLiquidationLimitAccumulationMultiplier",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "maxSecondsInLiquidationWindow",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "maxLiquidationPd",
                "indexed": false
            },
            {
                "type": "address",
                "name": "endorsedLiquidator",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MaxMarketSizeSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "maxMarketSize",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MaxMarketValueSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "maxMarketValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OrderFeesSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "makerFeeRatio",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "takerFeeRatio",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SettlementStrategyAdded",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "tuple",
                "name": "strategy",
                "indexed": false,
                "components": [
                    {
                        "type": "uint8",
                        "name": "strategyType"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementDelay"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementWindowDuration"
                    },
                    {
                        "type": "address",
                        "name": "priceVerificationContract"
                    },
                    {
                        "type": "bytes32",
                        "name": "feedId"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentPriceDelay"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "strategyId",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SettlementStrategySet",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "strategyId",
                "indexed": true
            },
            {
                "type": "tuple",
                "name": "strategy",
                "indexed": false,
                "components": [
                    {
                        "type": "uint8",
                        "name": "strategyType"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementDelay"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementWindowDuration"
                    },
                    {
                        "type": "address",
                        "name": "priceVerificationContract"
                    },
                    {
                        "type": "bytes32",
                        "name": "feedId"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentPriceDelay"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "addSettlementStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "tuple",
                "name": "strategy",
                "components": [
                    {
                        "type": "uint8",
                        "name": "strategyType"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementDelay"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementWindowDuration"
                    },
                    {
                        "type": "address",
                        "name": "priceVerificationContract"
                    },
                    {
                        "type": "bytes32",
                        "name": "feedId"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentPriceDelay"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "strategyId"
            }
        ]
    },
    {
        "type": "function",
        "name": "getFundingParameters",
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
                "name": "skewScale"
            },
            {
                "type": "uint256",
                "name": "maxFundingVelocity"
            }
        ]
    },
    {
        "type": "function",
        "name": "getLiquidationParameters",
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
                "name": "initialMarginRatioD18"
            },
            {
                "type": "uint256",
                "name": "minimumInitialMarginRatioD18"
            },
            {
                "type": "uint256",
                "name": "maintenanceMarginScalarD18"
            },
            {
                "type": "uint256",
                "name": "flagRewardRatioD18"
            },
            {
                "type": "uint256",
                "name": "minimumPositionMargin"
            }
        ]
    },
    {
        "type": "function",
        "name": "getLockedOiRatio",
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
        "name": "getMaxLiquidationParameters",
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
                "name": "maxLiquidationLimitAccumulationMultiplier"
            },
            {
                "type": "uint256",
                "name": "maxSecondsInLiquidationWindow"
            },
            {
                "type": "uint256",
                "name": "maxLiquidationPd"
            },
            {
                "type": "address",
                "name": "endorsedLiquidator"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMaxMarketSize",
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
                "name": "maxMarketSize"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMaxMarketValue",
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
                "name": "maxMarketValue"
            }
        ]
    },
    {
        "type": "function",
        "name": "getOrderFees",
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
                "name": "makerFee"
            },
            {
                "type": "uint256",
                "name": "takerFee"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPriceData",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "perpsMarketId"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": "feedId"
            },
            {
                "type": "uint256",
                "name": "strictStalenessTolerance"
            }
        ]
    },
    {
        "type": "function",
        "name": "getSettlementStrategy",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "strategyId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "settlementStrategy",
                "components": [
                    {
                        "type": "uint8",
                        "name": "strategyType"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementDelay"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementWindowDuration"
                    },
                    {
                        "type": "address",
                        "name": "priceVerificationContract"
                    },
                    {
                        "type": "bytes32",
                        "name": "feedId"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentPriceDelay"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "setFundingParameters",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "skewScale"
            },
            {
                "type": "uint256",
                "name": "maxFundingVelocity"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setLiquidationParameters",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "initialMarginRatioD18"
            },
            {
                "type": "uint256",
                "name": "minimumInitialMarginRatioD18"
            },
            {
                "type": "uint256",
                "name": "maintenanceMarginScalarD18"
            },
            {
                "type": "uint256",
                "name": "flagRewardRatioD18"
            },
            {
                "type": "uint256",
                "name": "minimumPositionMargin"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setLockedOiRatio",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "lockedOiRatioD18"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxLiquidationParameters",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "maxLiquidationLimitAccumulationMultiplier"
            },
            {
                "type": "uint256",
                "name": "maxSecondsInLiquidationWindow"
            },
            {
                "type": "uint256",
                "name": "maxLiquidationPd"
            },
            {
                "type": "address",
                "name": "endorsedLiquidator"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxMarketSize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "maxMarketSize"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxMarketValue",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "maxMarketValue"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setOrderFees",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "makerFeeRatio"
            },
            {
                "type": "uint256",
                "name": "takerFeeRatio"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setSettlementStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "strategyId"
            },
            {
                "type": "tuple",
                "name": "strategy",
                "components": [
                    {
                        "type": "uint8",
                        "name": "strategyType"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementDelay"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementWindowDuration"
                    },
                    {
                        "type": "address",
                        "name": "priceVerificationContract"
                    },
                    {
                        "type": "bytes32",
                        "name": "feedId"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentPriceDelay"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setSettlementStrategyEnabled",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "strategyId"
            },
            {
                "type": "bool",
                "name": "enabled"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updatePriceData",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "perpsMarketId"
            },
            {
                "type": "bytes32",
                "name": "feedId"
            },
            {
                "type": "uint256",
                "name": "strictStalenessTolerance"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "InvalidDistributorContract",
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
        "name": "CollateralConfigurationSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "maxCollateralAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "upperLimitDiscount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "lowerLimitDiscount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "discountScalar",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollateralLiquidateRewardRatioSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralLiquidateRewardRatioD18",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardDistributorRegistered",
        "inputs": [
            {
                "type": "address",
                "name": "distributor",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollateralConfiguration",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "maxCollateralAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollateralConfigurationFull",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "maxCollateralAmount"
            },
            {
                "type": "uint256",
                "name": "upperLimitDiscount"
            },
            {
                "type": "uint256",
                "name": "lowerLimitDiscount"
            },
            {
                "type": "uint256",
                "name": "discountScalar"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollateralLiquidateRewardRatio",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": "collateralLiquidateRewardRatioD18"
            }
        ]
    },
    {
        "type": "function",
        "name": "getRegisteredDistributor",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "distributor"
            },
            {
                "type": "address[]",
                "name": "poolDelegatedCollateralTypes"
            }
        ]
    },
    {
        "type": "function",
        "name": "isRegistered",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "distributor"
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
        "name": "registerDistributor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            },
            {
                "type": "address",
                "name": "distributor"
            },
            {
                "type": "uint128",
                "name": "collateralId"
            },
            {
                "type": "address[]",
                "name": "poolDelegatedCollateralTypes"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setCollateralConfiguration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            },
            {
                "type": "uint256",
                "name": "maxCollateralAmount"
            },
            {
                "type": "uint256",
                "name": "upperLimitDiscount"
            },
            {
                "type": "uint256",
                "name": "lowerLimitDiscount"
            },
            {
                "type": "uint256",
                "name": "discountScalar"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setCollateralLiquidateRewardRatio",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralLiquidateRewardRatioD18"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "InvalidFeeCollectorInterface",
        "inputs": [
            {
                "type": "address",
                "name": "invalidFeeCollector"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidInterestRateParameters",
        "inputs": [
            {
                "type": "uint128",
                "name": "lowUtilizationInterestRateGradient"
            },
            {
                "type": "uint128",
                "name": "highUtilizationInterestRateGradient"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidReferrerShareRatio",
        "inputs": [
            {
                "type": "uint256",
                "name": "shareRatioD18"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeeCollectorSet",
        "inputs": [
            {
                "type": "address",
                "name": "feeCollector",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "InterestRateParametersSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "lowUtilizationInterestRateGradient",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "interestRateGradientBreakpoint",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "highUtilizationInterestRateGradient",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "KeeperCostNodeIdUpdated",
        "inputs": [
            {
                "type": "bytes32",
                "name": "keeperCostNodeId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "KeeperRewardGuardsSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "minKeeperRewardUsd",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "minKeeperProfitRatioD18",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "maxKeeperRewardUsd",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "maxKeeperScalingRatioD18",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PerAccountCapsSet",
        "inputs": [
            {
                "type": "uint128",
                "name": "maxPositionsPerAccount",
                "indexed": false
            },
            {
                "type": "uint128",
                "name": "maxCollateralsPerAccount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ReferrerShareUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "referrer",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "shareRatioD18",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeeCollector",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": "feeCollector"
            }
        ]
    },
    {
        "type": "function",
        "name": "getInterestRateParameters",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": "lowUtilizationInterestRateGradient"
            },
            {
                "type": "uint128",
                "name": "interestRateGradientBreakpoint"
            },
            {
                "type": "uint128",
                "name": "highUtilizationInterestRateGradient"
            }
        ]
    },
    {
        "type": "function",
        "name": "getKeeperCostNodeId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": "keeperCostNodeId"
            }
        ]
    },
    {
        "type": "function",
        "name": "getKeeperRewardGuards",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "minKeeperRewardUsd"
            },
            {
                "type": "uint256",
                "name": "minKeeperProfitRatioD18"
            },
            {
                "type": "uint256",
                "name": "maxKeeperRewardUsd"
            },
            {
                "type": "uint256",
                "name": "maxKeeperScalingRatioD18"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarkets",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[]",
                "name": "marketIds"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPerAccountCaps",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": "maxPositionsPerAccount"
            },
            {
                "type": "uint128",
                "name": "maxCollateralsPerAccount"
            }
        ]
    },
    {
        "type": "function",
        "name": "getReferrerShare",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "shareRatioD18"
            }
        ]
    },
    {
        "type": "function",
        "name": "getSupportedCollaterals",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[]",
                "name": "supportedCollaterals"
            }
        ]
    },
    {
        "type": "function",
        "name": "globalCollateralValue",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "collateralId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "collateralValue"
            }
        ]
    },
    {
        "type": "function",
        "name": "setFeeCollector",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "feeCollector"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setInterestRateParameters",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "lowUtilizationInterestRateGradient"
            },
            {
                "type": "uint128",
                "name": "interestRateGradientBreakpoint"
            },
            {
                "type": "uint128",
                "name": "highUtilizationInterestRateGradient"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setKeeperRewardGuards",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "minKeeperRewardUsd"
            },
            {
                "type": "uint256",
                "name": "minKeeperProfitRatioD18"
            },
            {
                "type": "uint256",
                "name": "maxKeeperRewardUsd"
            },
            {
                "type": "uint256",
                "name": "maxKeeperScalingRatioD18"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPerAccountCaps",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "maxPositionsPerAccount"
            },
            {
                "type": "uint128",
                "name": "maxCollateralsPerAccount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "totalGlobalCollateralValue",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "totalCollateralValue"
            }
        ]
    },
    {
        "type": "function",
        "name": "updateInterestRate",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateKeeperCostNodeId",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "keeperCostNodeId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateReferrerShare",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "referrer"
            },
            {
                "type": "uint256",
                "name": "shareRatioD18"
            }
        ],
        "outputs": []
    }
]
