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

index:
	docker compose run indexer --network_name base_mainnet --protocol_name synthetix
	docker compose run indexer --network_name arbitrum_mainnet --protocol_name synthetix

synths:
	docker compose run transformer python scripts/get_synths.py

dbt: build
	docker compose run transformer dbt run --target prod --profiles-dir profiles --profile synthetix

seed-prod: build
	docker compose run transformer dbt seed --target prod --profiles-dir profiles --profile synthetix

seed-dev: build
	docker compose run transformer dbt seed --target dev --profiles-dir profiles --profile synthetix

dbt-op: build
	docker compose run transformer dbt run --target prod-op --profiles-dir profiles --profile synthetix
