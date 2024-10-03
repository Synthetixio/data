{% macro get_event_data(
    chain,
    network,
    contract_name,
    event_name
  ) %}

{%- set relation = source(
    'raw_' ~ chain ~ '_' ~ network,
    contract_name ~ '_event_' ~ event_name
  ) -%}
{%- set columns = dbt_utils.get_filtered_columns_in_relation(relation) -%}

SELECT
  {% for col in columns %}
    {{ col }} as {{ convert_case(col) }}{% if not loop.last %},{% endif %}
  {% endfor %}
FROM
  {{ relation }}
{% endmacro %}
