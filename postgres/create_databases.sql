CREATE DATABASE base_goerli; -- raw events from Base Goerli
CREATE DATABASE optimism_goerli; -- raw events from Optimism Goerli
CREATE DATABASE optimism_mainnet; -- raw events from Optimism Mainnet
CREATE DATABASE analytics; -- transformed data from dbt

-- create a read only user for querying
CREATE USER analytics WITH PASSWORD 'analytics';
GRANT pg_read_all_data TO analytics;
