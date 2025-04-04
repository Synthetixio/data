{%- macro get_vault_event_data(
    chain,
    network,
    event_name
) -%}

{%- set vaults = var('vaults', ['eth', 'btc']) -%}
{%- set relations = [] -%}

{%- for vault in vaults -%}
    {%- do relations.append(
        source(
        'raw_' ~ chain ~ '_' ~ network ~ '_vaults',
        vault ~ '_vault_event_' ~ event_name
        )
    ) -%}
{%- endfor -%}

WITH raw_data AS (
    {{ dbt_utils.union_relations(
        relations = relations
    ) }}
)

SELECT
    *,
    substring(
        "_dbt_source_relation"
        FROM '"analytics"."raw_{{ chain }}_{{ network }}_vaults"."([^_]+)_vault_event_{{ event_name }}"'
    ) AS vault_type
FROM
    raw_data

{%- endmacro -%}
