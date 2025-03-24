FROM --platform=linux/arm64 python:3.9-slim

# Install essential dependencies
RUN apt-get update && apt-get install -y \
    curl \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Mage AI
RUN pip install mage-ai==0.9.45

# Set up directories
ENV MAGE_DATA_DIR=/home/src/mage_data
WORKDIR /home/src

# Copy all your Synthetix code and files
COPY Synthetix /home/src/mage_data/Synthetix
COPY requirements.txt /home/src/

# Install additional dependencies from requirements.txt
RUN pip install -r requirements.txt

# Copy start script if needed
COPY start.sh /home/src/
RUN chmod +x /home/src/start.sh

# Expose the port
EXPOSE 6789

# Command with explicit host binding
CMD ["mage", "start", "--host", "0.0.0.0", "--port", "6789"]