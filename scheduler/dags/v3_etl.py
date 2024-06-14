import os
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
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
    "start_date": datetime.now() - timedelta(hours=1),
    "retries": 3,
    "retry_delay": timedelta(minutes=1),
    "catchup": False,
}

dag = DAG(
    "v3_pipeline",
    default_args=default_args,
    description="Extract and transform V3 data across networks",
    schedule_interval="@hourly",
)


def create_docker_operator(task_id, config_file, image, command, network_env_var):
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


extract_tasks = {}
transform_tasks = {}

for network, rpc_var in NETWORK_RPCS.items():
    extract_task_id = f"extract_{network}"
    config_file = f"configs/{network}.yaml"
    extract_tasks[network] = create_docker_operator(
        task_id=extract_task_id,
        config_file=config_file,
        image="data-extractors",
        command=None,
        network_env_var=rpc_var,
    )

    transform_task_id = f"transform_{network}"
    transform_tasks[network] = create_docker_operator(
        task_id=transform_task_id,
        config_file=None,
        image="data-transformer",
        command=f"dbt run --target {network} --profiles-dir profiles --profile docker",
        network_env_var=rpc_var,
    )

# Set task dependencies
for network in NETWORK_RPCS.keys():
    extract_tasks[network] >> transform_tasks[network]
