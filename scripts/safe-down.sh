#!/bin/bash
set -e

echo "--- SAFE SHUTDOWN SCRIPT ---"
echo "This script will back up all databases before shutting down the environment."

# --- Backup Step ---
echo ""
echo "Running backup script..."
# Execute the existing backup script in the same directory
"$(dirname "$0")/backup.sh"

# The "set -e" at the top will cause the script to exit if backup.sh fails.

# --- Shutdown Step ---
echo ""
echo "Backups successful. Proceeding with shutdown and volume cleanup..."
docker-compose --env-file ./.env down -v

echo ""
echo "--- Environment has been safely shut down and cleaned up. ---"