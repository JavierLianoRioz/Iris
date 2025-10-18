#!/bin/bash
set -e

echo "Iniciando servicios de Iris..."

# Cambia al directorio donde se encuentra este script
cd "$(dirname "$0")"

# Navega a la carpeta de compose y ejecuta docker-compose
cd compose
docker-compose --env-file ../.env up -d

echo ""
echo "Servicios de Iris iniciados en segundo plano."
