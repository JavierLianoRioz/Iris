# Arquitectura Detallada de Iris 🪻

Iris opera mediante un flujo de ejecución continuo y ramificado basado en el estado del usuario. A continuación se detalla la lógica completa del sistema, desde la recepción del mensaje hasta la respuesta final.

## 🔄 Diagrama de Flujo Lógico (Ecosistema n8n)

```mermaid
flowchart TD
    %% Entradas
    WEBHOOK["📥 Webhook Evolution API<br/>(Mensaje de WhatsApp)"] --> GATEKEEPER{¿Usuario Registrado en DB?}

    %% Lógica de Registro (Continuous Loop)
    GATEKEEPER -- "No" --> REG_JID["[DB] Registrar JID"]
    REG_JID --> AGENTE_REGISTRO[["🤖 Agente de Onboarding"]]
    
    GATEKEEPER -- "Sí" --> CHECK_NAME{¿Tiene Nombre?}
    CHECK_NAME -- "No" --> AGENTE_REGISTRO
    
    CHECK_NAME -- "Sí" --> CHECK_EMAIL{¿Tiene Email?}
    CHECK_EMAIL -- "No" --> AGENTE_REGISTRO
    
    CHECK_EMAIL -- "Sí" --> CHECK_VERIFIED{¿Está Verificado?}
    CHECK_VERIFIED -- "No" --> AGENTE_REGISTRO

    %% El Agente de Registro como bloque de proceso complejo
    subgraph Registro_Logic ["Lógica de Registro IA"]
        AGENTE_REGISTRO --> REG_PROMPT["Aplica Prompt Registro"]
        REG_PROMPT --> REG_TOOLS["Tools: SQL (Upsert Name/Email), Gmail (OTP)"]
        REG_TOOLS --> SEND_REG_MSG["[Evolution] Enviar Instrucciones"]
    end

    %% Flujo Principal (Usuario Verificado)
    CHECK_VERIFIED -- "Sí" --> AGENTE_GENERAL[["🤖 Agente General (Iris)"]]

    subgraph Chat_Logic ["Lógica de Chat Principal"]
        AGENTE_GENERAL --> CHAT_MEM["[DB] Recuperar Historial JSONB<br/>(Últimos 15 mensajes)"]
        CHAT_MEM --> CHAT_PROMPT["Aplica Prompt de Soporte Estudiante"]
        CHAT_PROMPT --> CHAT_TOOLS["Tools: SQL (CEX, Horarios, Profesores)"]
        CHAT_TOOLS --> SEND_CHAT_MSG["[Evolution] Enviar Respuesta"]
    end

    %% Flujo de Notificaciones (Pipeline Paralelo)
    subgraph Notification_Pipeline ["Pipeline de Notificaciones Académicas"]
        GMAIL_HOOK["📥 Webhook Nuevo Correo"] --> PROC_MAIL["[IA] Procesador Académico"]
        PROC_MAIL --> EXTRACT_SUB["Extraer Asignatura y Resumir"]
        EXTRACT_SUB --> FETCH_SUBS["[DB] Buscar Estudiantes Suscritos"]
        FETCH_SUBS --> FAN_OUT["Fan-out (Iteración de Mensajes)"]
        FAN_OUT --> SEND_NOTIF["[Evolution] Enviar a cada JID"]
    end

    %% Enlaces de Salida
    SEND_REG_MSG --> END((Fín))
    SEND_CHAT_MSG --> END
    SEND_NOTIF --> END
```

## 📜 Descripción del Flujo

### 1. El Gatekeeper de Registro (Validación en Cascada)
Cada mensaje entrante pasa por un "embudo" de validaciones secuenciales. Si falta cualquier dato (Nombre, Email, OTP), el control se delega inmediatamente al **Agente de Onboarding**. Esto garantiza que no haya "huérfanos" en el sistema sin datos académicos vinculados.

### 2. Agentes con Herramientas
Los bloques `🤖` representan sub-procesos donde la IA toma el mando. Estos no son simples nodos de texto, sino **Agentes LangChain** que:
- **Consultan la Memoria**: Leen el `chat_history` en Postgres (usando el JID como llave).
- **Usan Herramientas**: Si el usuario pide un horario, el agente decide ejecutar un nodo de SQL. Si el usuario da su email, el agente llama al flujo de envío de código.

### 3. Pipeline de Notificaciones
Este flujo es independiente y se activa por eventos externos (Gmail). Utiliza una lógica de **Fan-out**:
- Identifica la asignatura.
- Busca quiénes están suscritos.
- Envía un mensaje sintetizado a cada uno.

## 🔗 Mapeo de Workflows n8n

| Bloque Lógico | Workflow n8n | Notas |
| :--- | :--- | :--- |
| **Orquestador Gatekeeper** | `Iris` / `Registro` | Controla los "If" de validación inicial. |
| **Agente General** | `[General] AI` | Maneja la conversación principal. |
| **Procesador Académico** | `Procesador Académico` | Se activa ante nuevos correos. |
| **Infraestructura MSG** | `enviar mensaje` | Sub-workflow para Evolution API. |
