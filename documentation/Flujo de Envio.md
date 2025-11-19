```mermaid
sequenceDiagram
    autonumber
    %% Actores
    participant Email as "Gmail Universidad"
    participant Trigger as "Email Trigger<br/>(Script/Forwarder)"
    participant n8n as "n8n Orchestrator"
    participant DB as "PostgreSQL"
    participant LLM as "OpenRouter (IA)"
    participant Evo as "Evolution API"
    participant Whatsapp as "WhatsApp Alumno"

    %% 1. El detonante
    Note over Email, n8n: A. Ingesta del Correo
    Email->>Trigger: Nuevo correo etiquetado "IRIS"
    Trigger->>n8n: POST Webhook<br/>(Cuerpo, Asunto, Remitente)
    
    activate n8n
    
    %% 2. Buscar a quién enviar (Tu punto C)
    Note over n8n, DB: C. Obtener Audiencia
    n8n->>DB: SELECT numbers FROM subs<br/>WHERE subject = Asignatura_Detectada
    DB-->>n8n: Lista: [+34600..., +34611...]

    %% 3. La IA trabaja (Tu punto D)
    Note over n8n, LLM: D. Transformación del Mensaje
    n8n->>LLM: Prompt: "Reescribe esto claro y conciso..."
    LLM-->>n8n: Texto: "Examen mañana aula 2..."

    %% 4. El envío masivo (Tu punto E)
    Note over n8n, Whatsapp: E. Bucle de Envío
    loop Para cada número en la Lista
        n8n->>Evo: POST /message/sendText<br/>{phone, text}
        Evo->>Whatsapp: 🔔 Mensaje Final
    end
    
    deactivate n8n