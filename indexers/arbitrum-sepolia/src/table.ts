import {Table, Types, Column} from '@subsquid/file-store-parquet'

export let Block = new Table(
    'block.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        number: Column(Types.Int64(), {nullable: false}),
        timestamp: Column(Types.Timestamp(), {nullable: false}),
    }
)

export let Transaction = new Table(
    'transaction.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: true}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        hash: Column(Types.String(), {nullable: false}),
        to: Column(Types.String(), {nullable: true}),
        from: Column(Types.String(), {nullable: true}),
        status: Column(Types.Int64(), {nullable: true}),
    }
)

export let CoreProxyEventOwnerChanged = new Table(
    'core_proxy_event_owner_changed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        oldOwner: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventOwnerNominated = new Table(
    'core_proxy_event_owner_nominated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventUpgraded = new Table(
    'core_proxy_event_upgraded.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        self: Column(Types.String(), {nullable: false}),
        implementation: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventFeatureFlagAllowAllSet = new Table(
    'core_proxy_event_feature_flag_allow_all_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        allowAll: Column(Types.Boolean(), {nullable: false}),
    }
)

export let CoreProxyEventFeatureFlagAllowlistAdded = new Table(
    'core_proxy_event_feature_flag_allowlist_added.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        account: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventFeatureFlagAllowlistRemoved = new Table(
    'core_proxy_event_feature_flag_allowlist_removed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        account: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventFeatureFlagDeniersReset = new Table(
    'core_proxy_event_feature_flag_deniers_reset.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        deniers: Column(Types.JSON(), {nullable: false}),
    }
)

export let CoreProxyEventFeatureFlagDenyAllSet = new Table(
    'core_proxy_event_feature_flag_deny_all_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        denyAll: Column(Types.Boolean(), {nullable: false}),
    }
)

export let CoreProxyEventAccountCreated = new Table(
    'core_proxy_event_account_created.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPermissionGranted = new Table(
    'core_proxy_event_permission_granted.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        permission: Column(Types.String(), {nullable: false}),
        user: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPermissionRevoked = new Table(
    'core_proxy_event_permission_revoked.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        permission: Column(Types.String(), {nullable: false}),
        user: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventDebtAssociated = new Table(
    'core_proxy_event_debt_associated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        updatedDebt: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventAssociatedSystemSet = new Table(
    'core_proxy_event_associated_system_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        kind: Column(Types.String(), {nullable: false}),
        id0: Column(Types.String(), {nullable: false}),
        proxy: Column(Types.String(), {nullable: false}),
        impl: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventCollateralLockCreated = new Table(
    'core_proxy_event_collateral_lock_created.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        tokenAmount: Column(Types.String(), {nullable: false}),
        expireTimestamp: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventCollateralLockExpired = new Table(
    'core_proxy_event_collateral_lock_expired.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        tokenAmount: Column(Types.String(), {nullable: false}),
        expireTimestamp: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventDeposited = new Table(
    'core_proxy_event_deposited.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        tokenAmount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventWithdrawn = new Table(
    'core_proxy_event_withdrawn.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        tokenAmount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventCollateralConfigured = new Table(
    'core_proxy_event_collateral_configured.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        config: Column(Types.JSON(), {nullable: false}),
    }
)

export let CoreProxyEventTransferCrossChainInitiated = new Table(
    'core_proxy_event_transfer_cross_chain_initiated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        destChainId: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventIssuanceFeePaid = new Table(
    'core_proxy_event_issuance_fee_paid.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        feeAmount: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventUsdBurned = new Table(
    'core_proxy_event_usd_burned.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventUsdMinted = new Table(
    'core_proxy_event_usd_minted.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventLiquidation = new Table(
    'core_proxy_event_liquidation.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        liquidationData: Column(Types.JSON(), {nullable: false}),
        liquidateAsAccountId: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventVaultLiquidation = new Table(
    'core_proxy_event_vault_liquidation.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        liquidationData: Column(Types.JSON(), {nullable: false}),
        liquidateAsAccountId: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventMarketCollateralDeposited = new Table(
    'core_proxy_event_market_collateral_deposited.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        tokenAmount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
        creditCapacity: Column(Types.String(), {nullable: false}),
        netIssuance: Column(Types.String(), {nullable: false}),
        depositedCollateralValue: Column(Types.String(), {nullable: false}),
        reportedDebt: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventMarketCollateralWithdrawn = new Table(
    'core_proxy_event_market_collateral_withdrawn.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        tokenAmount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
        creditCapacity: Column(Types.String(), {nullable: false}),
        netIssuance: Column(Types.String(), {nullable: false}),
        depositedCollateralValue: Column(Types.String(), {nullable: false}),
        reportedDebt: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventMaximumMarketCollateralConfigured = new Table(
    'core_proxy_event_maximum_market_collateral_configured.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        systemAmount: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventMarketRegistered = new Table(
    'core_proxy_event_market_registered.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        market: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventMarketSystemFeePaid = new Table(
    'core_proxy_event_market_system_fee_paid.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        feeAmount: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventMarketUsdDeposited = new Table(
    'core_proxy_event_market_usd_deposited.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        target: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        market: Column(Types.String(), {nullable: false}),
        creditCapacity: Column(Types.String(), {nullable: false}),
        netIssuance: Column(Types.String(), {nullable: false}),
        depositedCollateralValue: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventMarketUsdWithdrawn = new Table(
    'core_proxy_event_market_usd_withdrawn.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        target: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        market: Column(Types.String(), {nullable: false}),
        creditCapacity: Column(Types.String(), {nullable: false}),
        netIssuance: Column(Types.String(), {nullable: false}),
        depositedCollateralValue: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventSetMarketMinLiquidityRatio = new Table(
    'core_proxy_event_set_market_min_liquidity_ratio.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        minLiquidityRatio: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventSetMinDelegateTime = new Table(
    'core_proxy_event_set_min_delegate_time.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        minDelegateTime: Column(Types.Int64(), {nullable: false}),
    }
)

export let CoreProxyEventPoolApprovedAdded = new Table(
    'core_proxy_event_pool_approved_added.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolApprovedRemoved = new Table(
    'core_proxy_event_pool_approved_removed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPreferredPoolSet = new Table(
    'core_proxy_event_preferred_pool_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolCollateralConfigurationUpdated = new Table(
    'core_proxy_event_pool_collateral_configuration_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        config: Column(Types.JSON(), {nullable: false}),
    }
)

export let CoreProxyEventPoolCollateralDisabledByDefaultSet = new Table(
    'core_proxy_event_pool_collateral_disabled_by_default_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        disabled: Column(Types.Boolean(), {nullable: false}),
    }
)

export let CoreProxyEventPoolConfigurationSet = new Table(
    'core_proxy_event_pool_configuration_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        markets: Column(Types.JSON(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolCreated = new Table(
    'core_proxy_event_pool_created.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolNameUpdated = new Table(
    'core_proxy_event_pool_name_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        name: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolNominationRenounced = new Table(
    'core_proxy_event_pool_nomination_renounced.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolNominationRevoked = new Table(
    'core_proxy_event_pool_nomination_revoked.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolOwnerNominated = new Table(
    'core_proxy_event_pool_owner_nominated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        nominatedOwner: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolOwnershipAccepted = new Table(
    'core_proxy_event_pool_ownership_accepted.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventPoolOwnershipRenounced = new Table(
    'core_proxy_event_pool_ownership_renounced.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventSetMinLiquidityRatio = new Table(
    'core_proxy_event_set_min_liquidity_ratio.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        minLiquidityRatio: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventRewardsClaimed = new Table(
    'core_proxy_event_rewards_claimed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        distributor: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventRewardsDistributed = new Table(
    'core_proxy_event_rewards_distributed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        distributor: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        start: Column(Types.String(), {nullable: false}),
        duration: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventRewardsDistributorRegistered = new Table(
    'core_proxy_event_rewards_distributor_registered.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        distributor: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventRewardsDistributorRemoved = new Table(
    'core_proxy_event_rewards_distributor_removed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        distributor: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventNewSupportedCrossChainNetwork = new Table(
    'core_proxy_event_new_supported_cross_chain_network.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        newChainId: Column(Types.String(), {nullable: false}),
    }
)

export let CoreProxyEventDelegationUpdated = new Table(
    'core_proxy_event_delegation_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        poolId: Column(Types.String(), {nullable: false}),
        collateralType: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        leverage: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let AccountProxyEventOwnerChanged = new Table(
    'account_proxy_event_owner_changed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        oldOwner: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let AccountProxyEventOwnerNominated = new Table(
    'account_proxy_event_owner_nominated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let AccountProxyEventUpgraded = new Table(
    'account_proxy_event_upgraded.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        self: Column(Types.String(), {nullable: false}),
        implementation: Column(Types.String(), {nullable: false}),
    }
)

export let AccountProxyEventApproval = new Table(
    'account_proxy_event_approval.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
        approved: Column(Types.String(), {nullable: false}),
        tokenId: Column(Types.String(), {nullable: false}),
    }
)

export let AccountProxyEventApprovalForAll = new Table(
    'account_proxy_event_approval_for_all.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
        operator: Column(Types.String(), {nullable: false}),
        approved: Column(Types.Boolean(), {nullable: false}),
    }
)

export let AccountProxyEventTransfer = new Table(
    'account_proxy_event_transfer.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        from: Column(Types.String(), {nullable: false}),
        to: Column(Types.String(), {nullable: false}),
        tokenId: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventOwnerChanged = new Table(
    'spot_market_proxy_event_owner_changed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        oldOwner: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventOwnerNominated = new Table(
    'spot_market_proxy_event_owner_nominated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventUpgraded = new Table(
    'spot_market_proxy_event_upgraded.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        self: Column(Types.String(), {nullable: false}),
        implementation: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventAssociatedSystemSet = new Table(
    'spot_market_proxy_event_associated_system_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        kind: Column(Types.String(), {nullable: false}),
        id0: Column(Types.String(), {nullable: false}),
        proxy: Column(Types.String(), {nullable: false}),
        impl: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventDecayRateUpdated = new Table(
    'spot_market_proxy_event_decay_rate_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        rate: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventMarketNominationRenounced = new Table(
    'spot_market_proxy_event_market_nomination_renounced.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        nominee: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventMarketOwnerChanged = new Table(
    'spot_market_proxy_event_market_owner_changed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        oldOwner: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventMarketOwnerNominated = new Table(
    'spot_market_proxy_event_market_owner_nominated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthImplementationSet = new Table(
    'spot_market_proxy_event_synth_implementation_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthImplementation: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthImplementationUpgraded = new Table(
    'spot_market_proxy_event_synth_implementation_upgraded.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        proxy: Column(Types.String(), {nullable: false}),
        implementation: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthPriceDataUpdated = new Table(
    'spot_market_proxy_event_synth_price_data_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        buyFeedId: Column(Types.String(), {nullable: false}),
        sellFeedId: Column(Types.String(), {nullable: false}),
        strictStalenessTolerance: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthRegistered = new Table(
    'spot_market_proxy_event_synth_registered.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        synthTokenAddress: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthetixSystemSet = new Table(
    'spot_market_proxy_event_synthetix_system_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthetix: Column(Types.String(), {nullable: false}),
        usdTokenAddress: Column(Types.String(), {nullable: false}),
        oracleManager: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthBought = new Table(
    'spot_market_proxy_event_synth_bought.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        synthReturned: Column(Types.String(), {nullable: false}),
        fees: Column(Types.JSON(), {nullable: false}),
        collectedFees: Column(Types.String(), {nullable: false}),
        referrer: Column(Types.String(), {nullable: false}),
        price: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthSold = new Table(
    'spot_market_proxy_event_synth_sold.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        amountReturned: Column(Types.String(), {nullable: false}),
        fees: Column(Types.JSON(), {nullable: false}),
        collectedFees: Column(Types.String(), {nullable: false}),
        referrer: Column(Types.String(), {nullable: false}),
        price: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventOrderCancelled = new Table(
    'spot_market_proxy_event_order_cancelled.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        asyncOrderId: Column(Types.String(), {nullable: false}),
        asyncOrderClaim: Column(Types.JSON(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventOrderCommitted = new Table(
    'spot_market_proxy_event_order_committed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        orderType: Column(Types.Int64(), {nullable: false}),
        amountProvided: Column(Types.String(), {nullable: false}),
        asyncOrderId: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
        referrer: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventOrderSettled = new Table(
    'spot_market_proxy_event_order_settled.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        asyncOrderId: Column(Types.String(), {nullable: false}),
        finalOrderAmount: Column(Types.String(), {nullable: false}),
        fees: Column(Types.JSON(), {nullable: false}),
        collectedFees: Column(Types.String(), {nullable: false}),
        settler: Column(Types.String(), {nullable: false}),
        price: Column(Types.String(), {nullable: false}),
        orderType: Column(Types.Int64(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSettlementStrategyAdded = new Table(
    'spot_market_proxy_event_settlement_strategy_added.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        strategyId: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSettlementStrategySet = new Table(
    'spot_market_proxy_event_settlement_strategy_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        strategyId: Column(Types.String(), {nullable: false}),
        strategy: Column(Types.JSON(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthUnwrapped = new Table(
    'spot_market_proxy_event_synth_unwrapped.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        amountUnwrapped: Column(Types.String(), {nullable: false}),
        fees: Column(Types.JSON(), {nullable: false}),
        feesCollected: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventSynthWrapped = new Table(
    'spot_market_proxy_event_synth_wrapped.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        amountWrapped: Column(Types.String(), {nullable: false}),
        fees: Column(Types.JSON(), {nullable: false}),
        feesCollected: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventWrapperSet = new Table(
    'spot_market_proxy_event_wrapper_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        wrapCollateralType: Column(Types.String(), {nullable: false}),
        maxWrappableAmount: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventAsyncFixedFeeSet = new Table(
    'spot_market_proxy_event_async_fixed_fee_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        asyncFixedFee: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventAtomicFixedFeeSet = new Table(
    'spot_market_proxy_event_atomic_fixed_fee_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        atomicFixedFee: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventCollateralLeverageSet = new Table(
    'spot_market_proxy_event_collateral_leverage_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        collateralLeverage: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventFeeCollectorSet = new Table(
    'spot_market_proxy_event_fee_collector_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        feeCollector: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventMarketSkewScaleSet = new Table(
    'spot_market_proxy_event_market_skew_scale_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        skewScale: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventMarketUtilizationFeesSet = new Table(
    'spot_market_proxy_event_market_utilization_fees_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        utilizationFeeRate: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventReferrerShareUpdated = new Table(
    'spot_market_proxy_event_referrer_share_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        referrer: Column(Types.String(), {nullable: false}),
        sharePercentage: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventTransactorFixedFeeSet = new Table(
    'spot_market_proxy_event_transactor_fixed_fee_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        transactor: Column(Types.String(), {nullable: false}),
        fixedFeeAmount: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventWrapperFeesSet = new Table(
    'spot_market_proxy_event_wrapper_fees_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        synthMarketId: Column(Types.String(), {nullable: false}),
        wrapFee: Column(Types.String(), {nullable: false}),
        unwrapFee: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventFeatureFlagAllowAllSet = new Table(
    'spot_market_proxy_event_feature_flag_allow_all_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        allowAll: Column(Types.Boolean(), {nullable: false}),
    }
)

export let SpotMarketProxyEventFeatureFlagAllowlistAdded = new Table(
    'spot_market_proxy_event_feature_flag_allowlist_added.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        account: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventFeatureFlagAllowlistRemoved = new Table(
    'spot_market_proxy_event_feature_flag_allowlist_removed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        account: Column(Types.String(), {nullable: false}),
    }
)

export let SpotMarketProxyEventFeatureFlagDeniersReset = new Table(
    'spot_market_proxy_event_feature_flag_deniers_reset.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        deniers: Column(Types.JSON(), {nullable: false}),
    }
)

export let SpotMarketProxyEventFeatureFlagDenyAllSet = new Table(
    'spot_market_proxy_event_feature_flag_deny_all_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        denyAll: Column(Types.Boolean(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventAccountCreated = new Table(
    'perps_market_proxy_event_account_created.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventPermissionGranted = new Table(
    'perps_market_proxy_event_permission_granted.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        permission: Column(Types.String(), {nullable: false}),
        user: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventPermissionRevoked = new Table(
    'perps_market_proxy_event_permission_revoked.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        permission: Column(Types.String(), {nullable: false}),
        user: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventAssociatedSystemSet = new Table(
    'perps_market_proxy_event_associated_system_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        kind: Column(Types.String(), {nullable: false}),
        id0: Column(Types.String(), {nullable: false}),
        proxy: Column(Types.String(), {nullable: false}),
        impl: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventOwnerChanged = new Table(
    'perps_market_proxy_event_owner_changed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        oldOwner: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventOwnerNominated = new Table(
    'perps_market_proxy_event_owner_nominated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventUpgraded = new Table(
    'perps_market_proxy_event_upgraded.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        self: Column(Types.String(), {nullable: false}),
        implementation: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFactoryInitialized = new Table(
    'perps_market_proxy_event_factory_initialized.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        globalPerpsMarketId: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventMarketCreated = new Table(
    'perps_market_proxy_event_market_created.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        perpsMarketId: Column(Types.String(), {nullable: false}),
        marketName: Column(Types.String(), {nullable: false}),
        marketSymbol: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventCollateralModified = new Table(
    'perps_market_proxy_event_collateral_modified.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        collateralId: Column(Types.String(), {nullable: false}),
        amountDelta: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventDebtPaid = new Table(
    'perps_market_proxy_event_debt_paid.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventInterestRateUpdated = new Table(
    'perps_market_proxy_event_interest_rate_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        superMarketId: Column(Types.String(), {nullable: false}),
        interestRate: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventOrderCommitted = new Table(
    'perps_market_proxy_event_order_committed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        orderType: Column(Types.Int64(), {nullable: false}),
        sizeDelta: Column(Types.String(), {nullable: false}),
        acceptablePrice: Column(Types.String(), {nullable: false}),
        commitmentTime: Column(Types.String(), {nullable: false}),
        expectedPriceTime: Column(Types.String(), {nullable: false}),
        settlementTime: Column(Types.String(), {nullable: false}),
        expirationTime: Column(Types.String(), {nullable: false}),
        trackingCode: Column(Types.String(), {nullable: false}),
        sender: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventPreviousOrderExpired = new Table(
    'perps_market_proxy_event_previous_order_expired.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        sizeDelta: Column(Types.String(), {nullable: false}),
        acceptablePrice: Column(Types.String(), {nullable: false}),
        commitmentTime: Column(Types.String(), {nullable: false}),
        trackingCode: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventAccountCharged = new Table(
    'perps_market_proxy_event_account_charged.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        amount: Column(Types.String(), {nullable: false}),
        accountDebt: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventInterestCharged = new Table(
    'perps_market_proxy_event_interest_charged.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        interest: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventMarketUpdated = new Table(
    'perps_market_proxy_event_market_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        price: Column(Types.String(), {nullable: false}),
        skew: Column(Types.String(), {nullable: false}),
        size: Column(Types.String(), {nullable: false}),
        sizeDelta: Column(Types.String(), {nullable: false}),
        currentFundingRate: Column(Types.String(), {nullable: false}),
        currentFundingVelocity: Column(Types.String(), {nullable: false}),
        interestRate: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventOrderSettled = new Table(
    'perps_market_proxy_event_order_settled.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        fillPrice: Column(Types.String(), {nullable: false}),
        pnl: Column(Types.String(), {nullable: false}),
        accruedFunding: Column(Types.String(), {nullable: false}),
        sizeDelta: Column(Types.String(), {nullable: false}),
        newSize: Column(Types.String(), {nullable: false}),
        totalFees: Column(Types.String(), {nullable: false}),
        referralFees: Column(Types.String(), {nullable: false}),
        collectedFees: Column(Types.String(), {nullable: false}),
        settlementReward: Column(Types.String(), {nullable: false}),
        trackingCode: Column(Types.String(), {nullable: false}),
        settler: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventOrderCancelled = new Table(
    'perps_market_proxy_event_order_cancelled.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        desiredPrice: Column(Types.String(), {nullable: false}),
        fillPrice: Column(Types.String(), {nullable: false}),
        sizeDelta: Column(Types.String(), {nullable: false}),
        settlementReward: Column(Types.String(), {nullable: false}),
        trackingCode: Column(Types.String(), {nullable: false}),
        settler: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFeatureFlagAllowAllSet = new Table(
    'perps_market_proxy_event_feature_flag_allow_all_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        allowAll: Column(Types.Boolean(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFeatureFlagAllowlistAdded = new Table(
    'perps_market_proxy_event_feature_flag_allowlist_added.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        account: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFeatureFlagAllowlistRemoved = new Table(
    'perps_market_proxy_event_feature_flag_allowlist_removed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        account: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFeatureFlagDeniersReset = new Table(
    'perps_market_proxy_event_feature_flag_deniers_reset.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        deniers: Column(Types.JSON(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFeatureFlagDenyAllSet = new Table(
    'perps_market_proxy_event_feature_flag_deny_all_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feature: Column(Types.String(), {nullable: false}),
        denyAll: Column(Types.Boolean(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventAccountFlaggedForLiquidation = new Table(
    'perps_market_proxy_event_account_flagged_for_liquidation.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        availableMargin: Column(Types.String(), {nullable: false}),
        requiredMaintenanceMargin: Column(Types.String(), {nullable: false}),
        liquidationReward: Column(Types.String(), {nullable: false}),
        flagReward: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventAccountLiquidationAttempt = new Table(
    'perps_market_proxy_event_account_liquidation_attempt.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        reward: Column(Types.String(), {nullable: false}),
        fullLiquidation: Column(Types.Boolean(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventAccountMarginLiquidation = new Table(
    'perps_market_proxy_event_account_margin_liquidation.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        seizedMarginValue: Column(Types.String(), {nullable: false}),
        liquidationReward: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventPositionLiquidated = new Table(
    'perps_market_proxy_event_position_liquidated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        accountId: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        amountLiquidated: Column(Types.String(), {nullable: false}),
        currentPositionSize: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFundingParametersSet = new Table(
    'perps_market_proxy_event_funding_parameters_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        skewScale: Column(Types.String(), {nullable: false}),
        maxFundingVelocity: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventLiquidationParametersSet = new Table(
    'perps_market_proxy_event_liquidation_parameters_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        initialMarginRatioD18: Column(Types.String(), {nullable: false}),
        maintenanceMarginRatioD18: Column(Types.String(), {nullable: false}),
        minimumInitialMarginRatioD18: Column(Types.String(), {nullable: false}),
        flagRewardRatioD18: Column(Types.String(), {nullable: false}),
        minimumPositionMargin: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventLockedOiRatioSet = new Table(
    'perps_market_proxy_event_locked_oi_ratio_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        lockedOiRatioD18: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventMarketPriceDataUpdated = new Table(
    'perps_market_proxy_event_market_price_data_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        feedId: Column(Types.String(), {nullable: false}),
        strictStalenessTolerance: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventMaxLiquidationParametersSet = new Table(
    'perps_market_proxy_event_max_liquidation_parameters_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        maxLiquidationLimitAccumulationMultiplier: Column(Types.String(), {nullable: false}),
        maxSecondsInLiquidationWindow: Column(Types.String(), {nullable: false}),
        maxLiquidationPd: Column(Types.String(), {nullable: false}),
        endorsedLiquidator: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventMaxMarketSizeSet = new Table(
    'perps_market_proxy_event_max_market_size_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        maxMarketSize: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventMaxMarketValueSet = new Table(
    'perps_market_proxy_event_max_market_value_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        maxMarketValue: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventOrderFeesSet = new Table(
    'perps_market_proxy_event_order_fees_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        makerFeeRatio: Column(Types.String(), {nullable: false}),
        takerFeeRatio: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventSettlementStrategyAdded = new Table(
    'perps_market_proxy_event_settlement_strategy_added.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        strategy: Column(Types.JSON(), {nullable: false}),
        strategyId: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventSettlementStrategySet = new Table(
    'perps_market_proxy_event_settlement_strategy_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        marketId: Column(Types.String(), {nullable: false}),
        strategyId: Column(Types.String(), {nullable: false}),
        strategy: Column(Types.JSON(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventCollateralConfigurationSet = new Table(
    'perps_market_proxy_event_collateral_configuration_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        collateralId: Column(Types.String(), {nullable: false}),
        maxCollateralAmount: Column(Types.String(), {nullable: false}),
        upperLimitDiscount: Column(Types.String(), {nullable: false}),
        lowerLimitDiscount: Column(Types.String(), {nullable: false}),
        discountScalar: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventCollateralLiquidateRewardRatioSet = new Table(
    'perps_market_proxy_event_collateral_liquidate_reward_ratio_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        collateralLiquidateRewardRatioD18: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventRewardDistributorRegistered = new Table(
    'perps_market_proxy_event_reward_distributor_registered.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        distributor: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventFeeCollectorSet = new Table(
    'perps_market_proxy_event_fee_collector_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        feeCollector: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventInterestRateParametersSet = new Table(
    'perps_market_proxy_event_interest_rate_parameters_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        lowUtilizationInterestRateGradient: Column(Types.String(), {nullable: false}),
        interestRateGradientBreakpoint: Column(Types.String(), {nullable: false}),
        highUtilizationInterestRateGradient: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventKeeperCostNodeIdUpdated = new Table(
    'perps_market_proxy_event_keeper_cost_node_id_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        keeperCostNodeId: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventKeeperRewardGuardsSet = new Table(
    'perps_market_proxy_event_keeper_reward_guards_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        minKeeperRewardUsd: Column(Types.String(), {nullable: false}),
        minKeeperProfitRatioD18: Column(Types.String(), {nullable: false}),
        maxKeeperRewardUsd: Column(Types.String(), {nullable: false}),
        maxKeeperScalingRatioD18: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventPerAccountCapsSet = new Table(
    'perps_market_proxy_event_per_account_caps_set.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        maxPositionsPerAccount: Column(Types.String(), {nullable: false}),
        maxCollateralsPerAccount: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsMarketProxyEventReferrerShareUpdated = new Table(
    'perps_market_proxy_event_referrer_share_updated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        referrer: Column(Types.String(), {nullable: false}),
        shareRatioD18: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsAccountProxyEventOwnerChanged = new Table(
    'perps_account_proxy_event_owner_changed.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        oldOwner: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsAccountProxyEventOwnerNominated = new Table(
    'perps_account_proxy_event_owner_nominated.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsAccountProxyEventUpgraded = new Table(
    'perps_account_proxy_event_upgraded.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        self: Column(Types.String(), {nullable: false}),
        implementation: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsAccountProxyEventApproval = new Table(
    'perps_account_proxy_event_approval.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
        approved: Column(Types.String(), {nullable: false}),
        tokenId: Column(Types.String(), {nullable: false}),
    }
)

export let PerpsAccountProxyEventApprovalForAll = new Table(
    'perps_account_proxy_event_approval_for_all.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
        operator: Column(Types.String(), {nullable: false}),
        approved: Column(Types.Boolean(), {nullable: false}),
    }
)

export let PerpsAccountProxyEventTransfer = new Table(
    'perps_account_proxy_event_transfer.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        from: Column(Types.String(), {nullable: false}),
        to: Column(Types.String(), {nullable: false}),
        tokenId: Column(Types.String(), {nullable: false}),
    }
)
