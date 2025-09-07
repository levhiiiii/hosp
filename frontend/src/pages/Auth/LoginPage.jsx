import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdLocalHospital } from 'react-icons/md'
import { loginUser, clearError } from '../../store/slices/authSlice'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import SuccessAlert from '../../components/UI/SuccessAlert'
import toast from 'react-hot-toast'
import bgImage from '../../assets/bg.jpeg'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'receptionist'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError())
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoginInProgress(true)
    
    try {
      const result = await dispatch(loginUser(formData)).unwrap()
      
      // Handle different response structures
      const userData = result.data?.user || result.user
      
      // Show alert first, then handle Redux state
      setLoggedInUser(userData)
      setShowSuccessAlert(true)
    } catch (error) {
      toast.error(error || 'Login failed')
      setIsLoginInProgress(false)
    }
  }

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false)
    setIsLoginInProgress(false)
    
    // Navigate after alert is closed
    setTimeout(() => {
      navigate(from, { replace: true })
    }, 500)
  }

  // Redirect if already authenticated (but not during login process)
  const { isAuthenticated } = useSelector((state) => state.auth)
  useEffect(() => {
    // Auto redirect if already authenticated and not in login process
    if (isAuthenticated && !isLoginInProgress && !showSuccessAlert) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, isLoginInProgress, showSuccessAlert, navigate, from])

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay with Blur Effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Glassmorphism Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-white/30"
          >
            <MdLocalHospital className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            Kale Accident Hospital
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-white/80"
          >
            Management System Login
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-1 text-xs text-white/60"
          >
            Healthcare Excellence Since 2024
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['receptionist', 'doctor'].map((role) => (
                  <label
                    key={role}
                    className={`
                      relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all backdrop-blur-sm
                      ${formData.role === role
                        ? 'border-white/50 bg-white/20 text-white shadow-lg'
                        : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/15 hover:border-white/40'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium capitalize">
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-white/60" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium hover:bg-white/30 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

          </form>

        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <p className="text-xs text-white/60">
            © 2024 Kale Accident Hospital. All rights reserved.
          </p>
        </motion.div>
      </motion.div>

      {/* Success Alert */}
        <SuccessAlert
          isOpen={showSuccessAlert}
          onClose={handleSuccessAlertClose}
          title="Welcome Back!"
          message="You have successfully logged in to the hospital management system."
          user={loggedInUser}
        />
    </div>
  )
}

export default LoginPage
