import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUser, 
  FiPhone, 
  FiMapPin,
  FiSave,
  FiArrowLeft,
  FiHash,
  FiFileText,
  FiDollarSign
} from 'react-icons/fi'
import { createPatient } from '../../store/slices/patientSlice'
import patientService from '../../services/patientService'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const CheckInPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(false)
  const [srNo, setSrNo] = useState('')
  const [formData, setFormData] = useState({
    opd: '',
    patient_name: '',
    age: '',
    mobile_number: '',
    address: '',
    reference: '',
    dressing: false,
    plaster: false,
    xray: false,
    fees: ''
  })
  const [errors, setErrors] = useState({})

  // Generate Sr No on component mount
  useEffect(() => {
    const generateSrNo = () => {
      const now = new Date()
      const year = now.getFullYear().toString().slice(-2)
      const month = (now.getMonth() + 1).toString().padStart(2, '0')
      const day = now.getDate().toString().padStart(2, '0')
      const time = now.getTime().toString().slice(-6)
      return `KAH${year}${month}${day}${time}`
    }
    setSrNo(generateSrNo())
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required'
    }
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = 'Valid age is required'
    }
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Mobile number is required'
    }
    if (!formData.fees || formData.fees < 0) {
      newErrors.fees = 'Valid fees amount is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare data for submission
      const patientData = {
        patient_id: srNo,
        full_name: formData.patient_name,
        age: parseInt(formData.age),
        mobile_number: formData.mobile_number,
        address: formData.address,
        opd_number: formData.opd,
        reference: formData.reference,
        dressing: formData.dressing,
        plaster: formData.plaster,
        xray: formData.xray,
        fees: parseFloat(formData.fees)
      }

      await dispatch(createPatient(patientData)).unwrap()
      toast.success('Patient checked in successfully!')
      navigate('/patients')
    } catch (error) {
      toast.error(error.response?.data?.message || error || 'Failed to check in patient')
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
        {/* Patient Check-in Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-soft p-6"
        >
          <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-primary-600" />
            Patient Check-in Form
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sr No - Auto Generated */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiHash className="w-4 h-4 inline mr-1" />
                Sr No (Auto Generated)
              </label>
              <input
                type="text"
                value={srNo}
                className="input-field bg-secondary-50"
                readOnly
              />
            </div>

            {/* OPD */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiFileText className="w-4 h-4 inline mr-1" />
                OPD
              </label>
              <input
                type="text"
                name="opd"
                value={formData.opd}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter OPD number"
              />
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiUser className="w-4 h-4 inline mr-1" />
                Patient Name *
              </label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                className={`input-field ${errors.patient_name ? 'border-error-500' : ''}`}
                placeholder="Enter patient's full name"
              />
              {errors.patient_name && (
                <p className="text-error-500 text-sm mt-1">{errors.patient_name}</p>
              )}
            </div>

            {/* Age */}
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
                placeholder="Enter age"
                min="1"
                max="150"
              />
              {errors.age && (
                <p className="text-error-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiPhone className="w-4 h-4 inline mr-1" />
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                className={`input-field ${errors.mobile_number ? 'border-error-500' : ''}`}
                placeholder="Enter mobile number"
              />
              {errors.mobile_number && (
                <p className="text-error-500 text-sm mt-1">{errors.mobile_number}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiMapPin className="w-4 h-4 inline mr-1" />
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

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Reference
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter reference (if any)"
              />
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiDollarSign className="w-4 h-4 inline mr-1" />
                Fees *
              </label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className={`input-field ${errors.fees ? 'border-error-500' : ''}`}
                placeholder="Enter consultation fees"
                min="0"
                step="0.01"
              />
              {errors.fees && (
                <p className="text-error-500 text-sm mt-1">{errors.fees}</p>
              )}
            </div>
          </div>

          {/* Services Checkboxes */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Services Required</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="dressing"
                  checked={formData.dressing}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">Dressing</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="plaster"
                  checked={formData.plaster}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">Plaster</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="xray"
                  checked={formData.xray}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">X-Ray</span>
              </label>
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
