#!/bin/bash
set -e

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

# Check if postgres container is running and healthy
echo "Waiting for postgres container to be healthy..."
while [ "$(docker-compose ps -q postgres | xargs docker inspect -f '{{.State.Health.Status}}')" != "healthy" ]; do
    sleep 1;
done

echo "Postgres is healthy. Finding latest backups..."

LATEST_IRIS=$(ls -t backups/iris-*.sql 2>/dev/null | head -n 1)
LATEST_N8N=$(ls -t backups/n8n-*.sql 2>/dev/null | head -n 1)
LATEST_EVOLUTION=$(ls -t backups/evolution-*.sql 2>/dev/null | head -n 1)

if [ -z "$LATEST_IRIS" ] || [ -z "$LATEST_N8N" ] || [ -z "$LATEST_EVOLUTION" ]; then
  echo "Warning: Could not find backup files for all databases. Skipping restore."
  exit 0
fi

echo "Restoring latest backups:"
echo " - $LATEST_IRIS"
echo " - $LATEST_N8N"
echo " - $LATEST_EVOLUTION"

# Restore each database
cat "$LATEST_IRIS" | docker-compose exec -T postgres psql -U "$POSTGRES_USER" -d iris
cat "$LATEST_N8N" | docker-compose exec -T postgres psql -U "$POSTGRES_USER" -d n8n
cat "$LATEST_EVOLUTION" | docker-compose exec -T postgres psql -U "$POSTGRES_USER" -d evolution

echo ""
echo "Databases restored successfully."
