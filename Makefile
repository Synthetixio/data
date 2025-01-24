include .env
export

.PHONY: build wrap dbt

build:
	docker compose build transformer

extract:
	docker compose run extractors uv run python main.py configs/eth_mainnet.yaml
	docker compose run extractors uv run python main.py configs/base_mainnet.yaml
	docker compose run extractors uv run python main.py configs/base_sepolia.yaml
	docker compose run extractors uv run python main.py configs/arbitrum_mainnet.yaml
	docker compose run extractors uv run python main.py configs/arbitrum_sepolia.yaml

listener-start:
	docker compose up -d indexer-listener

listener-stop:
	docker compose down indexer-listener

index-start:
	docker compose -f docker-compose.indexers.yml up -d

index-stop:
	docker compose -f docker-compose.indexers.yml down 

synths:
	docker compose run transformer uv run python scripts/get_synths.py

dbt: build
	docker compose run transformer dbt run --target prod --profiles-dir profiles --profile clickhouse

seed-prod: build
	docker compose run transformer dbt seed --target prod --profiles-dir profiles --profile clickhouse

seed-dev: build
	docker compose run transformer dbt seed --target dev --profiles-dir profiles --profile clickhouse

dbt-op: build
	docker compose run transformer dbt run --target prod-op --profiles-dir profiles --profile clickhouse
