{{
    config(
        materialized = 'view'
    )
}}

{{ get_vault_event_data('base', 'mainnet', 'withdraw') }}