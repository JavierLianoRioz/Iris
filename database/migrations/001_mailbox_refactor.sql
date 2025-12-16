-- Migration: 001_mailbox_refactor
-- Description: Refactor schema to separate Correos/Mensajes and create Buzon.
-- Author: Antigravity

SET client_encoding = 'UTF8';

BEGIN;

-- 1. Rename Source Table (Correos)
ALTER TABLE mensajes RENAME TO correos;
ALTER TABLE correos RENAME COLUMN fecha_creacion TO fecha_recepcion;
ALTER TABLE correos ALTER COLUMN fecha_recepcion SET DEFAULT NOW();

-- 2. Create Content Table (Mensajes)
CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT NOW() NOT NULL,
    correo_id INTEGER UNIQUE REFERENCES correos(id) ON DELETE CASCADE
);

-- 3. Data Migration (Correos -> Mensajes)
-- Preserving ID to maintain constraint validity with buzon (formerly mensajes_enviados)
INSERT INTO mensajes (id, contenido, fecha, correo_id)
SELECT id, mensaje_formateado, fecha_recepcion, id
FROM correos;

-- Fix sequence for new table
SELECT setval('mensajes_id_seq', (SELECT MAX(id) FROM mensajes));

-- 4. Transform Delivery Table (Buzon)
ALTER TABLE mensajes_enviados RENAME TO buzon;
ALTER TABLE buzon RENAME COLUMN fecha_envio TO fecha;
ALTER TABLE buzon ALTER COLUMN fecha SET DEFAULT NOW();

-- Add new columns
ALTER TABLE buzon ADD COLUMN external_id TEXT;
ALTER TABLE buzon ADD COLUMN tipo VARCHAR(20) NOT NULL DEFAULT 'SISTEMA';

-- Remove default from type as requested (must be explicit for new rows)
ALTER TABLE buzon ALTER COLUMN tipo DROP DEFAULT;

-- Fix Constraints
-- Drop old FK (automatically named by Postgres usually, but we check specific name or generic DROP if known)
-- Note: In previous inspection, constraint was "mensajes_enviados_mensaje_id_fkey"
ALTER TABLE buzon DROP CONSTRAINT mensajes_enviados_mensaje_id_fkey;

-- Add new FK pointing to the NEW mensajes table
ALTER TABLE buzon ADD CONSTRAINT buzon_mensaje_id_fkey 
FOREIGN KEY (mensaje_id) REFERENCES mensajes(id) ON DELETE CASCADE;

-- 5. Cleanup
ALTER TABLE correos DROP COLUMN mensaje_formateado;

COMMIT;
