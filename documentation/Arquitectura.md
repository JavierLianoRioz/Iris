````mermaid
graph TD
    %% 1. El Mundo Exterior (Entradas)
    subgraph Inputs ["Fuentes de Entrada"]
        User_Device["Navegador del Alumno"]:::ext
        Gmail_Cloud["Gmail + Google Script"]:::google
    end

    %% 2. Tu Servidor (Docker Host)
    subgraph Docker_Host ["Servidor Iris (Docker Compose)"]
        direction TB

        %% Bloque Web (Suscripción)
        subgraph Web_Stack ["Stack de Suscripción"]
            Frontend["Frontend Web<br/>(Nginx/React)"]:::front
            Backend["FastAPI Backend"]:::docker
        end

        %% Bloque Lógico (Procesamiento)
        n8n["n8n Orchestrator"]:::docker

        %% Bloque Envío (Evolution + Redis)
        subgraph Evo_Stack ["Stack de Envío"]
            Evo["Evolution API"]:::docker
            Redis[("Redis Cache<br/>(Solo Evo)")]:::db
        end

        %% Persistencia Compartida
        PG[("PostgreSQL<br/>SHARED DB")]:::db
    end

    %% 3. Salidas Externas
    subgraph Outputs ["Salidas"]
        LLM["IA (OpenRouter)"]:::ext
        Whatsapp["WhatsApp (Meta)"]:::ext
    end

    %% --- CONEXIONES DEL FLUJO 1: SUSCRIPCIÓN ---
    User_Device -- "1. HTTP Form" --> Frontend
    Frontend -- "API Request" --> Backend
    Backend -- "INSERT / UPDATE (Escritura)" --> PG

    %% --- CONEXIONES DEL FLUJO 2: ENVÍO ---
    Gmail_Cloud -- "2. Webhook (Email)" --> n8n
    n8n -- "SELECT Users (Lectura)" --> PG
    n8n -- "Prompting (Reescritura)" --> LLM
    
    %% Dispatch
    n8n -- "Send Command" --> Evo
    Evo -- "Session Data" --> PG
    Evo -- "Queue/Cache" --> Redis
    Evo -- "Protocolo WA" --> Whatsapp