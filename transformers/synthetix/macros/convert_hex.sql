{% macro convert_hex(hex_column) %}
    regexp_replace(
        encode(
            decode(replace({{ hex_column }}, '0x', ''), 'hex'), 
            'escape'
        )::text,
        '\\000', '', 'g'
    )
{% endmacro %}
