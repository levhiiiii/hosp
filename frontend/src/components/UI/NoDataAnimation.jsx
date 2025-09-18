import React from 'react'
import { motion } from 'framer-motion'
import { FiInbox, FiSearch, FiCalendar } from 'react-icons/fi'

const NoDataAnimation = ({ 
  type = 'patients', 
  message = 'No data found', 
  subMessage = 'Try adjusting your filters or search terms',
  icon: CustomIcon = FiInbox 
}) => {
  const getTypeSpecificContent = () => {
    switch (type) {
      case 'patients':
        return {
          icon: FiInbox,
          message: 'No patients found',
          subMessage: 'Try adjusting your filters or search terms',
          color: 'text-blue-500'
        }
      case 'search':
        return {
          icon: FiSearch,
          message: 'No search results',
          subMessage: 'Try different search terms or clear filters',
          color: 'text-gray-500'
        }
      case 'date':
        return {
          icon: FiCalendar,
          message: 'No data for selected date',
          subMessage: 'Try selecting a different date range',
          color: 'text-orange-500'
        }
      default:
        return {
          icon: CustomIcon,
          message,
          subMessage,
          color: 'text-gray-500'
        }
    }
  }

  const content = getTypeSpecificContent()
  const IconComponent = content.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.2, 
          type: "spring", 
          stiffness: 200, 
          damping: 15 
        }}
        className="relative mb-6"
      >
        <div className={`w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center ${content.color}`}>
          <IconComponent className="w-12 h-12" />
        </div>
        
        {/* Floating dots animation */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full"
        />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {content.message}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {content.subMessage}
        </p>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex space-x-2"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -5, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-gray-300 rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export default NoDataAnimation
