```mermaid
graph TD
    A[Internet] --> B(Iris)
    subgraph Iris
        C(Frontend) --> D(Backend)
        D --> E(PostgreSQL)
        D --> F(n8n)
        F --> G(Evolution API)
        F --> H(Gmail)
    end
```