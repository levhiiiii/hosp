import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api'

const patientService = {
  // Get all patients with pagination and filters
  getPatients: async (params = {}) => {
    const queryParams = new URLSearchParams()
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    // Add filter params
    if (params.search) queryParams.append('search', params.search)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    
    const url = `/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    // Debug: Log the constructed URL
    console.log('🔍 PatientService URL:', url);
    console.log('🔍 Query params string:', queryParams.toString());
    
    const response = await apiGet(url)
    return response
  },

  // Get total amount for all patients (with filters)
  getTotalAmount: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      // Add filter params
      if (params.status) queryParams.append('status', params.status)
      
      // Add date filter params
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      
      const url = `/patients/total-amount${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiGet(url)
      return response
    } catch (error) {
      // If the endpoint doesn't exist yet, return a default response
      console.warn('Total amount endpoint not available yet:', error.message)
      return {
        success: true,
        data: {
          totalAmount: 0,
          totalPatients: 0
        }
      }
    }
  },

  // Get single patient by ID
  getPatientById: async (id) => {
    const response = await apiGet(`/patients/${id}`)
    return response
  },

  // Create new patient (check-in)
  createPatient: async (patientData) => {
    const response = await apiPost('/patients', patientData)
    return response
  },

  // Update patient information
  updatePatient: async (id, patientData) => {
    const response = await apiPut(`/patients/${id}`, patientData)
    return response
  },

  // Update patient status
  updatePatientStatus: async (id, status, notes = '') => {
    const response = await apiPatch(`/patients/${id}/status`, { status, notes })
    return response
  },

  // Delete patient (soft delete)
  deletePatient: async (id) => {
    const response = await apiDelete(`/patients/${id}`)
    return response
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await apiGet('/patients/stats/dashboard')
    return response
  },

  // Helper functions for patient status
  getStatusColor: (status) => {
    const statusColors = {
      'checked_in': 'bg-blue-100 text-blue-800',
      'in_consultation': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'discharged': 'bg-gray-100 text-gray-800',
      'deleted': 'bg-red-100 text-red-800',
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  },

  getStatusLabel: (status) => {
    const statusLabels = {
      'checked_in': 'Checked In',
      'in_consultation': 'In Consultation',
      'completed': 'Completed',
      'discharged': 'Discharged',
      'deleted': 'Deleted',
    }
    return statusLabels[status] || status
  },

  // Format patient data for display
  formatPatientData: (patient) => {
    return {
      ...patient,
      age: `${patient.age} years`,
      statusLabel: patientService.getStatusLabel(patient.status),
      statusColor: patientService.getStatusColor(patient.status),
    }
  },

  // Validate patient data for new simplified form
  validatePatientData: (data) => {
    const errors = {}

    if (!data.full_name?.trim()) {
      errors.full_name = 'Full name is required'
    }

    if (!data.age || data.age < 1 || data.age > 150) {
      errors.age = 'Valid age is required (1-150)'
    }

    if (!data.mobile_number?.trim()) {
      errors.mobile_number = 'Mobile number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.mobile_number)) {
      errors.mobile_number = 'Valid mobile number is required'
    }

    if (!data.fees || data.fees < 0) {
      errors.fees = 'Valid fees amount is required'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Generate patient ID
  generatePatientId: () => {
    const timestamp = Date.now()
    return `KAH${timestamp}`
  },

  // Parse vital signs
  parseVitalSigns: (vitalSigns) => {
    if (typeof vitalSigns === 'string') {
      try {
        return JSON.parse(vitalSigns)
      } catch {
        return {}
      }
    }
    return vitalSigns || {}
  },

  // Format vital signs for display
  formatVitalSigns: (vitalSigns) => {
    const parsed = patientService.parseVitalSigns(vitalSigns)
    return {
      bp: parsed.bp || 'N/A',
      pulse: parsed.pulse ? `${parsed.pulse} bpm` : 'N/A',
      temp: parsed.temp ? `${parsed.temp}°F` : 'N/A',
      resp: parsed.resp ? `${parsed.resp}/min` : 'N/A',
      spo2: parsed.spo2 ? `${parsed.spo2}%` : 'N/A',
    }
  },
}

export default patientService
