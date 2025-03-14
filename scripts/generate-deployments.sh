#!/bin/bash

# Create directories if they don't exist
mkdir -p k8s/deployments

# First, create the template file
cat > k8s/deployment-template.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: indexer-NETWORK_NAME
  namespace: synthetix-data
  labels:
    app: synthetix-indexer
    network: NETWORK_NAME
spec:
  replicas: 1
  selector:
    matchLabels:
      app: synthetix-indexer
      network: NETWORK_NAME
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: synthetix-indexer
        network: NETWORK_NAME
    spec:
      containers:
      - name: indexer
        image: \${AWS_ACCOUNT_ID}.dkr.ecr.\${AWS_REGION}.amazonaws.com/synthetix-data/indexer:latest-NETWORK_NAME
        imagePullPolicy: Always
        resources:
          limits:
            cpu: "1"
            memory: "2Gi"
          requests:
            cpu: "500m"
            memory: "1Gi"
        ports:
        - containerPort: 4350
          name: gql
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: db-config
              key: db-host
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: db-config
              key: db-port
        - name: DB_NAME
          value: "DB_NAME_VALUE"
        - name: DB_PASS
          valueFrom:
            secretKeyRef:
              name: aurora-db-credentials
              key: password
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: aurora-db-credentials
              key: username
        - name: GQL_PORT
          value: "4350"
        - name: RPC_ENDPOINT
          valueFrom:
            configMapKeyRef:
              name: db-config
              key: NETWORK_NAME-rpc
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: aurora-db-credentials
              key: conduit-api-key
        readinessProbe:
          httpGet:
            path: /health
            port: 4350
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        livenessProbe:
          httpGet:
            path: /health
            port: 4350
          initialDelaySeconds: 60
          periodSeconds: 20
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      terminationGracePeriodSeconds: 60
EOF

# Template file path
TEMPLATE="k8s/deployment-template.yaml"

# Networks and their DB names - using simple format instead of associative array for compatibility
NETWORKS="arbitrum-mainnet:arbitrum_mainnet arbitrum-sepolia:arbitrum_sepolia base-mainnet:base_mainnet base-mainnet-lt:base_mainnet_lt base-sepolia:base_sepolia eth-mainnet:eth_mainnet optimism-mainnet:optimism_mainnet optimism-mainnet-tlx:optimism_mainnet_tlx snax-mainnet:snax_mainnet snax-testnet:snax_testnet"

# Generate deployment files for each network
echo "Starting deployment generation..."

for NETWORK_PAIR in $NETWORKS; do
  NETWORK=${NETWORK_PAIR%%:*}
  DB_NAME=${NETWORK_PAIR#*:}
  OUTPUT_FILE="k8s/deployments/$NETWORK.yaml"
  
  echo "Generating deployment for $NETWORK with DB name $DB_NAME..."
  
  # Make a copy of the template
  cp "$TEMPLATE" "$OUTPUT_FILE"
  
  # Replace placeholders in template
  sed -i.bak "s/NETWORK_NAME/$NETWORK/g" "$OUTPUT_FILE"
  sed -i.bak "s/DB_NAME_VALUE/$DB_NAME/g" "$OUTPUT_FILE"
  
  # Remove backup files created by sed (for macOS compatibility)
  rm -f "$OUTPUT_FILE.bak"
  
  echo "Created $OUTPUT_FILE"
done

echo "Deployment generation complete!"