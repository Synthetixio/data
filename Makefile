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
	docker compose run extractors python main.py configs/base_mainnet.yaml
	docker compose run extractors python main.py configs/base_sepolia.yaml
	docker compose run extractors python main.py configs/arbitrum_mainnet.yaml
	docker compose run extractors python main.py configs/arbitrum_sepolia.yaml

wrap:
	docker compose run transformer python scripts/wrap_tables.py

import:
	docker compose run transformer python scripts/import_parquet.py

dbt: build
	docker compose run transformer dbt run --target base_mainnet --profiles-dir profiles --profile docker
	docker compose run transformer dbt run --target base_sepolia --profiles-dir profiles --profile docker
	docker compose run transformer dbt run --target arbitrum_sepolia --profiles-dir profiles --profile docker
	docker compose run transformer dbt run --target arbitrum_mainnet --profiles-dir profiles --profile docker

dbt-op: build
	docker compose run transformer dbt run --target optimism_mainnet --profiles-dir profiles --profile docker
