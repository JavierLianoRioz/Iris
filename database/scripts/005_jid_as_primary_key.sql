-- 005_jid_as_primary_key.sql (BULLETPROOF)
-- Transitioning users.id (Serial) to users.jid (Text) as PK

BEGIN;

-- 1. Cleanup incomplete users (cannot have NULL PK)
DELETE FROM users WHERE jid IS NULL;

-- 2. Add user_jid column to dependent tables
ALTER TABLE career_subscriptions ADD COLUMN IF NOT EXISTS user_jid TEXT;
ALTER TABLE subject_subscriptions ADD COLUMN IF NOT EXISTS user_jid TEXT;
ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS user_jid TEXT;

-- 3. Populate new JID columns from users table
UPDATE career_subscriptions cs SET user_jid = u.jid FROM users u WHERE cs.user_id = u.id;
UPDATE subject_subscriptions ss SET user_jid = u.jid FROM users u WHERE ss.user_id = u.id;
UPDATE chat_history ch SET user_jid = u.jid FROM users u WHERE ch.user_id = u.id;

-- 4. Cleanup orphaned records (avoid NULLs in PK columns)
DELETE FROM career_subscriptions WHERE user_jid IS NULL;
DELETE FROM subject_subscriptions WHERE user_jid IS NULL;
DELETE FROM chat_history WHERE user_jid IS NULL;

-- 5. Drop old columns and recreate primary keys for junction tables
ALTER TABLE career_subscriptions DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE subject_subscriptions DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE chat_history DROP COLUMN IF EXISTS user_id CASCADE;

-- Recreate PKs for subscriptions
ALTER TABLE career_subscriptions DROP CONSTRAINT IF EXISTS career_subscriptions_pkey;
ALTER TABLE career_subscriptions ADD PRIMARY KEY (user_jid, career_id);

ALTER TABLE subject_subscriptions DROP CONSTRAINT IF EXISTS subject_subscriptions_pkey;
ALTER TABLE subject_subscriptions ADD PRIMARY KEY (user_jid, subject_id);

-- 6. Finalize Users table PK change
ALTER TABLE users ALTER COLUMN jid SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_jid_unique UNIQUE (jid);

-- Drop old PK
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;

-- Set JID as PK
ALTER TABLE users ADD PRIMARY KEY (jid);

-- Remove legacy ID column
ALTER TABLE users DROP COLUMN IF EXISTS id;

-- 7. Restore Foreign Key constraints using JID
ALTER TABLE career_subscriptions ADD CONSTRAINT career_subscriptions_user_jid_fkey FOREIGN KEY (user_jid) REFERENCES users(jid) ON DELETE CASCADE;
ALTER TABLE subject_subscriptions ADD CONSTRAINT subject_subscriptions_user_jid_fkey FOREIGN KEY (user_jid) REFERENCES users(jid) ON DELETE CASCADE;
ALTER TABLE chat_history ADD CONSTRAINT chat_history_user_jid_fkey FOREIGN KEY (user_jid) REFERENCES users(jid) ON DELETE CASCADE;

COMMIT;
