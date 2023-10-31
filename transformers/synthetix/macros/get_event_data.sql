{% macro get_event_data(contract_name, event_name) %}
WITH source_data AS (
  SELECT * 
  FROM {{ source('raw_' ~ target.name, contract_name ~ '_event_' ~ event_name) }}
)
SELECT 
  *
FROM source_data
{% endmacro %}
