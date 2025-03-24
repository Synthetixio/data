#!/bin/bash
set -e

# Help command
if [ "$1" = "help" ]; then
    echo "Options:"
    echo "  help             Show this help message"
    echo "  migrate          Run database migrations and exit"
    echo "  load-from-h2     Migrate from H2 database"
    exit 0
fi

# Detect architecture and apply architecture-specific optimizations
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
    # ARM64-specific optimizations
    if [ -f /usr/lib/aarch64-linux-gnu/libjemalloc.so.2 ]; then
        export LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2
    fi
    
    # Set more conservative memory limits for ARM64
    if [ -z "$JAVA_OPTS" ]; then
        export JAVA_OPTS="-XX:+UseG1GC -XX:+ExplicitGCInvokesConcurrent -XX:+ParallelRefProcEnabled -XX:+UseStringDeduplication -XX:MaxGCPauseMillis=50 -Xms512m -Xmx2g -Djava.awt.headless=true"
    fi
else
    # Default settings for AMD64/x86_64
    if [ -z "$JAVA_OPTS" ]; then
        export JAVA_OPTS="-XX:+UseG1GC -Djava.awt.headless=true"
    fi
fi

# Load configuration from file if it exists
if [ -f /app/env-config.json ]; then
    export MB_LOAD_CONFIG_FROM_FILE=true
    export MB_CONFIG_FILE_PATH=/app/env-config.json
fi

# Set plugins directory
export MB_PLUGINS_DIR=/plugins

# Print environment information for debugging
echo "Running Metabase on $ARCH architecture"
echo "Java version: $(java -version 2>&1 | head -1)"
echo "Using JAVA_OPTS: $JAVA_OPTS"

# Run the appropriate command
if [ "$1" = "migrate" ]; then
    exec java $JAVA_OPTS -jar /app/metabase.jar migrate
elif [ "$1" = "load-from-h2" ]; then
    exec java $JAVA_OPTS -jar /app/metabase.jar load-from-h2 "$@"
else
    exec java $JAVA_OPTS -jar /app/metabase.jar
fi