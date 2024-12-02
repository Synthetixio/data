#!/bin/sh

# Exit on error
set -e

COMMAND="uv run main.py --network_name $NETWORK_NAME --protocol_name $PROTOCOL_NAME"

if [ ! -z "$BLOCK_FROM" ]; then
    COMMAND="$COMMAND --block_from $BLOCK_FROM"
fi

if [ ! -z "$BLOCK_TO" ]; then
    COMMAND="$COMMAND --block_to $BLOCK_TO"
fi

$COMMAND

# Generate squid processor
npm run generate:processor

# Build squid processor
npm run build

# Start squid processor
npm run start