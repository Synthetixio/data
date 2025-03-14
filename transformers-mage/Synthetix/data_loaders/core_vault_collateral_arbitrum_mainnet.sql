-- WITH base AS (
--     SELECT
--         block_number,
--         contract_address,
--         chain_id,
--         '1' as pool_id,
--         collateral_type,
--         CAST(amount AS NUMERIC) AS amount,
--         CAST(value AS NUMERIC) AS collateral_value
--     FROM
--         core_get_vault_collateral
--     WHERE
--         amount IS NOT NULL
-- )

-- SELECT
--     TO_TIMESTAMP(blocks.timestamp) AS ts,
--     CAST(blocks.block_number AS INTEGER) AS block_number,
--     base.contract_address,
--     '1' AS pool_id,
--     CAST(base.collateral_type AS VARCHAR) AS collateral_type,
--     base.amount/1e18 AS amount,  -- Fixed typo in "amout"
--     base.collateral_value/1e18 AS collateral_value
-- FROM
--     base
-- INNER JOIN blocks_parquet AS blocks
--     ON base.block_number = blocks.block_number;

select 
    * 
from prod_raw_arbitrum_mainnet.core_vault_collateral_arbitrum_mainnet
where ts >= '{{ block_output("core_vault_collateral_arbitrum_mainnet_check", parse=lambda data, _vars: data["max_ts"][0] if data["max_ts"][0] is not None else "1970-01-01 00:00:00") }}'