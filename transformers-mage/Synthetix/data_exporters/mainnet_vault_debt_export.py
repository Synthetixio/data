import polars as pl
from os import path
from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists

if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter


@data_exporter
def export_data(df: pl.DataFrame, **kwargs) -> None:
    """
    export extractor data to clickhouse
    """
    table_name = 'core_vault_debt_parquet'
    database = kwargs['network']

    table_def = f"""
    CREATE OR REPLACE TABLE  {database}.{table_name}
        (
            block_number UInt64,
            contract_address String,
            call_data String,
            output_data String,
            chain_id UInt64,
            pool_id UInt64,
            collateral_type String,
            debt Int256,
        )
        ENGINE = MergeTree()
        ORDER BY (block_number, collateral_type)
    """
    
    df = df.with_columns([
        pl.col('chain_id').cast(pl.UInt64),
        pl.col('pool_id').str.replace(r'^$', '0'),  # Replace empty strings with '0' before casting
        pl.col('value_1').str.replace(r'^$', '0')
    ])
    
    # calculations for amount and value
    df = df.with_columns([
        (pl.col('value_1')).alias('debt')
    ])
    
    # Drop the original 'value' column since we renamed it
    df = df.drop('value_1')
    
    # make sure database exists
    ensure_database_exists(database)

    client = get_client()
    # create table if not exists
    client.query(table_def)
    # truncate and load
    client.query(f"TRUNCATE TABLE {database}.{table_name}")

    # send data to clickhouse
    client.insert_df(
        table=f'{database}.{table_name}',
        df=df.to_pandas(),
        column_names=list(df.schema.keys())
    )