select
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
from
    {{ ref('core_vault_debt_arbitrum_sepolia') }}
order by
    ts
