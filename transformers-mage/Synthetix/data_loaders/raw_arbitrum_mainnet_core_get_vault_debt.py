if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test
from Synthetix.utils.extractor import extractor_table

@data_loader
def load_data(*args, **kwargs):
    """
    get arbitrum mainnet core debt valut table

    Returns:
        pl.DataFrame
    """
    # Specify your data loading logic here

    return extractor_table('arbitrum_mainnet', 'NETWORK_42161_RPC', 'getVaultDebt')


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'
