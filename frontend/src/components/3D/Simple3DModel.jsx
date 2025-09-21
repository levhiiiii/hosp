import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Simple3DModel = () => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#4A90E2" />
    </mesh>
  )
}

export default Simple3DModel
