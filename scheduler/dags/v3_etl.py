import os
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.operators.latest_only import LatestOnlyOperator
from datetime import datetime, timedelta
from docker.types import Mount

# environment variables
WORKING_DIR = os.getenv("WORKING_DIR")
NETWORK_RPCS = {
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


def create_docker_operator(dag, task_id, config_file, image, command, network_env_var):
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
    )


def create_dag(network, rpc_var):
    dag = DAG(
        f"v3_etl_{network}",
        default_args=default_args,
        description=f"ETL pipeline for {network}",
        schedule_interval="0 16 * * *",
    )

    latest_only_task = LatestOnlyOperator(task_id=f"latest_only_{network}", dag=dag)

    extract_task_id = f"extract_{network}"
    config_file = f"configs/{network}.yaml"
    extract_task = create_docker_operator(
        dag=dag,
        task_id=extract_task_id,
        config_file=config_file,
        image="data-extractors",
        command=None,
        network_env_var=rpc_var,
    )

    transform_task_id = f"transform_{network}"
    transform_task = create_docker_operator(
        dag=dag,
        task_id=transform_task_id,
        config_file=None,
        image="data-transformer",
        command=f"dbt run --target {'prod' if network != 'optimism_mainnet' else 'prod-op'} --select tag:{network} --profiles-dir profiles --profile synthetix",
        network_env_var=rpc_var,
    )

    latest_only_task >> extract_task >> transform_task

    return dag


for network, rpc_var in NETWORK_RPCS.items():
    globals()[f"v3_etl_{network}"] = create_dag(network, rpc_var)
