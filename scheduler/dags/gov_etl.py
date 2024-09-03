import os
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.latest_only import LatestOnlyOperator
from airflow.providers.docker.operators.docker import DockerOperator
from utils import parse_dbt_output
from docker.types import Mount

# environment variables
WORKING_DIR = os.getenv("WORKING_DIR")
NETWORKS = [
    "snax_testnet",
    "snax_mainnet",
]

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2024, 8, 1),
    "retries": 3,
    "retry_delay": timedelta(minutes=1),
    "catchup": False,
}


def create_docker_operator(
    dag,
    task_id,
    config_file,
    image,
    command,
    on_success_callback=None,
    on_failure_callback=None,
):
    return DockerOperator(
        task_id=task_id,
        command=f"python main.py {config_file}" if command is None else command,
        image=image,
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
        on_success_callback=on_success_callback,
        on_failure_callback=on_failure_callback,
    )


def create_dag(network, target="dev"):
    version = f"{network}_{target}"

    dag = DAG(
        f"v3_etl_{version}",
        default_args=default_args,
        description=f"ETL pipeline for {version}",
        schedule_interval="0 16 * * *",
    )

    latest_only_task = LatestOnlyOperator(task_id=f"latest_only_{version}", dag=dag)

    transform_task_id = f"transform_{version}"
    transform_task = create_docker_operator(
        dag=dag,
        task_id=transform_task_id,
        config_file=None,
        image="data-transformer",
        command=f"dbt run --target prod --select tag:{network} --profiles-dir profiles --profile synthetix",
        on_success_callback=parse_dbt_output,
        on_failure_callback=parse_dbt_output,
    )

    test_task_id = f"test_{version}"
    test_task = create_docker_operator(
        dag=dag,
        task_id=test_task_id,
        config_file=None,
        image="data-transformer",
        command=f"dbt test --target prod --select tag:{network} --profiles-dir profiles --profile synthetix",
        on_success_callback=parse_dbt_output,
        on_failure_callback=parse_dbt_output,
    )

    latest_only_task >> transform_task >> test_task
    return dag


for network in NETWORKS:
    for target in ["dev", "prod"]:
        globals()[f"gov_etl_{network}_{target}"] = create_dag(network, target)
