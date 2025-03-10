#!/bin/sh

# Exit on error
set -e

# Get contract data from SDK and generate squidgen.yaml and squid.yaml
python3 main.py --network_name $NETWORK_NAME --config_name $CONFIG_NAME "$@"

# Generate squid processor
npm run generate:processor

# Move config.ts to src
mv config.ts src/config.ts

# Build squid processor
npm run build

# Start the squid processor
npm run start
