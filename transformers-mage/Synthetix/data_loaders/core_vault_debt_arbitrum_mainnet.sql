-- with base as (
--     select
--         block_number,
--         contract_address,
--         chain_id,
--         pool_id,
--         collateral_type,
--         cast(
--             value_1 as numeric
--         ) as debt
--     from
--         core_get_vault_debt
--     where
--         value_1 is not null
-- )

-- select
--     to_timestamp(blocks.timestamp) as ts,
--     cast(
--         blocks.block_number as integer
--     ) as block_number,
--     base.contract_address,
--     cast(
--         base.pool_id as integer
--     ) as pool_id,
--     cast(
--         base.collateral_type as varchar
--     ) as collateral_type,
--     base.dept/1e18 as debt
-- from
--     base
-- inner join blocks_parquet as blocks
--     on base.block_number = blocks.block_number

SELECT 
    * 
FROM prod_raw_arbitrum_mainnet.core_vault_debt_arbitrum_mainnet 
WHERE ts >= '{{ block_output("core_vault_debt_arbitrum_mainnet_check", parse=lambda data, _vars: data["max_ts"][0] if data["max_ts"][0] is not None else "1970-01-01 00:00:00") }}'