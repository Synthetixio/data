{% macro generate_alias_name(custom_alias_name=none, node=none) -%}

    {%- if custom_alias_name -%}

        {{ custom_alias_name | trim }}

    {%- else -%}
        {%- set protocol_name = node.fqn[(4)] -%}
        {%- if node.version -%}

            {{ return(protocol_name ~ "_" ~ node.name ~ "_v" ~ (node.version | replace(".", "_"))) }}

        {%- else -%}

            {{ return(protocol_name ~ "_" ~ node.name) }}

        {%- endif -%}
    {%- endif -%}

{%- endmacro %}