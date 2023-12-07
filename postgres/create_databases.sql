-- transformed data from dbt
CREATE database analytics;
-- raw events from Base Goerli
CREATE database base_goerli;
-- raw events from Optimism Goerli
CREATE database optimism_goerli;
-- raw events from Optimism Mainnet
CREATE database optimism_mainnet;
-- create a read only user for querying
CREATE USER analytics WITH password 'analytics';
GRANT pg_read_all_data TO analytics;
