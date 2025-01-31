{{
    config(
        materialized = 'view',
        tags = ["analytics", "vault", "collateral", "base", "mainnet"],
    )
}}

select
    ts,
    block_number,
    contract_address,
    pool_id,
    collateral_type,
    amount,
    collateral_value
from
    {{ ref("core_vault_collateral_base_mainnet") }}
