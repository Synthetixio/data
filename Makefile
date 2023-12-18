.PHONY: build wrap dbt

build:
	docker compose build transformer

wrap:
	docker compose run transformer python scripts/wrap_tables.py

dbt: build
	docker compose run transformer dbt run --target optimism_mainnet --profiles-dir profiles --profile docker
	docker compose run transformer dbt run --target base_goerli --profiles-dir profiles --profile docker
	docker compose run transformer dbt run --target base_mainnet --profiles-dir profiles --profile docker
