import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './SpotMarketProxy.abi'

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
    AssociatedSystemSet: new LogEvent<([kind: string, id: string, proxy: string, impl: string] & {kind: string, id: string, proxy: string, impl: string})>(
        abi, '0xc8551a5a03a7b06d5d20159b3b8839429a7aefab4bf3d020f1b65fa903ccb3d2'
    ),
    DecayRateUpdated: new LogEvent<([marketId: bigint, rate: bigint] & {marketId: bigint, rate: bigint})>(
        abi, '0x8a1ed33cd71d1533eadd1d4eb0ea2ae64da7d343cb2a932fdf135f345264e2b5'
    ),
    MarketNominationRenounced: new LogEvent<([marketId: bigint, nominee: string] & {marketId: bigint, nominee: string})>(
        abi, '0xf5b87e3c7e0caa8e0d233591fff85e764ebc73d5c7027cce729fd4beab04c2b6'
    ),
    MarketOwnerChanged: new LogEvent<([marketId: bigint, oldOwner: string, newOwner: string] & {marketId: bigint, oldOwner: string, newOwner: string})>(
        abi, '0xe73c996387b656d1e0ea2866c854ed68122ce4e4eea51d6af012938b3c7ff52f'
    ),
    MarketOwnerNominated: new LogEvent<([marketId: bigint, newOwner: string] & {marketId: bigint, newOwner: string})>(
        abi, '0x54605d90ee82d9b4318b0b4b479f3966976e44b94c6aff221c04f5294f85016b'
    ),
    SynthImplementationSet: new LogEvent<([synthImplementation: string] & {synthImplementation: string})>(
        abi, '0xafffc48b3243eba10d901f21ba761ad741f18a23feed86ca425df4974d3314b0'
    ),
    SynthImplementationUpgraded: new LogEvent<([synthMarketId: bigint, proxy: string, implementation: string] & {synthMarketId: bigint, proxy: string, implementation: string})>(
        abi, '0xa7badace8b24daeeb3981497a506d3812b3dc6f147ef3f78bc0e2cc664c50330'
    ),
    SynthPriceDataUpdated: new LogEvent<([synthMarketId: bigint, buyFeedId: string, sellFeedId: string, strictStalenessTolerance: bigint] & {synthMarketId: bigint, buyFeedId: string, sellFeedId: string, strictStalenessTolerance: bigint})>(
        abi, '0x814bcac408168fe72c457055f55abbaf041ad2e7ff12cdb93b058efe2216d8e9'
    ),
    SynthRegistered: new LogEvent<([synthMarketId: bigint, synthTokenAddress: string] & {synthMarketId: bigint, synthTokenAddress: string})>(
        abi, '0x04b07b1c236913894927915a3dd91c8e250223fc668ceabdc47074c5a77e2cb9'
    ),
    SynthetixSystemSet: new LogEvent<([synthetix: string, usdTokenAddress: string, oracleManager: string] & {synthetix: string, usdTokenAddress: string, oracleManager: string})>(
        abi, '0x52dccf7e2653d5ae8cf1d18c5499fd530f01920181d81afdf6bf489d897e24aa'
    ),
    SynthBought: new LogEvent<([synthMarketId: bigint, synthReturned: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), collectedFees: bigint, referrer: string, price: bigint] & {synthMarketId: bigint, synthReturned: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), collectedFees: bigint, referrer: string, price: bigint})>(
        abi, '0xac82d63e679c7d862613aa8b5ccd94f9adc4986763ab14bb3351ab9092ef1303'
    ),
    SynthSold: new LogEvent<([synthMarketId: bigint, amountReturned: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), collectedFees: bigint, referrer: string, price: bigint] & {synthMarketId: bigint, amountReturned: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), collectedFees: bigint, referrer: string, price: bigint})>(
        abi, '0x61fa4bb370a2f18a502b3bcf1d0755e53371d58791fa42766aa6386bbefb594a'
    ),
    OrderCancelled: new LogEvent<([marketId: bigint, asyncOrderId: bigint, asyncOrderClaim: ([id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string] & {id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string}), sender: string] & {marketId: bigint, asyncOrderId: bigint, asyncOrderClaim: ([id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string] & {id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string}), sender: string})>(
        abi, '0xa57ffc5057d10e88a0dd7713d14130f9638d680af94401e7f1f4fba44a3ad5e2'
    ),
    OrderCommitted: new LogEvent<([marketId: bigint, orderType: number, amountProvided: bigint, asyncOrderId: bigint, sender: string, referrer: string] & {marketId: bigint, orderType: number, amountProvided: bigint, asyncOrderId: bigint, sender: string, referrer: string})>(
        abi, '0xb26c216bf0a127dddc2431e4d8ca845513c8e6fb80e754296e7afab1ce92722f'
    ),
    OrderSettled: new LogEvent<([marketId: bigint, asyncOrderId: bigint, finalOrderAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), collectedFees: bigint, settler: string, price: bigint, orderType: number] & {marketId: bigint, asyncOrderId: bigint, finalOrderAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), collectedFees: bigint, settler: string, price: bigint, orderType: number})>(
        abi, '0x6c5e8ff282d52fb9f532408e86d4afc62fc1f89c749a8ddca7a6f34c0439a183'
    ),
    SettlementStrategyAdded: new LogEvent<([synthMarketId: bigint, strategyId: bigint] & {synthMarketId: bigint, strategyId: bigint})>(
        abi, '0x91750a8e3d84ed1bccdc79dcecf63cc1b6f83b5bf8293bf86628cbb248e487f1'
    ),
    SettlementStrategySet: new LogEvent<([synthMarketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})] & {synthMarketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})})>(
        abi, '0x3b785af09c0835778dc2ef3acec91abfbcf58e48118ede60e3a33ba55ec8af3d'
    ),
    SynthUnwrapped: new LogEvent<([synthMarketId: bigint, amountUnwrapped: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), feesCollected: bigint] & {synthMarketId: bigint, amountUnwrapped: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), feesCollected: bigint})>(
        abi, '0xa1dd74fb936c7942732e4355961ca6944ca6c6744121ace0d9a1203d664231b3'
    ),
    SynthWrapped: new LogEvent<([synthMarketId: bigint, amountWrapped: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), feesCollected: bigint] & {synthMarketId: bigint, amountWrapped: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint}), feesCollected: bigint})>(
        abi, '0xea50ab2f37d37692441c4a16317c1287bb410a3a616a16c49c9ca76d415667ff'
    ),
    WrapperSet: new LogEvent<([synthMarketId: bigint, wrapCollateralType: string, maxWrappableAmount: bigint] & {synthMarketId: bigint, wrapCollateralType: string, maxWrappableAmount: bigint})>(
        abi, '0xf6b8d296783aecfc5d372dff3e3e802ab63338637f9a2f3e2aae1e745c148def'
    ),
    AsyncFixedFeeSet: new LogEvent<([synthMarketId: bigint, asyncFixedFee: bigint] & {synthMarketId: bigint, asyncFixedFee: bigint})>(
        abi, '0xaef59d229d195c5b8372221acbf4041b926fb1616a95f93e44379e4f30d57bfe'
    ),
    AtomicFixedFeeSet: new LogEvent<([synthMarketId: bigint, atomicFixedFee: bigint] & {synthMarketId: bigint, atomicFixedFee: bigint})>(
        abi, '0x6b0a526b06b2f30ba2d5b063c2ef81547512216d37c540b86039e3a19f1d2b3f'
    ),
    CollateralLeverageSet: new LogEvent<([synthMarketId: bigint, collateralLeverage: bigint] & {synthMarketId: bigint, collateralLeverage: bigint})>(
        abi, '0x83113c0e8d811f7e7017948357e945a1a8a6b6fc0d76c8512ffdd6f6766e8a13'
    ),
    FeeCollectorSet: new LogEvent<([synthMarketId: bigint, feeCollector: string] & {synthMarketId: bigint, feeCollector: string})>(
        abi, '0x9559a9b7e14bf53553c17859be245a108350185ec859ec690012b13b820b7ef4'
    ),
    MarketSkewScaleSet: new LogEvent<([synthMarketId: bigint, skewScale: bigint] & {synthMarketId: bigint, skewScale: bigint})>(
        abi, '0x786fdfd5a0e146d8f4878876a8439ff01436e5969b14682e12d07d7e926b157c'
    ),
    MarketUtilizationFeesSet: new LogEvent<([synthMarketId: bigint, utilizationFeeRate: bigint] & {synthMarketId: bigint, utilizationFeeRate: bigint})>(
        abi, '0x83dfad56ac61e49feb43345b8c73b6d45eb121decc66b1709ca0413b31c64f63'
    ),
    ReferrerShareUpdated: new LogEvent<([marketId: bigint, referrer: string, sharePercentage: bigint] & {marketId: bigint, referrer: string, sharePercentage: bigint})>(
        abi, '0xd2a3339bb3c610e9030023c1cb3e89374fe0ebd7e37faee9b3d343f33e9df2fb'
    ),
    TransactorFixedFeeSet: new LogEvent<([synthMarketId: bigint, transactor: string, fixedFeeAmount: bigint] & {synthMarketId: bigint, transactor: string, fixedFeeAmount: bigint})>(
        abi, '0xeed7c7ebc4a7e7456a5b14f961bbe55d026f35a2a2b52d1ad43fe11c348df24a'
    ),
    WrapperFeesSet: new LogEvent<([synthMarketId: bigint, wrapFee: bigint, unwrapFee: bigint] & {synthMarketId: bigint, wrapFee: bigint, unwrapFee: bigint})>(
        abi, '0x84c5bc20d6e52e92afe6ebc9d85d3e4d35de276ba3f05cae640db053f5b861b8'
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
    acceptMarketOwnership: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, []>(
        abi, '0x1c216a0e'
    ),
    createSynth: new Func<[tokenName: string, tokenSymbol: string, synthOwner: string], {tokenName: string, tokenSymbol: string, synthOwner: string}, bigint>(
        abi, '0x2e535d61'
    ),
    getAssociatedSystem: new Func<[id: string], {id: string}, ([addr: string, kind: string] & {addr: string, kind: string})>(
        abi, '0x60988e09'
    ),
    getMarketOwner: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, string>(
        abi, '0xa7b8cb9f'
    ),
    getNominatedMarketOwner: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, string>(
        abi, '0xd2a25290'
    ),
    getPriceData: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, ([buyFeedId: string, sellFeedId: string, strictPriceStalenessTolerance: bigint] & {buyFeedId: string, sellFeedId: string, strictPriceStalenessTolerance: bigint})>(
        abi, '0x462b9a2d'
    ),
    getSynth: new Func<[marketId: bigint], {marketId: bigint}, string>(
        abi, '0x69e0365f'
    ),
    getSynthImpl: new Func<[marketId: bigint], {marketId: bigint}, string>(
        abi, '0x3e0c76ca'
    ),
    initOrUpgradeNft: new Func<[id: string, name: string, symbol: string, uri: string, impl: string], {id: string, name: string, symbol: string, uri: string, impl: string}, []>(
        abi, '0x2d22bef9'
    ),
    initOrUpgradeToken: new Func<[id: string, name: string, symbol: string, decimals: number, impl: string], {id: string, name: string, symbol: string, decimals: number, impl: string}, []>(
        abi, '0xc6f79537'
    ),
    minimumCredit: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0xafe79200'
    ),
    name: new Func<[marketId: bigint], {marketId: bigint}, string>(
        abi, '0xc624440a'
    ),
    nominateMarketOwner: new Func<[synthMarketId: bigint, newNominatedOwner: string], {synthMarketId: bigint, newNominatedOwner: string}, []>(
        abi, '0x5950864b'
    ),
    registerUnmanagedSystem: new Func<[id: string, endpoint: string], {id: string, endpoint: string}, []>(
        abi, '0xd245d983'
    ),
    renounceMarketNomination: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, []>(
        abi, '0x298b26bf'
    ),
    renounceMarketOwnership: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, []>(
        abi, '0xbd1cdfb5'
    ),
    reportedDebt: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0xbcec0d0f'
    ),
    setDecayRate: new Func<[marketId: bigint, rate: bigint], {marketId: bigint, rate: bigint}, []>(
        abi, '0xec846bac'
    ),
    setSynthImplementation: new Func<[synthImplementation: string], {synthImplementation: string}, []>(
        abi, '0xec04ceb1'
    ),
    setSynthetix: new Func<[synthetix: string], {synthetix: string}, []>(
        abi, '0xfec9f9da'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    updatePriceData: new Func<[synthMarketId: bigint, buyFeedId: string, sellFeedId: string, strictPriceStalenessTolerance: bigint], {synthMarketId: bigint, buyFeedId: string, sellFeedId: string, strictPriceStalenessTolerance: bigint}, []>(
        abi, '0x911414c6'
    ),
    upgradeSynthImpl: new Func<[marketId: bigint], {marketId: bigint}, []>(
        abi, '0xc99d0cdd'
    ),
    buy: new Func<[marketId: bigint, usdAmount: bigint, minAmountReceived: bigint, referrer: string], {marketId: bigint, usdAmount: bigint, minAmountReceived: bigint, referrer: string}, ([synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x37fb3369'
    ),
    buyExactIn: new Func<[marketId: bigint, usdAmount: bigint, minAmountReceived: bigint, referrer: string], {marketId: bigint, usdAmount: bigint, minAmountReceived: bigint, referrer: string}, ([synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0xa12d9400'
    ),
    buyExactOut: new Func<[marketId: bigint, synthAmount: bigint, maxUsdAmount: bigint, referrer: string], {marketId: bigint, synthAmount: bigint, maxUsdAmount: bigint, referrer: string}, ([usdAmountCharged: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {usdAmountCharged: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x983220bb'
    ),
    getMarketSkew: new Func<[marketId: bigint], {marketId: bigint}, bigint>(
        abi, '0xa05ee4f6'
    ),
    quoteBuyExactIn: new Func<[marketId: bigint, usdAmount: bigint, stalenessTolerance: number], {marketId: bigint, usdAmount: bigint, stalenessTolerance: number}, ([synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0xab75d950'
    ),
    quoteBuyExactOut: new Func<[marketId: bigint, synthAmount: bigint, stalenessTolerance: number], {marketId: bigint, synthAmount: bigint, stalenessTolerance: number}, ([usdAmountCharged: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {usdAmountCharged: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x70d9a0c6'
    ),
    quoteSellExactIn: new Func<[marketId: bigint, synthAmount: bigint, stalenessTolerance: number], {marketId: bigint, synthAmount: bigint, stalenessTolerance: number}, ([returnAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {returnAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x687ed93d'
    ),
    quoteSellExactOut: new Func<[marketId: bigint, usdAmount: bigint, stalenessTolerance: number], {marketId: bigint, usdAmount: bigint, stalenessTolerance: number}, ([synthToBurn: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {synthToBurn: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0xc4b41a2e'
    ),
    sell: new Func<[marketId: bigint, synthAmount: bigint, minUsdAmount: bigint, referrer: string], {marketId: bigint, synthAmount: bigint, minUsdAmount: bigint, referrer: string}, ([usdAmountReceived: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {usdAmountReceived: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x4d4bfbd5'
    ),
    sellExactIn: new Func<[marketId: bigint, synthAmount: bigint, minAmountReceived: bigint, referrer: string], {marketId: bigint, synthAmount: bigint, minAmountReceived: bigint, referrer: string}, ([returnAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {returnAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x3d1a60e4'
    ),
    sellExactOut: new Func<[marketId: bigint, usdAmount: bigint, maxSynthAmount: bigint, referrer: string], {marketId: bigint, usdAmount: bigint, maxSynthAmount: bigint, referrer: string}, ([synthToBurn: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {synthToBurn: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x4ce94d9d'
    ),
    cancelOrder: new Func<[marketId: bigint, asyncOrderId: bigint], {marketId: bigint, asyncOrderId: bigint}, []>(
        abi, '0x4138dc53'
    ),
    commitOrder: new Func<[marketId: bigint, orderType: number, amountProvided: bigint, settlementStrategyId: bigint, minimumSettlementAmount: bigint, referrer: string], {marketId: bigint, orderType: number, amountProvided: bigint, settlementStrategyId: bigint, minimumSettlementAmount: bigint, referrer: string}, ([id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string] & {id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string})>(
        abi, '0xd393340e'
    ),
    getAsyncOrderClaim: new Func<[marketId: bigint, asyncOrderId: bigint], {marketId: bigint, asyncOrderId: bigint}, ([id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string] & {id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string})>(
        abi, '0x5381ce16'
    ),
    settleOrder: new Func<[marketId: bigint, asyncOrderId: bigint], {marketId: bigint, asyncOrderId: bigint}, ([finalOrderAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {finalOrderAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x9444ac48'
    ),
    addSettlementStrategy: new Func<[marketId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})], {marketId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})}, bigint>(
        abi, '0x97b30e6d'
    ),
    getSettlementStrategy: new Func<[marketId: bigint, strategyId: bigint], {marketId: bigint, strategyId: bigint}, ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})>(
        abi, '0xf74c377f'
    ),
    setSettlementStrategy: new Func<[marketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})], {marketId: bigint, strategyId: bigint, strategy: ([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})}, []>(
        abi, '0x7cbe2075'
    ),
    setSettlementStrategyEnabled: new Func<[marketId: bigint, strategyId: bigint, enabled: boolean], {marketId: bigint, strategyId: bigint, enabled: boolean}, []>(
        abi, '0x7f73a891'
    ),
    getWrapper: new Func<[marketId: bigint], {marketId: bigint}, ([wrapCollateralType: string, maxWrappableAmount: bigint] & {wrapCollateralType: string, maxWrappableAmount: bigint})>(
        abi, '0x5fdf4e98'
    ),
    setWrapper: new Func<[marketId: bigint, wrapCollateralType: string, maxWrappableAmount: bigint], {marketId: bigint, wrapCollateralType: string, maxWrappableAmount: bigint}, []>(
        abi, '0x673a21e5'
    ),
    unwrap: new Func<[marketId: bigint, unwrapAmount: bigint, minAmountReceived: bigint], {marketId: bigint, unwrapAmount: bigint, minAmountReceived: bigint}, ([returnCollateralAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {returnCollateralAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0x784dad9e'
    ),
    wrap: new Func<[marketId: bigint, wrapAmount: bigint, minAmountReceived: bigint], {marketId: bigint, wrapAmount: bigint, minAmountReceived: bigint}, ([amountToMint: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {amountToMint: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})>(
        abi, '0xd7ce770c'
    ),
    getCollateralLeverage: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, bigint>(
        abi, '0xcdfaef0f'
    ),
    getCustomTransactorFees: new Func<[synthMarketId: bigint, transactor: string], {synthMarketId: bigint, transactor: string}, bigint>(
        abi, '0x2efaa971'
    ),
    getFeeCollector: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, string>(
        abi, '0x5497eb23'
    ),
    getMarketFees: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, ([atomicFixedFee: bigint, asyncFixedFee: bigint, wrapFee: bigint, unwrapFee: bigint] & {atomicFixedFee: bigint, asyncFixedFee: bigint, wrapFee: bigint, unwrapFee: bigint})>(
        abi, '0x32598e61'
    ),
    getMarketSkewScale: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, bigint>(
        abi, '0x8d105571'
    ),
    getMarketUtilizationFees: new Func<[synthMarketId: bigint], {synthMarketId: bigint}, bigint>(
        abi, '0xf375f324'
    ),
    getReferrerShare: new Func<[synthMarketId: bigint, referrer: string], {synthMarketId: bigint, referrer: string}, bigint>(
        abi, '0xfa4b28ed'
    ),
    setAsyncFixedFee: new Func<[synthMarketId: bigint, asyncFixedFee: bigint], {synthMarketId: bigint, asyncFixedFee: bigint}, []>(
        abi, '0x61dcca86'
    ),
    setAtomicFixedFee: new Func<[synthMarketId: bigint, atomicFixedFee: bigint], {synthMarketId: bigint, atomicFixedFee: bigint}, []>(
        abi, '0x480be91f'
    ),
    setCollateralLeverage: new Func<[synthMarketId: bigint, collateralLeverage: bigint], {synthMarketId: bigint, collateralLeverage: bigint}, []>(
        abi, '0x21f7f58f'
    ),
    setCustomTransactorFees: new Func<[synthMarketId: bigint, transactor: string, fixedFeeAmount: bigint], {synthMarketId: bigint, transactor: string, fixedFeeAmount: bigint}, []>(
        abi, '0x95fcd547'
    ),
    setFeeCollector: new Func<[synthMarketId: bigint, feeCollector: string], {synthMarketId: bigint, feeCollector: string}, []>(
        abi, '0x025f6120'
    ),
    setMarketSkewScale: new Func<[synthMarketId: bigint, skewScale: bigint], {synthMarketId: bigint, skewScale: bigint}, []>(
        abi, '0x9a40f8cb'
    ),
    setMarketUtilizationFees: new Func<[synthMarketId: bigint, utilizationFeeRate: bigint], {synthMarketId: bigint, utilizationFeeRate: bigint}, []>(
        abi, '0x45f2601c'
    ),
    setWrapperFees: new Func<[synthMarketId: bigint, wrapFee: bigint, unwrapFee: bigint], {synthMarketId: bigint, wrapFee: bigint, unwrapFee: bigint}, []>(
        abi, '0x6539b1c3'
    ),
    updateReferrerShare: new Func<[synthMarketId: bigint, referrer: string, sharePercentage: bigint], {synthMarketId: bigint, referrer: string, sharePercentage: bigint}, []>(
        abi, '0x6ad77077'
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

    getAssociatedSystem(id: string): Promise<([addr: string, kind: string] & {addr: string, kind: string})> {
        return this.eth_call(functions.getAssociatedSystem, [id])
    }

    getMarketOwner(synthMarketId: bigint): Promise<string> {
        return this.eth_call(functions.getMarketOwner, [synthMarketId])
    }

    getNominatedMarketOwner(synthMarketId: bigint): Promise<string> {
        return this.eth_call(functions.getNominatedMarketOwner, [synthMarketId])
    }

    getPriceData(synthMarketId: bigint): Promise<([buyFeedId: string, sellFeedId: string, strictPriceStalenessTolerance: bigint] & {buyFeedId: string, sellFeedId: string, strictPriceStalenessTolerance: bigint})> {
        return this.eth_call(functions.getPriceData, [synthMarketId])
    }

    getSynth(marketId: bigint): Promise<string> {
        return this.eth_call(functions.getSynth, [marketId])
    }

    getSynthImpl(marketId: bigint): Promise<string> {
        return this.eth_call(functions.getSynthImpl, [marketId])
    }

    minimumCredit(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.minimumCredit, [marketId])
    }

    name(marketId: bigint): Promise<string> {
        return this.eth_call(functions.name, [marketId])
    }

    reportedDebt(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.reportedDebt, [marketId])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    getMarketSkew(marketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketSkew, [marketId])
    }

    quoteBuyExactIn(marketId: bigint, usdAmount: bigint, stalenessTolerance: number): Promise<([synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {synthAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})> {
        return this.eth_call(functions.quoteBuyExactIn, [marketId, usdAmount, stalenessTolerance])
    }

    quoteBuyExactOut(marketId: bigint, synthAmount: bigint, stalenessTolerance: number): Promise<([usdAmountCharged: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {usdAmountCharged: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})> {
        return this.eth_call(functions.quoteBuyExactOut, [marketId, synthAmount, stalenessTolerance])
    }

    quoteSellExactIn(marketId: bigint, synthAmount: bigint, stalenessTolerance: number): Promise<([returnAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {returnAmount: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})> {
        return this.eth_call(functions.quoteSellExactIn, [marketId, synthAmount, stalenessTolerance])
    }

    quoteSellExactOut(marketId: bigint, usdAmount: bigint, stalenessTolerance: number): Promise<([synthToBurn: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})] & {synthToBurn: bigint, fees: ([fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint] & {fixedFees: bigint, utilizationFees: bigint, skewFees: bigint, wrapperFees: bigint})})> {
        return this.eth_call(functions.quoteSellExactOut, [marketId, usdAmount, stalenessTolerance])
    }

    getAsyncOrderClaim(marketId: bigint, asyncOrderId: bigint): Promise<([id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string] & {id: bigint, owner: string, orderType: number, amountEscrowed: bigint, settlementStrategyId: bigint, commitmentTime: bigint, minimumSettlementAmount: bigint, settledAt: bigint, referrer: string})> {
        return this.eth_call(functions.getAsyncOrderClaim, [marketId, asyncOrderId])
    }

    getSettlementStrategy(marketId: bigint, strategyId: bigint): Promise<([strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean] & {strategyType: number, settlementDelay: bigint, settlementWindowDuration: bigint, priceVerificationContract: string, feedId: string, url: string, settlementReward: bigint, priceDeviationTolerance: bigint, minimumUsdExchangeAmount: bigint, maxRoundingLoss: bigint, disabled: boolean})> {
        return this.eth_call(functions.getSettlementStrategy, [marketId, strategyId])
    }

    getWrapper(marketId: bigint): Promise<([wrapCollateralType: string, maxWrappableAmount: bigint] & {wrapCollateralType: string, maxWrappableAmount: bigint})> {
        return this.eth_call(functions.getWrapper, [marketId])
    }

    getCollateralLeverage(synthMarketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getCollateralLeverage, [synthMarketId])
    }

    getCustomTransactorFees(synthMarketId: bigint, transactor: string): Promise<bigint> {
        return this.eth_call(functions.getCustomTransactorFees, [synthMarketId, transactor])
    }

    getFeeCollector(synthMarketId: bigint): Promise<string> {
        return this.eth_call(functions.getFeeCollector, [synthMarketId])
    }

    getMarketFees(synthMarketId: bigint): Promise<([atomicFixedFee: bigint, asyncFixedFee: bigint, wrapFee: bigint, unwrapFee: bigint] & {atomicFixedFee: bigint, asyncFixedFee: bigint, wrapFee: bigint, unwrapFee: bigint})> {
        return this.eth_call(functions.getMarketFees, [synthMarketId])
    }

    getMarketSkewScale(synthMarketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketSkewScale, [synthMarketId])
    }

    getMarketUtilizationFees(synthMarketId: bigint): Promise<bigint> {
        return this.eth_call(functions.getMarketUtilizationFees, [synthMarketId])
    }

    getReferrerShare(synthMarketId: bigint, referrer: string): Promise<bigint> {
        return this.eth_call(functions.getReferrerShare, [synthMarketId, referrer])
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
}
