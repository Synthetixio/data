{% macro get_v2_event_data(
    event_name
  ) %}
  {% set markets = var('v2_markets') %}
  {% set relations = [] %}
  {% for market in markets %}
    {% do relations.append(
      source(
        'raw_' ~ target.name,
        'perps_v2_' ~ market ~ '_event_' ~ event_name if market != '1_inch' else 'perps_v2' ~ market ~ '_event_' ~ event_name
      )
    ) %}
  {% endfor %}

  WITH raw_data AS (
    {{ dbt_utils.union_relations(
      relations = relations
    ) }}
  )
SELECT
  *,
  COALESCE(
    REGEXP_SUBSTR(
      "_dbt_source_relation",
      'perps_v2_([^_]+)_event',
      1,
      1,
      'i',
      1
    ),
    '1inch'
  ) AS market
FROM
  raw_data
{% endmacro %}
