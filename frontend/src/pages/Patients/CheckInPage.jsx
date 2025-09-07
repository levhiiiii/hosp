import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUser, 
  FiPhone, 
  FiCalendar, 
  FiMapPin,
  FiActivity,
  FiSave,
  FiArrowLeft
} from 'react-icons/fi'
import { createPatient } from '../../store/slices/patientSlice'
import patientService from '../../services/patientService'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const CheckInPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    emergency_contact: '',
    chief_complaint: '',
    symptoms: '',
    medical_history: '',
    current_medications: '',
    allergies: '',
    height: '',
    weight: '',
    vital_signs: {
      bp: '',
      pulse: '',
      temp: '',
      resp: '',
      spo2: ''
    }
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('vital_signs.')) {
      const vitalSign = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        vital_signs: {
          ...prev.vital_signs,
          [vitalSign]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form data
    const validation = patientService.validatePatientData(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare data for submission
      const patientData = {
        ...formData,
        patient_id: patientService.generatePatientId(),
        age: parseInt(formData.age),
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        vital_signs: JSON.stringify(formData.vital_signs)
      }

      await dispatch(createPatient(patientData)).unwrap()
      toast.success('Patient checked in successfully!')
      navigate('/patients')
    } catch (error) {
      toast.error(error || 'Failed to check in patient')
    } finally {
      setIsLoading(false)
    }
  }

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
            onClick={() => navigate(-1)}
            className="flex items-center text-secondary-600 hover:text-secondary-900 mb-2"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-secondary-900">Check-in Patient</h1>
          <p className="text-secondary-600 mt-2">
            Register a new patient for consultation
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-soft p-6"
        >
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-primary-600" />
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`input-field ${errors.full_name ? 'border-error-500' : ''}`}
                placeholder="Enter patient's full name"
              />
              {errors.full_name && (
                <p className="text-error-500 text-sm mt-1">{errors.full_name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`input-field ${errors.age ? 'border-error-500' : ''}`}
                  placeholder="Age"
                  min="1"
                  max="150"
                />
                {errors.age && (
                  <p className="text-error-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`input-field ${errors.gender ? 'border-error-500' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-error-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field ${errors.phone ? 'border-error-500' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-error-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="input-field"
                placeholder="Emergency contact number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="input-field"
                placeholder="Enter patient's address"
              />
            </div>
          </div>
        </motion.div>

        {/* Physical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-soft p-6"
        >
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
            <FiActivity className="w-5 h-5 mr-2 text-primary-600" />
            Physical Details & Vital Signs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="input-field"
                placeholder="Height in cm"
                min="30"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input-field"
                placeholder="Weight in kg"
                min="1"
                max="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                BMI
              </label>
              <input
                type="text"
                value={
                  formData.height && formData.weight
                    ? (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)
                    : ''
                }
                className="input-field bg-secondary-50"
                placeholder="Auto calculated"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Blood Pressure
              </label>
              <input
                type="text"
                name="vital_signs.bp"
                value={formData.vital_signs.bp}
                onChange={handleChange}
                className="input-field"
                placeholder="120/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Pulse (bpm)
              </label>
              <input
                type="number"
                name="vital_signs.pulse"
                value={formData.vital_signs.pulse}
                onChange={handleChange}
                className="input-field"
                placeholder="72"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Temperature (°F)
              </label>
              <input
                type="number"
                name="vital_signs.temp"
                value={formData.vital_signs.temp}
                onChange={handleChange}
                className="input-field"
                placeholder="98.6"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Respiration (/min)
              </label>
              <input
                type="number"
                name="vital_signs.resp"
                value={formData.vital_signs.resp}
                onChange={handleChange}
                className="input-field"
                placeholder="16"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                SpO2 (%)
              </label>
              <input
                type="number"
                name="vital_signs.spo2"
                value={formData.vital_signs.spo2}
                onChange={handleChange}
                className="input-field"
                placeholder="98"
                min="0"
                max="100"
              />
            </div>
          </div>
        </motion.div>

        {/* Medical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-soft p-6"
        >
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            Medical Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Chief Complaint *
              </label>
              <textarea
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleChange}
                rows="2"
                className={`input-field ${errors.chief_complaint ? 'border-error-500' : ''}`}
                placeholder="Main reason for visit"
              />
              {errors.chief_complaint && (
                <p className="text-error-500 text-sm mt-1">{errors.chief_complaint}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Symptoms
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="2"
                className="input-field"
                placeholder="Describe current symptoms"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Medical History
                </label>
                <textarea
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="Previous medical conditions, surgeries, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Current Medications
                </label>
                <textarea
                  name="current_medications"
                  value={formData.current_medications}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="List current medications"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="2"
                className="input-field"
                placeholder="Known allergies (medications, food, etc.)"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Checking in...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Check-in Patient
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default CheckInPage
