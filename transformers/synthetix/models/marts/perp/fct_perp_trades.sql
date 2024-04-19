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
    {{ convert_wei('fill_price') }} AS fill_price,
    {{ convert_wei('pnl') }} AS pnl,
    {{ convert_wei('accrued_funding') }} AS accrued_funding,
    {{ convert_wei('size_delta') }} AS trade_size,
    {{ convert_wei('new_size') }} AS position_size,
    {{ convert_wei('total_fees') }} AS total_fees,
    {{ convert_wei('referral_fees') }} AS referral_fees,
    {{ convert_wei('collected_fees') }} AS collected_fees,
    {{ convert_wei('settlement_reward') }} AS settlement_reward,
    {{ convert_hex('tracking_code') }} AS tracking_code,
    pos.settler
  FROM
    {{ ref('perp_order_settled') }} AS pos
    LEFT JOIN {{ ref('fct_perp_markets') }} AS markets
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
