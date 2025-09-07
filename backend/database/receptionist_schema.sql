-- Receptionist Login Schema for Kale Accident Hospital Management System
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (if not already exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'receptionist')),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create a sample receptionist user
-- Username: receptionist_test
-- Password: receptionist123
-- Role: receptionist
INSERT INTO users (username, password, role, full_name, email) VALUES
(
    'receptionist_test',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BoqjO6',
    'receptionist',
    'Test Receptionist',
    'test@receptionist.com'
) ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = NOW();

-- Create an index for faster login queries
CREATE INDEX IF NOT EXISTS idx_users_login ON users(username, role);

-- Create a view for user management (without exposing passwords)
CREATE OR REPLACE VIEW user_management AS
SELECT 
    id,
    username,
    role,
    full_name,
    email,
    created_at,
    updated_at,
    last_login,
    CASE 
        WHEN last_login IS NULL THEN 'Never'
        ELSE last_login::text
    END as last_login_display
FROM users
WHERE role IN ('doctor', 'receptionist')
ORDER BY role, username;

-- Verify the receptionist user was created
SELECT 
    username,
    role,
    full_name,
    email,
    created_at
FROM users 
WHERE username = 'receptionist_test';

-- Sample query to test receptionist login
-- This query simulates the login process
SELECT 
    id,
    username,
    role,
    full_name,
    email
FROM users 
WHERE username = 'receptionist_test' 
  AND role = 'receptionist';

-- Create a function to update last login timestamp
CREATE OR REPLACE FUNCTION update_last_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET last_login = NOW(), updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
-- GRANT SELECT ON user_management TO authenticated;
-- GRANT EXECUTE ON FUNCTION update_last_login(UUID) TO authenticated;

-- Create a function to hash passwords (for reference)
-- Note: In practice, use bcrypt in your application
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- This is a placeholder. Use bcrypt in your Node.js application
    RETURN 'Use bcrypt in your application to hash passwords';
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts for hospital management system';
COMMENT ON COLUMN users.username IS 'Unique username for login';
COMMENT ON COLUMN users.password IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role: doctor or receptionist';
COMMENT ON COLUMN users.full_name IS 'Full name of the user';
COMMENT ON COLUMN users.email IS 'Email address of the user';
COMMENT ON COLUMN users.last_login IS 'Timestamp of last successful login';

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Final verification query
SELECT 
    'Schema setup completed successfully!' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'receptionist' THEN 1 END) as receptionists,
    COUNT(CASE WHEN role = 'doctor' THEN 1 END) as doctors
FROM users;
