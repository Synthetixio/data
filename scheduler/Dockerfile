FROM apache/airflow:slim-latest-python3.11

USER root
RUN apt-get update && apt-get install -y docker.io
RUN chown -R airflow:root /opt/

USER airflow

# install requirements
COPY scheduler/requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

RUN python3 -m venv /home/airflow/venv
ENV PATH="/home/airflow/venv/bin:$PATH"
COPY transformers/requirements.txt /transformers_requirements.txt
RUN pip install --no-cache-dir -r /transformers_requirements.txt

COPY clickhouse/requirements.txt /clickhouse_requirements.txt
RUN pip install --no-cache-dir -r /clickhouse_requirements.txt

ENV AIRFLOW__CORE__LOAD_EXAMPLES=False
ENV AIRFLOW__WEBSERVER__RBAC=True

COPY scheduler/entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
