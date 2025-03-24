# First stage: Base builder with platform args
FROM --platform=${BUILDPLATFORM} python:3.9-slim AS builder

# Accept architecture arguments
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "Building on $BUILDPLATFORM for $TARGETPLATFORM"

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    pkg-config \
    libssl-dev \
    # Architecture-specific optimizations will be handled by BuildKit
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install base dependencies with versions that work across architectures
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
    synthetix==0.1.19

# Copy and filter requirements
COPY requirements.txt /tmp/requirements.txt
RUN grep -v -E "duckdb|polars|web3|eth-abi|synthetix|requests|pyyaml|pandas|numpy|torch|tensorflow" /tmp/requirements.txt > /tmp/remaining_requirements.txt || true
RUN if [ -s /tmp/remaining_requirements.txt ]; then \
        pip install -r /tmp/remaining_requirements.txt; \
    fi

# Second stage: Final image targeted for the specific platform
FROM --platform=${TARGETPLATFORM} python:3.9-slim

# Add metadata
LABEL maintainer="Synthetix Team"
LABEL description="Synthetix Transformers Mage (Multi-Arch)"

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

# Install architecture-specific versions of DuckDB & Polars
# This will compile natively for the target platform
RUN pip install duckdb==0.8.1 polars==0.19.3 --no-cache-dir

# Verify installation
RUN python -c "import duckdb; print('DuckDB version:', duckdb.__version__); print('Running on ' + '${TARGETPLATFORM}')"

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Set up directories
WORKDIR /home/src
RUN mkdir -p /home/src/mage_data/logs && \
    chown -R appuser:appuser /home/src

# Copy application code
COPY --chown=appuser:appuser . .

# Set environment variables for optimization
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/home/src \
    PYTHONMALLOC=malloc \
    MPLBACKEND=Agg \
    NUMBA_DISABLE_JIT=1 \
    OMP_NUM_THREADS=2 \
    OPENBLAS_NUM_THREADS=2 \
    PYTHONIOENCODING=UTF-8

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:6789/ || exit 1

# Expose the port
EXPOSE 6789

# Switch to non-root user
USER appuser

# Command with explicit host binding
CMD ["python", "-m", "mage_ai.server.server", "--host", "0.0.0.0", "--port", "6789"]