#!/bin/bash

# Media Editor Deployment Script
# Usage: ./deploy.sh [port]
# Example: ./deploy.sh 8080

set -e

# Default port
APP_PORT=${1:-8080}

echo "🚀 Starting Media Editor deployment..."
echo "📡 App will be available on port: $APP_PORT"

# Export environment variable
export APP_PORT=$APP_PORT

# Stop existing containers
echo "🔄 Stopping existing containers..."
docker compose down

# Clean up old images
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build the application
echo "🔨 Building application..."
docker compose build --no-cache

# Start the application
echo "▶️ Starting application..."
docker compose up -d

# Wait for application to be ready
echo "⏳ Waiting for application to start..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:$APP_PORT > /dev/null 2>&1; then
        echo ""
        echo "✅ Deployment successful!"
        echo "🌐 Your Media Editor is now running at: http://localhost:$APP_PORT"
        echo ""
        echo "📋 Available commands:"
        echo "  - View logs: docker compose logs -f"
        echo "  - Stop app: docker compose down"
        echo "  - Update app: ./deploy.sh $APP_PORT"
        exit 0
    fi

    echo -n "."
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo ""
echo "❌ Deployment failed - application not responding on port $APP_PORT"
echo "📄 Check logs with: docker compose logs"
docker compose logs
exit 1
