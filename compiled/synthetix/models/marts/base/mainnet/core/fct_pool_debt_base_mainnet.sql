select
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
from
    "analytics"."prod_raw_base_mainnet"."core_vault_debt_base_mainnet"
order by
    ts