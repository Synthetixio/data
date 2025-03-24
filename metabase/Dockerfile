FROM --platform=linux/arm64 eclipse-temurin:17-jre-focal as runner

ENV FC_LANG en-US LC_CTYPE en_US.UTF-8

WORKDIR /app/

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends ttf-dejavu && \
    # create certs directory
    mkdir -p /app/certs && \
    # download certificates
    curl https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem -o /app/certs/rds-combined-ca-bundle.pem && \
    curl https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem -o /app/certs/DigiCertGlobalRootG2.crt.pem && \
    # import certificates
    mkdir -p /etc/ssl/certs/java/cacerts && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias aws-rds -file /app/certs/rds-combined-ca-bundle.pem -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias azure-cert -file /app/certs/DigiCertGlobalRootG2.crt.pem -keystore /etc/ssl/certs/java/cacerts/java-keystore -keypass changeit -storepass changeit && \
    # download metabase jar
    curl https://downloads.metabase.com/latest/metabase.jar -o metabase.jar && \
    # download run script
    curl https://raw.githubusercontent.com/metabase/metabase/master/bin/docker/run_metabase.sh -o run_metabase.sh && \
    chmod +x run_metabase.sh && \
    # clean up
    apt-get autoremove -y && apt-get autoclean && \
    rm -rf /var/lib/apt/lists/* && \
    # providing permissions to the nobody user
    chown -R nobody:nogroup /app

USER nobody

# expose our default runtime port
EXPOSE 3000

# run it
ENTRYPOINT ["/app/run_metabase.sh"]
