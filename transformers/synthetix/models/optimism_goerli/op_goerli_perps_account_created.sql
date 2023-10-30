with final as (
    SELECT
        *
    FROM
        raw_optimism_goerli.perps_market_proxy_event_account_created
)

select * from final