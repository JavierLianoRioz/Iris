-- Verification Script: Iris v2.2 Database
-- Tests for Phase 1 (Database Refactoring)

SET client_encoding = 'UTF8';

DO $$
DECLARE
    v_user_id INTEGER;
    v_tokens INTEGER;
BEGIN
    RAISE NOTICE 'Starting Verification...';

    -- 1. Check Schema
    PERFORM * FROM information_schema.columns WHERE table_name = 'subject_teachers' AND column_name = 'type';
    IF NOT FOUND THEN RAISE EXCEPTION 'subject_teachers.type missing'; END IF;
    
    PERFORM * FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'jid';
    IF NOT FOUND THEN RAISE EXCEPTION 'users.jid missing'; END IF;

    -- 2. Test Data Integrity (Seeds)
    INSERT INTO teachers (name, email) VALUES ('Test Teacher', 'test@uneatlantico.es') 
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_user_id;
    
    INSERT INTO subjects (code, name) VALUES ('TS-101', 'Test Subject') ON CONFLICT (code) DO NOTHING;
    
    INSERT INTO subject_teachers (subject_code, teacher_id, type) 
    VALUES ('TS-101', (SELECT id FROM teachers WHERE email = 'test@uneatlantico.es'), 'Teoría')
    ON CONFLICT DO NOTHING;

    -- 3. Test Token Pruning Trigger
    INSERT INTO users (email, jid, conversation_token_limit) 
    VALUES ('tester@uneatlantico.es', '34000000000@s.whatsapp.net', 100)
    ON CONFLICT (email) DO UPDATE SET conversation_token_limit = 100 RETURNING id INTO v_user_id;

    -- Insert records up to limit
    INSERT INTO chat_history (user_id, role, content, tokens) VALUES (v_user_id, 'user', 'Hello', 60);
    INSERT INTO chat_history (user_id, role, content, tokens) VALUES (v_user_id, 'iris', 'Hi!', 50); -- Total 110, exceeds 100

    -- Verify Pruning (The oldest record 'Hello' should be gone)
    SELECT SUM(tokens) INTO v_tokens FROM chat_history WHERE user_id = v_user_id;
    RAISE NOTICE 'Current Tokens for tester: %', v_tokens;
    
    IF v_tokens > 100 THEN
        RAISE EXCEPTION 'Pruning trigger FAILED: tokens (%) exceed limit (100)', v_tokens;
    END IF;

    RAISE NOTICE 'Verification SUCCESSFUL.';
END $$;
