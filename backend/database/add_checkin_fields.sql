-- Migration script to add new check-in form fields to patients table
-- Execute this in your Supabase SQL editor

-- Add new columns for simplified check-in form
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS opd_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS dressing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plaster BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS xray BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fees DECIMAL(10,2) DEFAULT 0.00;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_patients_opd_number ON patients(opd_number);
CREATE INDEX IF NOT EXISTS idx_patients_fees ON patients(fees);

-- Update existing records to have default values
UPDATE patients 
SET 
    opd_number = COALESCE(opd_number, ''),
    reference = COALESCE(reference, ''),
    dressing = COALESCE(dressing, FALSE),
    plaster = COALESCE(plaster, FALSE),
    xray = COALESCE(xray, FALSE),
    fees = COALESCE(fees, 0.00)
WHERE opd_number IS NULL OR reference IS NULL OR dressing IS NULL OR plaster IS NULL OR xray IS NULL OR fees IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'patients' 
AND column_name IN ('opd_number', 'reference', 'dressing', 'plaster', 'xray', 'fees')
ORDER BY column_name;
