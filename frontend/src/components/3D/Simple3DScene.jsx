import React from 'react'
import { Canvas } from '@react-three/fiber'
import Simple3DModel from './Simple3DModel'

const Simple3DScene = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3] }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Simple3DModel />
      </Canvas>
    </div>
  )
}

export default Simple3DScene
