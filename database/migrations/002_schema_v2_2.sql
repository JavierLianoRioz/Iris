-- Migration: 002_schema_v2_2 (Robust Version)
-- Description: Implement Headless-Conversational schema for Iris v2.2
-- Author: Antigravity

SET client_encoding = 'UTF8';

BEGIN;

-- 1. Teachers Table (Ensuring email exists)
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- 2. Subjects & Teachers Junction
-- If teacher_subjects exists, rename it. If not, create subject_teachers.
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'teacher_subjects') THEN
        ALTER TABLE teacher_subjects RENAME TO subject_teachers;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subject_teachers') THEN
        CREATE TABLE subject_teachers (
            subject_code VARCHAR(20) REFERENCES subjects(code) ON DELETE CASCADE,
            teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
            PRIMARY KEY (subject_code, teacher_id)
        );
    END IF;
END $$;

-- Add extra columns to subject_teachers if they don't exist
ALTER TABLE subject_teachers ADD COLUMN IF NOT EXISTS id SERIAL; -- We won't make it PK if there's already one
ALTER TABLE subject_teachers ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'General';

-- 3. Update Users for WhatsApp/Headless flow
ALTER TABLE users ADD COLUMN IF NOT EXISTS jid TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS conversation_token_limit INTEGER DEFAULT 4000;
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
COMMENT ON COLUMN users.email IS 'Verified *@*.uneatlantico.es';

-- 4. Received Emails Audit & Link
ALTER TABLE correos ADD COLUMN IF NOT EXISTS subject_code VARCHAR(20) REFERENCES subjects(code) ON DELETE SET NULL;
ALTER TABLE correos ADD COLUMN IF NOT EXISTS summary TEXT;

-- 5. Chat History & Memory
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email_id INTEGER REFERENCES correos(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL, -- user/iris/system
    content TEXT NOT NULL,
    tokens INTEGER DEFAULT 0,
    timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMIT;
