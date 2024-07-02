SELECT
    id,
    block_timestamp,
    account_id,
    block_number,
    transaction_hash,
    contract,
    event_name,
    synth_market_id,
    sender,
    {{ convert_wei("amount_delta") }} AS amount_delta
FROM
    {{ ref("perp_collateral_modified_base_sepolia") }}
