import {DataHandlerContext} from '@subsquid/evm-processor'
import {toJSON} from '@subsquid/util-internal-json'
import {Store} from '../db'
import * as spec from '../abi/PerpsMarketProxy'
import {Log, Transaction} from '../processor'

const address = '0xa73a7b754ec870b3738d0654ca75b7d0eebdb460'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['AccountCreated'].topic: {
                let e = spec.events['AccountCreated'].decode(log)
                ctx.store.PerpsMarketProxyEventAccountCreated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AccountCreated',
                    accountId: e[0].toString(),
                    owner: e[1],
                })
                break
            }
            case spec.events['PermissionGranted'].topic: {
                let e = spec.events['PermissionGranted'].decode(log)
                ctx.store.PerpsMarketProxyEventPermissionGranted.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PermissionGranted',
                    accountId: e[0].toString(),
                    permission: e[1],
                    user: e[2],
                    sender: e[3],
                })
                break
            }
            case spec.events['PermissionRevoked'].topic: {
                let e = spec.events['PermissionRevoked'].decode(log)
                ctx.store.PerpsMarketProxyEventPermissionRevoked.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PermissionRevoked',
                    accountId: e[0].toString(),
                    permission: e[1],
                    user: e[2],
                    sender: e[3],
                })
                break
            }
            case spec.events['AssociatedSystemSet'].topic: {
                let e = spec.events['AssociatedSystemSet'].decode(log)
                ctx.store.PerpsMarketProxyEventAssociatedSystemSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AssociatedSystemSet',
                    kind: e[0],
                    id0: e[1],
                    proxy: e[2],
                    impl: e[3],
                })
                break
            }
            case spec.events['OwnerChanged'].topic: {
                let e = spec.events['OwnerChanged'].decode(log)
                ctx.store.PerpsMarketProxyEventOwnerChanged.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OwnerChanged',
                    oldOwner: e[0],
                    newOwner: e[1],
                })
                break
            }
            case spec.events['OwnerNominated'].topic: {
                let e = spec.events['OwnerNominated'].decode(log)
                ctx.store.PerpsMarketProxyEventOwnerNominated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OwnerNominated',
                    newOwner: e[0],
                })
                break
            }
            case spec.events['Upgraded'].topic: {
                let e = spec.events['Upgraded'].decode(log)
                ctx.store.PerpsMarketProxyEventUpgraded.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'Upgraded',
                    self: e[0],
                    implementation: e[1],
                })
                break
            }
            case spec.events['FactoryInitialized'].topic: {
                let e = spec.events['FactoryInitialized'].decode(log)
                ctx.store.PerpsMarketProxyEventFactoryInitialized.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FactoryInitialized',
                    globalPerpsMarketId: e[0].toString(),
                })
                break
            }
            case spec.events['MarketCreated'].topic: {
                let e = spec.events['MarketCreated'].decode(log)
                ctx.store.PerpsMarketProxyEventMarketCreated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketCreated',
                    perpsMarketId: e[0].toString(),
                    marketName: e[1],
                    marketSymbol: e[2],
                })
                break
            }
            case spec.events['CollateralModified'].topic: {
                let e = spec.events['CollateralModified'].decode(log)
                ctx.store.PerpsMarketProxyEventCollateralModified.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'CollateralModified',
                    accountId: e[0].toString(),
                    collateralId: e[1].toString(),
                    amountDelta: e[2].toString(),
                    sender: e[3],
                })
                break
            }
            case spec.events['DebtPaid'].topic: {
                let e = spec.events['DebtPaid'].decode(log)
                ctx.store.PerpsMarketProxyEventDebtPaid.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'DebtPaid',
                    accountId: e[0].toString(),
                    amount: e[1].toString(),
                    sender: e[2],
                })
                break
            }
            case spec.events['InterestRateUpdated'].topic: {
                let e = spec.events['InterestRateUpdated'].decode(log)
                ctx.store.PerpsMarketProxyEventInterestRateUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'InterestRateUpdated',
                    superMarketId: e[0].toString(),
                    interestRate: e[1].toString(),
                })
                break
            }
            case spec.events['OrderCommitted'].topic: {
                let e = spec.events['OrderCommitted'].decode(log)
                ctx.store.PerpsMarketProxyEventOrderCommitted.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OrderCommitted',
                    marketId: e[0].toString(),
                    accountId: e[1].toString(),
                    orderType: e[2],
                    sizeDelta: e[3].toString(),
                    acceptablePrice: e[4].toString(),
                    commitmentTime: e[5].toString(),
                    expectedPriceTime: e[6].toString(),
                    settlementTime: e[7].toString(),
                    expirationTime: e[8].toString(),
                    trackingCode: e[9],
                    sender: e[10],
                })
                break
            }
            case spec.events['PreviousOrderExpired'].topic: {
                let e = spec.events['PreviousOrderExpired'].decode(log)
                ctx.store.PerpsMarketProxyEventPreviousOrderExpired.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PreviousOrderExpired',
                    marketId: e[0].toString(),
                    accountId: e[1].toString(),
                    sizeDelta: e[2].toString(),
                    acceptablePrice: e[3].toString(),
                    commitmentTime: e[4].toString(),
                    trackingCode: e[5],
                })
                break
            }
            case spec.events['AccountCharged'].topic: {
                let e = spec.events['AccountCharged'].decode(log)
                ctx.store.PerpsMarketProxyEventAccountCharged.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AccountCharged',
                    accountId: e[0].toString(),
                    amount: e[1].toString(),
                    accountDebt: e[2].toString(),
                })
                break
            }
            case spec.events['InterestCharged'].topic: {
                let e = spec.events['InterestCharged'].decode(log)
                ctx.store.PerpsMarketProxyEventInterestCharged.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'InterestCharged',
                    accountId: e[0].toString(),
                    interest: e[1].toString(),
                })
                break
            }
            case spec.events['MarketUpdated'].topic: {
                let e = spec.events['MarketUpdated'].decode(log)
                ctx.store.PerpsMarketProxyEventMarketUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketUpdated',
                    marketId: e[0].toString(),
                    price: e[1].toString(),
                    skew: e[2].toString(),
                    size: e[3].toString(),
                    sizeDelta: e[4].toString(),
                    currentFundingRate: e[5].toString(),
                    currentFundingVelocity: e[6].toString(),
                    interestRate: e[7].toString(),
                })
                break
            }
            case spec.events['OrderSettled'].topic: {
                let e = spec.events['OrderSettled'].decode(log)
                ctx.store.PerpsMarketProxyEventOrderSettled.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OrderSettled',
                    marketId: e[0].toString(),
                    accountId: e[1].toString(),
                    fillPrice: e[2].toString(),
                    pnl: e[3].toString(),
                    accruedFunding: e[4].toString(),
                    sizeDelta: e[5].toString(),
                    newSize: e[6].toString(),
                    totalFees: e[7].toString(),
                    referralFees: e[8].toString(),
                    collectedFees: e[9].toString(),
                    settlementReward: e[10].toString(),
                    trackingCode: e[11],
                    settler: e[12],
                })
                break
            }
            case spec.events['OrderCancelled'].topic: {
                let e = spec.events['OrderCancelled'].decode(log)
                ctx.store.PerpsMarketProxyEventOrderCancelled.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OrderCancelled',
                    marketId: e[0].toString(),
                    accountId: e[1].toString(),
                    desiredPrice: e[2].toString(),
                    fillPrice: e[3].toString(),
                    sizeDelta: e[4].toString(),
                    settlementReward: e[5].toString(),
                    trackingCode: e[6],
                    settler: e[7],
                })
                break
            }
            case spec.events['FeatureFlagAllowAllSet'].topic: {
                let e = spec.events['FeatureFlagAllowAllSet'].decode(log)
                ctx.store.PerpsMarketProxyEventFeatureFlagAllowAllSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FeatureFlagAllowAllSet',
                    feature: e[0],
                    allowAll: e[1],
                })
                break
            }
            case spec.events['FeatureFlagAllowlistAdded'].topic: {
                let e = spec.events['FeatureFlagAllowlistAdded'].decode(log)
                ctx.store.PerpsMarketProxyEventFeatureFlagAllowlistAdded.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FeatureFlagAllowlistAdded',
                    feature: e[0],
                    account: e[1],
                })
                break
            }
            case spec.events['FeatureFlagAllowlistRemoved'].topic: {
                let e = spec.events['FeatureFlagAllowlistRemoved'].decode(log)
                ctx.store.PerpsMarketProxyEventFeatureFlagAllowlistRemoved.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FeatureFlagAllowlistRemoved',
                    feature: e[0],
                    account: e[1],
                })
                break
            }
            case spec.events['FeatureFlagDeniersReset'].topic: {
                let e = spec.events['FeatureFlagDeniersReset'].decode(log)
                ctx.store.PerpsMarketProxyEventFeatureFlagDeniersReset.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FeatureFlagDeniersReset',
                    feature: e[0],
                    deniers: toJSON(e[1]),
                })
                break
            }
            case spec.events['FeatureFlagDenyAllSet'].topic: {
                let e = spec.events['FeatureFlagDenyAllSet'].decode(log)
                ctx.store.PerpsMarketProxyEventFeatureFlagDenyAllSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FeatureFlagDenyAllSet',
                    feature: e[0],
                    denyAll: e[1],
                })
                break
            }
            case spec.events['AccountFlaggedForLiquidation'].topic: {
                let e = spec.events['AccountFlaggedForLiquidation'].decode(log)
                ctx.store.PerpsMarketProxyEventAccountFlaggedForLiquidation.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AccountFlaggedForLiquidation',
                    accountId: e[0].toString(),
                    availableMargin: e[1].toString(),
                    requiredMaintenanceMargin: e[2].toString(),
                    liquidationReward: e[3].toString(),
                    flagReward: e[4].toString(),
                })
                break
            }
            case spec.events['AccountLiquidationAttempt'].topic: {
                let e = spec.events['AccountLiquidationAttempt'].decode(log)
                ctx.store.PerpsMarketProxyEventAccountLiquidationAttempt.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AccountLiquidationAttempt',
                    accountId: e[0].toString(),
                    reward: e[1].toString(),
                    fullLiquidation: e[2],
                })
                break
            }
            case spec.events['AccountMarginLiquidation'].topic: {
                let e = spec.events['AccountMarginLiquidation'].decode(log)
                ctx.store.PerpsMarketProxyEventAccountMarginLiquidation.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AccountMarginLiquidation',
                    accountId: e[0].toString(),
                    seizedMarginValue: e[1].toString(),
                    liquidationReward: e[2].toString(),
                })
                break
            }
            case spec.events['PositionLiquidated'].topic: {
                let e = spec.events['PositionLiquidated'].decode(log)
                ctx.store.PerpsMarketProxyEventPositionLiquidated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PositionLiquidated',
                    accountId: e[0].toString(),
                    marketId: e[1].toString(),
                    amountLiquidated: e[2].toString(),
                    currentPositionSize: e[3].toString(),
                })
                break
            }
            case spec.events['FundingParametersSet'].topic: {
                let e = spec.events['FundingParametersSet'].decode(log)
                ctx.store.PerpsMarketProxyEventFundingParametersSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FundingParametersSet',
                    marketId: e[0].toString(),
                    skewScale: e[1].toString(),
                    maxFundingVelocity: e[2].toString(),
                })
                break
            }
            case spec.events['LiquidationParametersSet'].topic: {
                let e = spec.events['LiquidationParametersSet'].decode(log)
                ctx.store.PerpsMarketProxyEventLiquidationParametersSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'LiquidationParametersSet',
                    marketId: e[0].toString(),
                    initialMarginRatioD18: e[1].toString(),
                    maintenanceMarginRatioD18: e[2].toString(),
                    minimumInitialMarginRatioD18: e[3].toString(),
                    flagRewardRatioD18: e[4].toString(),
                    minimumPositionMargin: e[5].toString(),
                })
                break
            }
            case spec.events['LockedOiRatioSet'].topic: {
                let e = spec.events['LockedOiRatioSet'].decode(log)
                ctx.store.PerpsMarketProxyEventLockedOiRatioSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'LockedOiRatioSet',
                    marketId: e[0].toString(),
                    lockedOiRatioD18: e[1].toString(),
                })
                break
            }
            case spec.events['MarketPriceDataUpdated'].topic: {
                let e = spec.events['MarketPriceDataUpdated'].decode(log)
                ctx.store.PerpsMarketProxyEventMarketPriceDataUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketPriceDataUpdated',
                    marketId: e[0].toString(),
                    feedId: e[1],
                    strictStalenessTolerance: e[2].toString(),
                })
                break
            }
            case spec.events['MaxLiquidationParametersSet'].topic: {
                let e = spec.events['MaxLiquidationParametersSet'].decode(log)
                ctx.store.PerpsMarketProxyEventMaxLiquidationParametersSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MaxLiquidationParametersSet',
                    marketId: e[0].toString(),
                    maxLiquidationLimitAccumulationMultiplier: e[1].toString(),
                    maxSecondsInLiquidationWindow: e[2].toString(),
                    maxLiquidationPd: e[3].toString(),
                    endorsedLiquidator: e[4],
                })
                break
            }
            case spec.events['MaxMarketSizeSet'].topic: {
                let e = spec.events['MaxMarketSizeSet'].decode(log)
                ctx.store.PerpsMarketProxyEventMaxMarketSizeSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MaxMarketSizeSet',
                    marketId: e[0].toString(),
                    maxMarketSize: e[1].toString(),
                })
                break
            }
            case spec.events['MaxMarketValueSet'].topic: {
                let e = spec.events['MaxMarketValueSet'].decode(log)
                ctx.store.PerpsMarketProxyEventMaxMarketValueSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MaxMarketValueSet',
                    marketId: e[0].toString(),
                    maxMarketValue: e[1].toString(),
                })
                break
            }
            case spec.events['OrderFeesSet'].topic: {
                let e = spec.events['OrderFeesSet'].decode(log)
                ctx.store.PerpsMarketProxyEventOrderFeesSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OrderFeesSet',
                    marketId: e[0].toString(),
                    makerFeeRatio: e[1].toString(),
                    takerFeeRatio: e[2].toString(),
                })
                break
            }
            case spec.events['SettlementStrategyAdded'].topic: {
                let e = spec.events['SettlementStrategyAdded'].decode(log)
                ctx.store.PerpsMarketProxyEventSettlementStrategyAdded.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SettlementStrategyAdded',
                    marketId: e[0].toString(),
                    strategy: toJSON(e[1]),
                    strategyId: e[2].toString(),
                })
                break
            }
            case spec.events['SettlementStrategySet'].topic: {
                let e = spec.events['SettlementStrategySet'].decode(log)
                ctx.store.PerpsMarketProxyEventSettlementStrategySet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SettlementStrategySet',
                    marketId: e[0].toString(),
                    strategyId: e[1].toString(),
                    strategy: toJSON(e[2]),
                })
                break
            }
            case spec.events['CollateralConfigurationSet'].topic: {
                let e = spec.events['CollateralConfigurationSet'].decode(log)
                ctx.store.PerpsMarketProxyEventCollateralConfigurationSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'CollateralConfigurationSet',
                    collateralId: e[0].toString(),
                    maxCollateralAmount: e[1].toString(),
                    upperLimitDiscount: e[2].toString(),
                    lowerLimitDiscount: e[3].toString(),
                    discountScalar: e[4].toString(),
                })
                break
            }
            case spec.events['CollateralLiquidateRewardRatioSet'].topic: {
                let e = spec.events['CollateralLiquidateRewardRatioSet'].decode(log)
                ctx.store.PerpsMarketProxyEventCollateralLiquidateRewardRatioSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'CollateralLiquidateRewardRatioSet',
                    collateralLiquidateRewardRatioD18: e[0].toString(),
                })
                break
            }
            case spec.events['RewardDistributorRegistered'].topic: {
                let e = spec.events['RewardDistributorRegistered'].decode(log)
                ctx.store.PerpsMarketProxyEventRewardDistributorRegistered.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'RewardDistributorRegistered',
                    distributor: e[0],
                })
                break
            }
            case spec.events['FeeCollectorSet'].topic: {
                let e = spec.events['FeeCollectorSet'].decode(log)
                ctx.store.PerpsMarketProxyEventFeeCollectorSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FeeCollectorSet',
                    feeCollector: e[0],
                })
                break
            }
            case spec.events['InterestRateParametersSet'].topic: {
                let e = spec.events['InterestRateParametersSet'].decode(log)
                ctx.store.PerpsMarketProxyEventInterestRateParametersSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'InterestRateParametersSet',
                    lowUtilizationInterestRateGradient: e[0].toString(),
                    interestRateGradientBreakpoint: e[1].toString(),
                    highUtilizationInterestRateGradient: e[2].toString(),
                })
                break
            }
            case spec.events['KeeperCostNodeIdUpdated'].topic: {
                let e = spec.events['KeeperCostNodeIdUpdated'].decode(log)
                ctx.store.PerpsMarketProxyEventKeeperCostNodeIdUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'KeeperCostNodeIdUpdated',
                    keeperCostNodeId: e[0],
                })
                break
            }
            case spec.events['KeeperRewardGuardsSet'].topic: {
                let e = spec.events['KeeperRewardGuardsSet'].decode(log)
                ctx.store.PerpsMarketProxyEventKeeperRewardGuardsSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'KeeperRewardGuardsSet',
                    minKeeperRewardUsd: e[0].toString(),
                    minKeeperProfitRatioD18: e[1].toString(),
                    maxKeeperRewardUsd: e[2].toString(),
                    maxKeeperScalingRatioD18: e[3].toString(),
                })
                break
            }
            case spec.events['PerAccountCapsSet'].topic: {
                let e = spec.events['PerAccountCapsSet'].decode(log)
                ctx.store.PerpsMarketProxyEventPerAccountCapsSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PerAccountCapsSet',
                    maxPositionsPerAccount: e[0].toString(),
                    maxCollateralsPerAccount: e[1].toString(),
                })
                break
            }
            case spec.events['ReferrerShareUpdated'].topic: {
                let e = spec.events['ReferrerShareUpdated'].decode(log)
                ctx.store.PerpsMarketProxyEventReferrerShareUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'ReferrerShareUpdated',
                    referrer: e[0],
                    shareRatioD18: e[1].toString(),
                })
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        switch (transaction.input.slice(0, 10)) {
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
