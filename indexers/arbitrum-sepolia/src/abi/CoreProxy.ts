import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './CoreProxy.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    OwnerChanged: new LogEvent<([oldOwner: string, newOwner: string] & {oldOwner: string, newOwner: string})>(
        abi, '0xb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c'
    ),
    OwnerNominated: new LogEvent<([newOwner: string] & {newOwner: string})>(
        abi, '0x906a1c6bd7e3091ea86693dd029a831c19049ce77f1dce2ce0bab1cacbabce22'
    ),
    Upgraded: new LogEvent<([self: string, implementation: string] & {self: string, implementation: string})>(
        abi, '0x5d611f318680d00598bb735d61bacf0c514c6b50e1e5ad30040a4df2b12791c7'
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
    AccountCreated: new LogEvent<([accountId: bigint, owner: string] & {accountId: bigint, owner: string})>(
        abi, '0xa9e04d307e860938fa63307df8b8090e365276e59fcca12ed55656c25e538019'
    ),
    PermissionGranted: new LogEvent<([accountId: bigint, permission: string, user: string, sender: string] & {accountId: bigint, permission: string, user: string, sender: string})>(
        abi, '0x32ff7c3f84299a3543c1e89057e98ba962f4fbe7786c52289e184c57b9a36a50'
    ),
    PermissionRevoked: new LogEvent<([accountId: bigint, permission: string, user: string, sender: string] & {accountId: bigint, permission: string, user: string, sender: string})>(
        abi, '0x116c7e9cd2db316974fb473babcbcd625be1350842d0319e761d30aefb09a58a'
    ),
    DebtAssociated: new LogEvent<([marketId: bigint, poolId: bigint, collateralType: string, accountId: bigint, amount: bigint, updatedDebt: bigint] & {marketId: bigint, poolId: bigint, collateralType: string, accountId: bigint, amount: bigint, updatedDebt: bigint})>(
        abi, '0xb03bc7530b5650601d2c8bc86c81a45b6b50b0099defd3f17a6bdb48660180ad'
    ),
    AssociatedSystemSet: new LogEvent<([kind: string, id: string, proxy: string, impl: string] & {kind: string, id: string, proxy: string, impl: string})>(
        abi, '0xc8551a5a03a7b06d5d20159b3b8839429a7aefab4bf3d020f1b65fa903ccb3d2'
    ),
    CollateralLockCreated: new LogEvent<([accountId: bigint, collateralType: string, tokenAmount: bigint, expireTimestamp: bigint] & {accountId: bigint, collateralType: string, tokenAmount: bigint, expireTimestamp: bigint})>(
        abi, '0x8a78446a234220d3ee3f46aa6ea1ea5bc438bd153398ebcbd171843744b452a6'
    ),
    CollateralLockExpired: new LogEvent<([accountId: bigint, collateralType: string, tokenAmount: bigint, expireTimestamp: bigint] & {accountId: bigint, collateralType: string, tokenAmount: bigint, expireTimestamp: bigint})>(
        abi, '0xc5e2c7afc4e54d998977e11260a0bfc0ad5678a3a8b6628162f9d4e642d7f160'
    ),
    Deposited: new LogEvent<([accountId: bigint, collateralType: string, tokenAmount: bigint, sender: string] & {accountId: bigint, collateralType: string, tokenAmount: bigint, sender: string})>(
        abi, '0xd92122e67326e9313bfae33ccb1fccf5194584c6bf93a8529a6b006d8c6e24a9'
    ),
    Withdrawn: new LogEvent<([accountId: bigint, collateralType: string, tokenAmount: bigint, sender: string] & {accountId: bigint, collateralType: string, tokenAmount: bigint, sender: string})>(
        abi, '0x8b5f9d7ce522936589c630db08c0fa2405b21c4a5ff8ef19899900172736ba38'
    ),
    CollateralConfigured: new LogEvent<([collateralType: string, config: ([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})] & {collateralType: string, config: ([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})})>(
        abi, '0xefc23317f58afd6b22480bd22174cc7da0913bce25c03d9859216dacddebe6fe'
    ),
    TransferCrossChainInitiated: new LogEvent<([destChainId: bigint, amount: bigint, sender: string] & {destChainId: bigint, amount: bigint, sender: string})>(
        abi, '0xb87c3097d7f9145a4915e8e434f04a1b7b91646d8a6e66a5cdab25caccb644c4'
    ),
    IssuanceFeePaid: new LogEvent<([accountId: bigint, poolId: bigint, collateralType: string, feeAmount: bigint] & {accountId: bigint, poolId: bigint, collateralType: string, feeAmount: bigint})>(
        abi, '0x28d0fb10e1c8ce51490a16fb3b40bf23f8064f7c624d3a3852ad66683a25995d'
    ),
    UsdBurned: new LogEvent<([accountId: bigint, poolId: bigint, collateralType: string, amount: bigint, sender: string] & {accountId: bigint, poolId: bigint, collateralType: string, amount: bigint, sender: string})>(
        abi, '0x6b0230f0abe9188cbdbb1c816a4c5e213758b5b743d8a94af056280cc1e7aeb1'
    ),
    UsdMinted: new LogEvent<([accountId: bigint, poolId: bigint, collateralType: string, amount: bigint, sender: string] & {accountId: bigint, poolId: bigint, collateralType: string, amount: bigint, sender: string})>(
        abi, '0x2100f67dc9a5917400f799bb13194553e3f74c19a207c56350d2c223ac9c36c9'
    ),
    Liquidation: new LogEvent<([accountId: bigint, poolId: bigint, collateralType: string, liquidationData: ([debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint] & {debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint}), liquidateAsAccountId: bigint, sender: string] & {accountId: bigint, poolId: bigint, collateralType: string, liquidationData: ([debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint] & {debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint}), liquidateAsAccountId: bigint, sender: string})>(
        abi, '0xe6c1b26644f880854bf954d4186be9f0b2d06d50fa0484b596e79d409c07a5fd'
    ),
    VaultLiquidation: new LogEvent<([poolId: bigint, collateralType: string, liquidationData: ([debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint] & {debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint}), liquidateAsAccountId: bigint, sender: string] & {poolId: bigint, collateralType: string, liquidationData: ([debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint] & {debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint}), liquidateAsAccountId: bigint, sender: string})>(
        abi, '0x1834a7cc9d14f9bfa482df5c0404dadd1b8ec123b41f082e76ae28a3b2ea68d5'
    ),
    MarketCollateralDeposited: new LogEvent<([marketId: bigint, collateralType: string, tokenAmount: bigint, sender: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint, reportedDebt: bigint] & {marketId: bigint, collateralType: string, tokenAmount: bigint, sender: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint, reportedDebt: bigint})>(
        abi, '0x0268c0025d1310f8cbf9a431c755af708633271b9b5902855857297267d6f41b'
    ),
    MarketCollateralWithdrawn: new LogEvent<([marketId: bigint, collateralType: string, tokenAmount: bigint, sender: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint, reportedDebt: bigint] & {marketId: bigint, collateralType: string, tokenAmount: bigint, sender: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint, reportedDebt: bigint})>(
        abi, '0x88eb4cc1feb3af3a3e45798dc1d42ec34ef453093ffe0c56fc36e27abd2cc4d7'
    ),
    MaximumMarketCollateralConfigured: new LogEvent<([marketId: bigint, collateralType: string, systemAmount: bigint, owner: string] & {marketId: bigint, collateralType: string, systemAmount: bigint, owner: string})>(
        abi, '0x499c8fcfbc4341c37dcf444c890d42ef888d46aa586f97ceb20577c2635c8075'
    ),
    MarketRegistered: new LogEvent<([market: string, marketId: bigint, sender: string] & {market: string, marketId: bigint, sender: string})>(
        abi, '0xeb87361ace8c1947e121293eb214f68d889d9cf273c48246b38c3cbf185748d0'
    ),
    MarketSystemFeePaid: new LogEvent<([marketId: bigint, feeAmount: bigint] & {marketId: bigint, feeAmount: bigint})>(
        abi, '0x8b69fed8aed97ef9572216662359ece45fa52f2b5ff44a78b7ec3c5ef05153f8'
    ),
    MarketUsdDeposited: new LogEvent<([marketId: bigint, target: string, amount: bigint, market: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint] & {marketId: bigint, target: string, amount: bigint, market: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint})>(
        abi, '0x9a027325990fdf972bdf1b29c875c0b38eb13c24b40eb1c3e76c59fbccae7c24'
    ),
    MarketUsdWithdrawn: new LogEvent<([marketId: bigint, target: string, amount: bigint, market: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint] & {marketId: bigint, target: string, amount: bigint, market: string, creditCapacity: bigint, netIssuance: bigint, depositedCollateralValue: bigint})>(
        abi, '0x78275f67a7ec18521036f43b5352fa06fb6b886629ae2c532dd1093504bc6acc'
    ),
    SetMarketMinLiquidityRatio: new LogEvent<([marketId: bigint, minLiquidityRatio: bigint] & {marketId: bigint, minLiquidityRatio: bigint})>(
        abi, '0x563eb723f21b3e87ec8932cfb4ffa64d1b68c42053c28d6b4db019a40f6daf47'
    ),
    SetMinDelegateTime: new LogEvent<([marketId: bigint, minDelegateTime: number] & {marketId: bigint, minDelegateTime: number})>(
        abi, '0x6942a68d151863c1fed3c0c4c5f3258af738218527147ac69290ab23ca7d26c6'
    ),
    PoolApprovedAdded: new LogEvent<([poolId: bigint] & {poolId: bigint})>(
        abi, '0x7d5bdf4e8c44e0b5a8249bf03c2a1febd848cc7f580efd7b1703301c5b1a9e4e'
    ),
    PoolApprovedRemoved: new LogEvent<([poolId: bigint] & {poolId: bigint})>(
        abi, '0xc1567ee9983f306f073ea7d59a7fb5680ce07985f8b49cc50d00a3a9f748d3c2'
    ),
    PreferredPoolSet: new LogEvent<([poolId: bigint] & {poolId: bigint})>(
        abi, '0x7e7cb4726e710dc12fad41f158c37a4a71af3a6f053b8b13670d35c710139a56'
    ),
    PoolCollateralConfigurationUpdated: new LogEvent<([poolId: bigint, collateralType: string, config: ([collateralLimitD18: bigint, issuanceRatioD18: bigint] & {collateralLimitD18: bigint, issuanceRatioD18: bigint})] & {poolId: bigint, collateralType: string, config: ([collateralLimitD18: bigint, issuanceRatioD18: bigint] & {collateralLimitD18: bigint, issuanceRatioD18: bigint})})>(
        abi, '0x5ebb5c59166ab9735b293a159ee2129e61d16b526867763f25557a275a2aad92'
    ),
    PoolCollateralDisabledByDefaultSet: new LogEvent<([poolId: bigint, disabled: boolean] & {poolId: bigint, disabled: boolean})>(
        abi, '0xe0ed98ef42e6a4a881ae0d3c4459c9ed06a36a2144e02efc11823c6cae515bf2'
    ),
    PoolConfigurationSet: new LogEvent<([poolId: bigint, markets: Array<([marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint] & {marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint})>, sender: string] & {poolId: bigint, markets: Array<([marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint] & {marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint})>, sender: string})>(
        abi, '0xdd812c2e47943d98e6c66b2b9872d1f9270b8523c82eb60ad5c8d580a614081c'
    ),
    PoolCreated: new LogEvent<([poolId: bigint, owner: string, sender: string] & {poolId: bigint, owner: string, sender: string})>(
        abi, '0xb1517ad708e5f9a104c30d3f1ff749d55833b1d03bf472013c29888e741cf340'
    ),
    PoolNameUpdated: new LogEvent<([poolId: bigint, name: string, sender: string] & {poolId: bigint, name: string, sender: string})>(
        abi, '0x63b42abaf7e145a993f20bc64259f45d09c43d18838ab0bca078b15093ac55f4'
    ),
    PoolNominationRenounced: new LogEvent<([poolId: bigint, owner: string] & {poolId: bigint, owner: string})>(
        abi, '0x28301da5fb0feefb138efa6310af4547a74f415d62616f90519436dc169c3ae0'
    ),
    PoolNominationRevoked: new LogEvent<([poolId: bigint, owner: string] & {poolId: bigint, owner: string})>(
        abi, '0xa20a605599b6da4a06e0662f1284c442a576bc452b77a38c8c55805cb82a1865'
    ),
    PoolOwnerNominated: new LogEvent<([poolId: bigint, nominatedOwner: string, owner: string] & {poolId: bigint, nominatedOwner: string, owner: string})>(
        abi, '0x55d98f82a53fb5776e9ea48d624ab9cb015b51a45249b1ed8425fc857c82f4f8'
    ),
    PoolOwnershipAccepted: new LogEvent<([poolId: bigint, owner: string] & {poolId: bigint, owner: string})>(
        abi, '0x4f86f2ce8b08e27d0e470f4269b71c3bbc68407d51a2e692f6573236074ebc5a'
    ),
    PoolOwnershipRenounced: new LogEvent<([poolId: bigint, owner: string] & {poolId: bigint, owner: string})>(
        abi, '0x0d1df5c898ce9334fe91f342f5c07b0eea630d388f90b4e07e85753d61252734'
    ),
    SetMinLiquidityRatio: new LogEvent<([minLiquidityRatio: bigint] & {minLiquidityRatio: bigint})>(
        abi, '0x66fd484d9868d1faddc8fef1f3faed0ed25eb4e6acde49dd1f2cbf0fba903635'
    ),
    RewardsClaimed: new LogEvent<([accountId: bigint, poolId: bigint, collateralType: string, distributor: string, amount: bigint] & {accountId: bigint, poolId: bigint, collateralType: string, distributor: string, amount: bigint})>(
        abi, '0xa4a60be4203e7975e54ab5314c7e9e18aba9ad71e8da714d8de987f4f05410f2'
    ),
    RewardsDistributed: new LogEvent<([poolId: bigint, collateralType: string, distributor: string, amount: bigint, start: bigint, duration: bigint] & {poolId: bigint, collateralType: string, distributor: string, amount: bigint, start: bigint, duration: bigint})>(
        abi, '0x19ced31d71d1db45f99d5a8d3a7616fe9d78828df58f2a28feb68c9f9ab876ca'
    ),
    RewardsDistributorRegistered: new LogEvent<([poolId: bigint, collateralType: string, distributor: string] & {poolId: bigint, collateralType: string, distributor: string})>(
        abi, '0x9d3609c05a83dc93a5b355d62c2b37dfde8f0833b1184d4d05c6f51cd46b6e5b'
    ),
    RewardsDistributorRemoved: new LogEvent<([poolId: bigint, collateralType: string, distributor: string] & {poolId: bigint, collateralType: string, distributor: string})>(
        abi, '0x375c4507f463c55a506be95e2cfd3cfdc0610be055087eac6049588a1bcfacba'
    ),
    NewSupportedCrossChainNetwork: new LogEvent<([newChainId: bigint] & {newChainId: bigint})>(
        abi, '0x1874eb2a5288e478dcedf1d33291bd7293eeef5946ec516d2ef54a364b3f63d8'
    ),
    DelegationUpdated: new LogEvent<([accountId: bigint, poolId: bigint, collateralType: string, amount: bigint, leverage: bigint, sender: string] & {accountId: bigint, poolId: bigint, collateralType: string, amount: bigint, leverage: bigint, sender: string})>(
        abi, '0x7b12dd38f18c0ff77ae702f6da13fbbcb28f53f807ecc7d39ee8d8b1ea8295ad'
    ),
}

export const functions = {
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
    associateDebt: new Func<[marketId: bigint, poolId: bigint, collateralType: string, accountId: bigint, amount: bigint], {marketId: bigint, poolId: bigint, collateralType: string, accountId: bigint, amount: bigint}, bigint>(
        abi, '0x11aa282d'
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
    ccipReceive: new Func<[message: ([messageId: string, sourceChainSelector: bigint, sender: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>] & {messageId: string, sourceChainSelector: bigint, sender: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>})], {message: ([messageId: string, sourceChainSelector: bigint, sender: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>] & {messageId: string, sourceChainSelector: bigint, sender: string, data: string, tokenAmounts: Array<([token: string, amount: bigint] & {token: string, amount: bigint})>})}, []>(
        abi, '0x85572ffb'
    ),
    cleanExpiredLocks: new Func<[accountId: bigint, collateralType: string, offset: bigint, count: bigint], {accountId: bigint, collateralType: string, offset: bigint, count: bigint}, bigint>(
        abi, '0x198f0aa1'
    ),
    createLock: new Func<[accountId: bigint, collateralType: string, amount: bigint, expireTimestamp: bigint], {accountId: bigint, collateralType: string, amount: bigint, expireTimestamp: bigint}, []>(
        abi, '0x0bae9893'
    ),
    deposit: new Func<[accountId: bigint, collateralType: string, tokenAmount: bigint], {accountId: bigint, collateralType: string, tokenAmount: bigint}, []>(
        abi, '0x83802968'
    ),
    getAccountAvailableCollateral: new Func<[accountId: bigint, collateralType: string], {accountId: bigint, collateralType: string}, bigint>(
        abi, '0x927482ff'
    ),
    getAccountCollateral: new Func<[accountId: bigint, collateralType: string], {accountId: bigint, collateralType: string}, ([totalDeposited: bigint, totalAssigned: bigint, totalLocked: bigint] & {totalDeposited: bigint, totalAssigned: bigint, totalLocked: bigint})>(
        abi, '0xef45148e'
    ),
    getLocks: new Func<[accountId: bigint, collateralType: string, offset: bigint, count: bigint], {accountId: bigint, collateralType: string, offset: bigint, count: bigint}, Array<([amountD18: bigint, lockExpirationTime: bigint] & {amountD18: bigint, lockExpirationTime: bigint})>>(
        abi, '0xaa8c6369'
    ),
    withdraw: new Func<[accountId: bigint, collateralType: string, tokenAmount: bigint], {accountId: bigint, collateralType: string, tokenAmount: bigint}, []>(
        abi, '0x95997c51'
    ),
    configureCollateral: new Func<[config: ([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})], {config: ([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})}, []>(
        abi, '0x644cb0f3'
    ),
    getCollateralConfiguration: new Func<[collateralType: string], {collateralType: string}, ([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})>(
        abi, '0xdc0b3f52'
    ),
    getCollateralConfigurations: new Func<[hideDisabled: boolean], {hideDisabled: boolean}, Array<([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})>>(
        abi, '0x75bf2444'
    ),
    getCollateralPrice: new Func<[collateralType: string], {collateralType: string}, bigint>(
        abi, '0x51a40994'
    ),
    transferCrossChain: new Func<[destChainId: bigint, amount: bigint], {destChainId: bigint, amount: bigint}, bigint>(
        abi, '0x340824d7'
    ),
    burnUsd: new Func<[accountId: bigint, poolId: bigint, collateralType: string, amount: bigint], {accountId: bigint, poolId: bigint, collateralType: string, amount: bigint}, []>(
        abi, '0xd3264e43'
    ),
    mintUsd: new Func<[accountId: bigint, poolId: bigint, collateralType: string, amount: bigint], {accountId: bigint, poolId: bigint, collateralType: string, amount: bigint}, []>(
        abi, '0xdf16a074'
    ),
    isPositionLiquidatable: new Func<[accountId: bigint, poolId: bigint, collateralType: string], {accountId: bigint, poolId: bigint, collateralType: string}, boolean>(
        abi, '0x2fa7bb65'
    ),
    isVaultLiquidatable: new Func<[poolId: bigint, collateralType: string], {poolId: bigint, collateralType: string}, boolean>(
        abi, '0x2a5354d2'
    ),
    liquidate: new Func<[accountId: bigint, poolId: bigint, collateralType: string, liquidateAsAccountId: bigint], {accountId: bigint, poolId: bigint, collateralType: string, liquidateAsAccountId: bigint}, ([debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint] & {debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint})>(
        abi, '0x3e033a06'
    ),
    liquidateVault: new Func<[poolId: bigint, collateralType: string, liquidateAsAccountId: bigint, maxUsd: bigint], {poolId: bigint, collateralType: string, liquidateAsAccountId: bigint, maxUsd: bigint}, ([debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint] & {debtLiquidated: bigint, collateralLiquidated: bigint, amountRewarded: bigint})>(
        abi, '0x7d8a4140'
    ),
    configureMaximumMarketCollateral: new Func<[marketId: bigint, collateralType: string, amount: bigint], {marketId: bigint, collateralType: string, amount: bigint}, []>(
        abi, '0xdbdea94c'
    ),
    depositMarketCollateral: new Func<[marketId: bigint, collateralType: string, tokenAmount: bigint], {marketId: bigint, collateralType: string, tokenAmount: bigint}, []>(
        abi, '0xa4e6306b'
    ),
    getMarketCollateralAmount: new Func<[marketId: bigint, collateralType: string], {marketId: bigint, collateralType: string}, bigint>(
        abi, '0xc2b0cf41'
    ),
    getMarketCollateralValue: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0xd4f88381'
    ),
    getMaximumMarketCollateral: new Func<[marketId: bigint, collateralType: string], {marketId: bigint, collateralType: string}, bigint>(
        abi, '0x12e1c673'
    ),
    withdrawMarketCollateral: new Func<[marketId: bigint, collateralType: string, tokenAmount: bigint], {marketId: bigint, collateralType: string, tokenAmount: bigint}, []>(
        abi, '0xa3aa8b51'
    ),
    depositMarketUsd: new Func<[marketId: bigint, target: string, amount: bigint], {marketId: bigint, target: string, amount: bigint}, bigint>(
        abi, '0x10b0cf76'
    ),
    distributeDebtToPools: new Func<[marketId: bigint, maxIter: bigint], {marketId: bigint, maxIter: bigint}, boolean>(
        abi, '0xa0c12269'
    ),
    getMarketAddress: new Func<[marketId: bigint], {marketId: bigint}, string>(
        abi, '0xd24437f1'
    ),
    getMarketCollateral: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x150834a3'
    ),
    getMarketDebtPerShare: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x95909ba3'
    ),
    getMarketFees: new Func<[_: bigint, amount: bigint], {amount: bigint}, ([depositFeeAmount: bigint, withdrawFeeAmount: bigint] & {depositFeeAmount: bigint, withdrawFeeAmount: bigint})>(
        abi, '0xdfb83437'
    ),
    getMarketMinDelegateTime: new Func<[marketId: bigint], {marketId: bigint}, number>(
        abi, '0x5424901b'
    ),
    getMarketNetIssuance: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x85d99ebc'
    ),
    getMarketPoolDebtDistribution: new Func<[marketId: bigint, poolId: bigint], {marketId: bigint, poolId: bigint}, ([sharesD18: bigint, totalSharesD18: bigint, valuePerShareD27: bigint] & {sharesD18: bigint, totalSharesD18: bigint, valuePerShareD27: bigint})>(
        abi, '0x25eeea4b'
    ),
    getMarketPools: new Func<[marketId: bigint], {marketId: bigint}, ([inRangePoolIds: Array<bigint>, outRangePoolIds: Array<bigint>] & {inRangePoolIds: Array<bigint>, outRangePoolIds: Array<bigint>})>(
        abi, '0xbe0b8e6f'
    ),
    getMarketReportedDebt: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x86e3b1cf'
    ),
    getMarketTotalDebt: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0xbaa2a264'
    ),
    'getMinLiquidityRatio(uint128)': new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x84f29b6d'
    ),
    getOracleManager: new Func<[], {}, string>(
        abi, '0xb01ceccd'
    ),
    getUsdToken: new Func<[], {}, string>(
        abi, '0x21f1d9e5'
    ),
    getWithdrawableMarketUsd: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0x1eb60770'
    ),
    isMarketCapacityLocked: new Func<[marketId: bigint], {marketId: bigint}, boolean>(
        abi, '0x07003f0a'
    ),
    registerMarket: new Func<[market: string], {market: string}, bigint>(
        abi, '0xa79b9ec9'
    ),
    setMarketMinDelegateTime: new Func<[marketId: bigint, minDelegateTime: number], {marketId: bigint, minDelegateTime: number}, []>(
        abi, '0x1d90e392'
    ),
    'setMinLiquidityRatio(uint128,uint256)': new Func<[marketId: bigint, minLiquidityRatio: bigint], {marketId: bigint, minLiquidityRatio: bigint}, []>(
        abi, '0x6fd5bdce'
    ),
    withdrawMarketUsd: new Func<[marketId: bigint, target: string, amount: bigint], {marketId: bigint, target: string, amount: bigint}, bigint>(
        abi, '0x140a7cfe'
    ),
    addApprovedPool: new Func<[poolId: bigint], {poolId: bigint}, []>(
        abi, '0xb790a1ae'
    ),
    getApprovedPools: new Func<[], {}, Array<bigint>>(
        abi, '0x48741626'
    ),
    getPreferredPool: new Func<[], {}, bigint>(
        abi, '0x3b390b57'
    ),
    removeApprovedPool: new Func<[poolId: bigint], {poolId: bigint}, []>(
        abi, '0xe1b440d0'
    ),
    setPreferredPool: new Func<[poolId: bigint], {poolId: bigint}, []>(
        abi, '0xe7098c0c'
    ),
    acceptPoolOwnership: new Func<[poolId: bigint], {poolId: bigint}, []>(
        abi, '0xc707a39f'
    ),
    createPool: new Func<[requestedPoolId: bigint, owner: string], {requestedPoolId: bigint, owner: string}, []>(
        abi, '0xcaab529b'
    ),
    'getMinLiquidityRatio()': new Func<[], {}, bigint>(
        abi, '0xfd85c1f8'
    ),
    getNominatedPoolOwner: new Func<[poolId: bigint], {poolId: bigint}, string>(
        abi, '0x9851af01'
    ),
    getPoolCollateralConfiguration: new Func<[poolId: bigint, collateralType: string], {poolId: bigint, collateralType: string}, ([collateralLimitD18: bigint, issuanceRatioD18: bigint] & {collateralLimitD18: bigint, issuanceRatioD18: bigint})>(
        abi, '0xc77e51f6'
    ),
    getPoolCollateralIssuanceRatio: new Func<[poolId: bigint, collateral: string], {poolId: bigint, collateral: string}, bigint>(
        abi, '0xc4d2aad3'
    ),
    getPoolConfiguration: new Func<[poolId: bigint], {poolId: bigint}, Array<([marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint] & {marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint})>>(
        abi, '0xefecf137'
    ),
    getPoolName: new Func<[poolId: bigint], {poolId: bigint}, string>(
        abi, '0xf86e6f91'
    ),
    getPoolOwner: new Func<[poolId: bigint], {poolId: bigint}, string>(
        abi, '0xbbdd7c5a'
    ),
    nominatePoolOwner: new Func<[nominatedOwner: string, poolId: bigint], {nominatedOwner: string, poolId: bigint}, []>(
        abi, '0x6141f7a2'
    ),
    rebalancePool: new Func<[poolId: bigint, optionalCollateralType: string], {poolId: bigint, optionalCollateralType: string}, []>(
        abi, '0x183231d7'
    ),
    renouncePoolNomination: new Func<[poolId: bigint], {poolId: bigint}, []>(
        abi, '0xca5bed77'
    ),
    renouncePoolOwnership: new Func<[poolId: bigint], {poolId: bigint}, []>(
        abi, '0x7cc14a92'
    ),
    revokePoolNomination: new Func<[poolId: bigint], {poolId: bigint}, []>(
        abi, '0x1f1b33b9'
    ),
    'setMinLiquidityRatio(uint256)': new Func<[minLiquidityRatio: bigint], {minLiquidityRatio: bigint}, []>(
        abi, '0x34078a01'
    ),
    setPoolCollateralConfiguration: new Func<[poolId: bigint, collateralType: string, newConfig: ([collateralLimitD18: bigint, issuanceRatioD18: bigint] & {collateralLimitD18: bigint, issuanceRatioD18: bigint})], {poolId: bigint, collateralType: string, newConfig: ([collateralLimitD18: bigint, issuanceRatioD18: bigint] & {collateralLimitD18: bigint, issuanceRatioD18: bigint})}, []>(
        abi, '0x5a4aabb1'
    ),
    setPoolCollateralDisabledByDefault: new Func<[poolId: bigint, disabled: boolean], {poolId: bigint, disabled: boolean}, []>(
        abi, '0x4c6568b1'
    ),
    setPoolConfiguration: new Func<[poolId: bigint, newMarketConfigurations: Array<([marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint] & {marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint})>], {poolId: bigint, newMarketConfigurations: Array<([marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint] & {marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint})>}, []>(
        abi, '0x5d8c8844'
    ),
    setPoolName: new Func<[poolId: bigint, name: string], {poolId: bigint, name: string}, []>(
        abi, '0x11e72a43'
    ),
    claimRewards: new Func<[accountId: bigint, poolId: bigint, collateralType: string, distributor: string], {accountId: bigint, poolId: bigint, collateralType: string, distributor: string}, bigint>(
        abi, '0x460d2049'
    ),
    distributeRewards: new Func<[poolId: bigint, collateralType: string, amount: bigint, start: bigint, duration: number], {poolId: bigint, collateralType: string, amount: bigint, start: bigint, duration: number}, []>(
        abi, '0x5a7ff7c5'
    ),
    getAvailableRewards: new Func<[accountId: bigint, poolId: bigint, collateralType: string, distributor: string], {accountId: bigint, poolId: bigint, collateralType: string, distributor: string}, bigint>(
        abi, '0xc4b3410e'
    ),
    getRewardRate: new Func<[poolId: bigint, collateralType: string, distributor: string], {poolId: bigint, collateralType: string, distributor: string}, bigint>(
        abi, '0x0dd2395a'
    ),
    registerRewardsDistributor: new Func<[poolId: bigint, collateralType: string, distributor: string], {poolId: bigint, collateralType: string, distributor: string}, []>(
        abi, '0x170c1351'
    ),
    removeRewardsDistributor: new Func<[poolId: bigint, collateralType: string, distributor: string], {poolId: bigint, collateralType: string, distributor: string}, []>(
        abi, '0x2685f42b'
    ),
    updateRewards: new Func<[poolId: bigint, collateralType: string, accountId: bigint], {poolId: bigint, collateralType: string, accountId: bigint}, [_: Array<bigint>, _: Array<string>]>(
        abi, '0x645657d8'
    ),
    configureChainlinkCrossChain: new Func<[ccipRouter: string, ccipTokenPool: string], {ccipRouter: string, ccipTokenPool: string}, []>(
        abi, '0x10d52805'
    ),
    configureOracleManager: new Func<[oracleManagerAddress: string], {oracleManagerAddress: string}, []>(
        abi, '0xa5d49393'
    ),
    getConfig: new Func<[k: string], {k: string}, string>(
        abi, '0x6dd5b69d'
    ),
    getConfigAddress: new Func<[k: string], {k: string}, string>(
        abi, '0xf896503a'
    ),
    getConfigUint: new Func<[k: string], {k: string}, bigint>(
        abi, '0xf92bb8c9'
    ),
    getTrustedForwarder: new Func<[], {}, string>(
        abi, '0xce1b815f'
    ),
    isTrustedForwarder: new Func<[forwarder: string], {forwarder: string}, boolean>(
        abi, '0x572b6c05'
    ),
    setConfig: new Func<[k: string, v: string], {k: string, v: string}, []>(
        abi, '0xd1fd27b3'
    ),
    setSupportedCrossChainNetworks: new Func<[supportedNetworks: Array<bigint>, ccipSelectors: Array<bigint>], {supportedNetworks: Array<bigint>, ccipSelectors: Array<bigint>}, bigint>(
        abi, '0x830e23b5'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    delegateCollateral: new Func<[accountId: bigint, poolId: bigint, collateralType: string, newCollateralAmountD18: bigint, leverage: bigint], {accountId: bigint, poolId: bigint, collateralType: string, newCollateralAmountD18: bigint, leverage: bigint}, []>(
        abi, '0x7b0532a4'
    ),
    getPosition: new Func<[accountId: bigint, poolId: bigint, collateralType: string], {accountId: bigint, poolId: bigint, collateralType: string}, ([collateralAmount: bigint, collateralValue: bigint, debt: bigint, collateralizationRatio: bigint] & {collateralAmount: bigint, collateralValue: bigint, debt: bigint, collateralizationRatio: bigint})>(
        abi, '0xf544d66e'
    ),
    getPositionCollateral: new Func<[accountId: bigint, poolId: bigint, collateralType: string], {accountId: bigint, poolId: bigint, collateralType: string}, bigint>(
        abi, '0x33cc422b'
    ),
    getPositionCollateralRatio: new Func<[accountId: bigint, poolId: bigint, collateralType: string], {accountId: bigint, poolId: bigint, collateralType: string}, bigint>(
        abi, '0xdc0a5384'
    ),
    getPositionDebt: new Func<[accountId: bigint, poolId: bigint, collateralType: string], {accountId: bigint, poolId: bigint, collateralType: string}, bigint>(
        abi, '0x3593bbd2'
    ),
    getVaultCollateral: new Func<[poolId: bigint, collateralType: string], {poolId: bigint, collateralType: string}, ([amount: bigint, value: bigint] & {amount: bigint, value: bigint})>(
        abi, '0x078145a8'
    ),
    getVaultCollateralRatio: new Func<[poolId: bigint, collateralType: string], {poolId: bigint, collateralType: string}, bigint>(
        abi, '0x60248c55'
    ),
    getVaultDebt: new Func<[poolId: bigint, collateralType: string], {poolId: bigint, collateralType: string}, bigint>(
        abi, '0x2fb8ff24'
    ),
}

export class Contract extends ContractBase {

    getImplementation(): Promise<string> {
        return this.eth_call(functions.getImplementation, [])
    }

    nominatedOwner(): Promise<string> {
        return this.eth_call(functions.nominatedOwner, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
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

    getAccountAvailableCollateral(accountId: bigint, collateralType: string): Promise<bigint> {
        return this.eth_call(functions.getAccountAvailableCollateral, [accountId, collateralType])
    }

    getAccountCollateral(accountId: bigint, collateralType: string): Promise<([totalDeposited: bigint, totalAssigned: bigint, totalLocked: bigint] & {totalDeposited: bigint, totalAssigned: bigint, totalLocked: bigint})> {
        return this.eth_call(functions.getAccountCollateral, [accountId, collateralType])
    }

    getLocks(accountId: bigint, collateralType: string, offset: bigint, count: bigint): Promise<Array<([amountD18: bigint, lockExpirationTime: bigint] & {amountD18: bigint, lockExpirationTime: bigint})>> {
        return this.eth_call(functions.getLocks, [accountId, collateralType, offset, count])
    }

    getCollateralConfiguration(collateralType: string): Promise<([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})> {
        return this.eth_call(functions.getCollateralConfiguration, [collateralType])
    }

    getCollateralConfigurations(hideDisabled: boolean): Promise<Array<([depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint] & {depositingEnabled: boolean, issuanceRatioD18: bigint, liquidationRatioD18: bigint, liquidationRewardD18: bigint, oracleNodeId: string, tokenAddress: string, minDelegationD18: bigint})>> {
        return this.eth_call(functions.getCollateralConfigurations, [hideDisabled])
    }

    getCollateralPrice(collateralType: string): Promise<bigint> {
        return this.eth_call(functions.getCollateralPrice, [collateralType])
    }

    getMarketCollateralAmount(marketId: bigint, collateralType: string): Promise<bigint> {
        return this.eth_call(functions.getMarketCollateralAmount, [marketId, collateralType])
    }

    getMarketCollateralValue(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketCollateralValue, [marketId])
    }

    getMaximumMarketCollateral(marketId: bigint, collateralType: string): Promise<bigint> {
        return this.eth_call(functions.getMaximumMarketCollateral, [marketId, collateralType])
    }

    getMarketAddress(marketId: bigint): Promise<string> {
        return this.eth_call(functions.getMarketAddress, [marketId])
    }

    getMarketCollateral(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketCollateral, [marketId])
    }

    getMarketFees(arg0: bigint, amount: bigint): Promise<([depositFeeAmount: bigint, withdrawFeeAmount: bigint] & {depositFeeAmount: bigint, withdrawFeeAmount: bigint})> {
        return this.eth_call(functions.getMarketFees, [arg0, amount])
    }

    getMarketMinDelegateTime(marketId: bigint): Promise<number> {
        return this.eth_call(functions.getMarketMinDelegateTime, [marketId])
    }

    getMarketNetIssuance(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketNetIssuance, [marketId])
    }

    getMarketReportedDebt(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketReportedDebt, [marketId])
    }

    getMarketTotalDebt(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketTotalDebt, [marketId])
    }

    'getMinLiquidityRatio(uint128)'(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions['getMinLiquidityRatio(uint128)'], [marketId])
    }

    getOracleManager(): Promise<string> {
        return this.eth_call(functions.getOracleManager, [])
    }

    getUsdToken(): Promise<string> {
        return this.eth_call(functions.getUsdToken, [])
    }

    getWithdrawableMarketUsd(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getWithdrawableMarketUsd, [marketId])
    }

    isMarketCapacityLocked(marketId: bigint): Promise<boolean> {
        return this.eth_call(functions.isMarketCapacityLocked, [marketId])
    }

    getApprovedPools(): Promise<Array<bigint>> {
        return this.eth_call(functions.getApprovedPools, [])
    }

    getPreferredPool(): Promise<bigint> {
        return this.eth_call(functions.getPreferredPool, [])
    }

    'getMinLiquidityRatio()'(): Promise<bigint> {
        return this.eth_call(functions['getMinLiquidityRatio()'], [])
    }

    getNominatedPoolOwner(poolId: bigint): Promise<string> {
        return this.eth_call(functions.getNominatedPoolOwner, [poolId])
    }

    getPoolCollateralConfiguration(poolId: bigint, collateralType: string): Promise<([collateralLimitD18: bigint, issuanceRatioD18: bigint] & {collateralLimitD18: bigint, issuanceRatioD18: bigint})> {
        return this.eth_call(functions.getPoolCollateralConfiguration, [poolId, collateralType])
    }

    getPoolCollateralIssuanceRatio(poolId: bigint, collateral: string): Promise<bigint> {
        return this.eth_call(functions.getPoolCollateralIssuanceRatio, [poolId, collateral])
    }

    getPoolConfiguration(poolId: bigint): Promise<Array<([marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint] & {marketId: bigint, weightD18: bigint, maxDebtShareValueD18: bigint})>> {
        return this.eth_call(functions.getPoolConfiguration, [poolId])
    }

    getPoolName(poolId: bigint): Promise<string> {
        return this.eth_call(functions.getPoolName, [poolId])
    }

    getPoolOwner(poolId: bigint): Promise<string> {
        return this.eth_call(functions.getPoolOwner, [poolId])
    }

    getAvailableRewards(accountId: bigint, poolId: bigint, collateralType: string, distributor: string): Promise<bigint> {
        return this.eth_call(functions.getAvailableRewards, [accountId, poolId, collateralType, distributor])
    }

    getRewardRate(poolId: bigint, collateralType: string, distributor: string): Promise<bigint> {
        return this.eth_call(functions.getRewardRate, [poolId, collateralType, distributor])
    }

    getConfig(k: string): Promise<string> {
        return this.eth_call(functions.getConfig, [k])
    }

    getConfigAddress(k: string): Promise<string> {
        return this.eth_call(functions.getConfigAddress, [k])
    }

    getConfigUint(k: string): Promise<bigint> {
        return this.eth_call(functions.getConfigUint, [k])
    }

    getTrustedForwarder(): Promise<string> {
        return this.eth_call(functions.getTrustedForwarder, [])
    }

    isTrustedForwarder(forwarder: string): Promise<boolean> {
        return this.eth_call(functions.isTrustedForwarder, [forwarder])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    getPositionCollateral(accountId: bigint, poolId: bigint, collateralType: string): Promise<bigint> {
        return this.eth_call(functions.getPositionCollateral, [accountId, poolId, collateralType])
    }

    getVaultCollateral(poolId: bigint, collateralType: string): Promise<([amount: bigint, value: bigint] & {amount: bigint, value: bigint})> {
        return this.eth_call(functions.getVaultCollateral, [poolId, collateralType])
    }
}
