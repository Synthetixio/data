# Base image
FROM python:3.11-slim

# Create app directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY . .

WORKDIR /app/synthetix

RUN dbt deps

# Command to run the service
CMD ["dbt", "build", "--profiles-dir", "/app/synthetix/profiles", "--profile", "synthetix", "--project-dir", "/app/synthetix"]
