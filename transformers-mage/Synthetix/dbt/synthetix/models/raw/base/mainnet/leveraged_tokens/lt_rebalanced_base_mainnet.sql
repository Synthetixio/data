with events as (
    {{ get_base_lt_event_data('base', 'mainnet', 'rebalanced') }} -- noqa
)

select * -- noqa: ST06
from
    events
where
    {% if is_incremental() %}
        block_number > (
            select coalesce(max(t.block_number), 0) as b
            from {{ this }} as t
        )
    {% else %}
        true
    {% endif %}
order by
    id
