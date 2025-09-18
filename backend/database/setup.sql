-- Kale Accident Hospital Management System Database Schema
-- Execute these SQL commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for doctors and receptionists)
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

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    blood_group VARCHAR(5),
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    chief_complaint TEXT NOT NULL,
    symptoms TEXT,
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    vital_signs JSONB, -- Store as JSON: {"bp": "120/80", "pulse": "72", "temp": "98.6", "resp": "16"}
    -- New fields for simplified check-in form
    opd_number VARCHAR(50),
    reference VARCHAR(100),
    dressing BOOLEAN DEFAULT FALSE,
    plaster BOOLEAN DEFAULT FALSE,
    xray BOOLEAN DEFAULT FALSE,
    fees DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'in_consultation', 'completed', 'discharged', 'deleted')),
    status_notes TEXT,
    checked_in_by UUID REFERENCES users(id),
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON patients(full_name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert default users (password is 'password123' hashed with bcrypt)
-- Note: In production, use stronger passwords and proper hashing
INSERT INTO users (username, password, role, full_name, email) VALUES
('doctor', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BoqjO6', 'doctor', 'Dr. Vishal Diliprao Kale', 'doctor@kalehospital.com'),
('receptionist', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BoqjO6', 'receptionist', 'Hospital Receptionist', 'receptionist@kalehospital.com')
ON CONFLICT (username) DO NOTHING;

-- Create RLS (Row Level Security) policies if needed
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample patient data for testing (optional)
INSERT INTO patients (
    patient_id, full_name, age, gender, phone, address, 
    emergency_contact, emergency_phone, blood_group, height, weight,
    chief_complaint, symptoms, medical_history, allergies, current_medications,
    vital_signs, status, checked_in_by
) VALUES
(
    'KAH' || EXTRACT(EPOCH FROM NOW())::BIGINT,
    'Rajesh Kumar Sharma',
    45,
    'male',
    '+91-9876543210',
    'Village Pathardi, Shevgaon, Ahilyanagar',
    'Sunita Sharma (Wife)',
    '+91-9876543211',
    'B+',
    175.5,
    70.2,
    'Chest pain and shortness of breath',
    'Sharp chest pain, difficulty breathing, sweating',
    'Hypertension for 5 years, Diabetes Type 2',
    'None known',
    'Metformin 500mg twice daily, Amlodipine 5mg once daily',
    '{"bp": "140/90", "pulse": "88", "temp": "98.4", "resp": "20", "spo2": "96"}',
    'checked_in',
    (SELECT id FROM users WHERE role = 'receptionist' LIMIT 1)
) ON CONFLICT (patient_id) DO NOTHING;

-- Grant necessary permissions (adjust as needed for your Supabase setup)
-- GRANT ALL ON users TO authenticated;
-- GRANT ALL ON patients TO authenticated;
