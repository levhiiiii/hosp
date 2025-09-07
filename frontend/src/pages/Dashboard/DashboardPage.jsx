import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUsers, 
  FiUserPlus, 
  FiActivity, 
  FiClock,
  FiTrendingUp,
  FiLogOut
} from 'react-icons/fi'
import { fetchDashboardStats } from '../../store/slices/patientSlice'
import { logoutUser } from '../../store/slices/authSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'
import hospitalConfig from '../../config/hospital'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { stats, isLoading } = useSelector((state) => state.patients)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const statsCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients || 0,
      icon: FiUsers,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700'
    },
    {
      title: 'Today\'s Patients',
      value: stats.todayPatients || 0,
      icon: FiUserPlus,
      color: 'bg-success-500',
      bgColor: 'bg-success-50',
      textColor: 'text-success-700'
    },
    {
      title: 'Checked In',
      value: stats.checkedInPatients || 0,
      icon: FiClock,
      color: 'bg-warning-500',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-700'
    },
    {
      title: 'In Consultation',
      value: stats.inConsultationPatients || 0,
      icon: FiActivity,
      color: 'bg-error-500',
      bgColor: 'bg-error-50',
      textColor: 'text-error-700'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-secondary-600 mt-2">
            Here's what's happening at {hospitalConfig.name} today.
          </p>
        </div>
        
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-error-50 text-error-600 rounded-lg hover:bg-error-100 transition-colors border border-error-200"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-xl p-6 border border-opacity-20`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'receptionist' && (
            <motion.a
              href="/check-in"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-4 bg-primary-50 rounded-lg border border-primary-200 hover:bg-primary-100 transition-colors"
            >
              <FiUserPlus className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <h3 className="font-medium text-primary-900">Check-in Patient</h3>
                <p className="text-sm text-primary-600">Register new patient</p>
              </div>
            </motion.a>
          )}
          
          <motion.a
            href="/patients"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-success-50 rounded-lg border border-success-200 hover:bg-success-100 transition-colors"
          >
            <FiUsers className="w-8 h-8 text-success-600 mr-4" />
            <div>
              <h3 className="font-medium text-success-900">View Patients</h3>
              <p className="text-sm text-success-600">Manage patient records</p>
            </div>
          </motion.a>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-warning-50 rounded-lg border border-warning-200 hover:bg-warning-100 transition-colors cursor-pointer"
          >
            <FiTrendingUp className="w-8 h-8 text-warning-600 mr-4" />
            <div>
              <h3 className="font-medium text-warning-900">Reports</h3>
              <p className="text-sm text-warning-600">View analytics</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Hospital Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Hospital Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Contact Details</h3>
            <p className="text-secondary-600 text-sm">
              {hospitalConfig.address.street}<br />
              {hospitalConfig.address.city}<br />
              {hospitalConfig.address.state}<br />
              Phone: {hospitalConfig.address.phone}<br />
              Email: {hospitalConfig.address.email}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Primary Doctor</h3>
            <p className="text-secondary-600 text-sm">
              {hospitalConfig.primaryDoctor.name}<br />
              {hospitalConfig.primaryDoctor.title}<br />
              Phone: {hospitalConfig.primaryDoctor.phone}<br />
              Email: {hospitalConfig.primaryDoctor.email}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Operating Hours</h3>
            <p className="text-secondary-600 text-sm">
              <strong>Weekdays:</strong> {hospitalConfig.hours.weekdays}<br />
              <strong>Weekends:</strong> {hospitalConfig.hours.weekends}<br />
              <strong>Emergency:</strong> {hospitalConfig.hours.emergency}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
