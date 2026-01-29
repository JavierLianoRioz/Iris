-- Database Maintenance Scripts: Iris v2.2
-- Includes: Chat History Pruning (Tokens) & Email TTL

SET client_encoding = 'UTF8';

BEGIN;

-- 1. Chat History Pruning Logic (Trigger)
-- This function deletes the oldest messages for a user once their conversation_token_limit is reached.
CREATE OR REPLACE FUNCTION prune_chat_history()
RETURNS TRIGGER AS $$
DECLARE
    total_tokens INTEGER;
    limit_tokens INTEGER;
BEGIN
    -- Get the user's token limit
    SELECT conversation_token_limit INTO limit_tokens FROM users WHERE id = NEW.user_id;
    
    -- Calculate current total tokens for the user
    SELECT SUM(tokens) INTO total_tokens FROM chat_history WHERE user_id = NEW.user_id;

    -- If limit exceeded, delete oldest records until we are below the limit
    WHILE total_tokens > limit_tokens LOOP
        DELETE FROM chat_history 
        WHERE id = (SELECT id FROM chat_history WHERE user_id = NEW.user_id ORDER BY timestamp ASC LIMIT 1)
        RETURNING tokens INTO total_tokens; -- This is simplified; we actually need to subtract deleted tokens
        
        -- Recalculate correctly
        SELECT SUM(tokens) INTO total_tokens FROM chat_history WHERE user_id = NEW.user_id;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prune_chat_history ON chat_history;
CREATE TRIGGER trg_prune_chat_history
AFTER INSERT ON chat_history
FOR EACH ROW
EXECUTE FUNCTION prune_chat_history();

-- 2. Email TTL (7 Days)
-- Procedimiento para limpiar correos viejos no vinculados a historial activo.
CREATE OR REPLACE PROCEDURE cleanup_old_emails()
AS $$
BEGIN
    DELETE FROM correos
    WHERE fecha_recepcion < NOW() - INTERVAL '7 days'
    AND id NOT IN (SELECT DISTINCT email_id FROM chat_history WHERE email_id IS NOT NULL);
END;
$$ LANGUAGE plpgsql;

COMMIT;
