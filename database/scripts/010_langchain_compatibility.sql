-- 010_langchain_compatibility.sql
-- Formatting "message" JSONB to match LangChain EXACTLY (fixing the 'map' error)

BEGIN;

-- 1. Update the Trigger Function to use LangChain JSON structure
-- n8n/LangChain expect: {"data": {"content": "...", "additional_kwargs": {}}, "type": "ai|human"}
CREATE OR REPLACE FUNCTION sync_n8n_memory()
RETURNS TRIGGER AS $$
BEGIN
    -- If n8n writes JSON, extract it to our columns
    IF NEW.message IS NOT NULL AND NEW.content IS NULL THEN
        NEW.content := NEW.message->'data'->>'content';
        NEW.role := CASE 
            WHEN NEW.message->>'type' = 'ai' THEN 'iris' 
            ELSE 'user' 
        END;
    -- If we write columns manually, generate LangChain JSON for n8n
    ELSIF NEW.content IS NOT NULL AND NEW.message IS NULL THEN
        NEW.message := jsonb_build_object(
            'data', jsonb_build_object('content', NEW.content, 'additional_kwargs', jsonb_build_object()),
            'type', CASE WHEN NEW.role = 'iris' THEN 'ai' ELSE 'human' END
        );
    END IF;
    
    IF NEW.timestamp IS NULL THEN
        NEW.timestamp := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Back-fill ALL existing rows with the correct LangChain structure
UPDATE chat_history
SET message = jsonb_build_object(
    'data', jsonb_build_object('content', COALESCE(content, ''), 'additional_kwargs', jsonb_build_object()),
    'type', CASE WHEN role = 'iris' THEN 'ai' ELSE 'human' END
);

COMMIT;
