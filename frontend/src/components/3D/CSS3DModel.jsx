import React from 'react'
import { motion } from 'framer-motion'

const CSS3DModel = () => {
  return (
    <div className="w-full h-full flex items-center justify-center perspective-1000">
      {/* 3D Container */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="relative w-64 h-64 transform-style-preserve-3d"
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-2xl transform translateZ-32 flex items-center justify-center border-2 border-blue-300">
          <div className="text-white text-4xl font-bold">🏥</div>
        </div>
        
        {/* Back Face */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-2xl transform translateZ-32 rotateY-180 flex items-center justify-center border-2 border-blue-300">
          <div className="text-white text-4xl font-bold">🏥</div>
        </div>
        
        {/* Right Face */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-2xl transform rotateY-90 translateZ-32 flex items-center justify-center border-2 border-blue-300">
          <div className="text-white text-4xl font-bold">🏥</div>
        </div>
        
        {/* Left Face */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-2xl transform rotateY-270 translateZ-32 flex items-center justify-center border-2 border-blue-300">
          <div className="text-white text-4xl font-bold">🏥</div>
        </div>
        
        {/* Top Face */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-300 to-blue-500 rounded-lg shadow-2xl transform rotateX-90 translateZ-32 flex items-center justify-center border-2 border-blue-300">
          <div className="text-white text-4xl font-bold">🏥</div>
        </div>
        
        {/* Bottom Face */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-2xl transform rotateX-90 translateZ-32 flex items-center justify-center border-2 border-blue-300">
          <div className="text-white text-4xl font-bold">🏥</div>
        </div>
      </motion.div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default CSS3DModel
