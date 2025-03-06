if 'transformer' not in globals():
    from mage_ai.data_preparation.decorators import transformer
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.extractor import extract_table

@transformer
def transform(data, *args, **kwargs):
    """
     extract core vault collateral data from extractorhttp://localhost:6789/pipelines/extractors/edit?sideview=tree# and send them to postgres

    Returns:
        pl.DataFrame
    """

    return return extract_table('arbitrum_mainnet', 'getVaultDebt', extract_new=False)


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'