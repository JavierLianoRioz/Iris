# Solución de Fallo de Arranque del Contenedor PostgreSQL en Docker

Este documento describe el proceso para diagnosticar y solucionar un fallo común donde el contenedor de `postgres` no se inicia correctamente en un entorno de Docker Compose, especialmente cuando se trabaja en un entorno mixto Windows/Linux (WSL).

## Problema

Al ejecutar `docker-compose up`, el proceso falla y muestra los siguientes síntomas:

1.  El contenedor `iris-postgres-1` se reporta como `unhealthy` o `Error`.
2.  Los servicios que dependen de `postgres` no se inician.
3.  Al revisar los logs del contenedor `postgres` (`docker-compose logs postgres`), se observan errores repetitivos como:
    ```
    FATAL: database "iris" does not exist
    ```

## Diagnóstico

La investigación reveló una combinación de tres problemas subyacentes:

1.  **Volumen de Datos Corrupto:** Un primer intento de arranque fallido puede dejar el volumen de Docker (`postgres_data`) en un estado inconsistente. En arranques posteriores, el script de entrada de la imagen de PostgreSQL detecta este volumen, asume que la base de datos ya está inicializada y **omite la ejecución de los scripts de inicialización** (`/docker-entrypoint-initdb.d/`). Esto causa que la base de datos `iris` nunca se cree. El log clave para este síntoma es:
    ```
    PostgreSQL Database directory appears to contain a database; Skipping initialization
    ```

2.  **Finales de Línea (CRLF vs. LF):** El script de inicialización (`init-db.sh`), al ser editado en Windows, tenía finales de línea `CRLF`. El entorno Linux dentro del contenedor de Docker espera `LF`. Este conflicto puede impedir que el script se ejecute correctamente, causando el fallo de inicialización inicial. El síntoma en los logs puede ser un error como `cannot execute: required file not found` o similar.

3.  **Healthcheck Frágil:** El `healthcheck` original en `docker-compose.yml` intentaba conectarse directamente a la base de datos `iris`. Si la inicialización fallaba por cualquier motivo, el healthcheck también fallaba, marcando al contenedor como `unhealthy` sin dar una causa clara del problema de fondo.

## Solución

La solución se aplicó en tres pasos para asegurar un arranque limpio y robusto:

1.  **Limpieza Completa del Entorno:**
    *   Detener y eliminar todos los contenedores:
        ```sh
        docker-compose down
        ```
    *   **Eliminar el volumen persistente de PostgreSQL** para forzar una reinicialización desde cero. Primero, se identifica el nombre del volumen (`docker volume ls`) y luego se elimina:
        ```sh
        docker volume rm iris_postgres_data
        ```

2.  **Corrección del Script de Inicialización:**
    *   Se convirtió el formato del archivo `docker/postgres/init-db.sh` para que use finales de línea **LF**. Esto se puede hacer con cualquier editor de código moderno (como VS Code) o herramientas de línea de comandos.

3.  **Mejora del Healthcheck:**
    *   Se modificó el `healthcheck` del servicio `postgres` en `docker-compose.yml` para usar el comando `pg_isready`, que es más robusto. Este comando verifica si el servidor está listo para aceptar conexiones, sin depender de que una base de datos específica ya haya sido creada.

    *   **Cambio realizado en `docker-compose.yml`:**
        ```diff
        - test: ["CMD-SHELL", "psql -h localhost -U ${POSTGRES_USER} -d iris -c 'SELECT 1'"]
        + test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
        ```

Con estos tres cambios, el comando `docker-compose up` (o el script `start.bat`/`start.sh`) vuelve a funcionar correctamente, creando el entorno de forma estable.
