{% macro convert_case(field) %}
    {% set re = modules.re %}
    {% set field_snake = re.sub('(?<!^)(?=[A-Z])', '_', field) %}
    {% set field_lower = field_snake | lower() %}
    {{ field_lower }}
{% endmacro %}

