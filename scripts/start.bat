@echo off
ECHO Iniciando servicios de Iris...

REM Cambia al directorio raíz del proyecto (un nivel arriba de la carpeta scripts)
cd /d "%~dp0.."

REM Ejecuta docker-compose
REM El archivo .env en la raíz se carga automáticamente.
REM Usar --env-file para ser explícito es una buena práctica.
docker-compose --env-file ./.env up -d

ECHO.
ECHO Servicios de Iris iniciados en segundo plano.
