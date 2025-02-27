
with debt as (
    select
        ts,
        2 as market_id,
        debt * -1 as market_pnl
    from
        "analytics"."prod_raw_arbitrum_mainnet"."core_vault_debt_arbitrum_mainnet"
)

select
    ts,
    market_id,
    market_pnl
from
    debt
order by
    ts