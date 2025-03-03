{%- macro get_base_lt_event_data(
    chain,
    network,
    event_name
  ) -%}
  {%- set markets = var('base_lt') -%}
  {%- set relations = [] -%}
  {%- for market in markets -%}
    {%- do relations.append(
      source(
        'raw_' ~ chain ~ '_' ~ network ~ '_lt',
        'lt_' ~ market ~ '_event_' ~ event_name
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
  SUBSTRING(
    "_dbt_source_relation"
    FROM
      'lt_([^_]+_[^_]+)_event_[^_]+$'
  ) AS token
FROM
  raw_data
{%- endmacro -%}
