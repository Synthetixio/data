{% macro convert_wei(column_name) %}
    cast({{ column_name }} as UInt256) / 1e18
{% endmacro %}
