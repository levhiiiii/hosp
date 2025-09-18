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

      {/* Patient Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            Patient Information
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${formattedPatient.statusColor}`}>
            {formattedPatient.statusLabel}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-sm text-primary-600 mb-1">Sr No</p>
            <p className="font-bold text-primary-900 text-lg">{currentPatient.patient_id}</p>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Patient Name</p>
            <p className="font-bold text-secondary-900 text-lg">{currentPatient.full_name}</p>
          </div>
          
          <div className="bg-success-50 p-4 rounded-lg">
            <p className="text-sm text-success-600 mb-1">Age</p>
            <p className="font-bold text-success-900 text-lg">{currentPatient.age} years</p>
          </div>
          
          <div className="bg-warning-50 p-4 rounded-lg">
            <p className="text-sm text-warning-600 mb-1">Mobile Number</p>
            <p className="font-bold text-warning-900 text-lg">{currentPatient.phone}</p>
          </div>
          
          <div className="bg-info-50 p-4 rounded-lg">
            <p className="text-sm text-info-600 mb-1">OPD Number</p>
            <p className="font-bold text-info-900 text-lg">{currentPatient.opd_number || 'Not assigned'}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Consultation Fees</p>
            <p className="font-bold text-purple-900 text-lg">₹{currentPatient.fees || '0.00'}</p>
          </div>
        </div>
        
        {currentPatient.address && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Address</p>
            <p className="font-medium text-gray-900">{currentPatient.address}</p>
          </div>
        )}
        
        {currentPatient.reference && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-2">Reference</p>
            <p className="font-medium text-blue-900">{currentPatient.reference}</p>
          </div>
        )}
      </motion.div>

      {/* Services Required */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">
          Services Required
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${currentPatient.dressing ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${currentPatient.dressing ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className={`font-medium ${currentPatient.dressing ? 'text-blue-900' : 'text-gray-500'}`}>
                Dressing
              </span>
            </div>
            {currentPatient.dressing && (
              <p className="text-sm text-blue-600 mt-2">✓ Service requested</p>
            )}
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${currentPatient.plaster ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${currentPatient.plaster ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={`font-medium ${currentPatient.plaster ? 'text-green-900' : 'text-gray-500'}`}>
                Plaster
              </span>
            </div>
            {currentPatient.plaster && (
              <p className="text-sm text-green-600 mt-2">✓ Service requested</p>
            )}
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${currentPatient.xray ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${currentPatient.xray ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
              <span className={`font-medium ${currentPatient.xray ? 'text-purple-900' : 'text-gray-500'}`}>
                X-Ray
              </span>
            </div>
            {currentPatient.xray && (
              <p className="text-sm text-purple-600 mt-2">✓ Service requested</p>
            )}
          </div>
        </div>
        
        {!currentPatient.dressing && !currentPatient.plaster && !currentPatient.xray && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No additional services requested</p>
            <p className="text-gray-400 text-sm mt-1">Only consultation fees apply</p>
          </div>
        )}
      </motion.div>

      {/* Check-in Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
          <FiClock className="w-5 h-5 mr-2 text-primary-600" />
          Check-in Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-secondary-500 mb-1">Check-in Time</p>
            <p className="font-medium text-secondary-900">
              {new Date(currentPatient.created_at).toLocaleString()}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-secondary-500 mb-1">Status</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${formattedPatient.statusColor}`}>
              {formattedPatient.statusLabel}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PatientDetailsPage
