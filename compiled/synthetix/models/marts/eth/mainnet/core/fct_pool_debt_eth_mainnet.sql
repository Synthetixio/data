select
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
from
    "analytics"."prod_raw_eth_mainnet"."core_vault_debt_eth_mainnet"
order by
    ts