-- raw events from Optimism Mainnet
CREATE database optimism_mainnet;
-- raw events from Base Mainnet
CREATE database base_mainnet;
-- raw events from Base Sepolia
CREATE database base_sepolia;
-- raw events from Arbitrum Sepolia
CREATE database arbitrum_sepolia;
-- raw events from Arbitrum Mainnet
CREATE database arbitrum_mainnet;
-- transformed data from dbt
CREATE database analytics;
-- create a read only user for querying
CREATE USER analytics WITH password 'analytics';
GRANT pg_read_all_data TO analytics;
-- add the parquet extension
\c analytics
CREATE extension IF NOT EXISTS parquet_fdw;
CREATE server parquet_server foreign DATA wrapper parquet_fdw;
