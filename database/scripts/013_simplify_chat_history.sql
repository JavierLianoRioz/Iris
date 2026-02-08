-- 013_simplify_chat_history.sql
-- Removing token logic for simplicity, switching to count-based pruning

BEGIN;

-- 1. Remove columns from metadata
ALTER TABLE users DROP COLUMN IF EXISTS conversation_token_limit;
ALTER TABLE chat_history DROP COLUMN IF EXISTS tokens;

-- 2. Update the trigger function to keep ONLY the last 15 messages per session
-- This is a safe buffer for n8n's default 5-message window.
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
