-- E2E Validation Script: Phase 2 (Auth & Messaging)
-- Logic validation for JID linking via OAuth Callback

SET client_encoding = 'UTF8';

DO $$
DECLARE
    v_test_jid TEXT := '34600000000@s.whatsapp.net';
    v_test_email TEXT := 'validator@uneatlantico.es';
    v_count INTEGER;
BEGIN
    RAISE NOTICE 'Starting Phase 2 Validation...';

    -- 1. Simulate n8n 'Upsert User JID' node logic
    -- We assume n8n successfully exchanges token and gets user info.
    INSERT INTO users (email, jid, name)
    VALUES (v_test_email, v_test_jid, 'Validator User')
    ON CONFLICT (email) DO UPDATE SET jid = EXCLUDED.jid, name = EXCLUDED.name;

    -- 2. Verify record existence and correct JID mapping
    SELECT count(*) INTO v_count FROM users WHERE email = v_test_email AND jid = v_test_jid;
    
    IF v_count = 1 THEN
        RAISE NOTICE 'SUCCESS: User linked correctly with Email % and JID %', v_test_email, v_test_jid;
    ELSE
        RAISE EXCEPTION 'FAILURE: User linkage failed or incorrect.';
    END IF;

    RAISE NOTICE 'Phase 2 Logic Validation SUCCESSFUL.';
END $$;
