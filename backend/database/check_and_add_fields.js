// Script to check and add new fields to patients table
// Run this with: node backend/database/check_and_add_fields.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAndAddFields() {
  try {
    console.log('🔍 Checking if new fields exist in patients table...')
    
    // First, let's check what columns exist
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'patients')
      .in('column_name', ['opd_number', 'reference', 'dressing', 'plaster', 'xray', 'fees'])
    
    if (columnsError) {
      console.error('❌ Error checking columns:', columnsError)
      return
    }
    
    console.log('📋 Existing columns:', columns.map(c => c.column_name))
    
    const existingColumns = columns.map(c => c.column_name)
    const requiredColumns = ['opd_number', 'reference', 'dressing', 'plaster', 'xray', 'fees']
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))
    
    if (missingColumns.length === 0) {
      console.log('✅ All required columns already exist!')
      
      // Update existing records with default values
      console.log('🔄 Updating existing records with default values...')
      const { error: updateError } = await supabase
        .from('patients')
        .update({
          opd_number: '',
          reference: '',
          dressing: false,
          plaster: false,
          xray: false,
          fees: 0.00
        })
        .is('opd_number', null)
      
      if (updateError) {
        console.error('❌ Error updating records:', updateError)
      } else {
        console.log('✅ Records updated successfully!')
      }
      
      return
    }
    
    console.log('⚠️  Missing columns:', missingColumns)
    console.log('📝 Please run the SQL migration script in Supabase SQL editor:')
    console.log('')
    console.log('-- Add missing columns')
    missingColumns.forEach(col => {
      let sql = ''
      switch(col) {
        case 'opd_number':
          sql = "ALTER TABLE patients ADD COLUMN opd_number VARCHAR(50);"
          break
        case 'reference':
          sql = "ALTER TABLE patients ADD COLUMN reference VARCHAR(100);"
          break
        case 'dressing':
          sql = "ALTER TABLE patients ADD COLUMN dressing BOOLEAN DEFAULT FALSE;"
          break
        case 'plaster':
          sql = "ALTER TABLE patients ADD COLUMN plaster BOOLEAN DEFAULT FALSE;"
          break
        case 'xray':
          sql = "ALTER TABLE patients ADD COLUMN xray BOOLEAN DEFAULT FALSE;"
          break
        case 'fees':
          sql = "ALTER TABLE patients ADD COLUMN fees DECIMAL(10,2) DEFAULT 0.00;"
          break
      }
      console.log(sql)
    })
    
    console.log('')
    console.log('-- Update existing records')
    console.log("UPDATE patients SET opd_number = COALESCE(opd_number, ''), reference = COALESCE(reference, ''), dressing = COALESCE(dressing, FALSE), plaster = COALESCE(plaster, FALSE), xray = COALESCE(xray, FALSE), fees = COALESCE(fees, 0.00) WHERE opd_number IS NULL OR reference IS NULL OR dressing IS NULL OR plaster IS NULL OR xray IS NULL OR fees IS NULL;")
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkAndAddFields()
