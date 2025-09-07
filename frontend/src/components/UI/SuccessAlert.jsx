import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiX } from 'react-icons/fi'

const SuccessAlert = ({ isOpen, onClose, title, message, user }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white/80 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20"
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <FiCheckCircle className="w-12 h-12 text-white" />
              </div>
              {/* Animated ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute inset-0 border-4 border-white/30 rounded-full"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="text-center">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {title}
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 mb-6"
            >
              {message}
            </motion.p>

            {/* User info */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-sm text-white/70 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex space-x-3"
            >
              <button
                onClick={onClose}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30"
              >
                Continue to Dashboard
              </button>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-white/30 rounded-full backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/20 rounded-full backdrop-blur-sm"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SuccessAlert
