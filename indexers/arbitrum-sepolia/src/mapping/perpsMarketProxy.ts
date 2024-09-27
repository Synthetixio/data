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
                    accountId: e[0],
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
                    accountId: e[0],
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
                    accountId: e[0],
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
                    globalPerpsMarketId: e[0],
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
                    perpsMarketId: e[0],
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
                    accountId: e[0],
                    collateralId: e[1],
                    amountDelta: e[2],
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
                    accountId: e[0],
                    amount: e[1],
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
                    superMarketId: e[0],
                    interestRate: e[1],
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
                    marketId: e[0],
                    accountId: e[1],
                    orderType: e[2],
                    sizeDelta: e[3],
                    acceptablePrice: e[4],
                    commitmentTime: e[5],
                    expectedPriceTime: e[6],
                    settlementTime: e[7],
                    expirationTime: e[8],
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
                    marketId: e[0],
                    accountId: e[1],
                    sizeDelta: e[2],
                    acceptablePrice: e[3],
                    commitmentTime: e[4],
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
                    accountId: e[0],
                    amount: e[1],
                    accountDebt: e[2],
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
                    accountId: e[0],
                    interest: e[1],
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
                    marketId: e[0],
                    price: e[1],
                    skew: e[2],
                    size: e[3],
                    sizeDelta: e[4],
                    currentFundingRate: e[5],
                    currentFundingVelocity: e[6],
                    interestRate: e[7],
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
                    marketId: e[0],
                    accountId: e[1],
                    fillPrice: e[2],
                    pnl: e[3],
                    accruedFunding: e[4],
                    sizeDelta: e[5],
                    newSize: e[6],
                    totalFees: e[7],
                    referralFees: e[8],
                    collectedFees: e[9],
                    settlementReward: e[10],
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
                    marketId: e[0],
                    accountId: e[1],
                    desiredPrice: e[2],
                    fillPrice: e[3],
                    sizeDelta: e[4],
                    settlementReward: e[5],
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
                    accountId: e[0],
                    availableMargin: e[1],
                    requiredMaintenanceMargin: e[2],
                    liquidationReward: e[3],
                    flagReward: e[4],
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
                    accountId: e[0],
                    reward: e[1],
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
                    accountId: e[0],
                    seizedMarginValue: e[1],
                    liquidationReward: e[2],
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
                    accountId: e[0],
                    marketId: e[1],
                    amountLiquidated: e[2],
                    currentPositionSize: e[3],
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
                    marketId: e[0],
                    skewScale: e[1],
                    maxFundingVelocity: e[2],
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
                    marketId: e[0],
                    initialMarginRatioD18: e[1],
                    maintenanceMarginRatioD18: e[2],
                    minimumInitialMarginRatioD18: e[3],
                    flagRewardRatioD18: e[4],
                    minimumPositionMargin: e[5],
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
                    marketId: e[0],
                    lockedOiRatioD18: e[1],
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
                    marketId: e[0],
                    feedId: e[1],
                    strictStalenessTolerance: e[2],
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
                    marketId: e[0],
                    maxLiquidationLimitAccumulationMultiplier: e[1],
                    maxSecondsInLiquidationWindow: e[2],
                    maxLiquidationPd: e[3],
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
                    marketId: e[0],
                    maxMarketSize: e[1],
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
                    marketId: e[0],
                    maxMarketValue: e[1],
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
                    marketId: e[0],
                    makerFeeRatio: e[1],
                    takerFeeRatio: e[2],
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
                    marketId: e[0],
                    strategy: toJSON(e[1]),
                    strategyId: e[2],
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
                    marketId: e[0],
                    strategyId: e[1],
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
                    collateralId: e[0],
                    maxCollateralAmount: e[1],
                    upperLimitDiscount: e[2],
                    lowerLimitDiscount: e[3],
                    discountScalar: e[4],
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
                    collateralLiquidateRewardRatioD18: e[0],
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
                    lowUtilizationInterestRateGradient: e[0],
                    interestRateGradientBreakpoint: e[1],
                    highUtilizationInterestRateGradient: e[2],
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
                    minKeeperRewardUsd: e[0],
                    minKeeperProfitRatioD18: e[1],
                    maxKeeperRewardUsd: e[2],
                    maxKeeperScalingRatioD18: e[3],
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
                    maxPositionsPerAccount: e[0],
                    maxCollateralsPerAccount: e[1],
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
                    shareRatioD18: e[1],
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
