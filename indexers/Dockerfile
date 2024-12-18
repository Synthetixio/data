FROM node:16-bullseye
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY package*.json ./
COPY patches/ ./patches/

RUN apt-get update && apt-get install -y build-essential clang
RUN npm ci

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
