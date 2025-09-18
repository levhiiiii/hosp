-- CLEAN REBUILD: Delete existing data and redesign for new check-in form
-- Run this in your Supabase SQL Editor

-- Step 1: Delete all existing patient data
DELETE FROM patients;

-- Step 2: Drop the existing patients table to start fresh
DROP TABLE IF EXISTS patients CASCADE;

-- Step 3: Create new patients table optimized for the new check-in form
CREATE TABLE patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Auto-generated Sr No (Primary identifier)
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Basic Patient Information
    full_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 150),
    mobile_number VARCHAR(20) NOT NULL,
    address TEXT,
    
    -- Check-in Information
    opd_number VARCHAR(50),
    reference VARCHAR(100),
    
    -- Services (Boolean flags)
    dressing BOOLEAN DEFAULT FALSE,
    plaster BOOLEAN DEFAULT FALSE,
    xray BOOLEAN DEFAULT FALSE,
    
    -- Financial
    fees DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    -- Status and Tracking
    status VARCHAR(20) DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'in_consultation', 'completed', 'discharged', 'deleted')),
    status_notes TEXT,
    
    -- Audit Fields
    checked_in_by UUID REFERENCES users(id),
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes for better performance
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_created_at ON patients(created_at);
CREATE INDEX idx_patients_full_name ON patients(full_name);
CREATE INDEX idx_patients_mobile_number ON patients(mobile_number);
CREATE INDEX idx_patients_opd_number ON patients(opd_number);
CREATE INDEX idx_patients_fees ON patients(fees);
CREATE INDEX idx_patients_checked_in_at ON patients(checked_in_at);

-- Step 5: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_patients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients
    FOR EACH ROW 
    EXECUTE FUNCTION update_patients_updated_at();

-- Step 6: Insert sample data for testing
INSERT INTO patients (
    patient_id,
    full_name,
    age,
    mobile_number,
    address,
    opd_number,
    reference,
    dressing,
    plaster,
    xray,
    fees,
    status,
    checked_in_by
) VALUES
(
    'KAH250107001',
    'Rajesh Kumar Sharma',
    45,
    '+91-9876543210',
    'Village Pathardi, Shevgaon, Ahilyanagar',
    'OPD001',
    'Dr. Smith',
    TRUE,
    FALSE,
    TRUE,
    500.00,
    'checked_in',
    (SELECT id FROM users WHERE role = 'receptionist' LIMIT 1)
),
(
    'KAH250107002',
    'Sunita Devi',
    32,
    '+91-9876543211',
    'Ahmednagar, Maharashtra',
    'OPD002',
    '',
    FALSE,
    TRUE,
    FALSE,
    300.00,
    'in_consultation',
    (SELECT id FROM users WHERE role = 'receptionist' LIMIT 1)
),
(
    'KAH250107003',
    'Vikram Singh',
    28,
    '+91-9876543212',
    'Pune, Maharashtra',
    'OPD003',
    'Emergency',
    TRUE,
    TRUE,
    TRUE,
    800.00,
    'completed',
    (SELECT id FROM users WHERE role = 'receptionist' LIMIT 1)
);

-- Step 7: Verify the new structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'patients' 
ORDER BY ordinal_position;

-- Step 8: Show sample data
SELECT 
    patient_id,
    full_name,
    age,
    mobile_number,
    opd_number,
    reference,
    CASE 
        WHEN dressing THEN 'Dressing' 
        ELSE '' 
    END as services_dressing,
    CASE 
        WHEN plaster THEN 'Plaster' 
        ELSE '' 
    END as services_plaster,
    CASE 
        WHEN xray THEN 'X-Ray' 
        ELSE '' 
    END as services_xray,
    fees,
    status,
    created_at
FROM patients 
ORDER BY created_at DESC;
