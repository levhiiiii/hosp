import express from 'express';
import { supabase } from '../index.js';
import { authenticateToken, requireStaff, requireReceptionist } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/patients/total-amount
// @desc    Get total amount for all patients (with filters)
// @access  Private (Doctor and Receptionist)
router.get('/total-amount', async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let query = supabase
      .from('patients')
      .select('fees', { count: 'exact' });

    // Add date filter
    if (startDate) {
      const startDateTime = new Date(startDate + 'T00:00:00.000Z');
      query = query.gte('created_at', startDateTime.toISOString());
    }
    if (endDate) {
      const endDateTime = new Date(endDate + 'T00:00:00.000Z');
      endDateTime.setDate(endDateTime.getDate() + 1);
      query = query.lt('created_at', endDateTime.toISOString());
    }

    // Add status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: patients, error } = await query;

    if (error) {
      console.error('Get total amount error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch total amount'
      });
    }

    // Calculate total amount
    const totalAmount = patients.reduce((sum, patient) => {
      return sum + (parseFloat(patient.fees) || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        totalAmount,
        totalPatients: patients.length
      }
    });
  } catch (error) {
    console.error('Get total amount error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/patients/test-search
// @desc    Test search functionality
// @access  Private (Doctor and Receptionist)
router.get('/test-search', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { search } = req.query;
    console.log('🧪 Test search endpoint - search term:', search);
    
    let query = supabase.from('patients').select('*');
    
    if (search && search.trim()) {
      query = query.ilike('full_name', `%${search.trim()}%`);
    }
    
    const { data: patients, error } = await query;
    
    if (error) {
      console.error('Test search error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    
    console.log('🧪 Test search results:', patients.length, 'patients found');
    res.json({ success: true, patients, count: patients.length });
  } catch (error) {
    console.error('Test search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/patients
// @desc    Get all patients (with pagination and search)
// @access  Private (Doctor and Receptionist)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Debug: Log search parameters
    console.log('🔍 Backend received search:', search);
    console.log('🔍 All query params:', req.query);

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' });

    // Add search filter
    if (search && search.trim()) {
      console.log('🔍 Applying search filter for:', search);
      const searchTerm = search.trim();
      
      // Try a simpler approach - search in full_name first
      query = query.ilike('full_name', `%${searchTerm}%`);
      console.log('✅ Search filter applied (full_name only)');
    } else {
      console.log('⚠️ No search filter applied');
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    console.log('🔍 Executing query...');
    const { data: patients, error, count } = await query;
    console.log('🔍 Query executed. Error:', error);
    console.log('🔍 Query result count:', count);
    console.log('🔍 Query result data length:', patients?.length);

    if (error) {
      console.error('Get patients error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch patients'
      });
    }

    // Debug: Log search results
    console.log('🔍 Search results:', {
      searchTerm: search,
      patientsFound: patients?.length || 0,
      totalCount: count
    });
    
    // Debug: Log patient names for search verification
    if (search && search.trim() && patients) {
      console.log('🔍 Patient names found:', patients.map(p => p.full_name));
    }

    // Calculate total amount for current page patients
    const totalAmount = patients.reduce((sum, patient) => {
      return sum + (parseFloat(patient.fees) || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        patients,
        totalAmount,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalRecords: count,
          hasNext: offset + limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/patients/:id
// @desc    Get single patient by ID
// @access  Private (Doctor and Receptionist)
router.get('/:id', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/patients
// @desc    Create new patient (check-in)
// @access  Private (Receptionist only)
router.post('/', authenticateToken, requireReceptionist, async (req, res) => {
  try {
    const {
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
      fees
    } = req.body;

    // Validation for new simplified form
    if (!full_name || !age || !mobile_number || !fees) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: full_name, age, mobile_number, fees'
      });
    }

    // Use provided patient_id or generate one
    const patientId = patient_id || `KAH${Date.now()}`;

    // Create patient record (only with existing columns for now)
    const patientData = {
      patient_id: patientId,
      full_name,
      age: parseInt(age),
      gender: 'other', // Default gender since not in new form
      phone: mobile_number, // Map mobile_number to phone column
      address: address || null,
      chief_complaint: 'General consultation', // Default since not in new form
      status: 'checked_in',
      checked_in_by: req.user.id,
      checked_in_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Add new fields only if they exist in the database
    if (opd_number) patientData.opd_number = opd_number;
    if (reference) patientData.reference = reference;
    if (dressing !== undefined) patientData.dressing = dressing;
    if (plaster !== undefined) patientData.plaster = plaster;
    if (xray !== undefined) patientData.xray = xray;
    if (fees !== undefined) patientData.fees = parseFloat(fees);

    console.log('Creating patient with data:', patientData);

    const { data: patient, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) {
      console.error('Create patient error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        message: 'Failed to create patient record',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Patient checked in successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient information
// @access  Private (Doctor and Receptionist)
router.put('/:id', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.patient_id;
    delete updateData.created_at;
    delete updateData.checked_in_by;
    delete updateData.checked_in_at;

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString();
    updateData.updated_by = req.user.id;

    const { data: patient, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update patient error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update patient'
      });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/patients/:id/status
// @desc    Update patient status
// @access  Private (Doctor and Receptionist)
router.patch('/:id/status', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['checked_in', 'in_consultation', 'completed', 'discharged'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      updated_by: req.user.id
    };

    if (notes) {
      updateData.status_notes = notes;
    }

    const { data: patient, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update patient status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update patient status'
      });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient status updated successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Update patient status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Delete patient (soft delete)
// @access  Private (Receptionist only)
router.delete('/:id', authenticateToken, requireReceptionist, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete by updating status
    const { data: patient, error } = await supabase
      .from('patients')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        deleted_by: req.user.id
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Delete patient error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete patient'
      });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/patients/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private (Doctor and Receptionist)
router.get('/stats/dashboard', authenticateToken, requireStaff, async (req, res) => {
  try {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Get various statistics
    const [
      { count: totalPatients },
      { count: todayPatients },
      { count: checkedInPatients },
      { count: inConsultationPatients }
    ] = await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('patients').select('*', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('patients').select('*', { count: 'exact', head: true }).eq('status', 'checked_in'),
      supabase.from('patients').select('*', { count: 'exact', head: true }).eq('status', 'in_consultation')
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalPatients,
          todayPatients,
          checkedInPatients,
          inConsultationPatients
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
