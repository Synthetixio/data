FROM --platform=linux/arm64 node:16-alpine

WORKDIR /app

# Install necessary ARM64 dependencies
RUN apk add --no-cache python3 make g++ linux-headers

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Compile for ARM64 architecture
RUN npm run build

# Run your application
CMD ["node", "lib/main.js"]