FROM nikolaik/python-nodejs:python3.11-nodejs16-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY package*.json ./
COPY patches/ ./patches/

RUN apk add --no-cache python3 python3-dev py3-pip clang cmake build-base git

RUN npm ci

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

RUN apk del build-base

COPY . .

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
