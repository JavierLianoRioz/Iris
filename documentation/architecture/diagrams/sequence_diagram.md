```mermaid
sequenceDiagram
    participant User
    participant Gmail
    participant n8n
    participant FastAPI
    participant PostgreSQL
    participant EvolutionAPI

    User->>Gmail: Receives an email
    n8n->>Gmail: Polls for new emails
    Gmail-->>n8n: Returns new emails
    n8n->>n8n: Extracts relevant information
    n8n->>FastAPI: Summarizes the email content
    FastAPI-->>n8n: Returns the summarized content
    n8n->>PostgreSQL: Queries for subscribed users
    PostgreSQL-->>n8n: Returns subscribed users
    n8n->>EvolutionAPI: Sends notification to subscribed users
    EvolutionAPI-->>User: Sends WhatsApp notification
```