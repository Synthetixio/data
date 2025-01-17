-- raw events from Ethereum Mainnet
CREATE DATABASE eth_mainnet;
-- raw events from Optimism Mainnet Synthetix
CREATE DATABASE optimism_mainnet;
-- raw events from Optimism Mainnet TLX
CREATE DATABASE optimism_mainnet_tlx;
-- raw events from Base Mainnet
CREATE DATABASE base_mainnet;
-- raw events from Base Mainnet Leveraged Tokens
CREATE DATABASE base_mainnet_lt;
-- raw events from Base Sepolia
CREATE DATABASE base_sepolia;
-- raw events from Arbitrum Sepolia
CREATE DATABASE arbitrum_sepolia;
-- raw events from Arbitrum Mainnet
CREATE DATABASE arbitrum_mainnet;
-- transformed data from dbt
CREATE DATABASE analytics;
-- create a read only user for querying
CREATE USER analytics WITH PASSWORD 'analytics';
GRANT pg_read_all_data TO analytics;

-- add the parquet extension
\c analytics
CREATE EXTENSION IF NOT EXISTS parquet_fdw;
CREATE SERVER parquet_server FOREIGN DATA WRAPPER parquet_fdw;

-- Create a function that always returns the first non-NULL value:
CREATE OR REPLACE FUNCTION first_agg(anyelement, anyelement)
RETURNS anyelement
LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS
'SELECT $1';

-- Then wrap an aggregate around it:
CREATE AGGREGATE first (anyelement) (
    sfunc = first_agg,
    stype = anyelement,
    parallel = safe
);

-- Create a function that always returns the last non-NULL value:
CREATE OR REPLACE FUNCTION last_agg(anyelement, anyelement)
RETURNS anyelement
LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS
'SELECT $2';

-- Then wrap an aggregate around it:
CREATE AGGREGATE last (anyelement) (
    sfunc = last_agg,
    stype = anyelement,
    parallel = safe
);
