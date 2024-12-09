{% macro get_event_data(
    chain,
    network,
    protocol_name,
    contract_name,
    event_name
  ) %}
  {%- set relation = source(
    'raw_' ~ chain ~ '_' ~ network,
    protocol_name ~ '_' ~ contract_name ~ '_event_' ~ event_name
  ) -%}
  {%- set columns = dbt_utils.get_filtered_columns_in_relation(relation) -%}


  SELECT
    {% for column in columns %}
      {{ column }}{% if not loop.last %},{% endif %}
    {% endfor %}
  FROM
    {{ relation }}
{% endmacro %}
