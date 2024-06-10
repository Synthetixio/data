{% macro get_reward_distributor_token(
    distributor
  ) %}
  CASE
    WHEN '{{ target.name }}' = 'base_mainnet'
    AND distributor = '0xe92bcD40849BE5a5eb90065402e508aF4b28263b' THEN 'USDC'
    WHEN '{{ target.name }}' = 'base_mainnet'
    AND distributor in ('0x45063DCd92f56138686810eacB1B510C941d6593', '0xbb63CA5554dc4CcaCa4EDd6ECC2837d5EFe83C82') THEN 'SNX'
    ELSE NULL
  END
{% endmacro %}
