import React, { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/soldier_glb_3.glb')
  const modelRef = useRef()

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return <primitive ref={modelRef} object={scene} scale={1} />
}

const GLBLoader = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading 3D Model...</div>}>
        <Model />
      </Suspense>
    </div>
  )
}

// Preload the model
useGLTF.preload('/soldier_glb_3.glb')

export default GLBLoader
