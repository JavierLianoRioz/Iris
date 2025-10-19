@echo off
echo Restoring latest database backups...

set "iris_backup="
for /f "delims=" %%F in ('dir /b /o-d "backups\iris-*.sql"') do (
    set "iris_backup=%%F"
    goto :found_iris
)
:found_iris

set "n8n_backup="
for /f "delims=" %%F in ('dir /b /o-d "backups\n8n-*.sql"') do (
    set "n8n_backup=%%F"
    goto :found_n8n
)
:found_n8n

set "evo_backup="
for /f "delims=" %%F in ('dir /b /o-d "backups\evolution-*.sql"') do (
    set "evo_backup=%%F"
    goto :found_evo
)
:found_evo

if not defined iris_backup (
    echo "Warning: No iris backup found."
) else (
    echo "Restoring %iris_backup%..."
    type "backups\%iris_backup%" | docker-compose --env-file ./.env exec -T postgres psql -U %POSTGRES_USER% -d iris
)

if not defined n8n_backup (
    echo "Warning: No n8n backup found."
) else (
    echo "Restoring %n8n_backup%..."
    type "backups\%n8n_backup%" | docker-compose --env-file ./.env exec -T postgres psql -U %POSTGRES_USER% -d n8n
)

if not defined evo_backup (
    echo "Warning: No evolution backup found."
) else (
    echo "Restoring %evo_backup%..."
    type "backups\%evo_backup%" | docker-compose --env-file ./.env exec -T postgres psql -U %POSTGRES_USER% -d evolution
)

echo.

echo Restore process finished.
