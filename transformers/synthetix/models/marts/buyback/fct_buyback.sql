SELECT
    id,
    block_timestamp AS ts,
    buyer,
    {{ convert_wei('snx') }} AS snx,
    {{ convert_wei('usd') }} AS usd,
    {{ convert_wei('usd') }} / {{ convert_wei('snx') }} AS snx_price
FROM
    {{ ref('buyback_processed') }}
