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
graph TD
    subgraph "Canales de Entrada"
        WA["WhatsApp (Evolution API)"]
        Mail["Gmail (Manual/Webhooks)"]
    end

    subgraph "Gateway: Iris (Orquestador)"
        O["Iris Orchestrator"]
        C_Reg{"¿Registrado?"}
        C_Name{"¿Tiene nombre?"}
        C_Email{"¿Tiene email?"}
        C_Verify{"¿Verificado?"}
    end

    subgraph "Servicios [IA & Registro]"
        RegAI["[Registro] Preguntar a la IA"]
        MainAI["flujo principal de iris (Agente)"]
        Verify["asignar correo / enviar código"]
    end

    subgraph "Persistencia (iris_db)"
        DB[(PostgreSQL)]
    end

    %% Flujos de Lógica
    WA --> O
    O --> C_Reg
    C_Reg -- "No" --> DB
    C_Reg -- "Sí" --> C_Name
    
    C_Name -- "No" --> RegAI
    C_Name -- "Sí" --> C_Email
    
    C_Email -- "No" --> RegAI
    C_Email -- "Sí" --> C_Verify
    
    C_Verify -- "No" --> RegAI
    C_Verify -- "Sí" --> MainAI

    %% Conexiones de Datos
    MainAI <--> DB
    RegAI <--> DB
    Verify <--> DB
    
    %% Respuesta Final
    MainAI --> Out[enviar mensaje]
    RegAI --> Out
    Verify --> Out
    Out --> WA
```

---

## 🔑 Lógica de Validación en Cascada

El sistema bloquea el acceso al `flujo principal de iris` hasta que el perfil del estudiante está completo y verificado.

```mermaid
stateDiagram-v2
    [*] --> CheckRegistration: Webhook
    CheckRegistration --> AddJID: No existe JID
    AddJID --> CheckName
    CheckRegistration --> CheckName: Existe JID
    
    state CheckName {
        [*] --> NameExists?
        NameExists? --> ExtractNameAI: No
        NameExists? --> CheckEmail: Sí
    }
    
    state CheckEmail {
        [*] --> EmailExists?
        EmailExists? --> RegisterEmailAI: No
        EmailExists? --> CheckVerify: Sí
    }
    
    state CheckVerify {
        [*] --> IsVerified?
        IsVerified? --> CheckCodeAI: No (OTP)
        IsVerified? --> MainFlow: Sí
    }

    MainFlow --> [*]: Execute 'flujo principal de iris'
    ExtractNameAI --> [*]: Call '[Registro] Preguntar a la IA'
    RegisterEmailAI --> [*]: Call '[Registro] Preguntar a la IA'
    CheckCodeAI --> [*]: Call '[Registro] Preguntar a la IA'
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
        int id PK
        string code UK
        string name
        text semantic_keywords "Fuzzy Search Hints"
    }

    TEACHERS {
        int id PK
        string name
    }

    RECEIVED_EMAILS {
        int id PK
        int subject_id FK
        int career_id FK
        text content
        timestamp date
    }
    
    SUBJECT_SUBSCRIPTIONS {
        string user_jid FK
        int subject_id FK
    }

    CAREER_SUBSCRIPTIONS {
        string user_jid FK
        int career_id FK
    }
```

> [!TIP]
> **Pruning Automático**: La tabla `chat_history` cuenta con un trigger (`prune_chat_history`) que mantiene automáticamente solo los últimos 15 mensajes por sesión para optimizar el rendimiento y el contexto de la IA.
