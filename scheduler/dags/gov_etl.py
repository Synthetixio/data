import os
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.latest_only import LatestOnlyOperator
from airflow.operators.bash import BashOperator
from utils import transformer_callback

# environment variables
WORKING_DIR = os.getenv("WORKING_DIR")
REPO_URL = os.getenv("REPO_URL")
REPO_DIR = os.getenv("REPO_CLONE_DIR", "/opt/data")
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


def create_bash_operator(
    dag,
    task_id,
    command,
    on_success_callback=None,
    on_failure_callback=None,
):
    return BashOperator(
        task_id=task_id,
        bash_command=command,
        env={
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

    sync_repo_task_id = f"sync_repo_{version}"
    sync_repo_task = create_bash_operator(
        dag=dag,
        task_id=sync_repo_task_id,
        command=f"cd {REPO_DIR} && git pull",
    )

    transform_task_id = f"transform_{version}"
    transform_task = create_bash_operator(
        dag=dag,
        task_id=transform_task_id,
        command=f"source /home/airflow/venv/bin/activate && dbt run --target prod --select tag:{network}+ --project-dir {REPO_DIR}/transformers/synthetix --profiles-dir {REPO_DIR}/transformers/synthetix/profiles --profile synthetix",
        on_success_callback=transformer_callback,
        on_failure_callback=transformer_callback,
    )

    test_task_id = f"test_{version}"
    test_task = create_bash_operator(
        dag=dag,
        task_id=test_task_id,
        command=f"source /home/airflow/venv/bin/activate && dbt test --target prod --select tag:{network}+ --project-dir {REPO_DIR}/transformers/synthetix --profiles-dir {REPO_DIR}/transformers/synthetix/profiles --profile synthetix",
        on_success_callback=transformer_callback,
        on_failure_callback=transformer_callback,
    )

    latest_only_task >> sync_repo_task >> transform_task >> test_task
    return dag


for network in NETWORKS:
    for target in ["dev", "prod"]:
        globals()[f"gov_etl_{network}_{target}"] = create_dag(network, target)
