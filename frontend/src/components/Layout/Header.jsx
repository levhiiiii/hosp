import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiBell, 
  FiLogOut, 
  FiUser, 
  FiSettings,
  FiMenu
} from 'react-icons/fi'
import { MdLocalHospital } from 'react-icons/md'
import { logoutUser } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'
import toast from 'react-hot-toast'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { sidebarOpen } = useSelector((state) => state.ui)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <header className="bg-white shadow-soft border-b border-secondary-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <FiMenu className="w-5 h-5 text-secondary-600" />
          </button>

          {/* Hospital Info */}
          <div className="flex items-center space-x-3">
            <MdLocalHospital className="w-6 h-6 text-primary-600" />
            <div>
              <h1 className="text-lg font-semibold text-secondary-900">
                {import.meta.env.VITE_HOSPITAL_NAME}
              </h1>
              <p className="text-xs text-secondary-500">
                {import.meta.env.VITE_HOSPITAL_ADDRESS}
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Current Time */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-sm font-medium text-secondary-900">
              {getCurrentTime()}
            </p>
            <p className="text-xs text-secondary-500">
              Doctor: {import.meta.env.VITE_DOCTOR_NAME}
            </p>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary-100 transition-colors">
            <FiBell className="w-5 h-5 text-secondary-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-secondary-500 capitalize">
                  {user?.role || 'Role'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors">
                  <FiUser className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors">
                  <FiSettings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                <hr className="my-2 border-secondary-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                >
                  <FiLogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
