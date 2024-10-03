import {DataHandlerContext} from '@subsquid/evm-processor'
import {toJSON} from '@subsquid/util-internal-json'
import {Store} from '../db'
import * as spec from '../abi/SpotMarketProxy'
import {Log, Transaction} from '../processor'

const address = '0x93d645c42a0ca3e08e9552367b8c454765fff041'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['OwnerChanged'].topic: {
                let e = spec.events['OwnerChanged'].decode(log)
                ctx.store.SpotMarketProxyEventOwnerChanged.write({
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
                ctx.store.SpotMarketProxyEventOwnerNominated.write({
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
                ctx.store.SpotMarketProxyEventUpgraded.write({
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
            case spec.events['AssociatedSystemSet'].topic: {
                let e = spec.events['AssociatedSystemSet'].decode(log)
                ctx.store.SpotMarketProxyEventAssociatedSystemSet.write({
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
            case spec.events['DecayRateUpdated'].topic: {
                let e = spec.events['DecayRateUpdated'].decode(log)
                ctx.store.SpotMarketProxyEventDecayRateUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'DecayRateUpdated',
                    marketId: e[0].toString(),
                    rate: e[1].toString(),
                })
                break
            }
            case spec.events['MarketNominationRenounced'].topic: {
                let e = spec.events['MarketNominationRenounced'].decode(log)
                ctx.store.SpotMarketProxyEventMarketNominationRenounced.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketNominationRenounced',
                    marketId: e[0].toString(),
                    nominee: e[1],
                })
                break
            }
            case spec.events['MarketOwnerChanged'].topic: {
                let e = spec.events['MarketOwnerChanged'].decode(log)
                ctx.store.SpotMarketProxyEventMarketOwnerChanged.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketOwnerChanged',
                    marketId: e[0].toString(),
                    oldOwner: e[1],
                    newOwner: e[2],
                })
                break
            }
            case spec.events['MarketOwnerNominated'].topic: {
                let e = spec.events['MarketOwnerNominated'].decode(log)
                ctx.store.SpotMarketProxyEventMarketOwnerNominated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketOwnerNominated',
                    marketId: e[0].toString(),
                    newOwner: e[1],
                })
                break
            }
            case spec.events['SynthImplementationSet'].topic: {
                let e = spec.events['SynthImplementationSet'].decode(log)
                ctx.store.SpotMarketProxyEventSynthImplementationSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthImplementationSet',
                    synthImplementation: e[0],
                })
                break
            }
            case spec.events['SynthImplementationUpgraded'].topic: {
                let e = spec.events['SynthImplementationUpgraded'].decode(log)
                ctx.store.SpotMarketProxyEventSynthImplementationUpgraded.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthImplementationUpgraded',
                    synthMarketId: e[0].toString(),
                    proxy: e[1],
                    implementation: e[2],
                })
                break
            }
            case spec.events['SynthPriceDataUpdated'].topic: {
                let e = spec.events['SynthPriceDataUpdated'].decode(log)
                ctx.store.SpotMarketProxyEventSynthPriceDataUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthPriceDataUpdated',
                    synthMarketId: e[0].toString(),
                    buyFeedId: e[1],
                    sellFeedId: e[2],
                    strictStalenessTolerance: e[3].toString(),
                })
                break
            }
            case spec.events['SynthRegistered'].topic: {
                let e = spec.events['SynthRegistered'].decode(log)
                ctx.store.SpotMarketProxyEventSynthRegistered.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthRegistered',
                    synthMarketId: e[0].toString(),
                    synthTokenAddress: e[1],
                })
                break
            }
            case spec.events['SynthetixSystemSet'].topic: {
                let e = spec.events['SynthetixSystemSet'].decode(log)
                ctx.store.SpotMarketProxyEventSynthetixSystemSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthetixSystemSet',
                    synthetix: e[0],
                    usdTokenAddress: e[1],
                    oracleManager: e[2],
                })
                break
            }
            case spec.events['SynthBought'].topic: {
                let e = spec.events['SynthBought'].decode(log)
                ctx.store.SpotMarketProxyEventSynthBought.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthBought',
                    synthMarketId: e[0].toString(),
                    synthReturned: e[1].toString(),
                    fees: toJSON(e[2]),
                    collectedFees: e[3].toString(),
                    referrer: e[4],
                    price: e[5].toString(),
                })
                break
            }
            case spec.events['SynthSold'].topic: {
                let e = spec.events['SynthSold'].decode(log)
                ctx.store.SpotMarketProxyEventSynthSold.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthSold',
                    synthMarketId: e[0].toString(),
                    amountReturned: e[1].toString(),
                    fees: toJSON(e[2]),
                    collectedFees: e[3].toString(),
                    referrer: e[4],
                    price: e[5].toString(),
                })
                break
            }
            case spec.events['OrderCancelled'].topic: {
                let e = spec.events['OrderCancelled'].decode(log)
                ctx.store.SpotMarketProxyEventOrderCancelled.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OrderCancelled',
                    marketId: e[0].toString(),
                    asyncOrderId: e[1].toString(),
                    asyncOrderClaim: toJSON(e[2]),
                    sender: e[3],
                })
                break
            }
            case spec.events['OrderCommitted'].topic: {
                let e = spec.events['OrderCommitted'].decode(log)
                ctx.store.SpotMarketProxyEventOrderCommitted.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OrderCommitted',
                    marketId: e[0].toString(),
                    orderType: e[1],
                    amountProvided: e[2].toString(),
                    asyncOrderId: e[3].toString(),
                    sender: e[4],
                    referrer: e[5],
                })
                break
            }
            case spec.events['OrderSettled'].topic: {
                let e = spec.events['OrderSettled'].decode(log)
                ctx.store.SpotMarketProxyEventOrderSettled.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'OrderSettled',
                    marketId: e[0].toString(),
                    asyncOrderId: e[1].toString(),
                    finalOrderAmount: e[2].toString(),
                    fees: toJSON(e[3]),
                    collectedFees: e[4].toString(),
                    settler: e[5],
                    price: e[6].toString(),
                    orderType: e[7],
                })
                break
            }
            case spec.events['SettlementStrategyAdded'].topic: {
                let e = spec.events['SettlementStrategyAdded'].decode(log)
                ctx.store.SpotMarketProxyEventSettlementStrategyAdded.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SettlementStrategyAdded',
                    synthMarketId: e[0].toString(),
                    strategyId: e[1].toString(),
                })
                break
            }
            case spec.events['SettlementStrategySet'].topic: {
                let e = spec.events['SettlementStrategySet'].decode(log)
                ctx.store.SpotMarketProxyEventSettlementStrategySet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SettlementStrategySet',
                    synthMarketId: e[0].toString(),
                    strategyId: e[1].toString(),
                    strategy: toJSON(e[2]),
                })
                break
            }
            case spec.events['SynthUnwrapped'].topic: {
                let e = spec.events['SynthUnwrapped'].decode(log)
                ctx.store.SpotMarketProxyEventSynthUnwrapped.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthUnwrapped',
                    synthMarketId: e[0].toString(),
                    amountUnwrapped: e[1].toString(),
                    fees: toJSON(e[2]),
                    feesCollected: e[3].toString(),
                })
                break
            }
            case spec.events['SynthWrapped'].topic: {
                let e = spec.events['SynthWrapped'].decode(log)
                ctx.store.SpotMarketProxyEventSynthWrapped.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SynthWrapped',
                    synthMarketId: e[0].toString(),
                    amountWrapped: e[1].toString(),
                    fees: toJSON(e[2]),
                    feesCollected: e[3].toString(),
                })
                break
            }
            case spec.events['WrapperSet'].topic: {
                let e = spec.events['WrapperSet'].decode(log)
                ctx.store.SpotMarketProxyEventWrapperSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'WrapperSet',
                    synthMarketId: e[0].toString(),
                    wrapCollateralType: e[1],
                    maxWrappableAmount: e[2].toString(),
                })
                break
            }
            case spec.events['AsyncFixedFeeSet'].topic: {
                let e = spec.events['AsyncFixedFeeSet'].decode(log)
                ctx.store.SpotMarketProxyEventAsyncFixedFeeSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AsyncFixedFeeSet',
                    synthMarketId: e[0].toString(),
                    asyncFixedFee: e[1].toString(),
                })
                break
            }
            case spec.events['AtomicFixedFeeSet'].topic: {
                let e = spec.events['AtomicFixedFeeSet'].decode(log)
                ctx.store.SpotMarketProxyEventAtomicFixedFeeSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'AtomicFixedFeeSet',
                    synthMarketId: e[0].toString(),
                    atomicFixedFee: e[1].toString(),
                })
                break
            }
            case spec.events['CollateralLeverageSet'].topic: {
                let e = spec.events['CollateralLeverageSet'].decode(log)
                ctx.store.SpotMarketProxyEventCollateralLeverageSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'CollateralLeverageSet',
                    synthMarketId: e[0].toString(),
                    collateralLeverage: e[1].toString(),
                })
                break
            }
            case spec.events['FeeCollectorSet'].topic: {
                let e = spec.events['FeeCollectorSet'].decode(log)
                ctx.store.SpotMarketProxyEventFeeCollectorSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'FeeCollectorSet',
                    synthMarketId: e[0].toString(),
                    feeCollector: e[1],
                })
                break
            }
            case spec.events['MarketSkewScaleSet'].topic: {
                let e = spec.events['MarketSkewScaleSet'].decode(log)
                ctx.store.SpotMarketProxyEventMarketSkewScaleSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketSkewScaleSet',
                    synthMarketId: e[0].toString(),
                    skewScale: e[1].toString(),
                })
                break
            }
            case spec.events['MarketUtilizationFeesSet'].topic: {
                let e = spec.events['MarketUtilizationFeesSet'].decode(log)
                ctx.store.SpotMarketProxyEventMarketUtilizationFeesSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketUtilizationFeesSet',
                    synthMarketId: e[0].toString(),
                    utilizationFeeRate: e[1].toString(),
                })
                break
            }
            case spec.events['ReferrerShareUpdated'].topic: {
                let e = spec.events['ReferrerShareUpdated'].decode(log)
                ctx.store.SpotMarketProxyEventReferrerShareUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'ReferrerShareUpdated',
                    marketId: e[0].toString(),
                    referrer: e[1],
                    sharePercentage: e[2].toString(),
                })
                break
            }
            case spec.events['TransactorFixedFeeSet'].topic: {
                let e = spec.events['TransactorFixedFeeSet'].decode(log)
                ctx.store.SpotMarketProxyEventTransactorFixedFeeSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'TransactorFixedFeeSet',
                    synthMarketId: e[0].toString(),
                    transactor: e[1],
                    fixedFeeAmount: e[2].toString(),
                })
                break
            }
            case spec.events['WrapperFeesSet'].topic: {
                let e = spec.events['WrapperFeesSet'].decode(log)
                ctx.store.SpotMarketProxyEventWrapperFeesSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'WrapperFeesSet',
                    synthMarketId: e[0].toString(),
                    wrapFee: e[1].toString(),
                    unwrapFee: e[2].toString(),
                })
                break
            }
            case spec.events['FeatureFlagAllowAllSet'].topic: {
                let e = spec.events['FeatureFlagAllowAllSet'].decode(log)
                ctx.store.SpotMarketProxyEventFeatureFlagAllowAllSet.write({
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
                ctx.store.SpotMarketProxyEventFeatureFlagAllowlistAdded.write({
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
                ctx.store.SpotMarketProxyEventFeatureFlagAllowlistRemoved.write({
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
                ctx.store.SpotMarketProxyEventFeatureFlagDeniersReset.write({
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
                ctx.store.SpotMarketProxyEventFeatureFlagDenyAllSet.write({
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
