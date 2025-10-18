#!/bin/bash
set -e

# Este script se ejecuta automáticamente por la imagen de postgres.
# Las variables como POSTGRES_USER son proporcionadas por Docker Compose.

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE $POSTGRES_DB_EVOLUTION;
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB_EVOLUTION TO $POSTGRES_USER;
EOSQL