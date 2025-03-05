#!/bin/bash

# Build the Docker image
echo "Building the Docker image..."
docker build -t synthetix-mage -f Dockerfile .

# Run the Docker container
echo "Running the Docker container..."
docker run -it -p 6789:6789 \
  -v $(pwd):/home/src \
  --env-file .env.tmp \
  synthetix-mage bash -c "pip install -r requirements.txt && /app/run_app.sh mage start Synthetix"