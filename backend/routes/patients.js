import express from 'express';
import { supabase } from '../index.js';
import { authenticateToken, requireStaff, requireReceptionist } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/patients
// @desc    Get all patients (with pagination and search)
// @access  Private (Doctor and Receptionist)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' });

    // Add search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,patient_id.ilike.%${search}%`);
    }

    // Add status filter
    if (status) {
      query = query.eq('status', status);
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

    res.json({
      success: true,
      data: {
        patients,
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
      full_name,
      age,
      gender,
      phone,
      address,
      emergency_contact,
      emergency_phone,
      blood_group,
      height,
      weight,
      chief_complaint,
      symptoms,
      medical_history,
      allergies,
      current_medications,
      vital_signs
    } = req.body;

    // Validation
    if (!full_name || !age || !gender || !phone || !chief_complaint) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: full_name, age, gender, phone, chief_complaint'
      });
    }

    // Generate patient ID
    const patientId = `KAH${Date.now()}`;

    // Create patient record
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([
        {
          patient_id: patientId,
          full_name,
          age: parseInt(age),
          gender,
          phone,
          address,
          emergency_contact,
          emergency_phone,
          blood_group,
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          chief_complaint,
          symptoms,
          medical_history,
          allergies,
          current_medications,
          vital_signs,
          status: 'checked_in',
          checked_in_by: req.user.id,
          checked_in_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Create patient error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create patient record'
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
