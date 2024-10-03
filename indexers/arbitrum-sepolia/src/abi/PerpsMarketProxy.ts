import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './PerpsMarketProxy.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    AccountCreated: new LogEvent<([accountId: bigint, owner: string] & {accountId: bigint, owner: string})>(
        abi, '0xa9e04d307e860938fa63307df8b8090e365276e59fcca12ed55656c25e538019'
    ),
    PermissionGranted: new LogEvent<([accountId: bigint, permission: string, user: string, sender: string] & {accountId: bigint, permission: string, user: string, sender: string})>(
        abi, '0x32ff7c3f84299a3543c1e89057e98ba962f4fbe7786c52289e184c57b9a36a50'
    ),
    PermissionRevoked: new LogEvent<([accountId: bigint, permission: string, user: string, sender: string] & {accountId: bigint, permission: string, user: string, sender: string})>(
        abi, '0x116c7e9cd2db316974fb473babcbcd625be1350842d0319e761d30aefb09a58a'
    ),
    AssociatedSystemSet: new LogEvent<([kind: string, id: string, proxy: string, impl: string] & {kind: string, id: string, proxy: string, impl: string})>(
        abi, '0xc8551a5a03a7b06d5d20159b3b8839429a7aefab4bf3d020f1b65fa903ccb3d2'
    ),
    OwnerChanged: new LogEvent<([oldOwner: string, newOwner: string] & {oldOwner: string, newOwner: string})>(
        abi, '0xb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c'
    ),
    OwnerNominated: new LogEvent<([newOwner: string] & {newOwner: string})>(
        abi, '0x906a1c6bd7e3091ea86693dd029a831c19049ce77f1dce2ce0bab1cacbabce22'
    ),
    Upgraded: new LogEvent<([self: string, implementation: string] & {self: string, implementation: string})>(
        abi, '0x5d611f318680d00598bb735d61bacf0c514c6b50e1e5ad30040a4df2b12791c7'
    ),
    FactoryInitialized: new LogEvent<([globalPerpsMarketId: bigint] & {globalPerpsMarketId: bigint})>(
        abi, '0xb3240229b07e26f2f02e69dda85ede86e162ccbc6d10e6aade28931e7f533339'
    ),
    MarketCreated: new LogEvent<([perpsMarketId: bigint, marketName: string, marketSymbol: string] & {perpsMarketId: bigint, marketName: string, marketSymbol: string})>(
        abi, '0x032553f94ac1323933f22650ec5b8e232babf1c47efca69383b749463116cc49'
    ),
    CollateralModified: new LogEvent<([accountId: bigint, collateralId: bigint, amountDelta: bigint, sender: string] & {accountId: bigint, collateralId: bigint, amountDelta: bigint, sender: string})>(
        abi, '0x2e8360c2f3a6fc1a15aefdd0a0922bea3c898cb90d38c3a97354e7c013116064'
    ),
    DebtPaid: new LogEvent<([accountId: bigint, amount: bigint, sender: string] & {accountId: bigint, amount: bigint, sender: string})>(
        abi, '0x4b2a60a1cb0c1127885a9f73b6ffca09ebb4cf25eba65024ee660b9b7008e823'
    ),
    InterestRateUpdated: new LogEvent<([superMarketId: bigint, interestRate: bigint] & {superMarketId: bigint, interestRate: bigint})>(
        abi, '0x13cc429774e87628617cfcb0a54da0a45b9deddfe73719fe97c353e77fc13025'
    ),
    OrderCommitted: new LogEvent<([marketId: bigint, accountId: bigint, orderType: number, sizeDelta: bigint, acceptablePrice: bigint, commitmentTime: bigint, expectedPriceTime: bigint, settlementTime: bigint, expirationTime: bigint, trackingCode: string, sender: string] & {marketId: bigint, accountId: bigint, orderType: number, sizeDelta: bigint, acceptablePrice: bigint, commitmentTime: bigint, expectedPriceTime: bigint, settlementTime: bigint, expirationTime: bigint, trackingCode: string, sender: string})>(
        abi, '0xeb7f3a2236186f1b0e183dad9959f6ece678f3d80447b125224e23942f50d44f'
    ),
    PreviousOrderExpired: new LogEvent<([marketId: bigint, accountId: bigint, sizeDelta: bigint, acceptablePrice: bigint, commitmentTime: bigint, trackingCode: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, acceptablePrice: bigint, commitmentTime: bigint, trackingCode: string})>(
        abi, '0x6d83c6751813f50325d75bc054621f83299659c5814d1e5fe6ac117860710dde'
    ),
    AccountCharged: new LogEvent<([accountId: bigint, amount: bigint, accountDebt: bigint] & {accountId: bigint, amount: bigint, accountDebt: bigint})>(
        abi, '0x0f0c4533e494a73710ef5720710448c8206681251f728460d5753f86c12004f7'
    ),
    InterestCharged: new LogEvent<([accountId: bigint, interest: bigint] & {accountId: bigint, interest: bigint})>(
        abi, '0xaf1bec63dc46ef212d5d5da0c9e303b8eb4394789d879ff849347302a390ae5c'
    ),
    MarketUpdated: new LogEvent<([marketId: bigint, price: bigint, skew: bigint, size: bigint, sizeDelta: bigint, currentFundingRate: bigint, currentFundingVelocity: bigint, interestRate: bigint] & {marketId: bigint, price: bigint, skew: bigint, size: bigint, sizeDelta: bigint, currentFundingRate: bigint, currentFundingVelocity: bigint, interestRate: bigint})>(
        abi, '0x346c68f39d865d9102f8e506228e49f3ff189d487acd496f59cfff5163dd7d70'
    ),
    OrderSettled: new LogEvent<([marketId: bigint, accountId: bigint, fillPrice: bigint, pnl: bigint, accruedFunding: bigint, sizeDelta: bigint, newSize: bigint, totalFees: bigint, referralFees: bigint, collectedFees: bigint, settlementReward: bigint, trackingCode: string, settler: string] & {marketId: bigint, accountId: bigint, fillPrice: bigint, pnl: bigint, accruedFunding: bigint, sizeDelta: bigint, newSize: bigint, totalFees: bigint, referralFees: bigint, collectedFees: bigint, settlementReward: bigint, trackingCode: string, settler: string})>(
        abi, '0x460080a757ec90719fe90ab2384c0196cdeed071a9fd7ce1ada43481d96b7db5'
    ),
    OrderCancelled: new LogEvent<([marketId: bigint, accountId: bigint, desiredPrice: bigint, fillPrice: bigint, sizeDelta: bigint, settlementReward: bigint, trackingCode: string, settler: string] & {marketId: bigint, accountId: bigint, desiredPrice: bigint, fillPrice: bigint, sizeDelta: bigint, settlementReward: bigint, trackingCode: string, settler: string})>(
        abi, '0x7415070016cafa6a064ae5b74d75f9968c033ce38621b3dc6d8e7a3b1e64e3ed'
    ),
    FeatureFlagAllowAllSet: new LogEvent<([feature: string, allowAll: boolean] & {feature: string, allowAll: boolean})>(
        abi, '0xa806035d8c8de7cd43725250d3fbf9ee7abe3b99ffb892897913d8a21721121d'
    ),
    FeatureFlagAllowlistAdded: new LogEvent<([feature: string, account: string] & {feature: string, account: string})>(
        abi, '0x30b9b4104e2fb00b4f980e414dcd828e691c8fcb286f0c73d7267c3a2de49383'
    ),
    FeatureFlagAllowlistRemoved: new LogEvent<([feature: string, account: string] & {feature: string, account: string})>(
        abi, '0xb44a47e11880cc865e8ea382561e406dea8c895366c58e3908f05708b2880890'
    ),
    FeatureFlagDeniersReset: new LogEvent<([feature: string, deniers: Array<string>] & {feature: string, deniers: Array<string>})>(
        abi, '0x74d48d0b51a70680130c00decd06b4d536fbb3cee16a3b0bdd2309c264dcbd13'
    ),
    FeatureFlagDenyAllSet: new LogEvent<([feature: string, denyAll: boolean] & {feature: string, denyAll: boolean})>(
        abi, '0x97f76d2e384948e28ddd4280a4e76e8600acc328a0c0910c93682a0fccc02018'
    ),
    AccountFlaggedForLiquidation: new LogEvent<([accountId: bigint, availableMargin: bigint, requiredMaintenanceMargin: bigint, liquidationReward: bigint, flagReward: bigint] & {accountId: bigint, availableMargin: bigint, requiredMaintenanceMargin: bigint, liquidationReward: bigint, flagReward: bigint})>(
        abi, '0xee38d74835b41491aaf94362bbbd5c0a844c795e5c2de530ddf37c91b0179ba9'
    ),
    AccountLiquidationAttempt: new LogEvent<([accountId: bigint, reward: bigint, fullLiquidation: boolean] & {accountId: bigint, reward: bigint, fullLiquidation: boolean})>(
        abi, '0x26ef135389b1c68384b54bcb8b8c6b329a4cc302ab22474b8991fa4e957def35'
    ),
    AccountMarginLiquidation: new LogEvent<([accountId: bigint, seizedMarginValue: bigint, liquidationReward: bigint] & {accountId: bigint, seizedMarginValue: bigint, liquidationReward: bigint})>(
        abi, '0x8d4cc65a0877c8660be72088e9e710822c801026a6ba5cb13792248b852c9113'
    ),
    PositionLiquidated: new LogEvent<([accountId: bigint, marketId: bigint, amountLiquidated: bigint, currentPositionSize: bigint] & {accountId: bigint, marketId: bigint, amountLiquidated: bigint, currentPositionSize: bigint})>(
        abi, '0xd583c0e2965aae317f4a9a6603c0c75602b9bc97dc7c5fc6446b0ba8d3ff1bb2'
    ),
    FundingParametersSet: new LogEvent<([marketId: bigint, skewScale: bigint, maxFundingVelocity: bigint] & {marketId: bigint, skewScale: bigint, maxFundingVelocity: bigint})>(
        abi, '0xa74afd926bbafbb9252d224a1fcd6a209f851324bd485f556786820a76e31b65'
    ),
    LiquidationParametersSet: new LogEvent<([marketId: bigint, initialMarginRatioD18: bigint, maintenanceMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint] & {marketId: bigint, initialMarginRatioD18: bigint, maintenanceMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint})>(
        abi, '0xa0c87f048ec4f5924e50d554aa4a6e65a935f133a2114e5222590c1690e1a7b8'
    ),
    LockedOiRatioSet: new LogEvent<([marketId: bigint, lockedOiRatioD18: bigint] & {marketId: bigint, lockedOiRatioD18: bigint})>(
        abi, '0x1d841fd5b4c806bc5a073d637a8506e1e74d16cb18251b711cb47e133ceafc2d'
    ),
    MarketPriceDataUpdated: new LogEvent<([marketId: bigint, feedId: string, strictStalenessTolerance: bigint] & {marketId: bigint, feedId: string, strictStalenessTolerance: bigint})>(
        abi, '0x6cf30df68198cadbabcf0342baee973e970617ec00e3cd564a8dc130b0d82dac'
    ),
    MaxLiquidationParametersSet: new LogEvent<([marketId: bigint, maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string] & {marketId: bigint, maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string})>(
        abi, '0x9012ce377b7043d153d2cba3376efe7e1742af5acb7e38897362f392a7dc89ed'
    ),
    MaxMarketSizeSet: new LogEvent<([marketId: bigint, maxMarketSize: bigint] & {marketId: bigint, maxMarketSize: bigint})>(
        abi, '0xbd063bd3072a194b255163ab8dfd3400c4ab1cc641b920e7aaf1c11f92cd26cf'
    ),
    MaxMarketValueSet: new LogEvent<([marketId: bigint, maxMarketValue: bigint] & {marketId: bigint, maxMarketValue: bigint})>(
        abi, '0x899b5a42ab35d659b6afef45eee0eaeef7fa0d3290dd18af9b1f97b31952a300'
    ),
    OrderFeesSet: new LogEvent<([marketId: bigint, makerFeeRatio: bigint, takerFeeRatio: bigint] & {marketId: bigint, makerFeeRatio: bigint, takerFeeRatio: bigint})>(
        abi, '0x28969f156340ba9eb31589904eb174d3a4b6a37781fa6f7ad289d349d75dd1ee'
    ),
    SettlementStrategyAdded: new LogEvent<([marketId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint}), strategyId: bigint] & {marketId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint}), strategyId: bigint})>(
        abi, '0x254a9d9f59b5ec6894fda88373cbd55c8cce1734b744f3d3edfec275d84ada56'
    ),
    SettlementStrategySet: new LogEvent<([marketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})] & {marketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})})>(
        abi, '0xdc5a4c4a722e4423d35b4fdcc236de75a4766a2625ae2f19411bfeeb3c160bf1'
    ),
    CollateralConfigurationSet: new LogEvent<([collateralId: bigint, maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint] & {collateralId: bigint, maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint})>(
        abi, '0x304ed8aa0efc4ca9f7fbcb32db12457495001ace596100f50777f05d203316f2'
    ),
    CollateralLiquidateRewardRatioSet: new LogEvent<([collateralLiquidateRewardRatioD18: bigint] & {collateralLiquidateRewardRatioD18: bigint})>(
        abi, '0x43c42438f2f0aa5d7cc5e4d40fd9bc53a2ed99e225941715396740d6a74c7f78'
    ),
    RewardDistributorRegistered: new LogEvent<([distributor: string] & {distributor: string})>(
        abi, '0x74adf812baf946d305ba8724699e32e055bf8664faac58fe27fade6a1a29c400'
    ),
    FeeCollectorSet: new LogEvent<([feeCollector: string] & {feeCollector: string})>(
        abi, '0x12e1d17016b94668449f97876f4a8d5cc2c19f314db337418894734037cc19d4'
    ),
    InterestRateParametersSet: new LogEvent<([lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint] & {lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint})>(
        abi, '0x9ab1d43881e1e730680d49d0c0f0da5fa8f38afa0fa2f9cf88674531c6212ef5'
    ),
    KeeperCostNodeIdUpdated: new LogEvent<([keeperCostNodeId: string] & {keeperCostNodeId: string})>(
        abi, '0x60cb06323d52fe6ab34750c42db77ba8dd1e013bb393edb9e1c88a88dee500a7'
    ),
    KeeperRewardGuardsSet: new LogEvent<([minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint] & {minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint})>(
        abi, '0xdc784d5448d4b3c13f36956adb978d1e276f2e0c8d37e78c262b5be7641d8b54'
    ),
    PerAccountCapsSet: new LogEvent<([maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint] & {maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint})>(
        abi, '0x3448c6d1990f2d48253b91394193cd11ce49f1653f2d03934af6d17195ffe34e'
    ),
    ReferrerShareUpdated: new LogEvent<([referrer: string, shareRatioD18: bigint] & {referrer: string, shareRatioD18: bigint})>(
        abi, '0xa225c555f4cd21a533ad4e01eaf30153c84ca28265d954a651410d3c1e56242c'
    ),
}

export const functions = {
    'createAccount()': new Func<[], {}, bigint>(
        abi, '0x9dca362f'
    ),
    'createAccount(uint128)': new Func<[requestedAccountId: bigint], {requestedAccountId: bigint}, []>(
        abi, '0xcadb09a5'
    ),
    getAccountLastInteraction: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0x1b5dccdb'
    ),
    getAccountOwner: new Func<[accountId: bigint], {accountId: bigint}, string>(
        abi, '0xbf60c31d'
    ),
    getAccountPermissions: new Func<[accountId: bigint], {accountId: bigint}, Array<([user: string, permissions: Array<string>] & {user: string, permissions: Array<string>})>>(
        abi, '0xa796fecd'
    ),
    getAccountTokenAddress: new Func<[], {}, string>(
        abi, '0xa148bf10'
    ),
    grantPermission: new Func<[accountId: bigint, permission: string, user: string], {accountId: bigint, permission: string, user: string}, []>(
        abi, '0x00cd9ef3'
    ),
    hasPermission: new Func<[accountId: bigint, permission: string, user: string], {accountId: bigint, permission: string, user: string}, boolean>(
        abi, '0x8d34166b'
    ),
    isAuthorized: new Func<[accountId: bigint, permission: string, user: string], {accountId: bigint, permission: string, user: string}, boolean>(
        abi, '0x1213d453'
    ),
    notifyAccountTransfer: new Func<[to: string, accountId: bigint], {to: string, accountId: bigint}, []>(
        abi, '0x7dec8b55'
    ),
    renouncePermission: new Func<[accountId: bigint, permission: string], {accountId: bigint, permission: string}, []>(
        abi, '0x47c1c561'
    ),
    revokePermission: new Func<[accountId: bigint, permission: string, user: string], {accountId: bigint, permission: string, user: string}, []>(
        abi, '0xa7627288'
    ),
    getAssociatedSystem: new Func<[id: string], {id: string}, ([addr: string, kind: string] & {addr: string, kind: string})>(
        abi, '0x60988e09'
    ),
    initOrUpgradeNft: new Func<[id: string, name: string, symbol: string, uri: string, impl: string], {id: string, name: string, symbol: string, uri: string, impl: string}, []>(
        abi, '0x2d22bef9'
    ),
    initOrUpgradeToken: new Func<[id: string, name: string, symbol: string, decimals: number, impl: string], {id: string, name: string, symbol: string, decimals: number, impl: string}, []>(
        abi, '0xc6f79537'
    ),
    registerUnmanagedSystem: new Func<[id: string, endpoint: string], {id: string, endpoint: string}, []>(
        abi, '0xd245d983'
    ),
    acceptOwnership: new Func<[], {}, []>(
        abi, '0x79ba5097'
    ),
    getImplementation: new Func<[], {}, string>(
        abi, '0xaaf10f42'
    ),
    nominateNewOwner: new Func<[newNominatedOwner: string], {newNominatedOwner: string}, []>(
        abi, '0x1627540c'
    ),
    nominatedOwner: new Func<[], {}, string>(
        abi, '0x53a47bb7'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    renounceNomination: new Func<[], {}, []>(
        abi, '0x718fe928'
    ),
    simulateUpgradeTo: new Func<[newImplementation: string], {newImplementation: string}, []>(
        abi, '0xc7f62cda'
    ),
    upgradeTo: new Func<[newImplementation: string], {newImplementation: string}, []>(
        abi, '0x3659cfe6'
    ),
    createMarket: new Func<[requestedMarketId: bigint, marketName: string, marketSymbol: string], {requestedMarketId: bigint, marketName: string, marketSymbol: string}, bigint>(
        abi, '0x7e947ea4'
    ),
    initializeFactory: new Func<[synthetix: string, spotMarket: string], {synthetix: string, spotMarket: string}, bigint>(
        abi, '0x3bef7df4'
    ),
    interestRate: new Func<[], {}, bigint>(
        abi, '0x7c3a00fd'
    ),
    minimumCredit: new Func<[perpsMarketId: bigint], {perpsMarketId: bigint}, bigint>(
        abi, '0xafe79200'
    ),
    name: new Func<[perpsMarketId: bigint], {perpsMarketId: bigint}, string>(
        abi, '0xc624440a'
    ),
    reportedDebt: new Func<[perpsMarketId: bigint], {perpsMarketId: bigint}, bigint>(
        abi, '0xbcec0d0f'
    ),
    setPerpsMarketName: new Func<[marketName: string], {marketName: string}, []>(
        abi, '0x55576c59'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    utilizationRate: new Func<[], {}, ([rate: bigint, delegatedCollateral: bigint, lockedCredit: bigint] & {rate: bigint, delegatedCollateral: bigint, lockedCredit: bigint})>(
        abi, '0x6c321c8a'
    ),
    debt: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0xcafdefbc'
    ),
    getAccountCollateralIds: new Func<[accountId: bigint], {accountId: bigint}, Array<bigint>>(
        abi, '0x9734ba0f'
    ),
    getAccountOpenPositions: new Func<[accountId: bigint], {accountId: bigint}, Array<bigint>>(
        abi, '0x35254238'
    ),
    getAvailableMargin: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0x0a7dad2d'
    ),
    getCollateralAmount: new Func<[accountId: bigint, collateralId: bigint], {accountId: bigint, collateralId: bigint}, bigint>(
        abi, '0x5dbd5c9b'
    ),
    getOpenPosition: new Func<[accountId: bigint, marketId: bigint], {accountId: bigint, marketId: bigint}, ([totalPnl: bigint, accruedFunding: bigint, positionSize: bigint, owedInterest: bigint] & {totalPnl: bigint, accruedFunding: bigint, positionSize: bigint, owedInterest: bigint})>(
        abi, '0x22a73967'
    ),
    getOpenPositionSize: new Func<[accountId: bigint, marketId: bigint], {accountId: bigint, marketId: bigint}, bigint>(
        abi, '0x6fa1b1a0'
    ),
    getRequiredMargins: new Func<[accountId: bigint], {accountId: bigint}, ([requiredInitialMargin: bigint, requiredMaintenanceMargin: bigint, maxLiquidationReward: bigint] & {requiredInitialMargin: bigint, requiredMaintenanceMargin: bigint, maxLiquidationReward: bigint})>(
        abi, '0x3c0f0753'
    ),
    getWithdrawableMargin: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0x04aa363e'
    ),
    modifyCollateral: new Func<[accountId: bigint, collateralId: bigint, amountDelta: bigint], {accountId: bigint, collateralId: bigint, amountDelta: bigint}, []>(
        abi, '0xbb58672c'
    ),
    payDebt: new Func<[accountId: bigint, amount: bigint], {accountId: bigint, amount: bigint}, []>(
        abi, '0x0706067b'
    ),
    totalAccountOpenInterest: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0x2daf43bc'
    ),
    totalCollateralValue: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0xb568ae42'
    ),
    currentFundingRate: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0xd435b2a2'
    ),
    currentFundingVelocity: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0xf265db02'
    ),
    fillPrice: new Func<[marketId: bigint, orderSize: bigint, price: bigint], {marketId: bigint, orderSize: bigint, price: bigint}, bigint>(
        abi, '0xdeff90ef'
    ),
    getMarketSummary: new Func<[marketId: bigint], {marketId: bigint}, ([skew: bigint, size: bigint, maxOpenInterest: bigint, currentFundingRate: bigint, currentFundingVelocity: bigint, indexPrice: bigint] & {skew: bigint, size: bigint, maxOpenInterest: bigint, currentFundingRate: bigint, currentFundingVelocity: bigint, indexPrice: bigint})>(
        abi, '0x41c2e8bd'
    ),
    indexPrice: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x4f778fb4'
    ),
    maxOpenInterest: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x0e7cace9'
    ),
    metadata: new Func<[marketId: bigint], {marketId: bigint}, ([name: string, symbol: string] & {name: string, symbol: string})>(
        abi, '0xe3bc36bf'
    ),
    size: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x2b267635'
    ),
    skew: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x83a7db27'
    ),
    commitOrder: new Func<[commitment: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})], {commitment: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})}, ([retOrder: ([commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})] & {commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})}), fees: bigint] & {retOrder: ([commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})] & {commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})}), fees: bigint})>(
        abi, '0x9f978860'
    ),
    computeOrderFees: new Func<[marketId: bigint, sizeDelta: bigint], {marketId: bigint, sizeDelta: bigint}, ([orderFees: bigint, fillPrice: bigint] & {orderFees: bigint, fillPrice: bigint})>(
        abi, '0x98ef15a2'
    ),
    computeOrderFeesWithPrice: new Func<[marketId: bigint, sizeDelta: bigint, price: bigint], {marketId: bigint, sizeDelta: bigint, price: bigint}, ([orderFees: bigint, fillPrice: bigint] & {orderFees: bigint, fillPrice: bigint})>(
        abi, '0x06e4ba89'
    ),
    getOrder: new Func<[accountId: bigint], {accountId: bigint}, ([commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})] & {commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})})>(
        abi, '0x117d4128'
    ),
    getSettlementRewardCost: new Func<[marketId: bigint, settlementStrategyId: bigint], {marketId: bigint, settlementStrategyId: bigint}, bigint>(
        abi, '0xecfebba2'
    ),
    requiredMarginForOrder: new Func<[accountId: bigint, marketId: bigint, sizeDelta: bigint], {accountId: bigint, marketId: bigint, sizeDelta: bigint}, bigint>(
        abi, '0xb8830a25'
    ),
    requiredMarginForOrderWithPrice: new Func<[accountId: bigint, marketId: bigint, sizeDelta: bigint, price: bigint], {accountId: bigint, marketId: bigint, sizeDelta: bigint, price: bigint}, bigint>(
        abi, '0x5a6a77bf'
    ),
    settleOrder: new Func<[accountId: bigint], {accountId: bigint}, []>(
        abi, '0xf89648fb'
    ),
    cancelOrder: new Func<[accountId: bigint], {accountId: bigint}, []>(
        abi, '0xdbc91396'
    ),
    addToFeatureFlagAllowlist: new Func<[feature: string, account: string], {feature: string, account: string}, []>(
        abi, '0xa0778144'
    ),
    getDeniers: new Func<[feature: string], {feature: string}, Array<string>>(
        abi, '0xed429cf7'
    ),
    getFeatureFlagAllowAll: new Func<[feature: string], {feature: string}, boolean>(
        abi, '0x40a399ef'
    ),
    getFeatureFlagAllowlist: new Func<[feature: string], {feature: string}, Array<string>>(
        abi, '0xe12c8160'
    ),
    getFeatureFlagDenyAll: new Func<[feature: string], {feature: string}, boolean>(
        abi, '0xbcae3ea0'
    ),
    isFeatureAllowed: new Func<[feature: string, account: string], {feature: string, account: string}, boolean>(
        abi, '0xcf635949'
    ),
    removeFromFeatureFlagAllowlist: new Func<[feature: string, account: string], {feature: string, account: string}, []>(
        abi, '0xb7746b59'
    ),
    setDeniers: new Func<[feature: string, deniers: Array<string>], {feature: string, deniers: Array<string>}, []>(
        abi, '0x715cb7d2'
    ),
    setFeatureFlagAllowAll: new Func<[feature: string, allowAll: boolean], {feature: string, allowAll: boolean}, []>(
        abi, '0x7d632bd2'
    ),
    setFeatureFlagDenyAll: new Func<[feature: string, denyAll: boolean], {feature: string, denyAll: boolean}, []>(
        abi, '0x5e52ad6e'
    ),
    canLiquidate: new Func<[accountId: bigint], {accountId: bigint}, boolean>(
        abi, '0x9b922bba'
    ),
    canLiquidateMarginOnly: new Func<[accountId: bigint], {accountId: bigint}, boolean>(
        abi, '0x065ddfaa'
    ),
    flaggedAccounts: new Func<[], {}, Array<bigint>>(
        abi, '0xa788d01f'
    ),
    liquidate: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0x048577de'
    ),
    liquidateFlagged: new Func<[maxNumberOfAccounts: bigint], {maxNumberOfAccounts: bigint}, bigint>(
        abi, '0xac53c5ae'
    ),
    liquidateFlaggedAccounts: new Func<[accountIds: Array<bigint>], {accountIds: Array<bigint>}, bigint>(
        abi, '0x3ce80659'
    ),
    liquidateMarginOnly: new Func<[accountId: bigint], {accountId: bigint}, bigint>(
        abi, '0x852806dc'
    ),
    liquidationCapacity: new Func<[marketId: bigint], {marketId: bigint}, ([capacity: bigint, maxLiquidationInWindow: bigint, latestLiquidationTimestamp: bigint] & {capacity: bigint, maxLiquidationInWindow: bigint, latestLiquidationTimestamp: bigint})>(
        abi, '0xbb36f896'
    ),
    addSettlementStrategy: new Func<[marketId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})], {marketId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})}, bigint>(
        abi, '0x74d745fc'
    ),
    getFundingParameters: new Func<[marketId: bigint], {marketId: bigint}, ([skewScale: bigint, maxFundingVelocity: bigint] & {skewScale: bigint, maxFundingVelocity: bigint})>(
        abi, '0x1b68d8fa'
    ),
    getLiquidationParameters: new Func<[marketId: bigint], {marketId: bigint}, ([initialMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, maintenanceMarginScalarD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint] & {initialMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, maintenanceMarginScalarD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint})>(
        abi, '0xf94363a6'
    ),
    getLockedOiRatio: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x31edc046'
    ),
    getMaxLiquidationParameters: new Func<[marketId: bigint], {marketId: bigint}, ([maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string] & {maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string})>(
        abi, '0x5443e33e'
    ),
    getMaxMarketSize: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x19a99bf5'
    ),
    getMaxMarketValue: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x3b217f67'
    ),
    getOrderFees: new Func<[marketId: bigint], {marketId: bigint}, ([makerFee: bigint, takerFee: bigint] & {makerFee: bigint, takerFee: bigint})>(
        abi, '0xaac23e8c'
    ),
    getPriceData: new Func<[perpsMarketId: bigint], {perpsMarketId: bigint}, ([feedId: string, strictStalenessTolerance: bigint] & {feedId: string, strictStalenessTolerance: bigint})>(
        abi, '0x462b9a2d'
    ),
    getSettlementStrategy: new Func<[marketId: bigint, strategyId: bigint], {marketId: bigint, strategyId: bigint}, ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})>(
        abi, '0xf74c377f'
    ),
    setFundingParameters: new Func<[marketId: bigint, skewScale: bigint, maxFundingVelocity: bigint], {marketId: bigint, skewScale: bigint, maxFundingVelocity: bigint}, []>(
        abi, '0xc2382277'
    ),
    setLiquidationParameters: new Func<[marketId: bigint, initialMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, maintenanceMarginScalarD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint], {marketId: bigint, initialMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, maintenanceMarginScalarD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint}, []>(
        abi, '0x25e5409e'
    ),
    setLockedOiRatio: new Func<[marketId: bigint, lockedOiRatioD18: bigint], {marketId: bigint, lockedOiRatioD18: bigint}, []>(
        abi, '0x033723d9'
    ),
    setMaxLiquidationParameters: new Func<[marketId: bigint, maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string], {marketId: bigint, maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string}, []>(
        abi, '0xc7f8a94f'
    ),
    setMaxMarketSize: new Func<[marketId: bigint, maxMarketSize: bigint], {marketId: bigint, maxMarketSize: bigint}, []>(
        abi, '0x404a68aa'
    ),
    setMaxMarketValue: new Func<[marketId: bigint, maxMarketValue: bigint], {marketId: bigint, maxMarketValue: bigint}, []>(
        abi, '0xdd661eea'
    ),
    setOrderFees: new Func<[marketId: bigint, makerFeeRatio: bigint, takerFeeRatio: bigint], {marketId: bigint, makerFeeRatio: bigint, takerFeeRatio: bigint}, []>(
        abi, '0xf842fa86'
    ),
    setSettlementStrategy: new Func<[marketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})], {marketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})}, []>(
        abi, '0x26641806'
    ),
    setSettlementStrategyEnabled: new Func<[marketId: bigint, strategyId: bigint, enabled: boolean], {marketId: bigint, strategyId: bigint, enabled: boolean}, []>(
        abi, '0x7f73a891'
    ),
    updatePriceData: new Func<[perpsMarketId: bigint, feedId: string, strictStalenessTolerance: bigint], {perpsMarketId: bigint, feedId: string, strictStalenessTolerance: bigint}, []>(
        abi, '0xb5848488'
    ),
    getCollateralConfiguration: new Func<[collateralId: bigint], {collateralId: bigint}, bigint>(
        abi, '0xfd51558e'
    ),
    getCollateralConfigurationFull: new Func<[collateralId: bigint], {collateralId: bigint}, ([maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint] & {maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint})>(
        abi, '0x6097fcda'
    ),
    getCollateralLiquidateRewardRatio: new Func<[], {}, bigint>(
        abi, '0x59e1f8c1'
    ),
    getRegisteredDistributor: new Func<[collateralId: bigint], {collateralId: bigint}, ([distributor: string, poolDelegatedCollateralTypes: Array<string>] & {distributor: string, poolDelegatedCollateralTypes: Array<string>})>(
        abi, '0x5a55b582'
    ),
    isRegistered: new Func<[distributor: string], {distributor: string}, boolean>(
        abi, '0xc3c5a547'
    ),
    registerDistributor: new Func<[token: string, distributor: string, collateralId: bigint, poolDelegatedCollateralTypes: Array<string>], {token: string, distributor: string, collateralId: bigint, poolDelegatedCollateralTypes: Array<string>}, []>(
        abi, '0xec5dedfc'
    ),
    setCollateralConfiguration: new Func<[collateralId: bigint, maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint], {collateralId: bigint, maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint}, []>(
        abi, '0x6aa08501'
    ),
    setCollateralLiquidateRewardRatio: new Func<[collateralLiquidateRewardRatioD18: bigint], {collateralLiquidateRewardRatioD18: bigint}, []>(
        abi, '0x77bedbcc'
    ),
    getFeeCollector: new Func<[], {}, string>(
        abi, '0x12fde4b7'
    ),
    getInterestRateParameters: new Func<[], {}, ([lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint] & {lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint})>(
        abi, '0xb4ed6320'
    ),
    getKeeperCostNodeId: new Func<[], {}, string>(
        abi, '0x1f4653bb'
    ),
    getKeeperRewardGuards: new Func<[], {}, ([minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint] & {minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint})>(
        abi, '0x26e77e84'
    ),
    getMarkets: new Func<[], {}, Array<bigint>>(
        abi, '0xec2c9016'
    ),
    getPerAccountCaps: new Func<[], {}, ([maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint] & {maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint})>(
        abi, '0x774f7b07'
    ),
    getReferrerShare: new Func<[referrer: string], {referrer: string}, bigint>(
        abi, '0xcae77b70'
    ),
    getSupportedCollaterals: new Func<[], {}, Array<bigint>>(
        abi, '0x05db8a69'
    ),
    globalCollateralValue: new Func<[collateralId: bigint], {collateralId: bigint}, bigint>(
        abi, '0xe53427e7'
    ),
    setFeeCollector: new Func<[feeCollector: string], {feeCollector: string}, []>(
        abi, '0xa42dce80'
    ),
    setInterestRateParameters: new Func<[lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint], {lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint}, []>(
        abi, '0xbe0cbb59'
    ),
    setKeeperRewardGuards: new Func<[minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint], {minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint}, []>(
        abi, '0x96e9f7a0'
    ),
    setPerAccountCaps: new Func<[maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint], {maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint}, []>(
        abi, '0xfa0e70a7'
    ),
    totalGlobalCollateralValue: new Func<[], {}, bigint>(
        abi, '0x65c5a0fe'
    ),
    updateInterestRate: new Func<[], {}, []>(
        abi, '0xce76756f'
    ),
    updateKeeperCostNodeId: new Func<[keeperCostNodeId: string], {keeperCostNodeId: string}, []>(
        abi, '0xf5322087'
    ),
    updateReferrerShare: new Func<[referrer: string, shareRatioD18: bigint], {referrer: string, shareRatioD18: bigint}, []>(
        abi, '0x6809fb4d'
    ),
}

export class Contract extends ContractBase {

    getAccountLastInteraction(accountId: bigint): Promise<bigint> {
        return this.eth_call(functions.getAccountLastInteraction, [accountId])
    }

    getAccountOwner(accountId: bigint): Promise<string> {
        return this.eth_call(functions.getAccountOwner, [accountId])
    }

    getAccountPermissions(accountId: bigint): Promise<Array<([user: string, permissions: Array<string>] & {user: string, permissions: Array<string>})>> {
        return this.eth_call(functions.getAccountPermissions, [accountId])
    }

    getAccountTokenAddress(): Promise<string> {
        return this.eth_call(functions.getAccountTokenAddress, [])
    }

    hasPermission(accountId: bigint, permission: string, user: string): Promise<boolean> {
        return this.eth_call(functions.hasPermission, [accountId, permission, user])
    }

    isAuthorized(accountId: bigint, permission: string, user: string): Promise<boolean> {
        return this.eth_call(functions.isAuthorized, [accountId, permission, user])
    }

    getAssociatedSystem(id: string): Promise<([addr: string, kind: string] & {addr: string, kind: string})> {
        return this.eth_call(functions.getAssociatedSystem, [id])
    }

    getImplementation(): Promise<string> {
        return this.eth_call(functions.getImplementation, [])
    }

    nominatedOwner(): Promise<string> {
        return this.eth_call(functions.nominatedOwner, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    interestRate(): Promise<bigint> {
        return this.eth_call(functions.interestRate, [])
    }

    minimumCredit(perpsMarketId: bigint): Promise<bigint> {
        return this.eth_call(functions.minimumCredit, [perpsMarketId])
    }

    name(perpsMarketId: bigint): Promise<string> {
        return this.eth_call(functions.name, [perpsMarketId])
    }

    reportedDebt(perpsMarketId: bigint): Promise<bigint> {
        return this.eth_call(functions.reportedDebt, [perpsMarketId])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    utilizationRate(): Promise<([rate: bigint, delegatedCollateral: bigint, lockedCredit: bigint] & {rate: bigint, delegatedCollateral: bigint, lockedCredit: bigint})> {
        return this.eth_call(functions.utilizationRate, [])
    }

    debt(accountId: bigint): Promise<bigint> {
        return this.eth_call(functions.debt, [accountId])
    }

    getAccountCollateralIds(accountId: bigint): Promise<Array<bigint>> {
        return this.eth_call(functions.getAccountCollateralIds, [accountId])
    }

    getAccountOpenPositions(accountId: bigint): Promise<Array<bigint>> {
        return this.eth_call(functions.getAccountOpenPositions, [accountId])
    }

    getAvailableMargin(accountId: bigint): Promise<bigint> {
        return this.eth_call(functions.getAvailableMargin, [accountId])
    }

    getCollateralAmount(accountId: bigint, collateralId: bigint): Promise<bigint> {
        return this.eth_call(functions.getCollateralAmount, [accountId, collateralId])
    }

    getOpenPosition(accountId: bigint, marketId: bigint): Promise<([totalPnl: bigint, accruedFunding: bigint, positionSize: bigint, owedInterest: bigint] & {totalPnl: bigint, accruedFunding: bigint, positionSize: bigint, owedInterest: bigint})> {
        return this.eth_call(functions.getOpenPosition, [accountId, marketId])
    }

    getOpenPositionSize(accountId: bigint, marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getOpenPositionSize, [accountId, marketId])
    }

    getRequiredMargins(accountId: bigint): Promise<([requiredInitialMargin: bigint, requiredMaintenanceMargin: bigint, maxLiquidationReward: bigint] & {requiredInitialMargin: bigint, requiredMaintenanceMargin: bigint, maxLiquidationReward: bigint})> {
        return this.eth_call(functions.getRequiredMargins, [accountId])
    }

    getWithdrawableMargin(accountId: bigint): Promise<bigint> {
        return this.eth_call(functions.getWithdrawableMargin, [accountId])
    }

    totalAccountOpenInterest(accountId: bigint): Promise<bigint> {
        return this.eth_call(functions.totalAccountOpenInterest, [accountId])
    }

    totalCollateralValue(accountId: bigint): Promise<bigint> {
        return this.eth_call(functions.totalCollateralValue, [accountId])
    }

    currentFundingRate(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.currentFundingRate, [marketId])
    }

    currentFundingVelocity(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.currentFundingVelocity, [marketId])
    }

    fillPrice(marketId: bigint, orderSize: bigint, price: bigint): Promise<bigint> {
        return this.eth_call(functions.fillPrice, [marketId, orderSize, price])
    }

    getMarketSummary(marketId: bigint): Promise<([skew: bigint, size: bigint, maxOpenInterest: bigint, currentFundingRate: bigint, currentFundingVelocity: bigint, indexPrice: bigint] & {skew: bigint, size: bigint, maxOpenInterest: bigint, currentFundingRate: bigint, currentFundingVelocity: bigint, indexPrice: bigint})> {
        return this.eth_call(functions.getMarketSummary, [marketId])
    }

    indexPrice(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.indexPrice, [marketId])
    }

    maxOpenInterest(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.maxOpenInterest, [marketId])
    }

    metadata(marketId: bigint): Promise<([name: string, symbol: string] & {name: string, symbol: string})> {
        return this.eth_call(functions.metadata, [marketId])
    }

    size(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.size, [marketId])
    }

    skew(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.skew, [marketId])
    }

    computeOrderFees(marketId: bigint, sizeDelta: bigint): Promise<([orderFees: bigint, fillPrice: bigint] & {orderFees: bigint, fillPrice: bigint})> {
        return this.eth_call(functions.computeOrderFees, [marketId, sizeDelta])
    }

    computeOrderFeesWithPrice(marketId: bigint, sizeDelta: bigint, price: bigint): Promise<([orderFees: bigint, fillPrice: bigint] & {orderFees: bigint, fillPrice: bigint})> {
        return this.eth_call(functions.computeOrderFeesWithPrice, [marketId, sizeDelta, price])
    }

    getOrder(accountId: bigint): Promise<([commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})] & {commitmentTime: bigint, request: ([marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string] & {marketId: bigint, accountId: bigint, sizeDelta: bigint, settlementStrategyId: bigint, acceptablePrice: bigint, trackingCode: string, referrer: string})})> {
        return this.eth_call(functions.getOrder, [accountId])
    }

    getSettlementRewardCost(marketId: bigint, settlementStrategyId: bigint): Promise<bigint> {
        return this.eth_call(functions.getSettlementRewardCost, [marketId, settlementStrategyId])
    }

    requiredMarginForOrder(accountId: bigint, marketId: bigint, sizeDelta: bigint): Promise<bigint> {
        return this.eth_call(functions.requiredMarginForOrder, [accountId, marketId, sizeDelta])
    }

    requiredMarginForOrderWithPrice(accountId: bigint, marketId: bigint, sizeDelta: bigint, price: bigint): Promise<bigint> {
        return this.eth_call(functions.requiredMarginForOrderWithPrice, [accountId, marketId, sizeDelta, price])
    }

    getDeniers(feature: string): Promise<Array<string>> {
        return this.eth_call(functions.getDeniers, [feature])
    }

    getFeatureFlagAllowAll(feature: string): Promise<boolean> {
        return this.eth_call(functions.getFeatureFlagAllowAll, [feature])
    }

    getFeatureFlagAllowlist(feature: string): Promise<Array<string>> {
        return this.eth_call(functions.getFeatureFlagAllowlist, [feature])
    }

    getFeatureFlagDenyAll(feature: string): Promise<boolean> {
        return this.eth_call(functions.getFeatureFlagDenyAll, [feature])
    }

    isFeatureAllowed(feature: string, account: string): Promise<boolean> {
        return this.eth_call(functions.isFeatureAllowed, [feature, account])
    }

    canLiquidate(accountId: bigint): Promise<boolean> {
        return this.eth_call(functions.canLiquidate, [accountId])
    }

    canLiquidateMarginOnly(accountId: bigint): Promise<boolean> {
        return this.eth_call(functions.canLiquidateMarginOnly, [accountId])
    }

    flaggedAccounts(): Promise<Array<bigint>> {
        return this.eth_call(functions.flaggedAccounts, [])
    }

    liquidationCapacity(marketId: bigint): Promise<([capacity: bigint, maxLiquidationInWindow: bigint, latestLiquidationTimestamp: bigint] & {capacity: bigint, maxLiquidationInWindow: bigint, latestLiquidationTimestamp: bigint})> {
        return this.eth_call(functions.liquidationCapacity, [marketId])
    }

    getFundingParameters(marketId: bigint): Promise<([skewScale: bigint, maxFundingVelocity: bigint] & {skewScale: bigint, maxFundingVelocity: bigint})> {
        return this.eth_call(functions.getFundingParameters, [marketId])
    }

    getLiquidationParameters(marketId: bigint): Promise<([initialMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, maintenanceMarginScalarD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint] & {initialMarginRatioD18: bigint, minimumInitialMarginRatioD18: bigint, maintenanceMarginScalarD18: bigint, flagRewardRatioD18: bigint, minimumPositionMargin: bigint})> {
        return this.eth_call(functions.getLiquidationParameters, [marketId])
    }

    getLockedOiRatio(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getLockedOiRatio, [marketId])
    }

    getMaxLiquidationParameters(marketId: bigint): Promise<([maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string] & {maxLiquidationLimitAccumulationMultiplier: bigint, maxSecondsInLiquidationWindow: bigint, maxLiquidationPd: bigint, endorsedLiquidator: string})> {
        return this.eth_call(functions.getMaxLiquidationParameters, [marketId])
    }

    getMaxMarketSize(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMaxMarketSize, [marketId])
    }

    getMaxMarketValue(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMaxMarketValue, [marketId])
    }

    getOrderFees(marketId: bigint): Promise<([makerFee: bigint, takerFee: bigint] & {makerFee: bigint, takerFee: bigint})> {
        return this.eth_call(functions.getOrderFees, [marketId])
    }

    getPriceData(perpsMarketId: bigint): Promise<([feedId: string, strictStalenessTolerance: bigint] & {feedId: string, strictStalenessTolerance: bigint})> {
        return this.eth_call(functions.getPriceData, [perpsMarketId])
    }

    getSettlementStrategy(marketId: bigint, strategyId: bigint): Promise<([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, settlementReward: bigint, disabled: boolean, commitmentPriceDelay: bigint})> {
        return this.eth_call(functions.getSettlementStrategy, [marketId, strategyId])
    }

    getCollateralConfiguration(collateralId: bigint): Promise<bigint> {
        return this.eth_call(functions.getCollateralConfiguration, [collateralId])
    }

    getCollateralConfigurationFull(collateralId: bigint): Promise<([maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint] & {maxCollateralAmount: bigint, upperLimitDiscount: bigint, lowerLimitDiscount: bigint, discountScalar: bigint})> {
        return this.eth_call(functions.getCollateralConfigurationFull, [collateralId])
    }

    getCollateralLiquidateRewardRatio(): Promise<bigint> {
        return this.eth_call(functions.getCollateralLiquidateRewardRatio, [])
    }

    getRegisteredDistributor(collateralId: bigint): Promise<([distributor: string, poolDelegatedCollateralTypes: Array<string>] & {distributor: string, poolDelegatedCollateralTypes: Array<string>})> {
        return this.eth_call(functions.getRegisteredDistributor, [collateralId])
    }

    isRegistered(distributor: string): Promise<boolean> {
        return this.eth_call(functions.isRegistered, [distributor])
    }

    getFeeCollector(): Promise<string> {
        return this.eth_call(functions.getFeeCollector, [])
    }

    getInterestRateParameters(): Promise<([lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint] & {lowUtilizationInterestRateGradient: bigint, interestRateGradientBreakpoint: bigint, highUtilizationInterestRateGradient: bigint})> {
        return this.eth_call(functions.getInterestRateParameters, [])
    }

    getKeeperCostNodeId(): Promise<string> {
        return this.eth_call(functions.getKeeperCostNodeId, [])
    }

    getKeeperRewardGuards(): Promise<([minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint] & {minKeeperRewardUsd: bigint, minKeeperProfitRatioD18: bigint, maxKeeperRewardUsd: bigint, maxKeeperScalingRatioD18: bigint})> {
        return this.eth_call(functions.getKeeperRewardGuards, [])
    }

    getMarkets(): Promise<Array<bigint>> {
        return this.eth_call(functions.getMarkets, [])
    }

    getPerAccountCaps(): Promise<([maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint] & {maxPositionsPerAccount: bigint, maxCollateralsPerAccount: bigint})> {
        return this.eth_call(functions.getPerAccountCaps, [])
    }

    getReferrerShare(referrer: string): Promise<bigint> {
        return this.eth_call(functions.getReferrerShare, [referrer])
    }

    getSupportedCollaterals(): Promise<Array<bigint>> {
        return this.eth_call(functions.getSupportedCollaterals, [])
    }

    globalCollateralValue(collateralId: bigint): Promise<bigint> {
        return this.eth_call(functions.globalCollateralValue, [collateralId])
    }

    totalGlobalCollateralValue(): Promise<bigint> {
        return this.eth_call(functions.totalGlobalCollateralValue, [])
    }
}
