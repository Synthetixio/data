FROM apache/airflow:slim-latest-python3.11

USER root
RUN apt-get update && apt-get install -y docker.io

USER airflow
COPY entrypoint.sh /entrypoint.sh

# install requirements
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

ENV AIRFLOW__CORE__LOAD_EXAMPLES=False
ENV AIRFLOW__WEBSERVER__RBAC=True

ENTRYPOINT ["/entrypoint.sh"]
