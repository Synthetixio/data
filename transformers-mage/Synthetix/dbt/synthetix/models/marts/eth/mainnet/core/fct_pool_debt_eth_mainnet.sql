select
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
from
    {{ ref('core_vault_debt_eth_mainnet') }}
order by
    ts
