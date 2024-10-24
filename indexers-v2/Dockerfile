FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY requirements.txt .

RUN apk add --no-cache python3 py3-pip
RUN apk add --no-cache build-base && npm ci && apk del build-base

COPY . .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["sh", "-c", "python3 main.py --network_name \"$NETWORK_NAME\" --rpc_endpoint \"$RPC_ENDPOINT\" && npm run generate:processor && npm run build && (npm run generate:migration || true) && npm run start"]
