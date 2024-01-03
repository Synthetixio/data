-- raw events from Optimism Mainnet
CREATE database optimism_mainnet;
-- raw events from Optimism Goerli
CREATE database optimism_goerli;
-- raw events from Base Goerli
CREATE database base_mainnet;
-- raw events from Base Mainnet
CREATE database base_goerli;
-- transformed data from dbt
CREATE database analytics;
-- create a read only user for querying
CREATE USER analytics WITH password 'analytics';
GRANT pg_read_all_data TO analytics;
