FROM postgres:15

RUN apt-get update && apt-get install -y \
    ca-certificates \
    lsb-release \
    wget \
    git \
    build-essential \
    postgresql-server-dev-15

RUN wget https://apache.jfrog.io/artifactory/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb \
    && apt install -y -V ./apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb \
    && apt update \
    && apt install -y -V libarrow-dev \
                        libarrow-glib-dev \
                        libarrow-dataset-dev \
                        libarrow-dataset-glib-dev \
                        libarrow-acero-dev \
                        libarrow-flight-dev \
                        libarrow-flight-glib-dev \
                        libarrow-flight-sql-dev \
                        libarrow-flight-sql-glib-dev \
                        libgandiva-dev \
                        libgandiva-glib-dev \
                        libparquet-dev \
                        libparquet-glib-dev \
    && rm -f apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb

RUN git clone https://github.com/adjust/parquet_fdw.git \
    && cd parquet_fdw \
    && make && make install \
    && cd .. && rm -rf parquet_fdw

EXPOSE 5432
