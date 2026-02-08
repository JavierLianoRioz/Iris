-- 009_fix_null_messages.sql
-- Back-filling "message" JSONB for existing rows to avoid n8n crashes

BEGIN;

-- Update existing NULL messages using the data in content/role
UPDATE chat_history
SET message = jsonb_build_object(
    'text', COALESCE(content, ''),
    'type', CASE 
        WHEN role = 'iris' THEN 'ai' 
        ELSE 'human' 
    END
)
WHERE message IS NULL;

-- Also ensure every row has a role and content for our own logging
UPDATE chat_history
SET 
    content = COALESCE(content, message->>'text'),
    role = COALESCE(role, CASE WHEN message->>'type' = 'ai' THEN 'iris' ELSE 'user' END)
WHERE content IS NULL OR role IS NULL;

COMMIT;
