-- 008_auto_sync_memory.sql
-- Automatically extract n8n JSONB data into Iris columns

BEGIN;

CREATE OR REPLACE FUNCTION sync_n8n_memory()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if n8n is writing to the 'message' column
    IF NEW.message IS NOT NULL AND NEW.content IS NULL THEN
        -- Extract text
        NEW.content := NEW.message->>'text';
        
        -- Map roles (n8n: ai/human -> Iris: iris/user)
        NEW.role := CASE 
            WHEN NEW.message->>'type' = 'ai' THEN 'iris' 
            ELSE 'user' 
        END;
        
        -- Ensure timestamp is set
        IF NEW.timestamp IS NULL THEN
            NEW.timestamp := NOW();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set up the trigger
DROP TRIGGER IF EXISTS trg_sync_n8n_memory ON chat_history;
CREATE TRIGGER trg_sync_n8n_memory
BEFORE INSERT ON chat_history
FOR EACH ROW EXECUTE FUNCTION sync_n8n_memory();

COMMIT;
