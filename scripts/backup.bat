@echo off
echo Creating database backups...

REM Create backups directory if it doesn't exist
if not exist "backups" mkdir "backups"

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set dt=%%a
set TIMESTAMP=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%

echo Backing up 'iris', 'n8n', and 'evolution' databases...
docker-compose --env-file ./.env exec -T postgres pg_dump -U %POSTGRES_USER% -d iris > backups\iris-%TIMESTAMP%.sql
docker-compose --env-file ./.env exec -T postgres pg_dump -U %POSTGRES_USER% -d n8n > backups\n8n-%TIMESTAMP%.sql
docker-compose --env-file ./.env exec -T postgres pg_dump -U %POSTGRES_USER% -d evolution > backups\evolution-%TIMESTAMP%.sql

echo.

echo Backups created successfully in the 'backups' directory.
