-- 004_consolidate_schema.sql (FIXED)
-- FINAL CLEANUP: Rename and Purge Legacy Components

BEGIN;

-- 1. Migrate subject_teachers to use subject_id instead of subject_code
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subject_teachers' AND column_name='subject_id') THEN
        ALTER TABLE subject_teachers ADD COLUMN subject_id INT REFERENCES subjects(id) ON DELETE CASCADE;
    END IF;
END $$;

UPDATE subject_teachers st
SET subject_id = s.id
FROM subjects s
WHERE st.subject_code = s.code 
AND st.subject_id IS NULL;

-- 2. Drop the old column from subject_teachers
ALTER TABLE subject_teachers DROP COLUMN IF EXISTS subject_code CASCADE;

-- 3. Rename "correos" to "received_emails" (Better organization)
ALTER TABLE IF EXISTS correos RENAME TO received_emails;

-- 4. Drop definitively legacy/redundant tables
DROP TABLE IF EXISTS user_subjects CASCADE; 
DROP TABLE IF EXISTS buzon CASCADE;       
DROP TABLE IF EXISTS mensajes CASCADE;    
DROP TABLE IF EXISTS metricas_modelos CASCADE;

-- 5. Cleanup Users table (Remove old career_id)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='career_id') THEN
        ALTER TABLE users DROP COLUMN career_id CASCADE;
    END IF;
END $$;

-- 6. Ensure subjects have semantic_keywords
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='semantic_keywords') THEN
        ALTER TABLE subjects ADD COLUMN semantic_keywords TEXT;
    END IF;
END $$;

COMMIT;
