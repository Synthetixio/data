WITH base AS (
  SELECT
    pos.id,
    pos.block_timestamp AS ts,
    pos.block_number,
    pos.transaction_hash,
    pos.contract,
    pos.market_id,
    markets.market_symbol,
    CAST(
      pos.account_id AS text
    ) AS account_id,
    
    fill_price / 1e18
 AS fill_price,
    
    pnl / 1e18
 AS pnl,
    
    accrued_funding / 1e18
 AS accrued_funding,
    
    size_delta / 1e18
 AS trade_size,
    
    new_size / 1e18
 AS position_size,
    
    total_fees / 1e18
 AS total_fees,
    
    referral_fees / 1e18
 AS referral_fees,
    
    collected_fees / 1e18
 AS collected_fees,
    
    settlement_reward / 1e18
 AS settlement_reward,
    
    LEFT(
        REGEXP_REPLACE(
            encode(
                DECODE(REPLACE(tracking_code, '0x', ''), 'hex'),
                'escape'
            ) :: text,
            '\\000',
            '',
            'g'
        ),
        20
    )
 AS tracking_code,
    pos.settler
  FROM
    "analytics"."prod_raw_base_sepolia"."perp_order_settled_base_sepolia" AS pos
    LEFT JOIN "analytics"."prod_base_sepolia"."fct_perp_markets_base_sepolia" AS markets
    ON pos.market_id = markets.id
)
SELECT
  *,
  ABS(
    fill_price * trade_size
  ) AS notional_trade_size,
  fill_price * position_size AS notional_position_size,
  total_fees - referral_fees - collected_fees - settlement_reward AS lp_fees,
  total_fees - settlement_reward AS exchange_fees
FROM
  base