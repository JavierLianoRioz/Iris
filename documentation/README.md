# Documentación de Iris 🪻

Bienvenido a la documentación técnica de Iris. Aquí encontrarás los detalles sobre la arquitectura del sistema, la lógica de los flujos de n8n y el diseño de la base de datos.

## 📌 Índice
1. [Arquitectura del Sistema](#-arquitectura-del-sistema)
2. [Lógica de Registro y Verificación](#-lógica-de-registro-y-verificación)
3. [Modelo de Datos](#-modelo-de-datos)

---

## 🏗️ Arquitectura del Sistema (Full Stack)

Iris opera bajo un modelo de orquestación centralizada que separa la lógica de validación de la lógica de negocio proactiva.

```mermaid
graph LR
    subgraph ENTRADA["📥 Entrada"]
        WA["WhatsApp<br/>(Evolution API)"]
    end

    subgraph ORQUESTACION["🎯 Orquestación"]
        O["Iris<br/>Webhook /iris"]
        REG["flujo de<br/>registro"]
        MAIN["flujo de respuesta<br/>a whatsapp"]
    end

    subgraph REGISTRO["📝 Servicios de Registro"]
        RegAI["[Registro]<br/>Preguntar a la IA"]
        AsignarCorreo["asignar correo<br/>a usuario"]
        EnviarCodigo["enviar codigo<br/>de verificación"]
    end

    subgraph UTILIDADES["🔧 Utilidades"]
        EnviarMsg["enviar mensaje"]
        ModelsOR["extraer modelos<br/>openrouter"]
    end

    subgraph DATOS["💾 Persistencia"]
        DB[(PostgreSQL)]
        Memory["chat_history"]
    end

    subgraph SALIDA["📤 Salida"]
        Mail["Gmail OTP"]
    end

    WA --> O --> REG
    REG -->|verificado| MAIN
    REG -->|incompleto| RegAI
    
    RegAI --> AsignarCorreo --> EnviarCodigo --> Mail
    RegAI --> DB
    AsignarCorreo --> DB
    EnviarCodigo --> DB
    
    MAIN --> ModelsOR
    MAIN --> DB
    MAIN --> Memory
    MAIN --> EnviarMsg
    REG --> EnviarMsg
    REG --> DB
    
    EnviarMsg --> WA
```

---

## 🔗 Mapa de Workflows (Iris 2.0)

Relación entre los 8 workflows activos del sistema:

```mermaid
flowchart TB
    subgraph ORQUESTADOR["🎯 Orquestador Principal"]
        IRIS["Iris (ACTIVO)"]
    end
    
    subgraph REGISTRO["📝 Flujo de Registro"]
        FR["flujo de registro"]
        RPAI["[Registro] Preguntar a la IA"]
    end
    
    subgraph PRINCIPAL["💬 Flujo Principal"]
        FRW["flujo de respuesta a whatsapp"]
    end
    
    subgraph VERIFICACION["✉️ Verificación"]
        ACU["asignar correo a usuario"]
        ECV["enviar codigo de verificación"]
    end
    
    subgraph UTILIDADES["🔧 Utilidades"]
        EM["enviar mensaje"]
        EMGO["extraer modelos gratuitos de openrouter"]
    end
    
    %% Flujo principal de orquestación
    IRIS --> FR
    FR -->|usuario verificado| FRW
    FR -->|datos incompletos| RPAI
    FR --> EM
    
    %% Herramientas IA de [Registro] Preguntar a la IA
    RPAI -.->|tool: asignar correo| ACU
    RPAI --> EMGO
    
    %% Cadena de verificación
    ACU --> ECV
    
    %% Flujo principal usa utilidades
    FRW --> EMGO
    FRW --> EM
```

---

## 🔑 Lógica de Validación en Cascada

El `flujo de registro` implementa una validación secuencial de 4 pilares antes de permitir acceso al flujo principal:

```mermaid
stateDiagram-v2
    [*] --> ComprobarJID: Webhook /iris
    
    ComprobarJID --> AñadirJID: No existe
    ComprobarJID --> ComprobarNombre: Existe
    AñadirJID --> ComprobarNombre
    
    state ComprobarNombre {
        [*] --> TieneNombre
        TieneNombre --> ExtraerNombreIA: No
        TieneNombre --> SiguienteCheck: Sí
        ExtraerNombreIA --> EnviarRespuesta
    }
    
    SiguienteCheck --> ComprobarEmail
    
    state ComprobarEmail {
        [*] --> TieneEmail
        TieneEmail --> RegistrarEmailIA: No
        TieneEmail --> SiguienteCheck2: Sí
        RegistrarEmailIA --> EnviarRespuesta
    }
    
    SiguienteCheck2 --> ComprobarVerificacion
    
    state ComprobarVerificacion {
        [*] --> EstaVerificado
        EstaVerificado --> ComprobarCodigoIA: No
        EstaVerificado --> FlujoPrincipal: Sí
        ComprobarCodigoIA --> EnviarRespuesta
    }

    FlujoPrincipal --> [*]: flujo de respuesta a whatsapp
    EnviarRespuesta --> [*]: enviar mensaje
```

---

## 📊 Modelo de Datos (Esquema Consolidado v2.2)

Iris utiliza un esquema relacional optimizado con **JID como clave primaria** y compatibilidad nativa para memorias de IA (LangChain).

```mermaid
erDiagram
    USERS ||--o{ SUBJECT_SUBSCRIPTIONS : "suscribe"
    USERS ||--o{ CAREER_SUBSCRIPTIONS : "suscribe"
    USERS ||--o{ CHAT_HISTORY : "genera"
    
    SUBJECTS ||--o{ SUBJECT_SUBSCRIPTIONS : ""
    CAREERS ||--o{ CAREER_SUBSCRIPTIONS : ""
    
    CAREERS ||--o{ CAREER_SUBJECTS : "comprises"
    SUBJECTS ||--o{ CAREER_SUBJECTS : ""
    
    SUBJECTS ||--o{ SUBJECT_TEACHERS : "taught_by"
    TEACHERS ||--o{ SUBJECT_TEACHERS : ""
    
    SUBJECTS ||--o{ RECEIVED_EMAILS : "classified_to"
    CAREERS ||--o{ RECEIVED_EMAILS : "belongs_to"

    USERS {
        string jid PK "whatsapp_id"
        string name
        string email UK
        string verification_code
        boolean is_verified
        timestamp verification_requested_at
    }
    
    CHAT_HISTORY {
        int id PK
        string user_jid FK "Relación con USERS"
        string session_id "JID del usuario"
        jsonb message "Formato LangChain (data/type)"
        text content "Copia plana para búsquedas"
        string role "iris | user"
        timestamp timestamp
    }
    
    SUBJECTS {
        string code PK
        string name
        text semantic_keywords "Fuzzy Search Hints"
    }

    TEACHERS {
        int id PK
        string name
    }

    RECEIVED_EMAILS {
        int id PK
        string subject_code FK
        int career_id FK
        text content
        timestamp date
    }
    
    SUBJECT_SUBSCRIPTIONS {
        string user_jid FK
        string subject_code FK
    }

    CAREER_SUBSCRIPTIONS {
        string user_jid FK
        int career_id FK
    }
```

> [!TIP]
> **Pruning Automático**: La tabla `chat_history` cuenta con un trigger (`prune_chat_history`) que mantiene automáticamente solo los últimos 15 mensajes por sesión para optimizar el rendimiento y el contexto de la IA.
