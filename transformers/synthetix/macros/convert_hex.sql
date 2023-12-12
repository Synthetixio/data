{% macro convert_hex(
        hex_column,
        max_length = 20
    ) %}
    LEFT(
        REGEXP_REPLACE(
            encode(
                DECODE(REPLACE({{ hex_column }}, '0x', ''), 'hex'),
                'escape'
            ) :: text,
            '\\000',
            '',
            'g'
        ),
        {{ max_length }}
    )
{% endmacro %}
