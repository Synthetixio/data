# include rust
FROM rust:1.79.0 AS builder

# install wheel package and run
FROM python:3.12
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy Rust and Cargo binaries from the builder stage
COPY --from=builder /usr/local/cargo /usr/local/cargo
COPY --from=builder /usr/local/rustup /usr/local/rustup
COPY --from=builder /usr/local/bin /usr/local/bin

# Ensure the copied binaries are in the PATH
ENV PATH="/usr/local/cargo/bin:/usr/local/rustup/bin:${PATH}"

RUN rustup default 1.79.0

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

COPY . .

CMD ["uv", "run", "python", "main.py"]
