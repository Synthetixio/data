import os
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.operators.latest_only import LatestOnlyOperator
from datetime import datetime, timedelta
from docker.types import Mount
from utils import get_log_url, send_discord_alert, parse_dbt_test_results

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


def success_callback(context):
    log_url = get_log_url(context)
    message = f":green_circle: DAG run was **successful** | DAG: {context['dag'].dag_id} | Task: {context['task'].task_id}"

    send_discord_alert(message)
    send_discord_alert(f"Link: {log_url}")

    parse_dbt_test_results(context)


def failure_callback(context):
    log_url = get_log_url(context)
    message = f":red_circle: DAG run has **failed** | DAG: {context['dag'].dag_id} | Task: {context['task'].task_id}"

    send_discord_alert(message)
    send_discord_alert(f"Link: {log_url}")

    parse_dbt_test_results(context)


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

test_optimism_mainnet = DockerOperator(
    task_id="test_optimism_mainnet",
    command=f"dbt test --target prod-op --profiles-dir profiles --profile synthetix",
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
    on_success_callback=success_callback,
    on_failure_callback=failure_callback
)

latest_only >> transform_optimism_mainnet >> test_optimism_mainnet
