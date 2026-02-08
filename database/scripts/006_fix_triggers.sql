-- 006_fix_triggers.sql
-- Updating triggers to use user_jid instead of user_id

CREATE OR REPLACE FUNCTION prune_chat_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete old messages if they exceed 15 (or any limit defined)
    DELETE FROM chat_history
    WHERE id IN (
        SELECT id FROM chat_history 
        WHERE user_jid = NEW.user_jid 
        ORDER BY timestamp DESC 
        OFFSET 15
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
