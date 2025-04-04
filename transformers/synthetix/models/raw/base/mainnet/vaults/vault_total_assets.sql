{{
    config(
        materialized = 'view'
    )
}}

{{ get_vault_function_data('base', 'mainnet', 'total_assets', ['total_assets_']) }}