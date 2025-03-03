with bought as (
    select
        id,
        block_timestamp as ts,
        block_number,
        transaction_hash as tx_hash,
        synth_market_id,
        {{ convert_wei('price') }} as price,
        {{ convert_wei('synth_returned') }} as amount,
        referrer
    from
        {{ ref('spot_synth_bought_base_sepolia') }}
),

sold as (
    select
        id,
        block_timestamp as ts,
        block_number,
        transaction_hash as tx_hash,
        synth_market_id,
        {{ convert_wei('price') }} as price,
        -1 * {{ convert_wei('amount_returned') }} as amount,
        referrer
    from
        {{ ref('spot_synth_sold_base_sepolia') }}
)

select
    id,
    ts,
    block_number,
    tx_hash,
    synth_market_id,
    price,
    amount,
    referrer
from
    bought
union all
select
    id,
    ts,
    block_number,
    tx_hash,
    synth_market_id,
    price,
    amount,
    referrer
from
    sold
order by
    ts
