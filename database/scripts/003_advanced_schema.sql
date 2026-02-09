-- 003_advanced_relational_schema.sql (FIXED v2)
-- Migration to normalization: Careers, Subjects, and M:N Subscriptions

BEGIN;

-- 1. Create Careers Table
CREATE TABLE IF NOT EXISTS careers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- 2. Modify Subjects for efficiency (Add unique ID if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='id') THEN
        ALTER TABLE subjects ADD COLUMN id SERIAL;
        ALTER TABLE subjects ADD CONSTRAINT subjects_id_unique UNIQUE (id);
    END IF;
END $$;

-- 3. Create Career-Subject Junction Table
CREATE TABLE IF NOT EXISTS career_subjects (
    career_id INT REFERENCES careers(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (career_id, subject_id)
);

-- 4. Create Career Subscriptions Table (Corrected INT user_id)
CREATE TABLE IF NOT EXISTS career_subscriptions (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    career_id INT REFERENCES careers(id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, career_id)
);

-- 5. Create Subject Subscriptions Table (Corrected INT user_id)
CREATE TABLE IF NOT EXISTS subject_subscriptions (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, subject_id)
);

-- 6. Migrate existing user_subjects data to subject_subscriptions
-- Map old subject_code (varchar) to the new subject.id (int)
INSERT INTO subject_subscriptions (user_id, subject_id)
SELECT us.user_id, s.id
FROM user_subjects us
JOIN subjects s ON us.subject_code = s.code
ON CONFLICT DO NOTHING;

-- 7. Add Semantic Keywords to Subjects
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='semantic_keywords') THEN
        ALTER TABLE subjects ADD COLUMN semantic_keywords TEXT;
    END IF;
END $$;

-- 8. Insert a default Career (GII)
INSERT INTO careers (code, name) VALUES ('GII', 'Grado en Ingeniería Informática') ON CONFLICT DO NOTHING;

COMMIT;
