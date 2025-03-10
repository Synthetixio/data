if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import ensure_database_exists

@data_loader
def load_data(*args, **kwargs):
    """
    Ensure all the database exists before we calculate apr

    Returns:
        {}
    """
    analytics_db = kwargs['analytics_db']
    raw_db = kwargs['raw_db']

    ensure_database_exists(analytics_db)
    ensure_database_exists(raw_db)

    return {
        'raw': raw_db,
        'analytics': analytics_db
    }


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'