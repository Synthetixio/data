#!/bin/bash

if [ "$1" = "help" ]; then
    echo "Options:"
    echo "  help             Show this help message"
    echo "  migrate          Run database migrations and exit"
    echo "  load-from-h2     Migrate from H2 database"
    exit 0
fi

if [ -f /app/env-config.json ]; then
    export MB_LOAD_CONFIG_FROM_FILE=true
    export MB_CONFIG_FILE_PATH=/app/env-config.json
fi

export MB_PLUGINS_DIR=/plugins

if [ "$1" = "migrate" ]; then
    exec java $JAVA_OPTS -jar /app/metabase.jar migrate
elif [ "$1" = "load-from-h2" ]; then
    exec java $JAVA_OPTS -jar /app/metabase.jar load-from-h2 "$@"
else
    exec java $JAVA_OPTS -jar /app/metabase.jar
fi