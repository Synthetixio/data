if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test


NETWORKS = ['arbitrum_mainnet']

@data_loader
def load_data(*args, **kwargs):
    """
    Load Extractors block data for various network

    Returns:
        List of Networks
    """

    return [NETWORKS]


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'