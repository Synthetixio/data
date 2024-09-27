import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './AccountProxy.abi'

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
    Approval: new LogEvent<([owner: string, approved: string, tokenId: bigint] & {owner: string, approved: string, tokenId: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    ApprovalForAll: new LogEvent<([owner: string, operator: string, approved: boolean] & {owner: string, operator: string, approved: boolean})>(
        abi, '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
    ),
    Transfer: new LogEvent<([from: string, to: string, tokenId: bigint] & {from: string, to: string, tokenId: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
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
    approve: new Func<[to: string, tokenId: bigint], {to: string, tokenId: bigint}, []>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[holder: string], {holder: string}, bigint>(
        abi, '0x70a08231'
    ),
    burn: new Func<[tokenId: bigint], {tokenId: bigint}, []>(
        abi, '0x42966c68'
    ),
    getApproved: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x081812fc'
    ),
    initialize: new Func<[tokenName: string, tokenSymbol: string, uri: string], {tokenName: string, tokenSymbol: string, uri: string}, []>(
        abi, '0xa6487c53'
    ),
    isApprovedForAll: new Func<[holder: string, operator: string], {holder: string, operator: string}, boolean>(
        abi, '0xe985e9c5'
    ),
    isInitialized: new Func<[], {}, boolean>(
        abi, '0x392e53cd'
    ),
    mint: new Func<[to: string, tokenId: bigint], {to: string, tokenId: bigint}, []>(
        abi, '0x40c10f19'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    ownerOf: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x6352211e'
    ),
    safeMint: new Func<[to: string, tokenId: bigint, data: string], {to: string, tokenId: bigint, data: string}, []>(
        abi, '0x8832e6e3'
    ),
    'safeTransferFrom(address,address,uint256)': new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x42842e0e'
    ),
    'safeTransferFrom(address,address,uint256,bytes)': new Func<[from: string, to: string, tokenId: bigint, data: string], {from: string, to: string, tokenId: bigint, data: string}, []>(
        abi, '0xb88d4fde'
    ),
    setAllowance: new Func<[tokenId: bigint, spender: string], {tokenId: bigint, spender: string}, []>(
        abi, '0xff53fac7'
    ),
    setApprovalForAll: new Func<[operator: string, approved: boolean], {operator: string, approved: boolean}, []>(
        abi, '0xa22cb465'
    ),
    setBaseTokenURI: new Func<[uri: string], {uri: string}, []>(
        abi, '0x30176e13'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    tokenByIndex: new Func<[index: bigint], {index: bigint}, bigint>(
        abi, '0x4f6ccce7'
    ),
    tokenOfOwnerByIndex: new Func<[owner: string, index: bigint], {owner: string, index: bigint}, bigint>(
        abi, '0x2f745c59'
    ),
    tokenURI: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0xc87b56dd'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x23b872dd'
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

    balanceOf(holder: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [holder])
    }

    getApproved(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.getApproved, [tokenId])
    }

    isApprovedForAll(holder: string, operator: string): Promise<boolean> {
        return this.eth_call(functions.isApprovedForAll, [holder, operator])
    }

    isInitialized(): Promise<boolean> {
        return this.eth_call(functions.isInitialized, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    ownerOf(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.ownerOf, [tokenId])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    tokenByIndex(index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenByIndex, [index])
    }

    tokenOfOwnerByIndex(owner: string, index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenOfOwnerByIndex, [owner, index])
    }

    tokenURI(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.tokenURI, [tokenId])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
