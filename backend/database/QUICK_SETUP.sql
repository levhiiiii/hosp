-- Quick Setup for Kale Accident Hospital Management System
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
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

-- Note: No default users are created. 
-- You need to create users through the registration API or manually insert them.
-- Example of how to create a user (replace with your own credentials):
-- INSERT INTO users (username, password, role, full_name, email) VALUES
-- ('your_username', 'your_hashed_password', 'doctor', 'Your Full Name', 'your@email.com');

-- Create an index for faster login queries
CREATE INDEX IF NOT EXISTS idx_users_login ON users(username, role);
