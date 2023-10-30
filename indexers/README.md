# Indexers

This service contains a set of blockchain indexers that use Subsquid archives to index Synthetix smart contracts. A fully configured docker compose file is provided to run the indexers and a Postgres database. 

## Getting Started

1. Ensure you have installed Docker with Docker Compose. If you have not, follow the instructions [here](https://docs.docker.com/compose/install/).
1. Clone this repository.
1. Copy the `indexers/.env.example` file to `indexers/.env`. This file contains an environment variable for Postgres database port.
1. Each network has a directory in the `indexers` directory (ie `optimism_mainnet`). Navigate to each network and copy the `.env.example` file to `.env`, filling in any additional settings. The example contains defaults which will work for most users, however the optional `RPC_ENDPOINT` value can be set to a custom RPC endpoint if you would like to index directly from a node.
1. Run `docker-compose up` from the root directory of this repository. This will start the indexers and a Postgres database. The indexers will begin indexing the specified network and will populate the database with raw event log data.

## Querying Data

A Postgres database will be running in a container. You can query the database using any Postgres client. The default credentials are:

```
Host: localhost
Port: 23798
Username: postgres
Password: postgres
```

Notes:
* The service will have one database for each network. For example, all Optimism Mainnet events can be found in the `optimism-mainnet` database.
* Database tables for events follow the format `{contract_name}_event_{event_name}`, for example: `perps_market_proxy_event_account_created`.
