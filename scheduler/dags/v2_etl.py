import os
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from datetime import datetime, timedelta
from docker.types import Mount

# environment variables
WORKING_DIR = os.getenv("WORKING_DIR")

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime.now() - timedelta(hours=1),
    "retries": 3,
    "retry_delay": timedelta(minutes=1),
    "catchup": False,
}

dag = DAG(
    "v2_pipeline",
    default_args=default_args,
    description="Extract and transform V2 data from Optimism",
    schedule_interval="@hourly",
)

transform_optimism_mainnet = DockerOperator(
    task_id="transform_optimism_mainnet",
    command=f"dbt run --target optimism_mainnet --profiles-dir profiles --profile docker",
    image='data-transformer',
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

transform_optimism_mainnet
