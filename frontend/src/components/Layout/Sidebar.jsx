import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  FiHome, 
  FiUsers, 
  FiUserPlus, 
  FiActivity,
  FiMenu,
  FiX,
  FiLogOut
} from 'react-icons/fi'
import { MdLocalHospital } from 'react-icons/md'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { logoutUser } from '../../store/slices/authSlice'
import authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const { user } = useSelector((state) => state.auth)


  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
      roles: ['doctor', 'receptionist']
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: FiUsers,
      roles: ['doctor', 'receptionist']
    },
    {
      name: 'Check-in Patient',
      href: '/check-in',
      icon: FiUserPlus,
      roles: ['receptionist']
    },
  ]

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(user?.role)
  )

  const sidebarVariants = {
    open: { width: '16rem' },
    closed: { width: '4rem' }
  }

  const linkVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  }

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-white shadow-strong border-r border-secondary-200 z-30"
      variants={sidebarVariants}
      animate={sidebarOpen ? 'open' : 'closed'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      initial={false}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center border-b border-secondary-200 ${
          sidebarOpen ? 'justify-between p-4' : 'justify-center p-2'
        }`}>
          <motion.div
            className="flex items-center space-x-3"
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex-shrink-0">
              <MdLocalHospital className="w-8 h-8 text-primary-600" />
            </div>
            {sidebarOpen && (
              <motion.div
                variants={linkVariants}
                animate={sidebarOpen ? 'open' : 'closed'}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <h1 className="text-lg font-bold text-secondary-900">
                  Kale Hospital
                </h1>
                <p className="text-xs text-secondary-500">
                  Management System
                </p>
              </motion.div>
            )}
          </motion.div>
          
          <button
            onClick={() => dispatch(toggleSidebar())}
            className={`p-1 rounded-lg hover:bg-secondary-100 transition-colors ${
              !sidebarOpen ? 'absolute top-2 right-2' : ''
            }`}
          >
            {sidebarOpen ? (
              <FiX className="w-5 h-5 text-secondary-600" />
            ) : (
              <FiMenu className="w-5 h-5 text-secondary-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-2 ${
          sidebarOpen ? 'px-4' : 'px-2'
        }`}>
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  flex items-center rounded-lg transition-all duration-200
                  ${sidebarOpen ? 'px-3 py-2' : 'justify-center p-2'}
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                    : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                  }
                `}
                title={!sidebarOpen ? item.name : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-primary-600' : 'text-secondary-500'
                }`} />
                
                {sidebarOpen && (
                  <motion.span
                    variants={linkVariants}
                    animate={sidebarOpen ? 'open' : 'closed'}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="ml-3 font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User Info */}
        <div className={`border-t border-secondary-200 ${
          sidebarOpen ? 'p-4' : 'p-2'
        }`}>
          <div className={`flex items-center ${
            sidebarOpen ? 'space-x-3' : 'justify-center'
          }`}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            
            {sidebarOpen && (
              <motion.div
                variants={linkVariants}
                animate={sidebarOpen ? 'open' : 'closed'}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-secondary-900 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-secondary-500 capitalize">
                  {user?.role || 'Role'}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className={`border-t border-secondary-200 ${
          sidebarOpen ? 'p-4' : 'p-2'
        }`}>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors ${
              sidebarOpen ? 'px-3 py-2' : 'justify-center p-2'
            }`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                variants={linkVariants}
                animate={sidebarOpen ? 'open' : 'closed'}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="ml-3 font-medium"
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar
