with events as (
    {{ get_base_lt_event_data('base', 'mainnet', 'redeemed') }} -- noqa
)

select -- noqa: ST06
    *
from
    events
where
    {% if is_incremental() %}
        block_number > (
            select coalesce(max(block_number), 0) as b
            from {{ this }}
        )
    {% else %}
        true
    {% endif %}
order by
    id
