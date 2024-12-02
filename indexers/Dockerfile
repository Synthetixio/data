FROM nikolaik/python-nodejs:python3.11-nodejs16-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY package*.json ./
COPY patches/ ./patches/

RUN apt-get update && apt-get install -y build-essential && npm ci && apt-get remove -y build-essential

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

COPY . .

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
