#!/bin/sh

# Exit on error
set -e

# Get contract data from SDK and generate squidgen.yaml and squid.yaml
uv run main.py --network_name $NETWORK_NAME --protocol_name $PROTOCOL_NAME "$@"

# Generate squid processor
npm run generate:processor

# Build squid processor
npm run build

# Start the squid processor
npm run start
