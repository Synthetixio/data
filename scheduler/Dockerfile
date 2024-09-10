FROM apache/airflow:slim-latest-python3.11

USER root
RUN apt-get update && apt-get install -y docker.io

USER airflow
COPY scheduler/entrypoint.sh /entrypoint.sh

# install requirements
COPY scheduler/requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

RUN python3 -m venv /home/airflow/venv
ENV PATH="/home/airflow/venv/bin:$PATH"
COPY transformers/requirements.txt /transformers_requirements.txt
RUN pip install --no-cache-dir -r /transformers_requirements.txt

ENV AIRFLOW__CORE__LOAD_EXAMPLES=False
ENV AIRFLOW__WEBSERVER__RBAC=True

ENTRYPOINT ["/entrypoint.sh"]
