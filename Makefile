include .env
export

.PHONY: build wrap dbt

DB_NAME ?= base_goerli
CONTAINER_NAME ?= data-db-1

# Target to recreate the database
recreate-db:
	docker exec -it $(CONTAINER_NAME) /bin/bash -c "PGPASSWORD=${PG_PASSWORD} psql -U postgres -c 'DROP DATABASE IF EXISTS $(DB_NAME);'"
	docker exec -it $(CONTAINER_NAME) /bin/bash -c "PGPASSWORD=${PG_PASSWORD} psql -U postgres -c 'CREATE DATABASE $(DB_NAME);'"

reset-pw:
	docker exec -it $(CONTAINER_NAME) /bin/bash -c "PGPASSWORD=$(PG_PASSWORD) psql -U postgres -c 'ALTER USER analytics WITH PASSWORD '\''$(READONLY_PASSWORD)'\'';'"

build:
	docker compose build transformer

wrap:
	docker compose run transformer python scripts/wrap_tables.py

dbt: build
	docker compose run transformer dbt run --target base_goerli --profiles-dir profiles --profile docker
	docker compose run transformer dbt run --target base_mainnet --profiles-dir profiles --profile docker
