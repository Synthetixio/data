if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, table_exists
import datetime

@data_loader
def load_data(*args, **kwargs):
    """
    Check if pool_apr table exists and initialize it if needed.
    Return the timestamp from which to start processing new data.

    Returns:
        DataFrame with max_ts column containing the timestamp to start processing from
    """

    DATABASE = kwargs['analytics_db']
    TABLE_NAME = 'pool_apr'
    
    client = get_client()
    
    # Check if table exists
    table_exists_flag = table_exists(f'{DATABASE}.{TABLE_NAME}')
    
    # Create table if it doesn't exist
    if not table_exists_flag:
        client.query(f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            ts DateTime64(3),
            pool_id UInt8,
            collateral_type LowCardinality(String),
            collateral_value Float64,
            debt Float64,
            hourly_issuance Float64,
            hourly_debt_migrated Float64,
            hourly_pnl Float64,
            cumulative_pnl Float64,
            cumulative_issuance Float64,
            cumulative_rewards Float64,
            rewards_usd Float64,
            hourly_pnl_pct Float64,
            hourly_rewards_pct Float64,
            apr_24h Float64,
            apy_24h Float64,
            apr_7d Float64,
            apy_7d Float64,
            apr_28d Float64,
            apy_28d Float64,
            apr_24h_pnl Float64,
            apy_24h_pnl Float64,
            apr_7d_pnl Float64,
            apy_7d_pnl Float64,
            apr_28d_pnl Float64,
            apy_28d_pnl Float64,
            apr_24h_rewards Float64,
            apy_24h_rewards Float64,
            apr_7d_rewards Float64,
            apy_7d_rewards Float64,
            apr_28d_rewards Float64,
            apy_28d_rewards Float64,
            apr_24h_incentive_rewards Float64,
            apy_24h_incentive_rewards Float64,
            apr_7d_incentive_rewards Float64,
            apy_7d_incentive_rewards Float64,
            apr_28d_incentive_rewards Float64,
            apy_28d_incentive_rewards Float64,
            apr_24h_performance Float64,
            apy_24h_performance Float64,
            apr_7d_performance Float64,
            apy_7d_performance Float64,
            apr_28d_performance Float64,
            apy_28d_performance Float64,
            apr_24h_underlying Float64,
            apy_24h_underlying Float64,
            apr_7d_underlying Float64,
            apy_7d_underlying Float64,
            apr_28d_underlying Float64,
            apy_28d_underlying Float64
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (pool_id, collateral_type, ts)
        PARTITION BY toYYYYMM(ts)
        """)
        
        start_date = datetime.datetime.now() - datetime.timedelta(days=30)
        max_ts = start_date.strftime('%Y-%m-%d %H:%M:%S')
    else:
        result_df = client.query_df(f'SELECT max(ts) as max_ts FROM {DATABASE}.{TABLE_NAME}')
        
        if result_df.empty or result_df['max_ts'].iloc[0] is None:
            # If table exists but is empty, start with data from 30 days ago
            start_date = datetime.datetime.now() - datetime.timedelta(days=30)
            max_ts = start_date.strftime('%Y-%m-%d %H:%M:%S')
        else:
            # Get the latest timestamp and subtract a buffer period to ensure overlap
            # This helps with window calculations that need previous data
            max_ts = result_df['max_ts'].iloc[0]
            
            # Convert to datetime, subtract buffer period, convert back to string
            dt_max_ts = datetime.datetime.strptime(str(max_ts), '%Y-%m-%d %H:%M:%S')
            buffer_ts = dt_max_ts - datetime.timedelta(hours=24)  # 24 hour buffer
            max_ts = buffer_ts.strftime('%Y-%m-%d %H:%M:%S')
    
    # Return as DataFrame with max_ts column
    return {'max_ts': [max_ts]}


@test
def test_output(output, *args) -> None:
    """
    Test the output of the data loader.
    
    Args:
        output: The output from the data loader
        
    Raises:
        AssertionError: If output is undefined or doesn't contain required data
    """
    # Skip testing for eth_mainnet
    if args and len(args) > 0 and 'kwargs' in args[0] and args[0]['kwargs'].get('raw_db') == 'eth_mainnet':
        return
    
    assert output is not None, 'The output is undefined'
    
    if isinstance(output, dict) and output:
        assert 'max_ts' in output, 'Output should contain max_ts key'
    else:
        assert False, 'Output should be a non-empty dictionary'