{{
    config(
        materialized = 'view'
    )
}}

{{ get_vault_function_data('base', 'mainnet', 'exchange_rate', ['exchange_rate_']) }}