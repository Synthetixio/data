FROM mageai/mageai:latest

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    ca-certificates \
    git \
    pkg-config \
    libssl-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust 1.79.0
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.79.0
ENV PATH="/root/.cargo/bin:${PATH}"

# Verify Rust version
RUN rustc --version && cargo --version

# Upgrade pip
RUN pip install --upgrade pip

# Install Python dependencies (excluding cryo for now)
RUN pip install duckdb polars synthetix web3 eth-abi cryo

# Install any additional requirements
COPY requirements.txt /tmp/requirements.txt
RUN grep -v "cryo" /tmp/requirements.txt > /tmp/requirements_no_cryo.txt && \
    pip install -r /tmp/requirements_no_cryo.txt

# Set the working directory
WORKDIR /home/src

# Entry point
ENTRYPOINT ["/app/run_app.sh"]
CMD ["mage", "start"]