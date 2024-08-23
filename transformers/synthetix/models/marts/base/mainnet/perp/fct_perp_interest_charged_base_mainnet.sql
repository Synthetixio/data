select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    account_id,
    {{ convert_wei("interest") }} as interest
from
    {{ ref("perp_interest_charged_base_mainnet") }}
