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
        "name": "InvalidMarketOwner",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidSynthImplementation",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthImplementation"
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
        "type": "error",
        "name": "OnlyMarketOwner",
        "inputs": [
            {
                "type": "address",
                "name": "marketOwner"
            },
            {
                "type": "address",
                "name": "sender"
            }
        ]
    },
    {
        "type": "error",
        "name": "OverflowInt256ToUint256",
        "inputs": []
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
        "type": "event",
        "anonymous": false,
        "name": "DecayRateUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "rate",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketNominationRenounced",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "nominee",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketOwnerChanged",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
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
        "name": "MarketOwnerNominated",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
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
        "name": "SynthImplementationSet",
        "inputs": [
            {
                "type": "address",
                "name": "synthImplementation",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SynthImplementationUpgraded",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "proxy",
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
        "type": "event",
        "anonymous": false,
        "name": "SynthPriceDataUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "buyFeedId",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "sellFeedId",
                "indexed": true
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
        "name": "SynthRegistered",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "synthTokenAddress",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SynthetixSystemSet",
        "inputs": [
            {
                "type": "address",
                "name": "synthetix",
                "indexed": false
            },
            {
                "type": "address",
                "name": "usdTokenAddress",
                "indexed": false
            },
            {
                "type": "address",
                "name": "oracleManager",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "acceptMarketOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "createSynth",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "tokenName"
            },
            {
                "type": "string",
                "name": "tokenSymbol"
            },
            {
                "type": "address",
                "name": "synthOwner"
            }
        ],
        "outputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
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
        "name": "getMarketOwner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "marketOwner"
            }
        ]
    },
    {
        "type": "function",
        "name": "getNominatedMarketOwner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "marketOwner"
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
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": "buyFeedId"
            },
            {
                "type": "bytes32",
                "name": "sellFeedId"
            },
            {
                "type": "uint256",
                "name": "strictPriceStalenessTolerance"
            }
        ]
    },
    {
        "type": "function",
        "name": "getSynth",
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
                "name": "synthAddress"
            }
        ]
    },
    {
        "type": "function",
        "name": "getSynthImpl",
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
                "name": "implAddress"
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
        "name": "minimumCredit",
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
                "name": "lockedAmount"
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
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": "marketName"
            }
        ]
    },
    {
        "type": "function",
        "name": "nominateMarketOwner",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "address",
                "name": "newNominatedOwner"
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
        "type": "function",
        "name": "renounceMarketNomination",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "renounceMarketOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": []
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
                "name": "marketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "reportedDebtAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "setDecayRate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "rate"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setSynthImplementation",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "synthImplementation"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setSynthetix",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "synthetix"
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
                "name": "isSupported"
            }
        ]
    },
    {
        "type": "function",
        "name": "updatePriceData",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "bytes32",
                "name": "buyFeedId"
            },
            {
                "type": "bytes32",
                "name": "sellFeedId"
            },
            {
                "type": "uint256",
                "name": "strictPriceStalenessTolerance"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "upgradeSynthImpl",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            }
        ],
        "outputs": []
    },
    {
        "type": "error",
        "name": "ExceedsMaxSynthAmount",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxSynthAmount"
            },
            {
                "type": "uint256",
                "name": "synthAmountCharged"
            }
        ]
    },
    {
        "type": "error",
        "name": "ExceedsMaxUsdAmount",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxUsdAmount"
            },
            {
                "type": "uint256",
                "name": "usdAmountCharged"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientAmountReceived",
        "inputs": [
            {
                "type": "uint256",
                "name": "expected"
            },
            {
                "type": "uint256",
                "name": "current"
            }
        ]
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
        "name": "InvalidPrices",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OverflowUint256ToInt256",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SynthBought",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "synthReturned",
                "indexed": false
            },
            {
                "type": "tuple",
                "name": "fees",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "collectedFees",
                "indexed": false
            },
            {
                "type": "address",
                "name": "referrer",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SynthSold",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amountReturned",
                "indexed": false
            },
            {
                "type": "tuple",
                "name": "fees",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "collectedFees",
                "indexed": false
            },
            {
                "type": "address",
                "name": "referrer",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "buy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "usdAmount"
            },
            {
                "type": "uint256",
                "name": "minAmountReceived"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "synthAmount"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "buyExactIn",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "usdAmount"
            },
            {
                "type": "uint256",
                "name": "minAmountReceived"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "synthAmount"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "buyExactOut",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "synthAmount"
            },
            {
                "type": "uint256",
                "name": "maxUsdAmount"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "usdAmountCharged"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketSkew",
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
                "name": "marketSkew"
            }
        ]
    },
    {
        "type": "function",
        "name": "quoteBuyExactIn",
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
                "name": "usdAmount"
            },
            {
                "type": "uint8",
                "name": "stalenessTolerance"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "synthAmount"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "quoteBuyExactOut",
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
                "name": "synthAmount"
            },
            {
                "type": "uint8",
                "name": "stalenessTolerance"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "usdAmountCharged"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "quoteSellExactIn",
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
                "name": "synthAmount"
            },
            {
                "type": "uint8",
                "name": "stalenessTolerance"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "returnAmount"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "quoteSellExactOut",
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
                "name": "usdAmount"
            },
            {
                "type": "uint8",
                "name": "stalenessTolerance"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "synthToBurn"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "sell",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "synthAmount"
            },
            {
                "type": "uint256",
                "name": "minUsdAmount"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "usdAmountReceived"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "sellExactIn",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "synthAmount"
            },
            {
                "type": "uint256",
                "name": "minAmountReceived"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "returnAmount"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "sellExactOut",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "usdAmount"
            },
            {
                "type": "uint256",
                "name": "maxSynthAmount"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "synthToBurn"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "error",
        "name": "IneligibleForCancellation",
        "inputs": [
            {
                "type": "uint256",
                "name": "timestamp"
            },
            {
                "type": "uint256",
                "name": "expirationTime"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientSharesAmount",
        "inputs": [
            {
                "type": "uint256",
                "name": "expected"
            },
            {
                "type": "uint256",
                "name": "actual"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidAsyncTransactionType",
        "inputs": [
            {
                "type": "uint8",
                "name": "transactionType"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidClaim",
        "inputs": [
            {
                "type": "uint256",
                "name": "asyncOrderId"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidCommitmentAmount",
        "inputs": [
            {
                "type": "uint256",
                "name": "minimumAmount"
            },
            {
                "type": "uint256",
                "name": "amount"
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
        "name": "OrderAlreadySettled",
        "inputs": [
            {
                "type": "uint256",
                "name": "asyncOrderId"
            },
            {
                "type": "uint256",
                "name": "settledAt"
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
                "name": "asyncOrderId",
                "indexed": true
            },
            {
                "type": "tuple",
                "name": "asyncOrderClaim",
                "indexed": false,
                "components": [
                    {
                        "type": "uint128",
                        "name": "id"
                    },
                    {
                        "type": "address",
                        "name": "owner"
                    },
                    {
                        "type": "uint8",
                        "name": "orderType"
                    },
                    {
                        "type": "uint256",
                        "name": "amountEscrowed"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementStrategyId"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentTime"
                    },
                    {
                        "type": "uint256",
                        "name": "minimumSettlementAmount"
                    },
                    {
                        "type": "uint256",
                        "name": "settledAt"
                    },
                    {
                        "type": "address",
                        "name": "referrer"
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
        "name": "OrderCommitted",
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "uint8",
                "name": "orderType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amountProvided",
                "indexed": false
            },
            {
                "type": "uint128",
                "name": "asyncOrderId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "address",
                "name": "referrer",
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
                "name": "marketId"
            },
            {
                "type": "uint128",
                "name": "asyncOrderId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "commitOrder",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint8",
                "name": "orderType"
            },
            {
                "type": "uint256",
                "name": "amountProvided"
            },
            {
                "type": "uint256",
                "name": "settlementStrategyId"
            },
            {
                "type": "uint256",
                "name": "minimumSettlementAmount"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "asyncOrderClaim",
                "components": [
                    {
                        "type": "uint128",
                        "name": "id"
                    },
                    {
                        "type": "address",
                        "name": "owner"
                    },
                    {
                        "type": "uint8",
                        "name": "orderType"
                    },
                    {
                        "type": "uint256",
                        "name": "amountEscrowed"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementStrategyId"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentTime"
                    },
                    {
                        "type": "uint256",
                        "name": "minimumSettlementAmount"
                    },
                    {
                        "type": "uint256",
                        "name": "settledAt"
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
        "type": "function",
        "name": "getAsyncOrderClaim",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint128",
                "name": "asyncOrderId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "asyncOrderClaim",
                "components": [
                    {
                        "type": "uint128",
                        "name": "id"
                    },
                    {
                        "type": "address",
                        "name": "owner"
                    },
                    {
                        "type": "uint8",
                        "name": "orderType"
                    },
                    {
                        "type": "uint256",
                        "name": "amountEscrowed"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementStrategyId"
                    },
                    {
                        "type": "uint256",
                        "name": "commitmentTime"
                    },
                    {
                        "type": "uint256",
                        "name": "minimumSettlementAmount"
                    },
                    {
                        "type": "uint256",
                        "name": "settledAt"
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
        "type": "error",
        "name": "InvalidSettlementStrategy",
        "inputs": [
            {
                "type": "uint8",
                "name": "strategyType"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidVerificationResponse",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MinimumSettlementAmountNotMet",
        "inputs": [
            {
                "type": "uint256",
                "name": "minimum"
            },
            {
                "type": "uint256",
                "name": "actual"
            }
        ]
    },
    {
        "type": "error",
        "name": "OutsideSettlementWindow",
        "inputs": [
            {
                "type": "uint256",
                "name": "timestamp"
            },
            {
                "type": "uint256",
                "name": "startTime"
            },
            {
                "type": "uint256",
                "name": "expirationTime"
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
        "name": "SettlementStrategyNotFound",
        "inputs": [
            {
                "type": "uint8",
                "name": "strategyType"
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
                "name": "asyncOrderId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "finalOrderAmount",
                "indexed": false
            },
            {
                "type": "tuple",
                "name": "fees",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "collectedFees",
                "indexed": false
            },
            {
                "type": "address",
                "name": "settler",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false
            },
            {
                "type": "uint8",
                "name": "orderType",
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
                "name": "marketId"
            },
            {
                "type": "uint128",
                "name": "asyncOrderId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "finalOrderAmount"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
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
        "name": "SettlementStrategyAdded",
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId",
                "indexed": true
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
                "name": "synthMarketId",
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
                        "type": "string",
                        "name": "url"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "uint256",
                        "name": "priceDeviationTolerance"
                    },
                    {
                        "type": "uint256",
                        "name": "minimumUsdExchangeAmount"
                    },
                    {
                        "type": "uint256",
                        "name": "maxRoundingLoss"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
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
                        "type": "string",
                        "name": "url"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "uint256",
                        "name": "priceDeviationTolerance"
                    },
                    {
                        "type": "uint256",
                        "name": "minimumUsdExchangeAmount"
                    },
                    {
                        "type": "uint256",
                        "name": "maxRoundingLoss"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
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
                        "type": "string",
                        "name": "url"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "uint256",
                        "name": "priceDeviationTolerance"
                    },
                    {
                        "type": "uint256",
                        "name": "minimumUsdExchangeAmount"
                    },
                    {
                        "type": "uint256",
                        "name": "maxRoundingLoss"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
                    }
                ]
            }
        ]
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
                        "type": "string",
                        "name": "url"
                    },
                    {
                        "type": "uint256",
                        "name": "settlementReward"
                    },
                    {
                        "type": "uint256",
                        "name": "priceDeviationTolerance"
                    },
                    {
                        "type": "uint256",
                        "name": "minimumUsdExchangeAmount"
                    },
                    {
                        "type": "uint256",
                        "name": "maxRoundingLoss"
                    },
                    {
                        "type": "bool",
                        "name": "disabled"
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
        "name": "InvalidCollateralType",
        "inputs": [
            {
                "type": "address",
                "name": "configuredCollateralType"
            }
        ]
    },
    {
        "type": "error",
        "name": "WrapperExceedsMaxAmount",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxWrappableAmount"
            },
            {
                "type": "uint256",
                "name": "currentSupply"
            },
            {
                "type": "uint256",
                "name": "amountToWrap"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SynthUnwrapped",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amountUnwrapped",
                "indexed": false
            },
            {
                "type": "tuple",
                "name": "fees",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "feesCollected",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SynthWrapped",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amountWrapped",
                "indexed": false
            },
            {
                "type": "tuple",
                "name": "fees",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            },
            {
                "type": "uint256",
                "name": "feesCollected",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WrapperSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "wrapCollateralType",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "maxWrappableAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "getWrapper",
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
                "name": "wrapCollateralType"
            },
            {
                "type": "uint256",
                "name": "maxWrappableAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "setWrapper",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "address",
                "name": "wrapCollateralType"
            },
            {
                "type": "uint256",
                "name": "maxWrappableAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unwrap",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "unwrapAmount"
            },
            {
                "type": "uint256",
                "name": "minAmountReceived"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "returnCollateralAmount"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "wrap",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "marketId"
            },
            {
                "type": "uint256",
                "name": "wrapAmount"
            },
            {
                "type": "uint256",
                "name": "minAmountReceived"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "amountToMint"
            },
            {
                "type": "tuple",
                "name": "fees",
                "components": [
                    {
                        "type": "uint256",
                        "name": "fixedFees"
                    },
                    {
                        "type": "uint256",
                        "name": "utilizationFees"
                    },
                    {
                        "type": "int256",
                        "name": "skewFees"
                    },
                    {
                        "type": "int256",
                        "name": "wrapperFees"
                    }
                ]
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidCollateralLeverage",
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
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
        "name": "InvalidWrapperFees",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AsyncFixedFeeSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "asyncFixedFee",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AtomicFixedFeeSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "atomicFixedFee",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollateralLeverageSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "collateralLeverage",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeeCollectorSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
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
        "name": "MarketSkewScaleSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "skewScale",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MarketUtilizationFeesSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "utilizationFeeRate",
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
                "type": "uint128",
                "name": "marketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "referrer",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "sharePercentage",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TransactorFixedFeeSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "transactor",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "fixedFeeAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WrapperFeesSet",
        "inputs": [
            {
                "type": "uint256",
                "name": "synthMarketId",
                "indexed": true
            },
            {
                "type": "int256",
                "name": "wrapFee",
                "indexed": false
            },
            {
                "type": "int256",
                "name": "unwrapFee",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollateralLeverage",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "collateralLeverage"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCustomTransactorFees",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "address",
                "name": "transactor"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "fixedFeeAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeeCollector",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "feeCollector"
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
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "atomicFixedFee"
            },
            {
                "type": "uint256",
                "name": "asyncFixedFee"
            },
            {
                "type": "int256",
                "name": "wrapFee"
            },
            {
                "type": "int256",
                "name": "unwrapFee"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketSkewScale",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "skewScale"
            }
        ]
    },
    {
        "type": "function",
        "name": "getMarketUtilizationFees",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "utilizationFeeRate"
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
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "address",
                "name": "referrer"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "sharePercentage"
            }
        ]
    },
    {
        "type": "function",
        "name": "setAsyncFixedFee",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "uint256",
                "name": "asyncFixedFee"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setAtomicFixedFee",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "uint256",
                "name": "atomicFixedFee"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setCollateralLeverage",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "uint256",
                "name": "collateralLeverage"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setCustomTransactorFees",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "address",
                "name": "transactor"
            },
            {
                "type": "uint256",
                "name": "fixedFeeAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setFeeCollector",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "address",
                "name": "feeCollector"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMarketSkewScale",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "uint256",
                "name": "skewScale"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMarketUtilizationFees",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "uint256",
                "name": "utilizationFeeRate"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWrapperFees",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "int256",
                "name": "wrapFee"
            },
            {
                "type": "int256",
                "name": "unwrapFee"
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
                "type": "uint128",
                "name": "synthMarketId"
            },
            {
                "type": "address",
                "name": "referrer"
            },
            {
                "type": "uint256",
                "name": "sharePercentage"
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
    }
]
