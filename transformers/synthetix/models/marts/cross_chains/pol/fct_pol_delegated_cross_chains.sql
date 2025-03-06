with delegated_combined as (
    select
        'Ethereum' as chain,
        ts,
        account_id,
        change_in_amount,
        change_in_value
    from {{ ref('fct_pol_delegated_eth_mainnet') }}

    union all

    select
        'Optimism' as chain,
        ts,
        account_id,
        change_in_amount,
        change_in_value
    from {{ ref('fct_pol_delegated_optimism_mainnet') }}
),

delegated as (
    select
        chain,
        ts,
        account_id,
        change_in_amount,
        change_in_value,
        sum(change_in_amount) over (order by ts) as cumulative_amount,
        sum(change_in_value) over (order by ts) as cumulative_value
    from delegated_combined
)

select
    chain,
    ts,
    account_id,
    change_in_amount,
    change_in_value,
    cumulative_amount,
    cumulative_value
from delegated
