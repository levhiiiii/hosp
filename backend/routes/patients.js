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


    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' });

    // Add search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();
      
      // Enhanced search: search across multiple fields
      // Check if search term is numeric (likely patient_id or phone)
      const isNumeric = /^\d+$/.test(searchTerm);
      
      if (isNumeric) {
        // If numeric, search in patient_id, phone, and opd_number
        query = query.or(`patient_id.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,opd_number.ilike.%${searchTerm}%`);
      } else {
        // If text, search in full_name and address
        query = query.or(`full_name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
      }
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data: patients, error, count } = await query;

    if (error) {
      console.error('Get patients error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch patients'
      });
    }


    // Calculate total amount for current page patients
    const totalAmount = patients.reduce((sum, patient) => {
      return sum + (parseFloat(patient.fees) || 0);
    }, 0);

    // Get today's date for real-time calculations
    const today = new Date().toISOString().split('T')[0];
    
    // Get all patients for real-time fee calculations (without pagination)
    const { data: allPatientsForStats } = await supabase
      .from('patients')
      .select('fees, created_at');

    // Calculate real-time fees
    const realTimeTotalFees = allPatientsForStats?.reduce((sum, patient) => {
      return sum + (parseFloat(patient.fees) || 0);
    }, 0) || 0;

    const realTimeTodayFees = allPatientsForStats
      ?.filter(patient => patient.created_at && patient.created_at.startsWith(today))
      .reduce((sum, patient) => {
        return sum + (parseFloat(patient.fees) || 0);
      }, 0) || 0;

    const responseData = {
      success: true,
      data: {
        patients,
        totalAmount,
        realTimeStats: {
          totalFees: realTimeTotalFees,
          todayFees: realTimeTodayFees
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalRecords: count,
          hasNext: offset + limit < count,
          hasPrev: page > 1
        }
      }
    };


    res.json(responseData);
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

    // Get all patients data for real-time calculation
    const { data: allPatients, error: patientsError } = await supabase
      .from('patients')
      .select('fees, created_at, status');

    if (patientsError) {
      console.error('Get patients for stats error:', patientsError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch patients data for statistics'
      });
    }

    // Calculate statistics in real-time from the data
    const totalPatients = allPatients.length;
    const todayPatients = allPatients.filter(patient => 
      patient.created_at && patient.created_at.startsWith(today)
    ).length;
    const checkedInPatients = allPatients.filter(patient => 
      patient.status === 'checked_in'
    ).length;
    const inConsultationPatients = allPatients.filter(patient => 
      patient.status === 'in_consultation'
    ).length;

    // Calculate fees in real-time
    const totalFees = allPatients.reduce((sum, patient) => {
      return sum + (parseFloat(patient.fees) || 0);
    }, 0);

    const todayFees = allPatients
      .filter(patient => patient.created_at && patient.created_at.startsWith(today))
      .reduce((sum, patient) => {
        return sum + (parseFloat(patient.fees) || 0);
      }, 0);

    const dashboardResponse = {
      success: true,
      data: {
        stats: {
          totalPatients,
          todayPatients,
          checkedInPatients,
          inConsultationPatients,
          totalFees,
          todayFees
        }
      }
    };


    res.json(dashboardResponse);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
