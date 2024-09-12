import os
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.latest_only import LatestOnlyOperator
from datetime import datetime, timedelta
from utils import parse_dbt_output

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


dag = DAG(
    "v2_etl_optimism_mainnet",
    default_args=default_args,
    description="Extract and transform V2 data from Optimism",
    schedule_interval="@hourly",
)

latest_only = LatestOnlyOperator(task_id="latest_only")

sync_repo_optimism_mainnet = BashOperator(
    task_id="sync_repo_optimism_mainnet",
    bash_command=f"""
    if [ -d {REPO_DIR} ]; then
        cd {REPO_DIR} && git pull && source /home/airflow/venv/bin/activate && dbt deps --project-dir {REPO_DIR}/transformers/synthetix
    else
        git clone {REPO_URL} {REPO_DIR} && source /home/airflow/venv/bin/activate && dbt deps --project-dir {REPO_DIR}/transformers/synthetix
    fi
    """,
    env={
        "WORKING_DIR": WORKING_DIR,
        "PG_PASSWORD": os.getenv("PG_PASSWORD"),
    },
    dag=dag,
)


transform_optimism_mainnet = BashOperator(
    task_id="transform_optimism_mainnet",
    bash_command=f"source /home/airflow/venv/bin/activate && dbt run --target prod-op --project-dir {REPO_DIR}/transformers/synthetix --profiles-dir {REPO_DIR}/transformers/synthetix/profiles --profile synthetix",
    env={
        "WORKING_DIR": WORKING_DIR,
        "PG_PASSWORD": os.getenv("PG_PASSWORD"),
    },
    dag=dag,
    on_success_callback=parse_dbt_output,
    on_failure_callback=parse_dbt_output,
)

test_optimism_mainnet = BashOperator(
    task_id="test_optimism_mainnet",
    bash_command=f"source /home/airflow/venv/bin/activate && dbt test --target prod-op --project-dir {REPO_DIR}/transformers/synthetix --profiles-dir {REPO_DIR}/transformers/synthetix/profiles --profile synthetix",
    env={
        "WORKING_DIR": WORKING_DIR,
        "PG_PASSWORD": os.getenv("PG_PASSWORD"),
    },
    dag=dag,
    on_success_callback=parse_dbt_output,
    on_failure_callback=parse_dbt_output,
)

latest_only >> sync_repo_optimism_mainnet >> transform_optimism_mainnet >> test_optimism_mainnet
