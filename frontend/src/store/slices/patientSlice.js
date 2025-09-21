import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import patientService from '../../services/patientService'

// Initial state
const initialState = {
  patients: [],
  currentPatient: null,
  stats: {
    totalPatients: 0,
    todayPatients: 0,
    checkedInPatients: 0,
    inConsultationPatients: 0,
    totalFees: 0,
    todayFees: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNext: false,
    hasPrev: false,
  },
  totalAmount: 0,
  filters: {
    search: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux fetchPatients called with params:', params);
      const response = await patientService.getPatients(params)
      console.log('✅ Redux fetchPatients response:', response);
      return response
    } catch (error) {
      console.error('❌ Redux fetchPatients error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients')
    }
  }
)

export const fetchTotalAmount = createAsyncThunk(
  'patients/fetchTotalAmount',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await patientService.getTotalAmount(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total amount')
    }
  }
)

export const fetchPatientById = createAsyncThunk(
  'patients/fetchPatientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatientById(id)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient')
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatient(patientData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create patient')
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(id, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient')
    }
  }
)

export const updatePatientStatus = createAsyncThunk(
  'patients/updatePatientStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatientStatus(id, status, notes)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient status')
    }
  }
)

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      await patientService.deletePatient(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete patient')
    }
  }
)

export const fetchDashboardStats = createAsyncThunk(
  'patients/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getDashboardStats()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats')
    }
  }
)

// Patient slice
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    updateStats: (state, action) => {
      state.stats.totalFees = action.payload.totalFees || state.stats.totalFees;
      state.stats.todayFees = action.payload.todayFees || state.stats.todayFees;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response structure: { success: true, data: { patients: [], pagination: {}, totalAmount: 0, realTimeStats: {} } }
        const responseData = action.payload.data || action.payload
        
        
        state.patients = responseData.patients || []
        state.pagination = responseData.pagination || state.pagination
        state.totalAmount = responseData.totalAmount || 0
        
        // Always calculate and update stats from current patients data
        const today = new Date().toISOString().split('T')[0];
        const currentPatients = responseData.patients || [];
        
        // Calculate stats from current patients
        const calculatedTotalFees = currentPatients.reduce((sum, patient) => {
          return sum + (parseFloat(patient.fees) || 0);
        }, 0);
        
        const calculatedTodayFees = currentPatients
          .filter(patient => patient.created_at && patient.created_at.startsWith(today))
          .reduce((sum, patient) => {
            return sum + (parseFloat(patient.fees) || 0);
          }, 0);
        
        const calculatedTodayPatients = currentPatients.filter(patient => 
          patient.created_at && patient.created_at.startsWith(today)
        ).length;
        
        const calculatedTotalPatients = currentPatients.length;
        
        // Update Redux stats with calculated values (this ensures stats are always correct)
        state.stats.totalFees = calculatedTotalFees;
        state.stats.todayFees = calculatedTodayFees;
        state.stats.todayPatients = calculatedTodayPatients;
        state.stats.totalPatients = calculatedTotalPatients;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch total amount
      .addCase(fetchTotalAmount.fulfilled, (state, action) => {
        const responseData = action.payload.data || action.payload
        state.totalAmount = responseData.totalAmount || 0
      })
      .addCase(fetchTotalAmount.rejected, (state, action) => {
        state.totalAmount = 0
        state.error = action.payload
      })
      // Fetch patient by ID
      .addCase(fetchPatientById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response structure: { success: true, data: { patient: {} } }
        const responseData = action.payload.data || action.payload
        state.currentPatient = responseData.patient || null
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create patient
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response structure: { success: true, data: { patient: {} } }
        const responseData = action.payload.data || action.payload
        if (responseData.patient) {
          state.patients.unshift(responseData.patient)
          
          // Update real-time stats when new patient is added
          const newPatient = responseData.patient
          const today = new Date().toISOString().split('T')[0]
          
          // Update total fees
          state.stats.totalFees += parseFloat(newPatient.fees) || 0
          
          // Update today's fees if patient was created today
          if (newPatient.created_at && newPatient.created_at.startsWith(today)) {
            state.stats.todayFees += parseFloat(newPatient.fees) || 0
            state.stats.todayPatients += 1
          }
          
          // Update total patients
          state.stats.totalPatients += 1
        }
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update patient
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response structure: { success: true, data: { patient: {} } }
        const responseData = action.payload.data || action.payload
        if (responseData.patient) {
          const updatedPatient = responseData.patient
          const index = state.patients.findIndex(p => p.id === updatedPatient.id)
          
          if (index !== -1) {
            const oldPatient = state.patients[index]
            const oldFees = parseFloat(oldPatient.fees) || 0
            const newFees = parseFloat(updatedPatient.fees) || 0
            const feeDifference = newFees - oldFees
            
            // Update the patient in the array
            state.patients[index] = updatedPatient
            
            // Update real-time stats based on fee changes
            state.stats.totalFees += feeDifference
            
            // Update today's fees if patient was created today
            const today = new Date().toISOString().split('T')[0]
            if (updatedPatient.created_at && updatedPatient.created_at.startsWith(today)) {
              state.stats.todayFees += feeDifference
            }
          }
          
          if (state.currentPatient?.id === updatedPatient.id) {
            state.currentPatient = updatedPatient
          }
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update patient status
      .addCase(updatePatientStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePatientStatus.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response structure: { success: true, data: { patient: {} } }
        const responseData = action.payload.data || action.payload
        if (responseData.patient) {
          const index = state.patients.findIndex(p => p.id === responseData.patient.id)
          if (index !== -1) {
            state.patients[index] = responseData.patient
          }
          if (state.currentPatient?.id === responseData.patient.id) {
            state.currentPatient = responseData.patient
          }
        }
      })
      .addCase(updatePatientStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete patient
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients = state.patients.filter(p => p.id !== action.payload)
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        // Handle the API response structure: { success: true, data: { stats: {} } }
        const responseData = action.payload.data || action.payload
        
        // Only update stats if they are currently 0 (initial state)
        // This prevents dashboard stats from overwriting correctly calculated values
        if (state.stats.totalFees === 0 && state.stats.todayFees === 0) {
          state.stats = responseData.stats || state.stats
        }
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const {
  clearError,
  clearCurrentPatient,
  setFilters,
  resetFilters,
  setPagination,
  updateStats,
} = patientSlice.actions

export default patientSlice.reducer
