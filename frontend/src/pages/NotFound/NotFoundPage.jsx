import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft } from 'react-icons/fi'
import { MdLocalHospital } from 'react-icons/md'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Hospital Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mb-8"
        >
          <MdLocalHospital className="w-10 h-10 text-white" />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold text-primary-600 mb-4"
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold text-secondary-900 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-secondary-600 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or return to the dashboard.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Link
            to="/dashboard"
            className="btn-primary w-full flex items-center justify-center"
          >
            <FiHome className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </motion.div>

        {/* Hospital Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-secondary-500">
            {import.meta.env.VITE_HOSPITAL_NAME}
          </p>
          <p className="text-xs text-secondary-400 mt-1">
            Management System
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
