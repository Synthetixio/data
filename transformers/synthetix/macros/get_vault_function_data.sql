{%- macro get_vault_function_data(
    chain,
    network,
    function_name,
    columns = None
) -%}

{%- set vaults = var('vaults', ['eth', 'btc']) -%}
{%- set relations = [] -%}

{%- for vault in vaults -%}
    {%- do relations.append(
        source(
        'raw_' ~ chain ~ '_' ~ network ~ '_vaults',
        vault ~ '_vault_function_' ~ function_name
        )
    ) -%}
{%- endfor -%}

WITH raw_data AS (
    {{ dbt_utils.union_relations(
        relations = relations
    ) }}
)

SELECT
    {% if columns is not none %}
        block_number,
        contract_address,
        {{ columns | join(', ') }},
    {% else %}
        *,
    {% endif %}
    substring(
        "_dbt_source_relation"
        FROM '"analytics"."raw_{{ chain }}_{{ network }}_vaults"."([^_]+)_vault_function_{{ function_name }}"'
    ) AS vault_type
FROM
    raw_data

{%- endmacro -%}
