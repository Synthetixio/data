\{% macro copy_raw() %}
{% set target_name = target.name %}
{% set sql %}
    CALL copy_schema_tables('{{ target_name }}', 'public', 'analytics', 'raw_{{ target_name }}');
{% endset %}

{% do run_query(sql) %}
{% endmacro %}
