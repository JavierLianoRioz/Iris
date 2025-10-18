@echo off
ECHO Iniciando servicios de Iris...

REM Cambia al directorio donde se encuentra este script
cd /d "%~dp0"

REM Navega a la carpeta de compose y ejecuta docker-compose
cd compose
docker-compose --env-file ../.env up -d

ECHO.
ECHO Servicios de Iris iniciados en segundo plano.
