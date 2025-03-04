if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.extractor import extractor_table


@data_loader
def load_data(*args, **kwargs):
    """
    Get arbitrum mainnet blocks data
    
    Returns:
        Polars DataFrame
    """
    df = extractor_table('arbitrum_mainnet', 'NETWORK_42161_RPC')
    
    # For vault collateral data:
    # df = extractor_table('arbitrum_mainnet', 'NETWORK_42161_RPC', 'getVaultCollateral')
    
    # For vault debt data:
    # df = extractor_table('arbitrum_mainnet', 'NETWORK_42161_RPC', 'getVaultDebt')
    
    return df


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'
