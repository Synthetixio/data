import os
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.latest_only import LatestOnlyOperator
from airflow.providers.docker.operators.docker import DockerOperator
from docker.types import Mount
from datetime import datetime, timedelta
from utils import transformer_callback, extractor_callback

# environment variables
WORKING_DIR = os.getenv("WORKING_DIR")
REPO_URL = os.getenv("REPO_URL")
REPO_DIR = os.getenv("REPO_CLONE_DIR", "/opt/data")

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
        auto_remove="force",
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


dag = DAG(
    "v2_etl_optimism_mainnet",
    default_args=default_args,
    description="Extract and transform V2 data from Optimism",
    schedule_interval="@hourly",
)

latest_only = LatestOnlyOperator(task_id="latest_only")

sync_repo_optimism_mainnet = BashOperator(
    task_id="sync_repo_optimism_mainnet",
    bash_command=f"cd {REPO_DIR} && git pull",
    env={
        "WORKING_DIR": WORKING_DIR,
        "PG_PASSWORD": os.getenv("PG_PASSWORD"),
    },
    dag=dag,
)

extract_optimism_mainnet = create_docker_operator(
    dag=dag,
    task_id="extract_optimism_mainnet",
    config_file=f"configs/optimism_mainnet.yaml",
    image="data-extractors",
    command=None,
    network_env_var="NETWORK_10_RPC",
    on_success_callback=extractor_callback,
    on_failure_callback=extractor_callback,
)

transform_optimism_mainnet = BashOperator(
    task_id="transform_optimism_mainnet",
    bash_command=f"source /home/airflow/venv/bin/activate && dbt run --target prod-op --project-dir {REPO_DIR}/transformers/synthetix --profiles-dir {REPO_DIR}/transformers/synthetix/profiles --profile synthetix --select tag:optimism_mainnet+",
    env={
        "WORKING_DIR": WORKING_DIR,
        "PG_PASSWORD": os.getenv("PG_PASSWORD"),
    },
    dag=dag,
    on_success_callback=transformer_callback,
    on_failure_callback=transformer_callback,
)

test_optimism_mainnet = BashOperator(
    task_id="test_optimism_mainnet",
    bash_command=f"source /home/airflow/venv/bin/activate && dbt test --target prod-op --project-dir {REPO_DIR}/transformers/synthetix --profiles-dir {REPO_DIR}/transformers/synthetix/profiles --profile synthetix --select tag:optimism_mainnet+",
    env={
        "WORKING_DIR": WORKING_DIR,
        "PG_PASSWORD": os.getenv("PG_PASSWORD"),
    },
    dag=dag,
    on_success_callback=transformer_callback,
    on_failure_callback=transformer_callback,
)

(
    latest_only
    >> sync_repo_optimism_mainnet
    >> extract_optimism_mainnet
    >> transform_optimism_mainnet
    >> test_optimism_mainnet
)
