-- 007_n8n_memory_compatibility.sql
-- Making chat_history compatible with n8n's Postgres Chat Memory node

BEGIN;

-- 1. Rename user_jid to session_id (what the node expects)
-- Safely handle renaming
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_history' AND column_name='user_jid') THEN
        ALTER TABLE chat_history RENAME COLUMN user_jid TO session_id;
    END IF;
END $$;

-- 2. Add "message" column (JSONB)
-- n8n stores the chat context here in a specific format
ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS message JSONB;

-- 3. Update the trigger function to use session_id
CREATE OR REPLACE FUNCTION prune_chat_history()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM chat_history
    WHERE id IN (
        SELECT id FROM chat_history 
        WHERE session_id = NEW.session_id 
        ORDER BY timestamp DESC 
        OFFSET 15
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;
