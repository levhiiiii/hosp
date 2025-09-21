import React from 'react'
import { motion } from 'framer-motion'
import { MdLocalHospital } from 'react-icons/md'

const StaticPlaceholder = ({ className = "" }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div className="text-center">
        {/* Large Hospital Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <MdLocalHospital className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>
        
        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white text-2xl font-bold mb-2"
        >
          Hospital 3D Model
        </motion.h3>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/70 text-sm"
        >
          Interactive 3D visualization
        </motion.p>
        
        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6"
        >
          <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-300 text-sm font-medium">3D Model Ready</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StaticPlaceholder
