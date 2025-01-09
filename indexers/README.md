# Indexers

This service creates a blockchain indexer that uses Subsquid Archives and RPCs to index smart contracts and save the data to Parquet files. Additional scripts are provided to ingest the data into a ClickHouse database (which can be set up using the docker compose config present in the root directory). 

## Getting Started

1. Ensure you have installed Docker with Docker Compose. If you have not, follow the instructions [here](https://docs.docker.com/compose/install/).
1. Each network has a directory in the `networks` directory (ie `base_mainnet`), with a `network_config.yaml` file and an (optional) `abi` directory. The `network_config.yaml` defines network-specific settings (under `network`), and multiple project-specific (or protocol) settings (under `config`). 
1. Run `docker compose run -e NETWORK_NAME={network_name} -e PROTOCOL_NAME={protocol_name} indexer` (replace `{network_name}` and `{protocol_name}` with a network name from the `networks` directory and the protocol defined under `configs` in the `network_config.yaml` file). This will start indexing the blockchain data and save it as Parquet files in `parquet-data/indexers/raw/{network_name}/{protocol_name}/` in the root directory.


## Querying Data Using ClickHouse

### Set Up Server

You can set up a ClickHouse database server by running `docker compose up clickhouse -d`. The default settings are:

```
host: localhost
port: 8123
```

### Ingesting Data

A Python script is provided that can be used to import the data from the Parquet files to ClickHouse. This script can be run using the `docker compose run` command as follows:

`docker compose run -e NETWORK_NAME={network_name} -e PROTOCOL_NAME={protocol_name} indexer uv run scripts/import_parquet.py`
 
Once the script finishes running, the data can be queried using any ClickHouse client.

Notes:
* The ClickHouse server will have one database per network. For example, all Base Mainnet events can be found in the `raw_base_mainnet` database.
* Database tables for events follow the format `{protocol_name}_{contract_name}_event_{event_name}`, for example: `synthetix_perps_market_proxy_event_account_created`.
* To further transform the data using `dbt`, see the [transformers](../transformers/) directory.