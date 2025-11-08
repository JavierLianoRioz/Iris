#!/bin/bash
set -e

# Este script se ejecuta automáticamente por la imagen de postgres.
# Las variables como POSTGRES_USER son proporcionadas por Docker Compose.

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE iris;
    CREATE DATABASE n8n;
    CREATE DATABASE evolution;
    GRANT ALL PRIVILEGES ON DATABASE iris TO "$POSTGRES_USER";
    GRANT ALL PRIVILEGES ON DATABASE n8n TO "$POSTGRES_USER";
    GRANT ALL PRIVILEGES ON DATABASE evolution TO "$POSTGRES_USER";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "iris" <<-EOSQL
    CREATE TABLE subjects (
        code VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50)
    );

    CREATE TABLE user_subjects (
        user_id INTEGER NOT NULL,
        subject_code VARCHAR(50) NOT NULL,
        PRIMARY KEY (user_id, subject_code),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (subject_code) REFERENCES subjects (code) ON DELETE CASCADE
    );

    CREATE TABLE teacher_subjects (
        teacher_id INTEGER NOT NULL,
        subject_code VARCHAR(50) NOT NULL,
        PRIMARY KEY (teacher_id, subject_code),
        FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE,
        FOREIGN KEY (subject_code) REFERENCES subjects (code) ON DELETE CASCADE
    );

    INSERT INTO subjects (code, name) VALUES
    ('IYA023', 'Bases de Datos I'),
    ('CSJ038', 'Estadística I'),
    ('IYA025', 'Estructuras de Datos y Algoritmos I'),
    ('IYA028', 'Matemática Numérica'),
    ('IYA022', 'Redes de Ordenadores');

    INSERT INTO teachers (id, name) VALUES
    (1, 'Lorenzo Perez Brito'),
    (2, 'Jose Manuel Breñosa Martínez'),
    (3, 'Manuel Antonio Masías Vergara'),
    (4, 'Jorge Crespo Álvarez'),
    (5, 'Mariano Benito Hoz');

    INSERT INTO teacher_subjects (teacher_id, subject_code) VALUES
    (1, 'IYA023'),
    (2, 'CSJ038'),
    (3, 'IYA025'),
    (4, 'IYA028'),
    (5, 'IYA022');
EOSQL