{# DEPRECATED: deprecate this table in dashboards and remove #}
with debt as (
    select
        ts,
        2 as market_id,
        debt * -1 as market_pnl
    from
        {{ ref('core_vault_debt_base_mainnet') }}
)

select
    ts,
    market_id,
    market_pnl
from
    debt
order by
    ts
