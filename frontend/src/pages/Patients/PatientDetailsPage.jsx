import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiUser, 
  FiPhone, 
  FiMapPin,
  FiActivity,
  FiFileText,
  FiEdit,
  FiClock
} from 'react-icons/fi'
import { fetchPatientById } from '../../store/slices/patientSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import patientService from '../../services/patientService'

const PatientDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentPatient, isLoading } = useSelector((state) => state.patients)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientById(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading patient details..." />
      </div>
    )
  }

  if (!currentPatient) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          Patient not found
        </h3>
        <button
          onClick={() => navigate('/patients')}
          className="btn-primary"
        >
          Back to Patients
        </button>
      </div>
    )
  }

  const formattedPatient = patientService.formatPatientData(currentPatient)
  const vitalSigns = patientService.formatVitalSigns(currentPatient.vital_signs)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <button
            onClick={() => navigate('/patients')}
            className="flex items-center text-secondary-600 hover:text-secondary-900 mb-2"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </button>
          <h1 className="text-3xl font-bold text-secondary-900">
            {currentPatient.full_name}
          </h1>
          <p className="text-secondary-600 mt-2">
            Patient ID: {currentPatient.patient_id}
          </p>
        </div>
        
        {user?.role === 'receptionist' && (
          <button className="btn-primary flex items-center">
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Patient
          </button>
        )}
      </motion.div>

      {/* Status & Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">
            Patient Status
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${formattedPatient.statusColor}`}>
            {formattedPatient.statusLabel}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <FiClock className="w-5 h-5 text-secondary-500" />
            <div>
              <p className="text-sm text-secondary-500">Check-in Time</p>
              <p className="font-medium text-secondary-900">
                {new Date(currentPatient.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FiUser className="w-5 h-5 text-secondary-500" />
            <div>
              <p className="text-sm text-secondary-500">Age & Gender</p>
              <p className="font-medium text-secondary-900">
                {formattedPatient.age} • {formattedPatient.gender}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FiActivity className="w-5 h-5 text-secondary-500" />
            <div>
              <p className="text-sm text-secondary-500">BMI</p>
              <p className="font-medium text-secondary-900">
                {formattedPatient.bmi}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
          <FiPhone className="w-5 h-5 mr-2 text-primary-600" />
          Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-secondary-500 mb-1">Phone Number</p>
            <p className="font-medium text-secondary-900">{currentPatient.phone}</p>
          </div>
          
          {currentPatient.emergency_contact && (
            <div>
              <p className="text-sm text-secondary-500 mb-1">Emergency Contact</p>
              <p className="font-medium text-secondary-900">{currentPatient.emergency_contact}</p>
            </div>
          )}
          
          {currentPatient.address && (
            <div className="md:col-span-2">
              <p className="text-sm text-secondary-500 mb-1">Address</p>
              <p className="font-medium text-secondary-900">{currentPatient.address}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Physical Details & Vital Signs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
          <FiActivity className="w-5 h-5 mr-2 text-primary-600" />
          Physical Details & Vital Signs
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-600 mb-1">Height</p>
            <p className="text-xl font-bold text-primary-900">{formattedPatient.height}</p>
          </div>
          
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-success-600 mb-1">Weight</p>
            <p className="text-xl font-bold text-success-900">{formattedPatient.weight}</p>
          </div>
          
          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <p className="text-sm text-warning-600 mb-1">BMI</p>
            <p className="text-xl font-bold text-warning-900">{formattedPatient.bmi}</p>
          </div>
          
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Age</p>
            <p className="text-xl font-bold text-secondary-900">{currentPatient.age}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 border border-secondary-200 rounded-lg">
            <p className="text-xs text-secondary-500 mb-1">Blood Pressure</p>
            <p className="font-semibold text-secondary-900">{vitalSigns.bp}</p>
          </div>
          
          <div className="text-center p-3 border border-secondary-200 rounded-lg">
            <p className="text-xs text-secondary-500 mb-1">Pulse</p>
            <p className="font-semibold text-secondary-900">{vitalSigns.pulse}</p>
          </div>
          
          <div className="text-center p-3 border border-secondary-200 rounded-lg">
            <p className="text-xs text-secondary-500 mb-1">Temperature</p>
            <p className="font-semibold text-secondary-900">{vitalSigns.temp}</p>
          </div>
          
          <div className="text-center p-3 border border-secondary-200 rounded-lg">
            <p className="text-xs text-secondary-500 mb-1">Respiration</p>
            <p className="font-semibold text-secondary-900">{vitalSigns.resp}</p>
          </div>
          
          <div className="text-center p-3 border border-secondary-200 rounded-lg">
            <p className="text-xs text-secondary-500 mb-1">SpO2</p>
            <p className="font-semibold text-secondary-900">{vitalSigns.spo2}</p>
          </div>
        </div>
      </motion.div>

      {/* Medical Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
          <FiFileText className="w-5 h-5 mr-2 text-primary-600" />
          Medical Information
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Chief Complaint</h3>
            <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg">
              {currentPatient.chief_complaint || 'Not specified'}
            </p>
          </div>
          
          {currentPatient.symptoms && (
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Symptoms</h3>
              <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg">
                {currentPatient.symptoms}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPatient.medical_history && (
              <div>
                <h3 className="font-medium text-secondary-900 mb-2">Medical History</h3>
                <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg text-sm">
                  {currentPatient.medical_history}
                </p>
              </div>
            )}
            
            {currentPatient.current_medications && (
              <div>
                <h3 className="font-medium text-secondary-900 mb-2">Current Medications</h3>
                <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg text-sm">
                  {currentPatient.current_medications}
                </p>
              </div>
            )}
          </div>
          
          {currentPatient.allergies && (
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Allergies</h3>
              <p className="text-error-700 bg-error-50 p-3 rounded-lg">
                {currentPatient.allergies}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PatientDetailsPage
