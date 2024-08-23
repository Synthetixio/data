-- raw events from Ethereum Mainnet
CREATE database eth_mainnet;
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

-- Create a function that always returns the first non-NULL value:
CREATE OR REPLACE FUNCTION first_agg (anyelement, anyelement)
  RETURNS anyelement
  LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS
'SELECT $1';

-- Then wrap an aggregate around it:
CREATE AGGREGATE first (anyelement) (
  SFUNC    = first_agg,
  STYPE    = anyelement,
  PARALLEL = safe
);

-- Create a function that always returns the last non-NULL value:
CREATE OR REPLACE FUNCTION last_agg (anyelement, anyelement)
  RETURNS anyelement
  LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS
'SELECT $2';

-- Then wrap an aggregate around it:
CREATE AGGREGATE last (anyelement) (
  SFUNC    = last_agg,
  STYPE    = anyelement,
  PARALLEL = safe
);
