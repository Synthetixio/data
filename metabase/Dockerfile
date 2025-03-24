# First stage build image
FROM --platform=${BUILDPLATFORM} eclipse-temurin:11-jre-focal AS builder

# Architecture args
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "Building on $BUILDPLATFORM for $TARGETPLATFORM"

# Metabase configuration
ARG CLICKHOUSE_DRIVER_VERSION=1.53.3
ENV FC_LANG=en-US LC_CTYPE=en_US.UTF-8
ENV MB_PLUGINS_DIR=/plugins

WORKDIR /app/

# Install dependencies and download required files
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends ttf-dejavu curl ca-certificates && \
    mkdir -p /app/certs /plugins && \
    curl -L https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem -o /app/certs/rds-combined-ca-bundle.pem && \
    curl -L https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem -o /app/certs/DigiCertGlobalRootG2.crt.pem 

# Set up certificates
RUN mkdir -p /etc/ssl/certs/java/cacerts && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias aws-rds \
    -file /app/certs/rds-combined-ca-bundle.pem \
    -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias azure-cert \
    -file /app/certs/DigiCertGlobalRootG2.crt.pem \
    -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit

# Download Metabase and plugins
RUN curl -L https://downloads.metabase.com/latest/metabase.jar -o /app/metabase.jar && \
    curl -L -o /plugins/clickhouse.metabase-driver.jar \
    https://github.com/clickhouse/metabase-clickhouse-driver/releases/download/${CLICKHOUSE_DRIVER_VERSION}/clickhouse.metabase-driver.jar && \
    apt-get autoremove -y && apt-get autoclean && \
    rm -rf /var/lib/apt/lists/*

# Create a smaller runtime image
FROM --platform=${TARGETPLATFORM} eclipse-temurin:11-jre-focal

# Metabase configuration
ENV FC_LANG=en-US LC_CTYPE=en_US.UTF-8
ENV MB_PLUGINS_DIR=/plugins
# ARM64 optimizations for memory and GC
ENV JAVA_OPTS="-XX:+UseG1GC -XX:+ExplicitGCInvokesConcurrent -XX:+ParallelRefProcEnabled -XX:+UseStringDeduplication -XX:+UnlockExperimentalVMOptions -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M -Djava.awt.headless=true"

WORKDIR /app/

# Install minimal runtime dependencies
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends ttf-dejavu procps && \
    # Add architecture-specific optimizations
    if [ "$(uname -m)" = "aarch64" ]; then \
        apt-get install -y --no-install-recommends libjemalloc2; \
        echo "export LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2" >> /etc/profile.d/jemalloc.sh; \
    fi && \
    apt-get autoremove -y && apt-get autoclean && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /plugins && chmod a+rwx /plugins

# Copy files from builder
COPY --from=builder /app/metabase.jar /app/metabase.jar
COPY --from=builder /app/certs /app/certs
COPY --from=builder /plugins /plugins
COPY --from=builder /etc/ssl/certs/java/cacerts /etc/ssl/certs/java/cacerts

# Copy startup script
COPY run_metabase.sh /app/run_metabase.sh

# Fix permissions
RUN chmod +x /app/run_metabase.sh && chown -R nobody:nogroup /app /plugins

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Switch to non-root user
USER nobody

# Expose port
EXPOSE 3000

# Run the application
ENTRYPOINT ["/app/run_metabase.sh"]