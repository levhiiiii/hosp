import React from 'react'
import { Canvas } from '@react-three/fiber'
import GLBLoader from './GLBLoader'

const GLBScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <GLBLoader />
      </Canvas>
    </div>
  )
}

export default GLBScene
