#!/bin/sh

# Exit on error
set -e

# Get contract data from SDK and generate squidgen.yaml and squid.yaml
python3 main.py --network_name $NETWORK_NAME --protocol_name $PROTOCOL_NAME --block_from $BLOCK_FROM --block_to $BLOCK_TO

# Generate squid processor
npm run generate:processor

# Build squid processor
npm run build

# Start squid processor
npm run start