import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiUserPlus,
  FiRefreshCw
} from 'react-icons/fi'
import { fetchPatients } from '../../store/slices/patientSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import patientService from '../../services/patientService'

const PatientsPage = () => {
  const dispatch = useDispatch()
  const { patients, isLoading, pagination } = useSelector((state) => state.patients)
  const { user } = useSelector((state) => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }
    dispatch(fetchPatients(params))
  }, [dispatch, currentPage, searchTerm, statusFilter])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }
    dispatch(fetchPatients(params))
  }

  const statusOptions = [
    { value: 'all', label: 'All Patients', color: 'bg-secondary-100 text-secondary-800' },
    { value: 'checked_in', label: 'Checked In', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_consultation', label: 'In Consultation', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'discharged', label: 'Discharged', color: 'bg-gray-100 text-gray-800' }
  ]

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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearch}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusFilter(option.value)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${statusFilter === option.value
                    ? option.color
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
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
          <div className="text-center py-12">
            <FiUserPlus className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No patients found
            </h3>
            <p className="text-secondary-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by checking in your first patient'
              }
            </p>
            {user?.role === 'receptionist' && (
              <Link to="/check-in" className="btn-primary">
                Check-in Patient
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Age/Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Check-in Time
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
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            {patient.full_name}
                          </div>
                          <div className="text-sm text-secondary-500">
                            ID: {patient.patient_id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {formattedPatient.age} • {formattedPatient.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${formattedPatient.statusColor}`}>
                          {formattedPatient.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {new Date(patient.created_at).toLocaleString()}
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
