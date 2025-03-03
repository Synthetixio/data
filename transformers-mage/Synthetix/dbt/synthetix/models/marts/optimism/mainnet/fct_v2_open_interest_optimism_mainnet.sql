with oi_base as (
    select
        id,
        ts,
        market,
        order_type,
        trade_size,
        price,
        skew,
        case
            when
                last_size > 0 -- long cross
                and "size" < 0 then -1 * last_size
            when
                last_size < 0 --short cross
                and "size" > 0 then "size"
            when
                "size" > 0 -- long increase
                and "size" > last_size
                then (
                    "size" - last_size
                )
            when
                "size" >= 0 -- long decrease
                and "size" < last_size
                then (
                    "size" - last_size
                )
            else 0
        end as long_oi_change,
        case
            when
                last_size > 0 -- long cross
                and "size" < 0 then "size" * -1
            when
                last_size < 0 --short cross
                and "size" > 0 then last_size
            when
                "size" < 0 -- short increase
                and "size" < last_size
                then (
                    last_size - "size"
                )
            when
                "size" <= 0 -- short decrease
                and "size" > last_size
                then (
                    last_size - "size"
                )
            else 0
        end as short_oi_change,
        -- get the cumulative sum
        SUM(
            case
                when
                    last_size > 0 -- long cross
                    and "size" < 0 then -1 * last_size
                when
                    last_size < 0 --short cross
                    and "size" > 0 then "size"
                when
                    "size" > 0 -- long increase
                    and "size" > last_size
                    then (
                        "size" - last_size
                    )
                when
                    "size" >= 0 -- long decrease
                    and "size" < last_size
                    then (
                        "size" - last_size
                    )
                else 0
            end
        ) over (
            partition by market
            order by
                id
        ) as long_oi,
        SUM(
            case
                when
                    last_size > 0 -- long cross
                    and "size" < 0 then "size" * -1
                when
                    last_size < 0 --short cross
                    and "size" > 0 then last_size
                when
                    "size" < 0 -- short increase
                    and "size" < last_size
                    then (
                        last_size - "size"
                    )
                when
                    "size" <= 0 -- short decrease
                    and "size" > last_size
                    then (
                        last_size - "size"
                    )
                else 0
            end
        ) over (
            partition by market
            order by
                id
        ) as short_oi
    from
        {{ ref('fct_v2_actions_optimism_mainnet') }}
)

select
    id,
    ts,
    market,
    order_type,
    trade_size,
    price,
    long_oi,
    short_oi,
    COALESCE(
        skew,
        long_oi - short_oi
    ) as skew,
    case
        when (
            long_oi + short_oi
        ) > 0
            then long_oi / (
                long_oi + short_oi
            )
        else 0
    end as long_oi_pct,
    case
        when (
            long_oi + short_oi
        ) > 0
            then short_oi / (
                long_oi + short_oi
            )
        else 0
    end as short_oi_pct,
    long_oi + short_oi as total_oi,
    long_oi * price as long_oi_usd,
    short_oi * price as short_oi_usd,
    (
        long_oi + short_oi
    ) * price as total_oi_usd
from
    oi_base
