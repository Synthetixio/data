if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'tokens'
    DATABASE = kwargs['raw_db']

    df = pd.read_csv(f'Synthetix/seeds/tokens/{DATABASE}_tokens.csv')
    
    required_columns = [
        'token_address', 'token_symbol', 'yield_token_symbol'
    ]
    
    if not all(col in df.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in df.columns]}")
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            token_address String,
            token_symbol String,
            yield_token_symbol Nullable(String),
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (token_address, token_symbol);
    """
    
    client = get_client()

    ensure_database_exists(DATABASE)
    
    client.query(ddl)
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=df,
        column_names=df.columns.tolist()
    )
    
    return {'rows_inserted': len(df)}