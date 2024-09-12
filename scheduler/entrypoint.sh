#!/bin/bash

source /home/airflow/venv/bin/activate
dbt deps --project-dir /opt/synthetix
source deactivate

airflow db upgrade
airflow users create -r Admin -u admin -p admin -e admin@example.com -f admin -l user || true
airflow webserver --port 8080 &
exec airflow scheduler
