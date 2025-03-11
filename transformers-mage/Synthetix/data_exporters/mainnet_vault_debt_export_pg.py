from mage_ai.settings.repo import get_repo_path
from mage_ai.io.config import ConfigFileLoader
from mage_ai.io.postgres import Postgres
from pandas import DataFrame
from os import path

if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter


@data_exporter
def export_data_to_postgres(df: DataFrame, **kwargs) -> None:
    """
    create core_get_vault_debt table in postgres
    """
    schema_name = 'public'
    table_name = 'core_get_vault_debt'
    config_path = path.join(get_repo_path(), 'io_config.yaml')
    config_profile = 'arbitrum_mainnet'

    with Postgres.with_config(ConfigFileLoader(config_path, config_profile)) as loader:
        loader.export(
            df.to_pandas(),
            schema_name,
            table_name,
            index=False,
            if_exists='replace',
        )