# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_STRAPI_URL
ARG VITE_STRAPI_API_TOKEN
ARG VITE_APP_NAME
ARG VITE_APP_URL

# Set environment variables for build
ENV VITE_STRAPI_URL=${VITE_STRAPI_URL}
ENV VITE_STRAPI_API_TOKEN=${VITE_STRAPI_API_TOKEN}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_URL=${VITE_APP_URL}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install bash for runtime environment variable injection
RUN apk add --no-cache bash

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (if needed)
# COPY nginx.conf /etc/nginx/nginx.conf

# Create environment variable injection script
COPY <<'EOF' /docker-entrypoint.d/40-envsubst-on-env.sh
#!/bin/bash
set -e

# If .env file exists, export its variables
if [ -f /app/.env ]; then
  echo "Loading environment variables from /app/.env"
  export $(grep -v '^#' /app/.env | xargs -0)
fi

# Create env-config.js with runtime environment variables
cat > /usr/share/nginx/html/env-config.js << ENVEOF
window.ENV = {
  VITE_STRAPI_URL: "${VITE_STRAPI_URL:-}",
  VITE_STRAPI_API_TOKEN: "${VITE_STRAPI_API_TOKEN:-}",
  VITE_APP_NAME: "${VITE_APP_NAME:-Kamili App}",
  VITE_APP_URL: "${VITE_APP_URL:-}"
};
ENVEOF

# Substitute environment variables in the file
envsubst < /usr/share/nginx/html/env-config.js > /usr/share/nginx/html/env-config.js.tmp
mv /usr/share/nginx/html/env-config.js.tmp /usr/share/nginx/html/env-config.js

echo "Runtime environment variables injected into /usr/share/nginx/html/env-config.js"
EOF

RUN chmod +x /docker-entrypoint.d/40-envsubst-on-env.sh

# Expose port 80
EXPOSE 80

# Start nginx (entrypoint scripts run automatically)
CMD ["nginx", "-g", "daemon off;"]
