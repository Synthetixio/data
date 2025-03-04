with events as (
    WITH raw_data AS (
    

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_eth_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_eth_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_eth_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_eth_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_btc_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_btc_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_btc_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_btc_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_sol_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_sol_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_sol_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_sol_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_xrp_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_xrp_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_xrp_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_xrp_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pepe_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_pepe_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pepe_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_pepe_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_doge_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_doge_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_doge_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_doge_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_wif_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_wif_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_wif_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_wif_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pnut_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_pnut_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pnut_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_pnut_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_bonk_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_bonk_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_bonk_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_bonk_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_fartcoin_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_fartcoin_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_fartcoin_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_fartcoin_short3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_trump_long3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_trump_long3_event_minted"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_trump_short3_event_minted"' as TEXT) as _dbt_source_relation,

                
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("leveraged_token_amount" as numeric) as "leveraged_token_amount" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" ,
                    cast("referral_code" as text) as "referral_code" ,
                    cast("recipient" as text) as "recipient" ,
                    cast("base_asset_amount" as numeric) as "base_asset_amount" ,
                    cast("event_name" as text) as "event_name" 

            from "analytics"."raw_base_mainnet_lt"."lt_trump_short3_event_minted"

            
        )

        
  )
SELECT
  *,
  SUBSTRING(
    "_dbt_source_relation"
    FROM
      'lt_([^_]+_[^_]+)_event_[^_]+$'
  ) AS token
FROM
  raw_data -- noqa
)

select -- noqa: ST06
    *
from
    events
where
    
        true
    
order by
    id