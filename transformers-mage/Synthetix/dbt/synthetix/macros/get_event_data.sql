{% macro get_event_data(
    chain,
    network,
    contract_name,
    event_name
  ) %}
SELECT
  *
FROM
  {{ source(
    'raw_' ~ chain ~ '_' ~ network,
    contract_name ~ '_event_' ~ event_name
  ) }}
{% endmacro %}
