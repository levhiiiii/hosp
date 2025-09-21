import React from 'react'
import { Canvas } from '@react-three/fiber'
import Minimal3D from './Minimal3D'

const MinimalScene = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3] }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <Minimal3D />
      </Canvas>
    </div>
  )
}

export default MinimalScene
