from mage_ai.orchestration.triggers.api import trigger_pipeline
if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader


@data_loader
def trigger(*args, **kwargs):
    """
    Trigger mainnet_apr_calc pipeline to load raw tables for eth_mainnet

    Documentation: https://docs.mage.ai/orchestration/triggers/trigger-pipeline
    """

    trigger_pipeline(
        'mainnet_apr_calc',        # Required: enter the UUID of the pipeline to trigger
        variables={
            "analytics_db": "analytics_eth",
            "raw_db": "eth_mainnet"
        },
        check_status=True,     # Optional: poll and check the status of the triggered pipeline
        error_on_failure=True, # Optional: if triggered pipeline fails, raise an exception
        poll_interval=60,       # Optional: check the status of triggered pipeline every N seconds
        poll_timeout=None,      # Optional: raise an exception after N seconds
        verbose=True,           # Optional: print status of triggered pipeline run
    )
