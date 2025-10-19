@echo off
echo --- SAFE SHUTDOWN SCRIPT ---
echo This script will back up all databases before shutting down the environment.

REM --- Backup Step ---
echo.
echo Creating database backups...

if not exist "backups" mkdir "backups"

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set dt=%%a
set TIMESTAMP=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%

echo Backing up 'iris', 'n8n', and 'evolution' databases...
docker-compose --env-file ./.env exec -T postgres pg_dump -U %POSTGRES_USER% -d iris > backups\iris-%TIMESTAMP%.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to back up 'iris' database. Aborting shutdown.
    exit /b %errorlevel%
)

docker-compose --env-file ./.env exec -T postgres pg_dump -U %POSTGRES_USER% -d n8n > backups\n8n-%TIMESTAMP%.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to back up 'n8n' database. Aborting shutdown.
    exit /b %errorlevel%
)

docker-compose --env-file ./.env exec -T postgres pg_dump -U %POSTGRES_USER% -d evolution > backups\evolution-%TIMESTAMP%.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to back up 'evolution' database. Aborting shutdown.
    exit /b %errorlevel%
)

echo.
echo Backups created successfully.

REM --- Shutdown Step ---
echo.
echo Proceeding with shutdown and volume cleanup...
docker-compose --env-file ./.env down -v

echo.
echo --- Environment has been safely shut down and cleaned up. ---