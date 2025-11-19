```mermaid
sequenceDiagram
    autonumber
    %% Actores
    participant User as "Alumno (Web)"
    participant Web as "Frontend Web"
    participant API as "FastAPI Backend"
    participant DB as "PostgreSQL"

    Note over User, API: Paso 1: Recogida de Datos
    User->>Web: Rellena Formulario<br/>(Nombre, Tlf, Asignaturas)
    Web->>API: POST /subscribe<br/>{json_data}
    
    activate API
    Note over API, DB: Paso 2: Persistencia
    API->>API: Validar datos
    API->>DB: INSERT INTO users...
    API->>DB: INSERT INTO subscriptions...
    DB-->>API: Confirmación (OK)
    
    API-->>Web: 200 OK (Suscrito)
    deactivate API
    
    Web-->>User: "¡Te has suscrito correctamente!"