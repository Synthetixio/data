select
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
from
    "analytics"."prod_raw_arbitrum_mainnet"."core_vault_debt_arbitrum_mainnet"
order by
    ts