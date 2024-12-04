include .env
export

.PHONY: build wrap dbt

DB_NAME ?= base_sepolia
CONTAINER_NAME ?= data-db-1

# Target to recreate the database
recreate-db:
	docker exec -it $(CONTAINER_NAME) /bin/bash -c "PGPASSWORD=${PG_PASSWORD} psql -U postgres -c 'DROP DATABASE IF EXISTS $(DB_NAME);'"
	docker exec -it $(CONTAINER_NAME) /bin/bash -c "PGPASSWORD=${PG_PASSWORD} psql -U postgres -c 'CREATE DATABASE $(DB_NAME);'"

reset-pw:
	docker exec -it $(CONTAINER_NAME) /bin/bash -c "PGPASSWORD=$(PG_PASSWORD) psql -U postgres -c 'ALTER USER analytics WITH PASSWORD '\''$(READONLY_PASSWORD)'\'';'"

build:
	docker compose build transformer

extract:
	docker compose run extractors python main.py configs/eth_mainnet.yaml
	docker compose run extractors python main.py configs/base_mainnet.yaml
	docker compose run extractors python main.py configs/base_sepolia.yaml
	docker compose run extractors python main.py configs/arbitrum_mainnet.yaml
	docker compose run extractors python main.py configs/arbitrum_sepolia.yaml

index:
	docker compose run indexers-v2 --network_name base_mainnet --config_name synthetix-v3
	docker compose run indexers-v2 --network_name arbitrum_mainnet --config_name synthetix-v3

synths:
	docker compose run transformer python scripts/get_synths.py

wrap:
	docker compose run transformer python scripts/wrap_tables.py

import:
	docker compose run transformer python scripts/import_parquet.py

dbt: build
	docker compose run transformer dbt run --target prod --profiles-dir profiles --profile synthetix

seed-prod: build
	docker compose run transformer dbt seed --target prod --profiles-dir profiles --profile synthetix

seed-dev: build
	docker compose run transformer dbt seed --target dev --profiles-dir profiles --profile synthetix

dbt-op: build
	docker compose run transformer dbt run --target prod-op --profiles-dir profiles --profile synthetix --model raw.optimism.mainnet.tlx_lt_minted_optimism_mainnet
