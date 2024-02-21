# Use a base image that includes Rust to avoid installing it each time
FROM rust:latest as builder

# Install Python and other necessary tools
RUN apt-get update && apt-get install -y python3-pip python3-venv

# Install caching tool for Rust compilations
RUN cargo install sccache
ENV RUSTC_WRAPPER=sccache

# Create app directory
WORKDIR /app

# Setup a virtual environment
RUN python3 -m venv venv
# Activate virtual environment for subsequent commands
ENV PATH="/app/venv/bin:$PATH"

# Now that we're using the virtual environment, upgrade pip within it
RUN pip install --upgrade pip

# Install your Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY . .

# Command to run the service
CMD ["python", "main.py"]
