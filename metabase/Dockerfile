FROM --platform=linux/arm64 eclipse-temurin:11-jre-focal

ENV FC_LANG=en-US LC_CTYPE=en_US.UTF-8
ENV MB_PLUGINS_DIR=/plugins
# ARM64 optimized memory settings
ENV JAVA_OPTS="-XX:+UseG1GC -XX:+ExplicitGCInvokesConcurrent -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=50 -Xms512m -Xmx2g -Djava.awt.headless=true"

WORKDIR /app/

# Install dependencies for ARM64
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends ttf-dejavu curl ca-certificates procps && \
    apt-get install -y --no-install-recommends libjemalloc2 && \
    echo "export LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2" >> /etc/profile.d/jemalloc.sh && \
    mkdir -p /app/certs /plugins && \
    curl -L https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem -o /app/certs/rds-combined-ca-bundle.pem && \
    curl -L https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem -o /app/certs/DigiCertGlobalRootG2.crt.pem && \
    mkdir -p /etc/ssl/certs/java/cacerts && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias aws-rds \
    -file /app/certs/rds-combined-ca-bundle.pem \
    -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias azure-cert \
    -file /app/certs/DigiCertGlobalRootG2.crt.pem \
    -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit && \
    curl -L https://downloads.metabase.com/latest/metabase.jar -o /app/metabase.jar && \
    apt-get autoremove -y && apt-get autoclean && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /plugins && chmod a+rwx /plugins

COPY run_metabase.sh /app/run_metabase.sh
RUN chmod +x /app/run_metabase.sh

USER nobody
EXPOSE 3000
ENTRYPOINT ["/app/run_metabase.sh"]