# APR Calculation Documentation for Synthetix Liquidity Providing

## Overview

The system estimates an APR for LPs by calculating the returns from several sources and extrapolating:

- **Debt fluctuations:** Changes in market debt backed by the pool.
- **Incentives:** Rewards provided by the Treasury to incentivize deposits.
- **Liquidation Rewards:** Liquidated collateral from perps traders, paid to LPs using the reward distributor contract

The overall process computes an hourly return, averages it over a chosen look-back period (24 hours, 7 days, or 28 days), and then annualizes that return. APRs are calculated for each "Vault" which in Synthetix V3 refers to a combination of collateral type and pool.

## Methodology

### 1. Hourly Return Calculation

- **Sources:**  
  The hourly return is derived from multiple components:
  - **Debt fluctuation:** Capture changes in the debt, with debt increases counting as losses and decreases counting as profits.
  - **Issuance:** Issuance of the native stablecoin is subtracted, since it impacts debt but does not represent profit/loss.
    - For example, fees create negative debt for LPs, which they can mint as stablecoins. This minting results in a debt increase, which is removed before the profit calculation.
  - **LP incentives:** Isolating returns purely from rewards streamed to LPs from the Treasury.
    - Reward streams are estimated by calculating the amount distributed per hour, and applying the price at that time.
  - **Collateral distributions:** Returns from the distribution of perp traders' liquidated collateral.
    - Collateral values are estimated by applying the price at that time of the liquidation to the collateral.
  - **Underlying token yields:** Capturing yield of tokens like Aave USDC deposits, which increase in value over time due to lending yields.

Each of these returns is calculated as a dollar amount. To find the percentage return, they are divided by the collateral value at the start of each hour.

These returns can be combined to calculate the total return for an LP, or isolated to calculate the returns from pool performance or incentives alone.

### 2. Averaging Hourly Returns

A moving average is applied to the hourly returns over one of three time windows: 24 hours, 7 days, or 28 days

For example, the 24‑hour average is computed using a window function similar to:

```sql
avg(hourly_total_pct) over (
    partition by pool_id, collateral_type
    order by ts
    range between interval '24 HOURS' preceding and current row
) as avg_24h_total_pct
```

The resulting "average hourly return" can easily be extrapolated to an APR or APY by factoring in the number of hours per year:

```sql
  -- apr
  avg_24h_total_pct * 24 * 265 as apr_24h,
  avg_7d_total_pct * 24 * 265 as apr_7d,

  -- apy
  (power(1 + apr_24h / (24 * 365), (24 * 365)) - 1) as apy_24h,
  (power(1 + apr_7d / (24 * 365), (24 * 365)) - 1) as apy_7d,
```

The intepretation of this APR can be stated as:

- "If the pool's performance over the last 24 hours were to continue for a year, the LP would earn an APR of `apr_24h`."
- "If the pool's performance over the last 7 days were to continue for a year, the LP would earn an APR of `apr_7d`."

## Technical Details

### Data sources

The base tables are calculated from the following sources:

- **Debt:** Debt is collected for each collateral type using `CoreProxy.getVaultDebt`
- **Collateral value:** Collateral values are using `CoreProxy.getVaultCollateral`
- **Issuance:** Issuance is calculated from `UsdMinted` and `UsdBurned` events
- **Rewards:** Rewards are calculated from `RewardDistributor` events

### Tables

All APR calculations are made from the `fct_pool_pnl_hourly` table, where hourly returns are calculated. This table joins the various other sources to calculate the hourly return for each vault:

- **fct_pool_debt_base_mainnet**
  - Contains debt records for each pool and collateral type.
  - Used to calculate hourly changes in debt by doing a difference on the last known value each hour..
- **fct_pool_issuance_hourly_base_mainnet**
  - Provides the hourly issuance amounts for each pool and collateral type.
  - Used to sum native stablecoin issuance for each hour.
- **core_vault_collateral_base_mainnet**
  - Contains the USD value of the collateral in each vault..
  - Used as the denominator for each hourly return as a percentage: `usd_return / collateral_value`.
- **fct_pool_rewards_pool_hourly_base_mainnet**
  - Contains hourly rewards for each vault in USD which came from "pool-level" rewards distributors.
  - Used to add incentives and liquidation rewards to the hourly return.
- **fct_pool_rewards_token_hourly_base_mainnet**
  - Contains hourly rewards for each vault in USD which came from all other reward distributors.
  - Used to add incentives and liquidation rewards to the hourly return.

### Rewards

Rewards are complex to handle during APR calculations, given there is little information provided about them directly onchain. For example, a reward distributor event looks like this:

```json
{
  "collateral_type": "0xC74eA762cF06c9151cE074E6a569a5945b6302E7",
  "block_number": 12325096,
  "amount": "100000000000000000000",
  "pool_id": "1",
  "start": "1711439580",
  "duration": "60",
  "distributor": "0xe92bcD40849BE5a5eb90065402e508aF4b28263b"
}
```

- `start` is the timestamp when the reward distribution started.
- `duration` is the duration of the reward distribution in seconds.
- `amount` is the total amount of rewards distributed.
- `distributor` is the address of the reward distributor contract.

We collect reward distributor information using the script in `transformers/synthetix/scripts/get_synths.py`. It queries each distributor to figure out which token is distributed in order look up a price to calculate the USD value, since the reward token is not contained in the event.

There are 3 cases for rewards:

1. **Pool-level rewards:**
   - These are rewards distributed across all collateral types in a pool. You can identify them because the `collateral_type` is the zero address.
   - The table `fct_pool_rewards_pool_hourly` contains these rewards, since they must be joined with collateral values to determine how they are split up.
2. **Vault-level rewards:**
   - This is the typical reward distribution, which includes a `collateral_type`.
   - These rewards are stored in `fct_pool_rewards_token_hourly`.
3. **Instantaneous rewards:**
   - These are rewards that are distributed instantly, and are not "streamed" to LPs over time.
   - These can be identified where the `duration` is 0.
   - Typically these come from multicollateral perp liquidations.

### Underlying Token Yields

Some tokens like Aave deposits have a yield on the underlying token. This yield is captures as `apr_underlying` for tokens that have been configured to include this. This is calculated by appreciation of the token price against a base price. For example, the `StataUSDC` price can be compared to the `USDC` price in order to determine the yield.

To enable a new token to calculate an "underlying" yield, specify a `yield_token` in the `tokens` seed.
