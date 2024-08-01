import os
import re
from urllib.parse import quote

import requests

DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")
AIRFLOW_BASE_URL = os.getenv("AIRFLOW_BASE_URL")
AIRFLOW_PORT = os.getenv("AIRFLOW_PORT")


def send_discord_alert(message):
    data = {"content": message}
    response = requests.post(DISCORD_WEBHOOK_URL, json=data)
    response.raise_for_status()


def get_log_url(context):
    dag_id = context["dag"].dag_id
    run_id = context["run_id"]
    task_id = context["task"].task_id
    encoded_run_id = quote(run_id, safe="")

    url = f"http://{AIRFLOW_BASE_URL}:{AIRFLOW_PORT}/dags/{dag_id}/grid?tab=logs&dag_run_id={encoded_run_id}&task_id={task_id}"
    return url


def parse_dbt_test_results(context):
    ti = context["task_instance"]
    log_path = f"./logs/dag_id={ti.dag_id}/run_id={ti.run_id}/task_id={ti.task_id}/attempt={ti.try_number-1}.log"

    with open(log_path, "r") as log_file:
        dbt_test_output = log_file.read()

    if dbt_test_output:
        summary_match = re.search(
            r"Done\.\s+PASS=(\d+)\s+WARN=(\d+)\s+ERROR=(\d+)\s+SKIP=(\d+)\s+TOTAL=(\d+)",
            dbt_test_output,
        )
        if summary_match:
            pass_count, warn_count, error_count, skip_count, total_count = map(
                int, summary_match.groups()
            )

            summary_message = f"dbt test summary: {pass_count} passed, {warn_count} warnings, {error_count} errors, {skip_count} skipped, {total_count} total"
            send_discord_alert(summary_message)

            if warn_count > 0 or error_count > 0:
                error_warnings = re.findall(
                    r"((?:Failure|Warning) in test .*? \(.*?\))", dbt_test_output
                )
                for test in error_warnings:
                    if "Failure" in test:
                        message = f":exclamation: {test}"
                    elif "Warning" in test:
                        message = f":warning: {test}"
                    else:
                        message = f"{test}"
                    message = message.replace("__", r"\_\_")
                    send_discord_alert(message)
        else:
            send_discord_alert("Unable to parse dbt test summary")
    else:
        send_discord_alert("Unable to retrieve dbt test output")
