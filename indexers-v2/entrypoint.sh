#!/bin/bash

# Exit on error
set -e

# Get contract data from SDK and generate squidgen.yaml and squid.yaml
python3 main.py --network_name "$NETWORK_NAME" --rpc_endpoint "$RPC_ENDPOINT"

# Generate squid processor
npm run generate:processor

# Build squid processor
npm run build

# Run migrations (continue if it fails e.g. if migrations already ran)
npm run generate:migration || true

# Start the squid processor
npm run start
