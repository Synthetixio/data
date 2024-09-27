import {coreProxy, accountProxy, spotMarketProxy, perpsMarketProxy, perpsAccountProxy} from './mapping'
import {processor} from './processor'
import {db, Store} from './db'

processor.run(db, async (ctx) => {
    for (let block of ctx.blocks) {
        ctx.store.Block.write({
            id: block.header.id,
            number: block.header.height,
            timestamp: new Date(block.header.timestamp),
        })

        for (let log of block.logs) {
            if (log.address === '0x76490713314fcec173f44e99346f54c6e92a8e42') {
                coreProxy.parseEvent(ctx, log)
            }
            if (log.address === '0x1b791d05e437c78039424749243f5a79e747525e') {
                accountProxy.parseEvent(ctx, log)
            }
            if (log.address === '0x93d645c42a0ca3e08e9552367b8c454765fff041') {
                spotMarketProxy.parseEvent(ctx, log)
            }
            if (log.address === '0xa73a7b754ec870b3738d0654ca75b7d0eebdb460') {
                perpsMarketProxy.parseEvent(ctx, log)
            }
            if (log.address === '0xf3d4109eb4e7ec31f8eee5d9addad5f3c53a6c87') {
                perpsAccountProxy.parseEvent(ctx, log)
            }
        }

        for (let transaction of block.transactions) {
            if (transaction.to === '0x76490713314fcec173f44e99346f54c6e92a8e42') {
                coreProxy.parseFunction(ctx, transaction)
            }
            if (transaction.to === '0x1b791d05e437c78039424749243f5a79e747525e') {
                accountProxy.parseFunction(ctx, transaction)
            }
            if (transaction.to === '0x93d645c42a0ca3e08e9552367b8c454765fff041') {
                spotMarketProxy.parseFunction(ctx, transaction)
            }
            if (transaction.to === '0xa73a7b754ec870b3738d0654ca75b7d0eebdb460') {
                perpsMarketProxy.parseFunction(ctx, transaction)
            }
            if (transaction.to === '0xf3d4109eb4e7ec31f8eee5d9addad5f3c53a6c87') {
                perpsAccountProxy.parseFunction(ctx, transaction)
            }

            ctx.store.Transaction.write({
                id: transaction.id,
                blockNumber: block.header.height,
                blockTimestamp: new Date(block.header.timestamp),
                hash: transaction.hash,
                to: transaction.to,
                from: transaction.from,
                status: transaction.status,
            })
        }
    }
    ctx.store.setForceFlush(true)
})
