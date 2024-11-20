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


def create_status_message(task_id, state):
    return (
        f":green_circle: {task_id}" if state == "success" else f":red_circle: {task_id}"
    )


def get_log_url(context):
    dag_id = context["dag"].dag_id
    run_id = context["run_id"]
    task_id = context["task"].task_id
    encoded_run_id = quote(run_id, safe="")

    url = f"http://{AIRFLOW_BASE_URL}:{AIRFLOW_PORT}/dags/{dag_id}/grid?tab=logs&dag_run_id={encoded_run_id}&task_id={task_id}"
    return url


def transformer_callback(context):
    ti = context["task_instance"]
    task_logs_url = get_log_url(context)

    # create DAG status message
    task_status_message = create_status_message(ti.task_id, ti.state.value)

    # send DAG status message & logs URL to Discord
    send_discord_alert(task_status_message)
    send_discord_alert(task_logs_url)

    # try to get dbt output
    log_path = f"./logs/dag_id={ti.dag_id}/run_id={ti.run_id}/task_id={ti.task_id}/attempt={ti.try_number-1}.log"

    try:
        with open(log_path, "r") as log_file:
            dbt_test_output = log_file.read()
        if dbt_test_output is None:
            send_discord_alert("Unable to retrieve dbt output")
            return

        summary_match = re.search(
            r"Done\.\s+PASS=(\d+)\s+WARN=(\d+)\s+ERROR=(\d+)\s+SKIP=(\d+)\s+TOTAL=(\d+)",
            dbt_test_output,
        )
        if summary_match is None:
            send_discord_alert("Unable to parse dbt summary")
            return

        pass_count, warn_count, error_count, skip_count, total_count = map(
            int, summary_match.groups()
        )

        summary_message = f"dbt output summary: {pass_count} passed, {warn_count} warnings, {error_count} errors, {skip_count} skipped, {total_count} total"
        send_discord_alert(summary_message)

        if warn_count > 0 or error_count > 0:
            error_warnings = re.findall(
                r"((?:Failure|Warning) in .*? \(.*?\))", dbt_test_output
            )
            for err in error_warnings:
                if "Failure" in err:
                    message = f":exclamation: {err}"
                elif "Warning" in err:
                    message = f":warning: {err}"
                else:
                    message = f"{err}"
                message = message.replace("__", r"\_\_")
                send_discord_alert(message)
    except FileNotFoundError:
        send_discord_alert("Unable to retrieve dbt output")
    except Exception as e:
        send_discord_alert(f"Error in transformer callback: {e}")
        raise e


def extractor_callback(context):
    ti = context["task_instance"]
    task_logs_url = get_log_url(context)

    # create DAG status message
    task_status_message = create_status_message(ti.task_id, ti.state.value)

    # send DAG status message & logs URL to Discord
    send_discord_alert(task_status_message)
    send_discord_alert(task_logs_url)
