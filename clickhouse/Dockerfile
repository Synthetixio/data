FROM clickhouse/clickhouse-server:24.1.2.1

# Set environment variables
ENV CLICKHOUSE_CONFIG=/etc/clickhouse-server/config.xml
ENV CLICKHOUSE_USER_CONFIG=/etc/clickhouse-server/users.xml

# Copy custom configuration file
COPY config.yaml /etc/clickhouse-server/config.yaml

# Expose ClickHouse ports
EXPOSE 8123 9000 9009

# Set the default command
CMD ["clickhouse-server"]