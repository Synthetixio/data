{% macro get_reward_distributor_token(
    distributor
  ) %}
  CASE
    WHEN '{{ target.name }}' = 'base_mainnet'
    AND distributor = '0xe92bcD40849BE5a5eb90065402e508aF4b28263b' THEN 'USDC'
    WHEN '{{ target.name }}' = 'base_mainnet'
    AND distributor = '0x45063DCd92f56138686810eacB1B510C941d6593' THEN 'SNX'
    ELSE NULL
  END
{% endmacro %}
