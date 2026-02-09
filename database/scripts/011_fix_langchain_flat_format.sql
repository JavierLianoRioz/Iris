-- 011_fix_langchain_flat_format.sql
-- Returning to FLAT LangChain format (n8n standard)

BEGIN;

-- 1. Update the Trigger Function to use FLAT JSON structure
-- n8n expects: {"type": "human|ai", "content": "..."}
CREATE OR REPLACE FUNCTION sync_n8n_memory()
RETURNS TRIGGER AS $$
BEGIN
    -- If n8n writes JSON, extract it to our columns
    IF NEW.message IS NOT NULL AND (NEW.content IS NULL OR NEW.content = '') THEN
        -- Standard n8n format uses 'content' or 'text' depending on version, 
        -- we try to be robust.
        NEW.content := COALESCE(NEW.message->>'content', NEW.message->>'text');
        
        NEW.role := CASE 
            WHEN NEW.message->>'type' = 'ai' THEN 'iris' 
            ELSE 'user' 
        END;
    -- If we write columns manually, generate FLAT JSON for n8n
    ELSIF NEW.content IS NOT NULL AND NEW.message IS NULL THEN
        NEW.message := jsonb_build_object(
            'type', CASE WHEN NEW.role = 'iris' THEN 'ai' ELSE 'human' END,
            'content', NEW.content,
            'additional_kwargs', jsonb_build_object(),
            'response_metadata', jsonb_build_object()
        );
    END IF;
    
    IF NEW.timestamp IS NULL THEN
        NEW.timestamp := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Back-fill ALL existing rows with the correct FLAT structure
UPDATE chat_history
SET message = jsonb_build_object(
    'type', CASE WHEN role = 'iris' THEN 'ai' ELSE 'human' END,
    'content', COALESCE(content, ''),
    'additional_kwargs', jsonb_build_object(),
    'response_metadata', jsonb_build_object()
);

COMMIT;
