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
    if (params.status) queryParams.append('status', params.status)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    
    const url = `/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await apiGet(url)
    return response
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
      gender: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
      height: patient.height ? `${patient.height} cm` : 'N/A',
      weight: patient.weight ? `${patient.weight} kg` : 'N/A',
      bmi: patient.height && patient.weight 
        ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)
        : 'N/A',
      statusLabel: patientService.getStatusLabel(patient.status),
      statusColor: patientService.getStatusColor(patient.status),
    }
  },

  // Validate patient data
  validatePatientData: (data) => {
    const errors = {}

    if (!data.full_name?.trim()) {
      errors.full_name = 'Full name is required'
    }

    if (!data.age || data.age < 1 || data.age > 150) {
      errors.age = 'Valid age is required (1-150)'
    }

    if (!data.gender) {
      errors.gender = 'Gender is required'
    }

    if (!data.phone?.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)) {
      errors.phone = 'Valid phone number is required'
    }

    if (!data.chief_complaint?.trim()) {
      errors.chief_complaint = 'Chief complaint is required'
    }

    if (data.height && (data.height < 30 || data.height > 300)) {
      errors.height = 'Height must be between 30-300 cm'
    }

    if (data.weight && (data.weight < 1 || data.weight > 500)) {
      errors.weight = 'Weight must be between 1-500 kg'
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
