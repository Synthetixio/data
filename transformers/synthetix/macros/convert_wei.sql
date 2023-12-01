{% macro convert_wei(column_name) %}
    {{ column_name }} / 1e18
{% endmacro %}
