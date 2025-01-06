#!/bin/bash

if [ -z "$REPO_URL" ]; then
    echo "REPO_URL is not set"
    exit 1
fi

REPO_DIR=${REPO_CLONE_DIR:-"/opt/data"}

if [ ! -d "$REPO_DIR" ]; then
    echo "Cloning repo $REPO_URL into $REPO_DIR"
    git clone $REPO_URL $REPO_DIR

    echo "Installing dbt dependencies"
    source /home/airflow/venv/bin/activate
    dbt deps --project-dir "$REPO_DIR/transformers/synthetix"
    source deactivate
fi

airflow db upgrade
airflow users create -r Admin -u admin -p admin -e admin@example.com -f admin -l user || true
airflow webserver --port 8080 &
exec airflow scheduler
