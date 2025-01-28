{{
    config(
        materialized = "view",
        tags = ["analytics", "pool", "debt", "base", "mainnet"],
    )
}}

select
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
from
    {{ ref('core_vault_debt_base_mainnet') }}
order by
    ts
