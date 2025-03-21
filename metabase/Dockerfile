FROM eclipse-temurin:11-jre-focal AS builder

ARG CLICKHOUSE_DRIVER_VERSION=1.53.3
ENV FC_LANG=en-US LC_CTYPE=en_US.UTF-8
ENV MB_PLUGINS_DIR=/plugins

WORKDIR /app/

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends ttf-dejavu curl && \
    mkdir -p /app/certs /plugins && \
    curl https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem -o /app/certs/rds-combined-ca-bundle.pem && \
    curl https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem -o /app/certs/DigiCertGlobalRootG2.crt.pem && \
    mkdir -p /etc/ssl/certs/java/cacerts && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias aws-rds \
    -file /app/certs/rds-combined-ca-bundle.pem \
    -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias azure-cert \
    -file /app/certs/DigiCertGlobalRootG2.crt.pem \
    -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit && \
    curl https://downloads.metabase.com/latest/metabase.jar -o /app/metabase.jar && \
    curl -L -o /plugins/clickhouse.metabase-driver.jar \
    https://github.com/clickhouse/metabase-clickhouse-driver/releases/download/${CLICKHOUSE_DRIVER_VERSION}/clickhouse.metabase-driver.jar && \
    apt-get autoremove -y && apt-get autoclean && \
    rm -rf /var/lib/apt/lists/*

FROM eclipse-temurin:11-jre-focal

ENV FC_LANG=en-US LC_CTYPE=en_US.UTF-8
ENV MB_PLUGINS_DIR=/plugins

WORKDIR /app/

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends ttf-dejavu && \
    apt-get autoremove -y && apt-get autoclean && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /plugins && chmod a+rwx /plugins

COPY --from=builder /app/metabase.jar /app/metabase.jar
COPY --from=builder /app/certs /app/certs
COPY --from=builder /plugins /plugins
COPY --from=builder /etc/ssl/certs/java/cacerts /etc/ssl/certs/java/cacerts
COPY run_metabase.sh /app/run_metabase.sh

RUN chmod +x /app/run_metabase.sh && chown -R nobody:nogroup /app /plugins

USER nobody

EXPOSE 3000

ENTRYPOINT ["/app/run_metabase.sh"]