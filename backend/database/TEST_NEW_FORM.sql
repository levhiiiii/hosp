-- Test script to verify the new check-in form works
-- Run this after executing CLEAN_REBUILD.sql

-- Test 1: Check if the new table structure is correct
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'patients' 
ORDER BY ordinal_position;

-- Test 2: Insert a test patient with new form data
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
    'KAH250107999',
    'Test Patient',
    30,
    '+91-9999999999',
    'Test Address, Test City',
    'OPD999',
    'Test Reference',
    TRUE,
    FALSE,
    TRUE,
    750.00,
    'checked_in',
    (SELECT id FROM users WHERE role = 'receptionist' LIMIT 1)
);

-- Test 3: Verify the data was inserted correctly
SELECT 
    patient_id,
    full_name,
    age,
    mobile_number,
    opd_number,
    reference,
    dressing,
    plaster,
    xray,
    fees,
    status,
    created_at
FROM patients 
WHERE patient_id = 'KAH250107999';

-- Test 4: Show all patients in the new format
SELECT 
    patient_id as "Sr No",
    full_name as "Patient Name",
    age as "Age",
    mobile_number as "Mobile",
    opd_number as "OPD",
    fees as "Fees",
    CASE 
        WHEN dressing THEN 'Dressing' 
        ELSE '' 
    END as "Dressing",
    CASE 
        WHEN plaster THEN 'Plaster' 
        ELSE '' 
    END as "Plaster",
    CASE 
        WHEN xray THEN 'X-Ray' 
        ELSE '' 
    END as "X-Ray",
    status as "Status"
FROM patients 
ORDER BY created_at DESC;
