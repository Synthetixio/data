import {Store as Store_, Database} from '@subsquid/file-store'
import {LocalDest} from '@subsquid/file-store'
import * as tables from './table'

export let db = new Database({
    tables,
    dest: new LocalDest('/parquet-data/indexed/arbitrum_sepolia'),
    chunkSizeMb: 100,
})

export type Store = Store_<typeof db extends Database<infer R, any> ? R : never>
