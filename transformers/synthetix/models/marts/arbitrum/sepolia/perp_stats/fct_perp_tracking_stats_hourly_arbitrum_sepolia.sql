with trades as (
    select
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        tracking_code,
        SUM(exchange_fees) as exchange_fees,
        SUM(referral_fees) as referral_fees,
        SUM(collected_fees) as collected_fees,
        SUM(notional_trade_size) as volume,
        SUM(1) as trades
    from
        {{ ref('fct_perp_trades_arbitrum_sepolia') }}
    group by
        DATE_TRUNC(
            'hour',
            ts
        ),
        tracking_code
),

accounts as (
    select
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        tracking_code,
        COUNT(
            distinct account_id
        ) as "accounts"
    from
        {{ ref('fct_perp_trades_arbitrum_sepolia') }}
    group by
        DATE_TRUNC(
            'hour',
            ts
        ),
        tracking_code
),

total as (
    select
        ts,
        SUM(trades) as trades_total,
        SUM(exchange_fees) as exchange_fees_total,
        SUM(referral_fees) as referral_fees_total,
        SUM(collected_fees) as collected_fees_total,
        SUM(volume) as volume_total
    from
        trades
    group by
        ts
)

select
    trades.ts,
    trades.tracking_code,
    trades.exchange_fees,
    trades.referral_fees,
    trades.collected_fees,
    trades.volume,
    trades.trades,
    accounts.accounts,
    case
        when total.exchange_fees_total = 0 then 0
        else trades.exchange_fees / total.exchange_fees_total
    end as exchange_fees_share,
    case
        when total.referral_fees_total = 0 then 0
        else trades.referral_fees / total.referral_fees_total
    end as referral_fees_share,
    case
        when total.collected_fees_total = 0 then 0
        else trades.collected_fees / total.collected_fees_total
    end as collected_fees_share,
    case
        when total.volume_total = 0 then 0
        else trades.volume / total.volume_total
    end as volume_share,
    case
        when total.trades_total = 0 then 0
        else trades.trades / total.trades_total
    end as trades_share
from
    trades
inner join accounts
    on
        trades.ts = accounts.ts
        and trades.tracking_code = accounts.tracking_code
inner join total
    on trades.ts = total.ts
