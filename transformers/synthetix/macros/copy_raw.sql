{% macro copy_raw() %}
{% set sql %}
    CALL copy_schema_tables('base_goerli', 'public', 'analytics', 'raw_base_goerli');
    CALL copy_schema_tables('optimism_goerli', 'public', 'analytics', 'raw_optimism_goerli');
    CALL copy_schema_tables('optimism_mainnet', 'public', 'analytics', 'raw_optimism_mainnet');
{% endset %}

{% do run_query(sql) %}
{% endmacro %}


