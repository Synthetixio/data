import os
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.latest_only import LatestOnlyOperator
from airflow.providers.docker.operators.docker import DockerOperator
from docker.types import Mount
from utils import parse_dbt_output

# environment variables
WORKING_DIR = os.getenv("WORKING_DIR")
NETWORK_RPCS = {
    "eth_mainnet": "NETWORK_1_RPC",
    "base_mainnet": "NETWORK_8453_RPC",
    "base_sepolia": "NETWORK_84532_RPC",
    "arbitrum_mainnet": "NETWORK_42161_RPC",
    "arbitrum_sepolia": "NETWORK_421614_RPC",
}

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2024, 7, 1),
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
    network_env_var,
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
            network_env_var: os.getenv(network_env_var),
        },
        dag=dag,
        on_success_callback=on_success_callback,
        on_failure_callback=on_failure_callback,
    )


def create_dag(network, rpc_var, target="dev"):
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
        command=f"dbt run --target {target if network != 'optimism_mainnet' else target + '-op'} --select tag:{network} --profiles-dir profiles --profile synthetix",
        network_env_var=rpc_var,
        on_success_callback=parse_dbt_output,
        on_failure_callback=parse_dbt_output
    )

    test_task_id = f"test_{version}"
    test_task = create_docker_operator(
        dag=dag,
        task_id=test_task_id,
        config_file=None,
        image="data-transformer",
        command=f"dbt test --target {target if network != 'optimism_mainnet' else target + '-op'} --select tag:{network} --profiles-dir profiles --profile synthetix",
        network_env_var=rpc_var,
        on_success_callback=parse_dbt_output,
        on_failure_callback=parse_dbt_output
    )

    if target == "prod":
        extract_task_id = f"extract_{version}"
        config_file = f"configs/{network}.yaml"
        extract_task = create_docker_operator(
            dag=dag,
            task_id=extract_task_id,
            config_file=config_file,
            image="data-extractors",
            command=None,
            network_env_var=rpc_var,
        )

        latest_only_task >> extract_task >> transform_task >> test_task
    else:
        latest_only_task >> transform_task >> test_task

    return dag


for network, rpc_var in NETWORK_RPCS.items():
    for target in ["dev", "prod"]:
        globals()[f"v3_etl_{network}_{target}"] = create_dag(network, rpc_var, target)
