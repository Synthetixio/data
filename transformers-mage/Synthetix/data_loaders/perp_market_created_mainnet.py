from mage_ai.settings.repo import get_repo_path
from mage_ai.io.config import ConfigFileLoader
from mage_ai.io.postgres import Postgres
from os import path
if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test


@data_loader
def load_data_from_postgres(data, *args, **kwargs):
    """
    get data for perpetual market created 
    """
    if kwargs['raw_db'] in ['eth_mainnet']:
        return {}
    
    query = f"""
        select 
            * 
        from perps_market_proxy_event_market_created
        where block_timestamp > '{data["max_ts"][0]}'
    """
    config_path = path.join(get_repo_path(), 'io_config.yaml')
    config_profile = kwargs['raw_db']

    with Postgres.with_config(ConfigFileLoader(config_path, config_profile)) as loader:
        # Use coerce_float=False to prevent automatic conversion to float
        df = loader.load(query, coerce_float=False)
        return df


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'