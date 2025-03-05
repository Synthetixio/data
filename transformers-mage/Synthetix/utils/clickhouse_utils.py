import clickhouse_connect
from mage_ai.settings.repo import get_repo_path
from mage_ai.io.config import ConfigFileLoader
import os

def get_client(config_scope: str = 'default'):
    config_path = os.path.join(get_repo_path(), 'io_config.yaml')
    config = ConfigFileLoader(config_path, config_scope)
    
    return clickhouse_connect.get_client(
        host=config.get('CLICKHOUSE_HOST'),
        username=config.get('CLICKHOUSE_USER'),
        password=config.get('CLICKHOUSE_PASSWORD'),
        secure=True
    )