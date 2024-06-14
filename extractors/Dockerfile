# build rust package
FROM rust:1.79.0 as builder

RUN apt-get update && apt-get install -y python3-pip python3-venv

RUN python3 -m venv venv
ENV PATH="/venv/bin:$PATH"

WORKDIR /usr/src
RUN git clone https://github.com/paradigmxyz/cryo
WORKDIR /usr/src/cryo/crates/python

RUN pip install maturin
RUN maturin build --release

# install wheel package and run
FROM python:3.11 as runtime

WORKDIR /app

COPY --from=builder /usr/src/cryo/target/wheels/*.whl /app/

RUN pip install --no-cache-dir /app/*.whl

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python3", "main.py"]
