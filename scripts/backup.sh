#!/bin/bash
set -e

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

echo "Creating database backups..."

# Create backups directory if it doesn't exist
mkdir -p backups

# Get current timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Check if postgres container is running
if [ ! "$(docker-compose ps -q postgres)" ] || [ "$(docker-compose ps -q postgres | xargs docker inspect -f '{{.State.Running}}')" != "true" ]; then
  echo "Error: The 'postgres' container is not running. Please start the services with 'docker-compose up -d' before creating a backup."
  exit 1
fi

echo "Backing up 'iris' database..."
docker-compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d iris > "backups/iris-$TIMESTAMP.sql"

echo "Backing up 'n8n' database..."
docker-compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d n8n > "backups/n8n-$TIMESTAMP.sql"

echo "Backing up 'evolution' database..."
docker-compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d evolution > "backups/evolution-$TIMESTAMP.sql"

echo ""
echo "Backups created successfully in the 'backups' directory."
