import os
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.operators.latest_only import LatestOnlyOperator
from datetime import datetime, timedelta
from docker.types import Mount

# environment variables
WORKING_DIR = os.getenv("WORKING_DIR")

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2024, 7, 1),
    "retries": 3,
    "retry_delay": timedelta(minutes=1),
    "catchup": False,
}

dag = DAG(
    "v2_etl_optimism_mainnet",
    default_args=default_args,
    description="Extract and transform V2 data from Optimism",
    schedule_interval="@hourly",
)

latest_only = LatestOnlyOperator(task_id="latest_only")

transform_optimism_mainnet = DockerOperator(
    task_id="transform_optimism_mainnet",
    command=f"dbt run --target prod-op --profiles-dir profiles --profile synthetix",
    image="data-transformer",
    api_version="auto",
    auto_remove=True,
    docker_url="unix://var/run/docker.sock",
    network_mode="data_data",
    mounts=[
        Mount(
            source=f"{WORKING_DIR}/parquet-data",
            target="/parquet-data",
            type="bind",
        )
    ],
    environment={
        "WORKING_DIR": WORKING_DIR,
        "PG_PASSWORD": os.getenv("PG_PASSWORD"),
    },
    dag=dag,
)

latest_only >> transform_optimism_mainnet
