```mermaid
graph LR
    %% Actores Externos
    Uni["Universidad<br/>(Fuente de Correos)"]:::uni
    Estudiante["Estudiante / Usuario"]:::student

    %% El Sistema Iris (Caja Negra)
    subgraph Iris_System [Sistema Iris]
        direction TB
        Web["Módulo de Suscripción<br/>(Web + Backend)"]:::system
        Engine["Motor de Notificaciones<br/>(n8n + Evolution)"]:::system
        
        %% El corazón compartido
        DB[("Base de Datos Compartida<br/>(Memoria del Sistema)")]:::db
    end

    %% Flujo 1: Suscripción (El alumno inicia)
    Estudiante -- "1. Rellena Formulario Web" --> Web
    Web -- "2. Guarda Suscripción" --> DB

    %% Flujo 2: Notificación (La Uni inicia)
    Uni -- "3. Nuevo Correo (Push)" --> Engine
    Engine -- "4. Consulta Destinatarios" --> DB
    Engine -- "5. Envío WhatsApp" --> Estudiante