FROM python:3.9-slim AS builder

# Add labels for better maintainability
LABEL maintainer="Synthetix Team"
LABEL description="Synthetix Transformers Mage"

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up pip
RUN pip install --upgrade pip wheel setuptools

# Create virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install standard dependencies
COPY requirements.txt /tmp/requirements.txt
RUN pip install \
    requests \
    pyyaml \
    pandas \
    numpy

# Install blockchain-related dependencies
RUN pip install \
    web3==6.11.1 \
    eth-abi==4.2.1 \
    synthetix==0.1.19

# Install remaining dependencies excluding problematic packages
RUN grep -v -E "duckdb|polars|web3|eth-abi|synthetix|requests|pyyaml|pandas|numpy" /tmp/requirements.txt > /tmp/remaining_requirements.txt || true
RUN if [ -s /tmp/remaining_requirements.txt ]; then \
        pip install -r /tmp/remaining_requirements.txt; \
    fi

# Create final image
FROM python:3.9-slim

# Add labels for better maintainability
LABEL maintainer="Synthetix Team"
LABEL description="Synthetix Transformers Mage"

# Copy virtual environment
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install architecture-specific DuckDB & Polars directly in final stage
# Using version 0.8.1 which works across architectures
RUN pip install duckdb==0.8.1 polars==0.19.3

# Test DuckDB installation
RUN python -c "import duckdb; print('DuckDB version:', duckdb.__version__)"

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Set the working directory
WORKDIR /home/appuser/app

# Copy application code
COPY --chown=appuser:appuser . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/home/appuser/app

# Add a healthcheck to verify the application's health
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import duckdb; print('Healthy')" || exit 1

# Switch to non-root user for better security
USER appuser

# Command to run the application
CMD ["python", "-m", "src.main"]
