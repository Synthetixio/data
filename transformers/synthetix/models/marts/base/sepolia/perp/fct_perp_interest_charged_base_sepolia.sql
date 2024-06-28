SELECT
    block_number,
    contract,
    id,
    transaction_hash,
    block_timestamp,
    interest,
    event_name,
    account_id
FROM
    {{ ref("perp_interest_charged_base_sepolia") }}
