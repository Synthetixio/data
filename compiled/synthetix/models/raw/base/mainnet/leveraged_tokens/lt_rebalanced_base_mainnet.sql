with events as (
    WITH raw_data AS (
    

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_eth_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_eth_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_eth_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_eth_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_btc_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_btc_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_btc_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_btc_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_sol_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_sol_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_sol_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_sol_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_xrp_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_xrp_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_xrp_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_xrp_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pepe_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_pepe_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pepe_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_pepe_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_doge_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_doge_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_doge_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_doge_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_wif_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_wif_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_wif_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_wif_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pnut_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_pnut_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_pnut_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_pnut_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_bonk_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_bonk_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_bonk_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_bonk_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_fartcoin_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_fartcoin_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_fartcoin_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_fartcoin_short3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_trump_long3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_trump_long3_event_rebalanced"

            
        )

        union all
        

        (
            select
                cast('"analytics"."raw_base_mainnet_lt"."lt_trump_short3_event_rebalanced"' as TEXT) as _dbt_source_relation,

                
                    cast("current_leverage" as numeric) as "current_leverage" ,
                    cast("event_name" as text) as "event_name" ,
                    cast("contract" as text) as "contract" ,
                    cast("block_number" as integer) as "block_number" ,
                    cast("id" as character varying) as "id" ,
                    cast("transaction_hash" as text) as "transaction_hash" ,
                    cast("block_timestamp" as timestamp with time zone) as "block_timestamp" 

            from "analytics"."raw_base_mainnet_lt"."lt_trump_short3_event_rebalanced"

            
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

select * -- noqa: ST06
from
    events
where
    
        true
    
order by
    id