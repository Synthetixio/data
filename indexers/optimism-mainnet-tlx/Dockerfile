FROM --platform=${BUILDPLATFORM} node:16-alpine AS builder

ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "Building on $BUILDPLATFORM for $TARGETPLATFORM"

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies with proper native modules for target architecture
RUN apk add --no-cache python3 build-base && \
    npm ci && \
    apk del build-base

# Copy the rest of the application
COPY . .

# Generate processor and build
RUN npm run generate:processor
RUN npm run build

# Create a smaller production image
FROM --platform=${TARGETPLATFORM} node:16-alpine

WORKDIR /app

# Copy package.json files
COPY --from=builder /app/package*.json ./

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy ABI files which are needed at runtime
COPY --from=builder /app/abi ./abi

# Copy config files
COPY --from=builder /app/squid.yaml ./squid.yaml
COPY --from=builder /app/commands.json ./commands.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Check and copy build output (typically lib or dist)
# First attempt to copy lib (most likely in Squid projects)
COPY --from=builder /app/lib ./lib

# Set environment variables for the application
ENV NODE_ENV=production

# Run the application
CMD npm run generate:migration ; npm run start
