FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY requirements.txt .
COPY patches/ ./patches/

RUN apk add --no-cache python3 py3-pip
RUN apk add --no-cache build-base && npm ci && apk del build-base

COPY . .

RUN chmod +x entrypoint.sh

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


ENTRYPOINT ["./entrypoint.sh"]
