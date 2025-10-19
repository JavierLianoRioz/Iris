#!/bin/bash
set -e

echo "Iniciando servicios de Iris..."

# Cambia al directorio raíz del proyecto (un nivel arriba de la carpeta scripts)
cd "$(dirname "$0")/.."

# Ejecuta docker-compose
# El archivo .env en la raíz se carga automáticamente.
# Usar --env-file para ser explícito es una buena práctica.
docker-compose --env-file ./.env up -d

echo ""
echo "Servicios de Iris iniciados en segundo plano."
