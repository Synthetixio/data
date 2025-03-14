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
    table_name = 'blocks_parquet'
    database = kwargs['network']

    table_def = f"""
    CREATE TABLE IF NOT EXISTS  {database}.{table_name}
        (
            timestamp DateTime64(3),
            block_number UInt64,
        )
        ENGINE = MergeTree()
        ORDER BY (timestamp, block_number)
    """

    # do few preprocessing first
    df = df.with_columns(
       pl.from_epoch("timestamp", time_unit="s"),
       pl.col("block_number").cast(pl.UInt64)
   )

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