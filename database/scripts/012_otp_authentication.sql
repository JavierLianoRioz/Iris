-- 012_otp_authentication.sql
-- Adding columns for the new OTP verification flow

BEGIN;

-- 1. Add verification columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 2. Optional: Add a timestamp for the verification code for expiry
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_requested_at TIMESTAMP;

-- 3. Ensure email can be NULL initially (if we create user upon JID request)
-- In JID-as-PK schema, the record might exist by JID before we know the email.
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

COMMIT;
