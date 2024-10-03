{% macro convert_hex(
        hex_column,
        max_length = 20
    ) %}
    LEFT(
        REGEXP_REPLACE(
                UNHEX(REPLACE({{ hex_column }}, '0x', '')),
            '\\000',
            ''
        ),
        {{ max_length }}
    )
{% endmacro %}
