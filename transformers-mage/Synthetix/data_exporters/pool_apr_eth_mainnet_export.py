if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH 
-- Token Yields Calculation
dim AS (
    SELECT DISTINCT
        p.ts as ts,
        p.pool_id as pool_id,
        p.collateral_type as collateral_type,
        t.token_symbol as token_symbol,
        t.yield_token_symbol as yield_token_symbol
    FROM
        {ANALYTICS_DATABASE}.pnl_hourly AS p
    INNER JOIN
        {RAW_DB}.tokens AS t
        ON lowerUTF8(p.collateral_type) = lowerUTF8(t.token_address)
    WHERE
        t.yield_token_symbol IS NOT NULL
),

token_prices AS (
    SELECT
        dim.ts as ts,
        dim.pool_id as pool_id,
        dim.collateral_type as collateral_type,
        dim.token_symbol as token_symbol,
        dim.yield_token_symbol as yield_token_symbol,
        tp.prices AS token_price,
        yp.prices AS yield_token_price,
        tp.prices / yp.prices AS exchange_rate
    FROM
        dim
    INNER JOIN {ANALYTICS_DATABASE}.market_prices_hourly AS tp
        ON
            dim.token_symbol = tp.market_symbol
            AND dim.ts = tp.ts
    INNER JOIN {ANALYTICS_DATABASE}.market_prices_hourly AS yp
        ON
            dim.yield_token_symbol = yp.market_symbol
            AND dim.ts = yp.ts
),

rate_changes AS (
    SELECT
        token_prices.ts as ts,
        token_prices.pool_id as pool_id,
        token_prices.collateral_type as collateral_type,
        token_prices.exchange_rate as exchange_rate,
        token_prices.exchange_rate / lagInFrame(token_prices.exchange_rate) OVER (
            PARTITION BY token_prices.token_symbol, token_prices.yield_token_symbol
            ORDER BY token_prices.ts
        ) - 1 AS hourly_exchange_rate_pnl
    FROM
        token_prices
),

token_yields AS (
    SELECT
        rc.ts as ts,
        rc.pool_id as pool_id,
        rc.collateral_type as collateral_type,
        rc.exchange_rate as exchange_rate,
        rc.hourly_exchange_rate_pnl as hourly_exchange_rate_pnl,
        avg(rc.hourly_exchange_rate_pnl) OVER (
            PARTITION BY rc.collateral_type
            ORDER BY rc.ts
            ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) * 24 * 365 AS apr_24h_underlying,
        avg(rc.hourly_exchange_rate_pnl) OVER (
            PARTITION BY rc.collateral_type
            ORDER BY rc.ts
            ROWS BETWEEN 167 PRECEDING AND CURRENT ROW
        ) * 24 * 365 AS apr_7d_underlying,
        avg(rc.hourly_exchange_rate_pnl) OVER (
            PARTITION BY rc.collateral_type
            ORDER BY rc.ts
            ROWS BETWEEN 671 PRECEDING AND CURRENT ROW
        ) * 24 * 365 AS apr_28d_underlying
    FROM
        rate_changes AS rc
),

pnl_hourly AS (
    SELECT
        p.ts as ts,
        p.pool_id as pool_id,
        p.collateral_type as collateral_type,
        p.collateral_value as collateral_value,
        p.debt as debt,
        p.hourly_pnl as hourly_pnl,
        p.hourly_issuance as hourly_issuance,
        p.hourly_debt_migrated as hourly_debt_migrated,
        p.rewards_usd as rewards_usd,
        p.hourly_pnl_pct as hourly_pnl_pct,
        p.hourly_rewards_pct as hourly_rewards_pct,
        p.hourly_total_pct as hourly_total_pct,
        p.hourly_rewards_pct AS hourly_incentive_rewards_pct,
        p.hourly_pnl_pct AS hourly_performance_pct,
        sum(coalesce(p.hourly_issuance, 0)) OVER (
            PARTITION BY p.pool_id, p.collateral_type
            ORDER BY p.ts
        ) AS cumulative_issuance,
        sum(p.hourly_pnl) OVER (
            PARTITION BY p.pool_id, p.collateral_type
            ORDER BY p.ts
        ) AS cumulative_pnl,
        sum(p.rewards_usd) OVER (
            PARTITION BY p.pool_id, p.collateral_type
            ORDER BY p.ts
        ) AS cumulative_rewards
    FROM {ANALYTICS_DATABASE}.pnl_hourly AS p
),

avg_returns AS (
    SELECT
        ph.ts,
        ph.pool_id,
        ph.collateral_type,
        avg(ph.hourly_pnl_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) AS avg_24h_pnl_pct,
        avg(ph.hourly_pnl_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 167 PRECEDING AND CURRENT ROW
        ) AS avg_7d_pnl_pct,
        avg(ph.hourly_pnl_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 671 PRECEDING AND CURRENT ROW
        ) AS avg_28d_pnl_pct,
        avg(ph.hourly_rewards_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) AS avg_24h_rewards_pct,
        avg(ph.hourly_rewards_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 167 PRECEDING AND CURRENT ROW
        ) AS avg_7d_rewards_pct,
        avg(ph.hourly_rewards_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 671 PRECEDING AND CURRENT ROW
        ) AS avg_28d_rewards_pct,
        avg(ph.hourly_total_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) AS avg_24h_total_pct,
        avg(ph.hourly_total_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 167 PRECEDING AND CURRENT ROW
        ) AS avg_7d_total_pct,
        avg(ph.hourly_total_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 671 PRECEDING AND CURRENT ROW
        ) AS avg_28d_total_pct,
        avg(ph.hourly_incentive_rewards_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) AS avg_24h_incentive_rewards_pct,
        avg(ph.hourly_incentive_rewards_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 167 PRECEDING AND CURRENT ROW
        ) AS avg_7d_incentive_rewards_pct,
        avg(ph.hourly_incentive_rewards_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 671 PRECEDING AND CURRENT ROW
        ) AS avg_28d_incentive_rewards_pct,
        avg(ph.hourly_performance_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) AS avg_24h_performance_pct,
        avg(ph.hourly_performance_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 167 PRECEDING AND CURRENT ROW
        ) AS avg_7d_performance_pct,
        avg(ph.hourly_performance_pct) OVER (
            PARTITION BY ph.pool_id, ph.collateral_type
            ORDER BY ph.ts
            ROWS BETWEEN 671 PRECEDING AND CURRENT ROW
        ) AS avg_28d_performance_pct
    FROM pnl_hourly AS ph
),

apr_calculations AS (
    SELECT
        ph.ts as ts,
        ph.pool_id as pool_id,
        ph.collateral_type as collateral_type,
        ph.collateral_value as collateral_value,
        ph.debt as debt,
        ph.hourly_pnl as hourly_pnl,
        ph.hourly_debt_migrated as hourly_debt_migrated,
        ph.cumulative_pnl as cumulative_pnl,
        ph.cumulative_rewards as cumulative_rewards,
        ph.hourly_issuance as hourly_issuance,
        ph.cumulative_issuance as cumulative_issuance,
        ph.rewards_usd as rewards_usd,
        ph.hourly_pnl_pct as hourly_pnl_pct,
        ph.hourly_rewards_pct as hourly_rewards_pct,
        -- total pnls
        ar.avg_24h_total_pct * 24 * 365 AS apr_24h,
        ar.avg_7d_total_pct * 24 * 365 AS apr_7d,
        ar.avg_28d_total_pct * 24 * 365 AS apr_28d,
        -- pool pnls
        ar.avg_24h_pnl_pct * 24 * 365 AS apr_24h_pnl,
        ar.avg_7d_pnl_pct * 24 * 365 AS apr_7d_pnl,
        ar.avg_28d_pnl_pct * 24 * 365 AS apr_28d_pnl,
        -- rewards pnls
        ar.avg_24h_rewards_pct * 24 * 365 AS apr_24h_rewards,
        ar.avg_7d_rewards_pct * 24 * 365 AS apr_7d_rewards,
        ar.avg_28d_rewards_pct * 24 * 365 AS apr_28d_rewards,
        -- incentive rewards pnls
        ar.avg_24h_incentive_rewards_pct * 24 * 365 AS apr_24h_incentive_rewards,
        ar.avg_7d_incentive_rewards_pct * 24 * 365 AS apr_7d_incentive_rewards,
        ar.avg_28d_incentive_rewards_pct * 24 * 365 AS apr_28d_incentive_rewards,
        -- performance pnls
        ar.avg_24h_performance_pct * 24 * 365 AS apr_24h_performance,
        ar.avg_7d_performance_pct * 24 * 365 AS apr_7d_performance,
        ar.avg_28d_performance_pct * 24 * 365 AS apr_28d_performance,
        -- underlying yields
        coalesce(yr.apr_24h_underlying, 0) AS apr_24h_underlying,
        coalesce(yr.apr_7d_underlying, 0) AS apr_7d_underlying,
        coalesce(yr.apr_28d_underlying, 0) AS apr_28d_underlying
    FROM pnl_hourly AS ph
    INNER JOIN avg_returns AS ar
        ON
            ph.ts = ar.ts
            AND ph.pool_id = ar.pool_id
            AND ph.collateral_type = ar.collateral_type
    LEFT JOIN token_yields AS yr
        ON
            ph.ts = yr.ts
            AND ph.pool_id = yr.pool_id
            AND ph.collateral_type = yr.collateral_type
),

apy_calculations AS (
    SELECT
        ac.ts,
        ac.pool_id,
        ac.collateral_type,
        ac.collateral_value,
        ac.debt,
        ac.hourly_issuance,
        ac.hourly_debt_migrated,
        ac.hourly_pnl,
        ac.cumulative_pnl,
        ac.cumulative_issuance,
        ac.cumulative_rewards,
        ac.rewards_usd,
        ac.hourly_pnl_pct,
        ac.hourly_rewards_pct,
        ac.apr_24h,
        (pow(1 + ac.apr_24h / 8760, 8760) - 1) AS apy_24h,
        ac.apr_7d,
        (pow(1 + ac.apr_7d / 8760, 8760) - 1) AS apy_7d,
        ac.apr_28d,
        (pow(1 + ac.apr_28d / 8760, 8760) - 1) AS apy_28d,
        ac.apr_24h_pnl,
        (pow(1 + ac.apr_24h_pnl / 8760, 8760) - 1) AS apy_24h_pnl,
        ac.apr_7d_pnl,
        (pow(1 + ac.apr_7d_pnl / 8760, 8760) - 1) AS apy_7d_pnl,
        ac.apr_28d_pnl,
        (pow(1 + ac.apr_28d_pnl / 8760, 8760) - 1) AS apy_28d_pnl,
        ac.apr_24h_rewards,
        (pow(1 + ac.apr_24h_rewards / 8760, 8760) - 1) AS apy_24h_rewards,
        ac.apr_7d_rewards,
        (pow(1 + ac.apr_7d_rewards / 8760, 8760) - 1) AS apy_7d_rewards,
        ac.apr_28d_rewards,
        (pow(1 + ac.apr_28d_rewards / 8760, 8760) - 1) AS apy_28d_rewards,
        ac.apr_24h_incentive_rewards,
        (pow(1 + ac.apr_24h_incentive_rewards / 8760, 8760) - 1) AS apy_24h_incentive_rewards,
        ac.apr_7d_incentive_rewards,
        (pow(1 + ac.apr_7d_incentive_rewards / 8760, 8760) - 1) AS apy_7d_incentive_rewards,
        ac.apr_28d_incentive_rewards,
        (pow(1 + ac.apr_28d_incentive_rewards / 8760, 8760) - 1) AS apy_28d_incentive_rewards,
        ac.apr_24h_performance,
        (pow(1 + ac.apr_24h_performance / 8760, 8760) - 1) AS apy_24h_performance,
        ac.apr_7d_performance,
        (pow(1 + ac.apr_7d_performance / 8760, 8760) - 1) AS apy_7d_performance,
        ac.apr_28d_performance,
        (pow(1 + ac.apr_28d_performance / 8760, 8760) - 1) AS apy_28d_performance,
        ac.apr_24h_underlying,
        (pow(1 + ac.apr_24h_underlying / 8760, 8760) - 1) AS apy_24h_underlying,
        ac.apr_7d_underlying,
        (pow(1 + ac.apr_7d_underlying / 8760, 8760) - 1) AS apy_7d_underlying,
        ac.apr_28d_underlying,
        (pow(1 + ac.apr_28d_underlying / 8760, 8760) - 1) AS apy_28d_underlying
    FROM apr_calculations AS ac
)

SELECT
    ts,
    pool_id,
    collateral_type,
    collateral_value,
    debt,
    hourly_issuance,
    hourly_debt_migrated,
    hourly_pnl,
    cumulative_pnl,
    cumulative_issuance,
    cumulative_rewards,
    rewards_usd,
    hourly_pnl_pct,
    hourly_rewards_pct,
    apr_24h,
    apy_24h,
    apr_7d,
    apy_7d,
    apr_28d,
    apy_28d,
    apr_24h_pnl,
    apy_24h_pnl,
    apr_7d_pnl,
    apy_7d_pnl,
    apr_28d_pnl,
    apy_28d_pnl,
    apr_24h_rewards,
    apy_24h_rewards,
    apr_7d_rewards,
    apy_7d_rewards,
    apr_28d_rewards,
    apy_28d_rewards,
    apr_24h_incentive_rewards,
    apy_24h_incentive_rewards,
    apr_7d_incentive_rewards,
    apy_7d_incentive_rewards,
    apr_28d_incentive_rewards,
    apy_28d_incentive_rewards,
    apr_24h_performance,
    apy_24h_performance,
    apr_7d_performance,
    apy_7d_performance,
    apr_28d_performance,
    apy_28d_performance,
    apr_24h_underlying,
    apy_24h_underlying,
    apr_7d_underlying,
    apy_7d_underlying,
    apr_28d_underlying,
    apy_28d_underlying
FROM apy_calculations
ORDER BY ts desc;
"""

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export pool APR data to ClickHouse
    
    Args:
        data: The output from the upstream parent block
        args: The varargs that the child block can access
        kwargs: The kwargs that the child block can access
        
    Returns:
        A dictionary containing status information
    """
    
    TABLE_NAME = 'pool_apr'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        ANALYTICS_DATABASE=kwargs['analytics_db'],
        RAW_DB=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
    ))
        
    # Get count of inserted rows
    count_query = f"SELECT count() FROM {DATABASE}.{TABLE_NAME} WHERE ts >= toDateTime('{data['max_ts'][0]}')"
    count_result = client.query(count_query)
    row_count = count_result.result_rows[0][0] if count_result.result_rows else 0
        
    return {
        'status': 'success',
        'rows_inserted': row_count,
        'database': kwargs['analytics_db'],
        'table': TABLE_NAME
    }