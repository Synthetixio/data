if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd

QUERY = """
INSERT INTO {database}.{table}
WITH 
-- Get debt data directly from the raw table
raw_debt AS (
    SELECT
        ts,
        block_number,
        pool_id,
        collateral_type,
        debt
    FROM prod_raw_arbitrum_mainnet.core_vault_debt_arbitrum_mainnet
),

-- Get collateral data directly from the raw table
raw_collateral AS (
    SELECT
        ts,
        block_number,
        pool_id,
        collateral_type,
        amount,
        collateral_value
    FROM prod_raw_arbitrum_mainnet.core_vault_collateral_arbitrum_mainnet
),

-- Create hourly dimensions with distinct pool/collateral types
min_max_ts AS (
    SELECT 
        min(ts) AS min_ts,
        max(ts) AS max_ts
    FROM raw_debt
),

hour_dim AS (
    SELECT
        arrayJoin(
            arrayMap(
                h -> toDateTime(toStartOfHour(min_ts) + h * 3600),
                range(0, toUInt32(intDiv(toUInt32(toStartOfHour(max_ts)) - toUInt32(toStartOfHour(min_ts)), 3600) + 1))
            )
        ) AS hour_ts
    FROM min_max_ts
),

pool_collateral AS (
    SELECT DISTINCT 
        pool_id,
        collateral_type
    FROM raw_debt
),

all_dimensions AS (
    SELECT
        h.hour_ts AS ts,
        p.pool_id,
        p.collateral_type
    FROM hour_dim h
    CROSS JOIN pool_collateral p
),

-- Process USD minted events
raw_usd_minted AS (
    SELECT
        block_timestamp,
        block_number,
        pool_id,
        collateral_type,
        account_id,
        amount / pow(10, 18) AS amount
    FROM prod_raw_arbitrum_mainnet.core_proxy_event_usd_minted
),

-- Process USD burned events
raw_usd_burned AS (
    SELECT
        block_timestamp,
        block_number,
        pool_id,
        collateral_type,
        account_id,
        -amount / pow(10, 18) AS amount
    FROM prod_raw_arbitrum_mainnet.core_proxy_event_usd_burned
),

-- Combine and aggregate issuance data
issuance AS (
    SELECT
        toStartOfHour(block_timestamp) AS ts,
        pool_id,
        collateral_type,
        sum(amount) AS hourly_issuance
    FROM (
        SELECT * FROM raw_usd_minted
        UNION ALL
        SELECT * FROM raw_usd_burned
    ) combined_issuance
    GROUP BY ts, pool_id, collateral_type
),

-- Process delegation data
delegation_changes AS (
    SELECT
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        amount / pow(10, 18) AS token_amount,
        token_amount - lagInFrame(token_amount, 1, 0) OVER (
            PARTITION BY account_id, pool_id, collateral_type
            ORDER BY block_timestamp
        ) AS amount_change
    FROM prod_raw_arbitrum_mainnet.core_delegation_updated_arbitrum_mainnet
),

delegation AS (
    SELECT
        toStartOfHour(block_timestamp) AS ts,
        pool_id,
        collateral_type,
        sum(amount_change) AS hourly_delegation_change
    FROM delegation_changes
    GROUP BY ts, pool_id, collateral_type
),

-- Process rewards distributed events
raw_rewards_distributed AS (
    SELECT
        block_timestamp,
        block_number,
        pool_id,
        collateral_type,
        distributor,
        amount / pow(10, 18) AS amount,
        start,
        duration
    FROM prod_raw_arbitrum_mainnet.core_proxy_event_rewards_distributed
),

-- Process rewards claimed events
raw_rewards_claimed AS (
    SELECT
        block_timestamp,
        block_number,
        pool_id,
        collateral_type,
        account_id,
        distributor,
        amount / pow(10, 18) AS amount
    FROM prod_raw_arbitrum_mainnet.core_proxy_event_rewards_claimed
),

-- Fill forward metrics for all hours
filled_metrics AS (
    SELECT
        d.ts as ts,
        d.pool_id as pool_id,
        d.collateral_type as collateral_type,
        -- Fill forward debt
        coalesce(
            last_value(debt.debt) OVER (
                PARTITION BY d.pool_id, d.collateral_type 
                ORDER BY d.ts
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ),
            0
        ) AS debt,
        -- Fill forward collateral value
        coalesce(
            last_value(coll.collateral_value) OVER (
                PARTITION BY d.pool_id, d.collateral_type 
                ORDER BY d.ts
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ),
            0
        ) AS collateral_value,
        -- Fill forward collateral amount
        coalesce(
            last_value(coll.amount) OVER (
                PARTITION BY d.pool_id, d.collateral_type 
                ORDER BY d.ts
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ),
            0
        ) AS amount,
        -- Get hourly issuance
        coalesce(iss.hourly_issuance, 0) AS hourly_issuance,
        -- Calculate delegation
        coalesce(del.hourly_delegation_change, 0) AS hourly_delegation_change
    FROM all_dimensions d
    LEFT JOIN (
        SELECT toStartOfHour(ts) AS ts, pool_id, collateral_type, debt 
        FROM raw_debt
    ) debt ON d.ts = debt.ts AND d.pool_id = debt.pool_id AND d.collateral_type = debt.collateral_type
    LEFT JOIN (
        SELECT toStartOfHour(ts) AS ts, pool_id, collateral_type, amount, collateral_value 
        FROM raw_collateral
    ) coll ON d.ts = coll.ts AND d.pool_id = coll.pool_id AND d.collateral_type = coll.collateral_type
    LEFT JOIN issuance iss ON d.ts = iss.ts AND d.pool_id = iss.pool_id AND d.collateral_type = iss.collateral_type
    LEFT JOIN delegation del ON d.ts = del.ts AND d.pool_id = del.pool_id AND d.collateral_type = del.collateral_type
),

-- Calculate hourly PnL
hourly_pnl_calc AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        debt,
        collateral_value,
        amount,
        hourly_issuance,
        hourly_delegation_change,
        -- Calculate hourly PnL (debt decrease = profit)
        coalesce(
            lagInFrame(debt, 1) OVER (
                PARTITION BY pool_id, collateral_type
                ORDER BY ts
            ) - debt,
            0
        ) AS hourly_pnl,
        -- Calculate percentage returns
        CASE 
            WHEN collateral_value = 0 THEN 0
            ELSE coalesce(
                lagInFrame(debt, 1) OVER (
                    PARTITION BY pool_id, collateral_type
                    ORDER BY ts
                ) - debt, 
                0
            ) / collateral_value
        END AS hourly_pnl_pct,
        -- Total return percentage (only PnL since we don't have reward USD values)
        CASE 
            WHEN collateral_value = 0 THEN 0
            ELSE coalesce(
                lagInFrame(debt, 1) OVER (
                    PARTITION BY pool_id, collateral_type
                    ORDER BY ts
                ) - debt, 
                0
            ) / collateral_value
        END AS hourly_total_pct
    FROM filled_metrics
),

-- Calculate cumulative metrics separately
cumulative_metrics AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        debt,
        collateral_value,
        amount,
        hourly_issuance,
        hourly_pnl,
        hourly_pnl_pct,
        hourly_total_pct,
        -- Calculate amount delegated (cumulative)
        sum(hourly_delegation_change) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
        ) AS amount_delegated,
        -- Calculate cumulative issuance
        sum(hourly_issuance) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
        ) AS cumulative_issuance,
        -- Calculate cumulative PnL
        sum(hourly_pnl) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
        ) AS cumulative_pnl
    FROM hourly_pnl_calc
),

-- Calculate moving averages for APR
moving_averages AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        collateral_value,
        debt,
        hourly_issuance,
        hourly_pnl,
        cumulative_issuance,
        cumulative_pnl,
        amount_delegated,
        hourly_pnl_pct,
        hourly_total_pct,
        
        -- 24h moving averages (86400 seconds = 24 hours)
        avg(hourly_total_pct) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
            RANGE BETWEEN 86400 PRECEDING AND CURRENT ROW
        ) AS avg_24h_total_pct,
        avg(hourly_pnl_pct) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
            RANGE BETWEEN 86400 PRECEDING AND CURRENT ROW
        ) AS avg_24h_pnl_pct,
        
        -- 7d moving averages (604800 seconds = 7 days)
        avg(hourly_total_pct) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
            RANGE BETWEEN 604800 PRECEDING AND CURRENT ROW
        ) AS avg_7d_total_pct,
        avg(hourly_pnl_pct) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
            RANGE BETWEEN 604800 PRECEDING AND CURRENT ROW
        ) AS avg_7d_pnl_pct,
        
        -- 28d moving averages (2419200 seconds = 28 days)
        avg(hourly_total_pct) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
            RANGE BETWEEN 2419200 PRECEDING AND CURRENT ROW
        ) AS avg_28d_total_pct,
        avg(hourly_pnl_pct) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
            RANGE BETWEEN 2419200 PRECEDING AND CURRENT ROW
        ) AS avg_28d_pnl_pct
    FROM cumulative_metrics
)

-- Calculate APR/APY from moving averages
SELECT
    ts,
    pool_id,
    collateral_type,
    collateral_value,
    debt,
    hourly_issuance,
    hourly_pnl,
    cumulative_issuance,
    cumulative_pnl,
    amount_delegated,
    hourly_pnl_pct,
    hourly_total_pct,
    
    -- APRs
    avg_24h_total_pct * 24 * 365 AS apr_24h,
    avg_7d_total_pct * 24 * 365 AS apr_7d,
    avg_28d_total_pct * 24 * 365 AS apr_28d,
    
    avg_24h_pnl_pct * 24 * 365 AS apr_24h_pnl,
    avg_7d_pnl_pct * 24 * 365 AS apr_7d_pnl,
    avg_28d_pnl_pct * 24 * 365 AS apr_28d_pnl,
    
    -- APYs
    pow(1 + (avg_24h_total_pct * 24 * 365 / 8760), 8760) - 1 AS apy_24h,
    pow(1 + (avg_7d_total_pct * 24 * 365 / 8760), 8760) - 1 AS apy_7d,
    pow(1 + (avg_28d_total_pct * 24 * 365 / 8760), 8760) - 1 AS apy_28d,
    
    pow(1 + (avg_24h_pnl_pct * 24 * 365 / 8760), 8760) - 1 AS apy_24h_pnl,
    pow(1 + (avg_7d_pnl_pct * 24 * 365 / 8760), 8760) - 1 AS apy_7d_pnl,
    pow(1 + (avg_28d_pnl_pct * 24 * 365 / 8760), 8760) - 1 AS apy_28d_pnl,
    
    concat(toString(ts), '_', toString(pool_id), '_', collateral_type) AS unique_id
FROM moving_averages
ORDER BY ts, pool_id, collateral_type
"""

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export consolidated PnL and APR metrics from the raw tables to ClickHouse.
    This exporter handles the conversion, validation, and loading process.
    """
    DATABASE = 'analytics'
    TABLE_NAME = 'liquidity_provider_metrics_arbitrum_mainnet'

    ensure_database_exists(DATABASE)
    
    # Get ClickHouse client
    client = get_client()
    
    # Define ClickHouse DDL for our comprehensive table
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            ts DateTime64(3),
            pool_id UInt64,
            collateral_type String,
            collateral_value Float64,
            debt Float64,
            hourly_issuance Float64,
            hourly_pnl Float64,
            cumulative_issuance Float64,
            cumulative_pnl Float64,
            amount_delegated Float64,
            hourly_pnl_pct Float64,
            hourly_total_pct Float64,
            
            -- APRs
            apr_24h Float64,
            apr_7d Float64,
            apr_28d Float64,
            apr_24h_pnl Float64,
            apr_7d_pnl Float64,
            apr_28d_pnl Float64,
            
            -- APYs
            apy_24h Float64,
            apy_7d Float64,
            apy_28d Float64,
            apy_24h_pnl Float64,
            apy_7d_pnl Float64,
            apy_28d_pnl Float64,
            
            unique_id String
        )
        ENGINE = MergeTree()
        ORDER BY (ts, pool_id, collateral_type)
        PRIMARY KEY (ts, pool_id, collateral_type)
    """
    
    # Create table in ClickHouse
    client.query(ddl)

    client.query(QUERY.format(database=DATABASE, table=TABLE_NAME))
    
    # Return metadata about the operation
    return {
        'database': DATABASE,
        'table': TABLE_NAME,
    }
