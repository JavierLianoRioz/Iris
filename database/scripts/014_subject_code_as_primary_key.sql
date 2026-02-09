-- 014_subject_code_as_primary_key.sql
-- Goal: Use subject.code as PK instead of incremental id

BEGIN;

-- 1. Add subject_code columns to dependent tables
ALTER TABLE career_subjects ADD COLUMN IF NOT EXISTS subject_code VARCHAR(20);
ALTER TABLE subject_subscriptions ADD COLUMN IF NOT EXISTS subject_code VARCHAR(20);
ALTER TABLE subject_teachers ADD COLUMN IF NOT EXISTS subject_code VARCHAR(20);

-- 2. Populate subject_code columns from subjects table
UPDATE career_subjects cs SET subject_code = s.code FROM subjects s WHERE cs.subject_id = s.id;
UPDATE subject_subscriptions ss SET subject_code = s.code FROM subjects s WHERE ss.subject_id = s.id;
UPDATE subject_teachers st SET subject_code = s.code FROM subjects s WHERE st.subject_id = s.id;

-- 3. Ensure no NULL codes before making them part of PKs
DELETE FROM career_subjects WHERE subject_code IS NULL;
DELETE FROM subject_subscriptions WHERE subject_code IS NULL;
DELETE FROM subject_teachers WHERE subject_code IS NULL;

-- 4. Clean up Junctions and references
-- Career-Subject Junction
ALTER TABLE career_subjects DROP CONSTRAINT IF EXISTS career_subjects_pkey;
ALTER TABLE career_subjects DROP COLUMN IF EXISTS subject_id CASCADE;
ALTER TABLE career_subjects ADD PRIMARY KEY (career_id, subject_code);

-- Subject Subscriptions
ALTER TABLE subject_subscriptions DROP CONSTRAINT IF EXISTS subject_subscriptions_pkey;
ALTER TABLE subject_subscriptions DROP COLUMN IF EXISTS subject_id CASCADE;
ALTER TABLE subject_subscriptions ADD PRIMARY KEY (user_jid, subject_code);

-- Subject Teachers
ALTER TABLE subject_teachers DROP COLUMN IF EXISTS subject_id CASCADE;

-- 5. Finalize Subjects table PK change
-- Drop old constraints and id column
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_pkey CASCADE;
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_id_unique CASCADE;
ALTER TABLE subjects DROP COLUMN IF EXISTS id CASCADE;

-- Set code as PK
ALTER TABLE subjects ADD PRIMARY KEY (code);

-- 6. Restore Foreign Key constraints
ALTER TABLE career_subjects ADD CONSTRAINT career_subjects_subject_code_fkey 
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON DELETE CASCADE;

ALTER TABLE subject_subscriptions ADD CONSTRAINT subject_subscriptions_subject_code_fkey 
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON DELETE CASCADE;

ALTER TABLE subject_teachers ADD CONSTRAINT subject_teachers_subject_code_fkey 
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON DELETE CASCADE;

COMMIT;
