# First stage: Base builder with platform args
FROM --platform=linux/arm64 python:3.9-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    pkg-config \
    libssl-dev \
    # ARM64-specific optimizations
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install base dependencies with versions that work well on ARM64
RUN pip install --upgrade pip wheel setuptools
RUN pip install \
    requests==2.31.0 \
    pyyaml==6.0.1 \
    numpy==1.24.4 \
    pandas==2.0.3 \
    pympler==1.0.1

# Install blockchain-related dependencies
RUN pip install \
    web3==6.11.1 \
    eth-abi==4.2.1 \
    synthetix==0.1.19 \
    clickhouse-driver==0.2.6 \
    boto3==1.28.38

# Copy and filter requirements
COPY requirements.txt /tmp/requirements.txt
RUN grep -v -E "duckdb|polars|web3|eth-abi|synthetix|requests|pyyaml|pandas|numpy|torch|tensorflow|clickhouse-driver|boto3" /tmp/requirements.txt > /tmp/remaining_requirements.txt || true
RUN if [ -s /tmp/remaining_requirements.txt ]; then \
        pip install -r /tmp/remaining_requirements.txt; \
    fi

# Install mage-ai separately to ensure it's properly installed
RUN pip install mage-ai==0.9.45

# Second stage: Final image
FROM --platform=linux/arm64 python:3.9-slim

# Add metadata
LABEL maintainer="Synthetix Team"
LABEL description="Synthetix Transformers Mage (ARM64)"

# Copy virtual environment
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    libopenblas0 \
    procps \
    htop \
    net-tools \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install architecture-specific versions of DuckDB & Polars for ARM64
RUN pip install duckdb==0.8.1 polars==0.19.3 --no-cache-dir

# Verify installation
RUN python -c "import duckdb; print('DuckDB version:', duckdb.__version__); print('Running on ARM64')"

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Set up directories
WORKDIR /home/src
RUN mkdir -p /home/src/mage_data/Synthetix/logs && \
    mkdir -p /home/src/mage_data/Synthetix/pipelines && \
    chown -R appuser:appuser /home/src

# Copy application code
COPY --chown=appuser:appuser . .

# Make start script executable
COPY start.sh /home/src/
RUN chmod +x /home/src/start.sh

# Set environment variables for optimization and application
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/home/src \
    PYTHONMALLOC=malloc \
    MPLBACKEND=Agg \
    NUMBA_DISABLE_JIT=1 \
    OMP_NUM_THREADS=2 \
    OPENBLAS_NUM_THREADS=2 \
    PYTHONIOENCODING=UTF-8 \
    MAGE_DATA_DIR=/home/src/mage_data \
    AWS_SDK_LOAD_CONFIG=1

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:6789/ || exit 1

# Expose the port
EXPOSE 6789

# Switch to non-root user
USER appuser

# Command with explicit host binding
CMD ["mage", "start", "--host", "0.0.0.0", "--port", "6789"]