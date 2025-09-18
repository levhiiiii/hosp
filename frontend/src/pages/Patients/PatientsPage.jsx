import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiEye, 
  FiEdit, 
  FiUserPlus,
  FiRefreshCw,
  FiSearch
} from 'react-icons/fi'
import { fetchPatients } from '../../store/slices/patientSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import NoDataAnimation from '../../components/UI/NoDataAnimation'
import patientService from '../../services/patientService'

const PatientsPage = () => {
  const dispatch = useDispatch()
  const { patients, isLoading, pagination } = useSelector((state) => state.patients)
  
  const { user } = useSelector((state) => state.auth)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10
    }
    
    // Only add search if there's a search term
    if (searchTerm.trim()) {
      params.search = searchTerm.trim()
    }
    
    // Debug: Log search parameters
    console.log('🔍 useEffect triggered - Search params:', params);
    console.log('🔍 useEffect triggered - Search term:', searchTerm);
    console.log('🔍 useEffect triggered - Current page:', currentPage);
    
    // Add small delay to prevent rapid requests
    const timeoutId = setTimeout(() => {
      console.log('🔍 Dispatching fetchPatients with params:', params);
      dispatch(fetchPatients(params))
    }, 300) // Increased delay for search
    
    return () => clearTimeout(timeoutId)
  }, [dispatch, currentPage, searchTerm])




  const handleSearch = (e) => {
    const value = e.target.value
    console.log('🔍 Search input changed:', value)
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleRefresh = () => {
    const params = {
      page: currentPage,
      limit: 10
    }
    
    // Only add search if there's a search term
    if (searchTerm.trim()) {
      params.search = searchTerm.trim()
    }
    
    dispatch(fetchPatients(params))
  }

  const clearSearch = () => {
    console.log('🔍 Clearing search')
    setSearchTerm('')
    setCurrentPage(1)
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Patients</h1>
          <p className="text-secondary-600 mt-2">
            Manage and view patient records
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center"
            disabled={isLoading}
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {user?.role === 'receptionist' && (
            <Link to="/check-in" className="btn-primary flex items-center">
              <FiUserPlus className="w-4 h-4 mr-2" />
              Check-in Patient
            </Link>
          )}
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients by name, phone, OPD number..."
              value={searchTerm}
              onChange={handleSearch}
              className="input-field pl-10 pr-10 w-full"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Search Info and Test Button */}
          <div className="flex items-center space-x-4">
            {searchTerm && (
              <div className="text-sm text-secondary-600">
                Searching for: <span className="font-medium text-primary-600">"{searchTerm}"</span>
              </div>
            )}
            <button
              onClick={() => {
                console.log('🧪 Manual search test triggered')
                const params = {
                  page: 1,
                  limit: 10,
                  search: searchTerm.trim()
                }
                console.log('🧪 Manual search params:', params)
                dispatch(fetchPatients(params))
              }}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
            >
              Test Search
            </button>
            <button
              onClick={async () => {
                console.log('🧪 Test search endpoint triggered')
                try {
                  const response = await fetch(`/api/patients/test-search?search=${encodeURIComponent(searchTerm)}`, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  })
                  const data = await response.json()
                  console.log('🧪 Test search endpoint response:', data)
                } catch (error) {
                  console.error('🧪 Test search endpoint error:', error)
                }
              }}
              className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
            >
              Test Endpoint
            </button>
          </div>
        </div>
      </motion.div>

      {/* Patients List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-soft overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading patients..." />
          </div>
        ) : patients.length === 0 ? (
          <NoDataAnimation 
            type={searchTerm ? 'search' : 'patients'}
            message={searchTerm ? 'No patients found matching your search' : 'No patients found'}
            subMessage={searchTerm ? 'Try adjusting your search terms' : 'Start by checking in your first patient'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Sr No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    OPD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {patients.map((patient, index) => {
                  const formattedPatient = patientService.formatPatientData(patient)
                  return (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {patient.patient_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {patient.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {patient.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {patient.opd_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        ₹{patient.fees || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {patient.dressing && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Dressing
                            </span>
                          )}
                          {patient.plaster && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Plaster
                            </span>
                          )}
                          {patient.xray && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              X-Ray
                            </span>
                          )}
                          {!patient.dressing && !patient.plaster && !patient.xray && (
                            <span className="text-xs text-secondary-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/patients/${patient.id}`}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          {user?.role === 'receptionist' && (
                            <button className="text-secondary-600 hover:text-secondary-900 p-1 rounded">
                              <FiEdit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between bg-white rounded-xl shadow-soft p-4"
        >
          <div className="text-sm text-secondary-700">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PatientsPage
