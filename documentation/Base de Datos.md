```mermaid
erDiagram
    users {
        INTEGER id PK
        VARCHAR username
        VARCHAR phone
    }

    subjects {
        VARCHAR code PK
        VARCHAR name
    }

    teachers {
        INTEGER id PK
        VARCHAR name
    }

    user_subjects {
        INTEGER user_id PK, FK
        VARCHAR subject_code PK, FK
    }

    teacher_subjects {
        INTEGER teacher_id PK, FK
        VARCHAR subject_code PK, FK
    }

    %% Relationships
    users ||--o{ user_subjects : "subscribes to"
    subjects ||--o{ user_subjects : "has subscribers"
    
    teachers ||--o{ teacher_subjects : "teaches"
    subjects ||--o{ teacher_subjects : "is taught by"