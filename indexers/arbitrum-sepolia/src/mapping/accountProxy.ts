import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import * as spec from '../abi/AccountProxy'
import {Log, Transaction} from '../processor'

const address = '0x1b791d05e437c78039424749243f5a79e747525e'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['OwnerChanged'].topic: {
                let e = spec.events['OwnerChanged'].decode(log)
                ctx.store.AccountProxyEventOwnerChanged.write({
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
                ctx.store.AccountProxyEventOwnerNominated.write({
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
                ctx.store.AccountProxyEventUpgraded.write({
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
            case spec.events['Approval'].topic: {
                let e = spec.events['Approval'].decode(log)
                ctx.store.AccountProxyEventApproval.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'Approval',
                    owner: e[0],
                    approved: e[1],
                    tokenId: e[2],
                })
                break
            }
            case spec.events['ApprovalForAll'].topic: {
                let e = spec.events['ApprovalForAll'].decode(log)
                ctx.store.AccountProxyEventApprovalForAll.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'ApprovalForAll',
                    owner: e[0],
                    operator: e[1],
                    approved: e[2],
                })
                break
            }
            case spec.events['Transfer'].topic: {
                let e = spec.events['Transfer'].decode(log)
                ctx.store.AccountProxyEventTransfer.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'Transfer',
                    from: e[0],
                    to: e[1],
                    tokenId: e[2],
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
