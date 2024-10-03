import {DataHandlerContext} from '@subsquid/evm-processor'
import {toJSON} from '@subsquid/util-internal-json'
import {Store} from '../db'
import * as spec from '../abi/CoreProxy'
import {Log, Transaction} from '../processor'

const address = '0x76490713314fcec173f44e99346f54c6e92a8e42'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['OwnerChanged'].topic: {
                let e = spec.events['OwnerChanged'].decode(log)
                ctx.store.CoreProxyEventOwnerChanged.write({
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
                ctx.store.CoreProxyEventOwnerNominated.write({
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
                ctx.store.CoreProxyEventUpgraded.write({
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
            case spec.events['FeatureFlagAllowAllSet'].topic: {
                let e = spec.events['FeatureFlagAllowAllSet'].decode(log)
                ctx.store.CoreProxyEventFeatureFlagAllowAllSet.write({
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
                ctx.store.CoreProxyEventFeatureFlagAllowlistAdded.write({
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
                ctx.store.CoreProxyEventFeatureFlagAllowlistRemoved.write({
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
                ctx.store.CoreProxyEventFeatureFlagDeniersReset.write({
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
                ctx.store.CoreProxyEventFeatureFlagDenyAllSet.write({
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
            case spec.events['AccountCreated'].topic: {
                let e = spec.events['AccountCreated'].decode(log)
                ctx.store.CoreProxyEventAccountCreated.write({
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
                ctx.store.CoreProxyEventPermissionGranted.write({
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
                ctx.store.CoreProxyEventPermissionRevoked.write({
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
            case spec.events['DebtAssociated'].topic: {
                let e = spec.events['DebtAssociated'].decode(log)
                ctx.store.CoreProxyEventDebtAssociated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'DebtAssociated',
                    marketId: e[0].toString(),
                    poolId: e[1].toString(),
                    collateralType: e[2],
                    accountId: e[3].toString(),
                    amount: e[4].toString(),
                    updatedDebt: e[5].toString(),
                })
                break
            }
            case spec.events['AssociatedSystemSet'].topic: {
                let e = spec.events['AssociatedSystemSet'].decode(log)
                ctx.store.CoreProxyEventAssociatedSystemSet.write({
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
            case spec.events['CollateralLockCreated'].topic: {
                let e = spec.events['CollateralLockCreated'].decode(log)
                ctx.store.CoreProxyEventCollateralLockCreated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'CollateralLockCreated',
                    accountId: e[0].toString(),
                    collateralType: e[1],
                    tokenAmount: e[2].toString(),
                    expireTimestamp: e[3].toString(),
                })
                break
            }
            case spec.events['CollateralLockExpired'].topic: {
                let e = spec.events['CollateralLockExpired'].decode(log)
                ctx.store.CoreProxyEventCollateralLockExpired.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'CollateralLockExpired',
                    accountId: e[0].toString(),
                    collateralType: e[1],
                    tokenAmount: e[2].toString(),
                    expireTimestamp: e[3].toString(),
                })
                break
            }
            case spec.events['Deposited'].topic: {
                let e = spec.events['Deposited'].decode(log)
                ctx.store.CoreProxyEventDeposited.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'Deposited',
                    accountId: e[0].toString(),
                    collateralType: e[1],
                    tokenAmount: e[2].toString(),
                    sender: e[3],
                })
                break
            }
            case spec.events['Withdrawn'].topic: {
                let e = spec.events['Withdrawn'].decode(log)
                ctx.store.CoreProxyEventWithdrawn.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'Withdrawn',
                    accountId: e[0].toString(),
                    collateralType: e[1],
                    tokenAmount: e[2].toString(),
                    sender: e[3],
                })
                break
            }
            case spec.events['CollateralConfigured'].topic: {
                let e = spec.events['CollateralConfigured'].decode(log)
                ctx.store.CoreProxyEventCollateralConfigured.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'CollateralConfigured',
                    collateralType: e[0],
                    config: toJSON(e[1]),
                })
                break
            }
            case spec.events['TransferCrossChainInitiated'].topic: {
                let e = spec.events['TransferCrossChainInitiated'].decode(log)
                ctx.store.CoreProxyEventTransferCrossChainInitiated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'TransferCrossChainInitiated',
                    destChainId: e[0].toString(),
                    amount: e[1].toString(),
                    sender: e[2],
                })
                break
            }
            case spec.events['IssuanceFeePaid'].topic: {
                let e = spec.events['IssuanceFeePaid'].decode(log)
                ctx.store.CoreProxyEventIssuanceFeePaid.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'IssuanceFeePaid',
                    accountId: e[0].toString(),
                    poolId: e[1].toString(),
                    collateralType: e[2],
                    feeAmount: e[3].toString(),
                })
                break
            }
            case spec.events['UsdBurned'].topic: {
                let e = spec.events['UsdBurned'].decode(log)
                ctx.store.CoreProxyEventUsdBurned.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'UsdBurned',
                    accountId: e[0].toString(),
                    poolId: e[1].toString(),
                    collateralType: e[2],
                    amount: e[3].toString(),
                    sender: e[4],
                })
                break
            }
            case spec.events['UsdMinted'].topic: {
                let e = spec.events['UsdMinted'].decode(log)
                ctx.store.CoreProxyEventUsdMinted.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'UsdMinted',
                    accountId: e[0].toString(),
                    poolId: e[1].toString(),
                    collateralType: e[2],
                    amount: e[3].toString(),
                    sender: e[4],
                })
                break
            }
            case spec.events['Liquidation'].topic: {
                let e = spec.events['Liquidation'].decode(log)
                ctx.store.CoreProxyEventLiquidation.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'Liquidation',
                    accountId: e[0].toString(),
                    poolId: e[1].toString(),
                    collateralType: e[2],
                    liquidationData: toJSON(e[3]),
                    liquidateAsAccountId: e[4].toString(),
                    sender: e[5],
                })
                break
            }
            case spec.events['VaultLiquidation'].topic: {
                let e = spec.events['VaultLiquidation'].decode(log)
                ctx.store.CoreProxyEventVaultLiquidation.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'VaultLiquidation',
                    poolId: e[0].toString(),
                    collateralType: e[1],
                    liquidationData: toJSON(e[2]),
                    liquidateAsAccountId: e[3].toString(),
                    sender: e[4],
                })
                break
            }
            case spec.events['MarketCollateralDeposited'].topic: {
                let e = spec.events['MarketCollateralDeposited'].decode(log)
                ctx.store.CoreProxyEventMarketCollateralDeposited.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketCollateralDeposited',
                    marketId: e[0].toString(),
                    collateralType: e[1],
                    tokenAmount: e[2].toString(),
                    sender: e[3],
                    creditCapacity: e[4].toString(),
                    netIssuance: e[5].toString(),
                    depositedCollateralValue: e[6].toString(),
                    reportedDebt: e[7].toString(),
                })
                break
            }
            case spec.events['MarketCollateralWithdrawn'].topic: {
                let e = spec.events['MarketCollateralWithdrawn'].decode(log)
                ctx.store.CoreProxyEventMarketCollateralWithdrawn.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketCollateralWithdrawn',
                    marketId: e[0].toString(),
                    collateralType: e[1],
                    tokenAmount: e[2].toString(),
                    sender: e[3],
                    creditCapacity: e[4].toString(),
                    netIssuance: e[5].toString(),
                    depositedCollateralValue: e[6].toString(),
                    reportedDebt: e[7].toString(),
                })
                break
            }
            case spec.events['MaximumMarketCollateralConfigured'].topic: {
                let e = spec.events['MaximumMarketCollateralConfigured'].decode(log)
                ctx.store.CoreProxyEventMaximumMarketCollateralConfigured.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MaximumMarketCollateralConfigured',
                    marketId: e[0].toString(),
                    collateralType: e[1],
                    systemAmount: e[2].toString(),
                    owner: e[3],
                })
                break
            }
            case spec.events['MarketRegistered'].topic: {
                let e = spec.events['MarketRegistered'].decode(log)
                ctx.store.CoreProxyEventMarketRegistered.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketRegistered',
                    market: e[0],
                    marketId: e[1].toString(),
                    sender: e[2],
                })
                break
            }
            case spec.events['MarketSystemFeePaid'].topic: {
                let e = spec.events['MarketSystemFeePaid'].decode(log)
                ctx.store.CoreProxyEventMarketSystemFeePaid.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketSystemFeePaid',
                    marketId: e[0].toString(),
                    feeAmount: e[1].toString(),
                })
                break
            }
            case spec.events['MarketUsdDeposited'].topic: {
                let e = spec.events['MarketUsdDeposited'].decode(log)
                ctx.store.CoreProxyEventMarketUsdDeposited.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketUsdDeposited',
                    marketId: e[0].toString(),
                    target: e[1],
                    amount: e[2].toString(),
                    market: e[3],
                    creditCapacity: e[4].toString(),
                    netIssuance: e[5].toString(),
                    depositedCollateralValue: e[6].toString(),
                })
                break
            }
            case spec.events['MarketUsdWithdrawn'].topic: {
                let e = spec.events['MarketUsdWithdrawn'].decode(log)
                ctx.store.CoreProxyEventMarketUsdWithdrawn.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'MarketUsdWithdrawn',
                    marketId: e[0].toString(),
                    target: e[1],
                    amount: e[2].toString(),
                    market: e[3],
                    creditCapacity: e[4].toString(),
                    netIssuance: e[5].toString(),
                    depositedCollateralValue: e[6].toString(),
                })
                break
            }
            case spec.events['SetMarketMinLiquidityRatio'].topic: {
                let e = spec.events['SetMarketMinLiquidityRatio'].decode(log)
                ctx.store.CoreProxyEventSetMarketMinLiquidityRatio.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SetMarketMinLiquidityRatio',
                    marketId: e[0].toString(),
                    minLiquidityRatio: e[1].toString(),
                })
                break
            }
            case spec.events['SetMinDelegateTime'].topic: {
                let e = spec.events['SetMinDelegateTime'].decode(log)
                ctx.store.CoreProxyEventSetMinDelegateTime.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SetMinDelegateTime',
                    marketId: e[0].toString(),
                    minDelegateTime: e[1],
                })
                break
            }
            case spec.events['PoolApprovedAdded'].topic: {
                let e = spec.events['PoolApprovedAdded'].decode(log)
                ctx.store.CoreProxyEventPoolApprovedAdded.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolApprovedAdded',
                    poolId: e[0].toString(),
                })
                break
            }
            case spec.events['PoolApprovedRemoved'].topic: {
                let e = spec.events['PoolApprovedRemoved'].decode(log)
                ctx.store.CoreProxyEventPoolApprovedRemoved.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolApprovedRemoved',
                    poolId: e[0].toString(),
                })
                break
            }
            case spec.events['PreferredPoolSet'].topic: {
                let e = spec.events['PreferredPoolSet'].decode(log)
                ctx.store.CoreProxyEventPreferredPoolSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PreferredPoolSet',
                    poolId: e[0].toString(),
                })
                break
            }
            case spec.events['PoolCollateralConfigurationUpdated'].topic: {
                let e = spec.events['PoolCollateralConfigurationUpdated'].decode(log)
                ctx.store.CoreProxyEventPoolCollateralConfigurationUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolCollateralConfigurationUpdated',
                    poolId: e[0].toString(),
                    collateralType: e[1],
                    config: toJSON(e[2]),
                })
                break
            }
            case spec.events['PoolCollateralDisabledByDefaultSet'].topic: {
                let e = spec.events['PoolCollateralDisabledByDefaultSet'].decode(log)
                ctx.store.CoreProxyEventPoolCollateralDisabledByDefaultSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolCollateralDisabledByDefaultSet',
                    poolId: e[0].toString(),
                    disabled: e[1],
                })
                break
            }
            case spec.events['PoolConfigurationSet'].topic: {
                let e = spec.events['PoolConfigurationSet'].decode(log)
                ctx.store.CoreProxyEventPoolConfigurationSet.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolConfigurationSet',
                    poolId: e[0].toString(),
                    markets: toJSON(e[1]),
                    sender: e[2],
                })
                break
            }
            case spec.events['PoolCreated'].topic: {
                let e = spec.events['PoolCreated'].decode(log)
                ctx.store.CoreProxyEventPoolCreated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolCreated',
                    poolId: e[0].toString(),
                    owner: e[1],
                    sender: e[2],
                })
                break
            }
            case spec.events['PoolNameUpdated'].topic: {
                let e = spec.events['PoolNameUpdated'].decode(log)
                ctx.store.CoreProxyEventPoolNameUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolNameUpdated',
                    poolId: e[0].toString(),
                    name: e[1],
                    sender: e[2],
                })
                break
            }
            case spec.events['PoolNominationRenounced'].topic: {
                let e = spec.events['PoolNominationRenounced'].decode(log)
                ctx.store.CoreProxyEventPoolNominationRenounced.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolNominationRenounced',
                    poolId: e[0].toString(),
                    owner: e[1],
                })
                break
            }
            case spec.events['PoolNominationRevoked'].topic: {
                let e = spec.events['PoolNominationRevoked'].decode(log)
                ctx.store.CoreProxyEventPoolNominationRevoked.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolNominationRevoked',
                    poolId: e[0].toString(),
                    owner: e[1],
                })
                break
            }
            case spec.events['PoolOwnerNominated'].topic: {
                let e = spec.events['PoolOwnerNominated'].decode(log)
                ctx.store.CoreProxyEventPoolOwnerNominated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolOwnerNominated',
                    poolId: e[0].toString(),
                    nominatedOwner: e[1],
                    owner: e[2],
                })
                break
            }
            case spec.events['PoolOwnershipAccepted'].topic: {
                let e = spec.events['PoolOwnershipAccepted'].decode(log)
                ctx.store.CoreProxyEventPoolOwnershipAccepted.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolOwnershipAccepted',
                    poolId: e[0].toString(),
                    owner: e[1],
                })
                break
            }
            case spec.events['PoolOwnershipRenounced'].topic: {
                let e = spec.events['PoolOwnershipRenounced'].decode(log)
                ctx.store.CoreProxyEventPoolOwnershipRenounced.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'PoolOwnershipRenounced',
                    poolId: e[0].toString(),
                    owner: e[1],
                })
                break
            }
            case spec.events['SetMinLiquidityRatio'].topic: {
                let e = spec.events['SetMinLiquidityRatio'].decode(log)
                ctx.store.CoreProxyEventSetMinLiquidityRatio.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'SetMinLiquidityRatio',
                    minLiquidityRatio: e[0].toString(),
                })
                break
            }
            case spec.events['RewardsClaimed'].topic: {
                let e = spec.events['RewardsClaimed'].decode(log)
                ctx.store.CoreProxyEventRewardsClaimed.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'RewardsClaimed',
                    accountId: e[0].toString(),
                    poolId: e[1].toString(),
                    collateralType: e[2],
                    distributor: e[3],
                    amount: e[4].toString(),
                })
                break
            }
            case spec.events['RewardsDistributed'].topic: {
                let e = spec.events['RewardsDistributed'].decode(log)
                ctx.store.CoreProxyEventRewardsDistributed.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'RewardsDistributed',
                    poolId: e[0].toString(),
                    collateralType: e[1],
                    distributor: e[2],
                    amount: e[3].toString(),
                    start: e[4].toString(),
                    duration: e[5].toString(),
                })
                break
            }
            case spec.events['RewardsDistributorRegistered'].topic: {
                let e = spec.events['RewardsDistributorRegistered'].decode(log)
                ctx.store.CoreProxyEventRewardsDistributorRegistered.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'RewardsDistributorRegistered',
                    poolId: e[0].toString(),
                    collateralType: e[1],
                    distributor: e[2],
                })
                break
            }
            case spec.events['RewardsDistributorRemoved'].topic: {
                let e = spec.events['RewardsDistributorRemoved'].decode(log)
                ctx.store.CoreProxyEventRewardsDistributorRemoved.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'RewardsDistributorRemoved',
                    poolId: e[0].toString(),
                    collateralType: e[1],
                    distributor: e[2],
                })
                break
            }
            case spec.events['NewSupportedCrossChainNetwork'].topic: {
                let e = spec.events['NewSupportedCrossChainNetwork'].decode(log)
                ctx.store.CoreProxyEventNewSupportedCrossChainNetwork.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'NewSupportedCrossChainNetwork',
                    newChainId: e[0].toString(),
                })
                break
            }
            case spec.events['DelegationUpdated'].topic: {
                let e = spec.events['DelegationUpdated'].decode(log)
                ctx.store.CoreProxyEventDelegationUpdated.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'DelegationUpdated',
                    accountId: e[0].toString(),
                    poolId: e[1].toString(),
                    collateralType: e[2],
                    amount: e[3].toString(),
                    leverage: e[4].toString(),
                    sender: e[5],
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
