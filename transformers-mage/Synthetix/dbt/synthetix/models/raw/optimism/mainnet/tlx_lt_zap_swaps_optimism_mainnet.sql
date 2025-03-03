WITH minted AS (
    {{ get_event_data(
        'optimism',
        'mainnet_tlx',
        'zap_swap',
        'minted'
    ) }}
),

redeemed AS (
    {{ get_event_data(
        'optimism',
        'mainnet_tlx',
        'zap_swap',
        'redeemed'
    ) }}
)

SELECT
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    event_name,
    leveraged_token,
    account,
    asset_in as asset,
    amount_in as amount,
    leveraged_token_amount_out as leveraged_token_amount
FROM
    minted

union all

SELECT
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    event_name,
    leveraged_token,
    account,
    asset_out as asset,
    amount_out as amount,
    leveraged_token_amount_in as leveraged_token_amount
FROM
    redeemed
