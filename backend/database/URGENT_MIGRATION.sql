-- URGENT: Run this in your Supabase SQL Editor to fix the missing fields
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- Step 1: Add the new columns to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS opd_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS dressing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plaster BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS xray BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fees DECIMAL(10,2) DEFAULT 0.00;

-- Step 2: Update existing records with default values
UPDATE patients 
SET 
    opd_number = COALESCE(opd_number, ''),
    reference = COALESCE(reference, ''),
    dressing = COALESCE(dressing, FALSE),
    plaster = COALESCE(plaster, FALSE),
    xray = COALESCE(xray, FALSE),
    fees = COALESCE(fees, 0.00)
WHERE opd_number IS NULL OR reference IS NULL OR dressing IS NULL OR plaster IS NULL OR xray IS NULL OR fees IS NULL;

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_opd_number ON patients(opd_number);
CREATE INDEX IF NOT EXISTS idx_patients_fees ON patients(fees);

-- Step 4: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'patients' 
AND column_name IN ('opd_number', 'reference', 'dressing', 'plaster', 'xray', 'fees')
ORDER BY column_name;

-- Step 5: Check a sample patient record
SELECT 
    patient_id,
    full_name,
    opd_number,
    reference,
    dressing,
    plaster,
    xray,
    fees
FROM patients 
LIMIT 3;
