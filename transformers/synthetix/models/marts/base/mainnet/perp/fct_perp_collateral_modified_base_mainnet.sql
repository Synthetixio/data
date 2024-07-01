SELECT
    account_id,
    synth_market_id,
    event_name,
    sender,
    transaction_hash,
    id,
    block_timestamp,
    {{ convert_wei("amount_delta") }} AS amount_delta,
    contract,
    block_number
FROM
    {{ ref("perp_collateral_modified_base_mainnet") }}
