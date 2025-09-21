import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const BasicHospitalModel = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()

  // Simple animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Simple hospital building */}
      <mesh>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Simple roof */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[1.5, 0.8, 4]} />
        <meshStandardMaterial color="#2C5AA0" />
      </mesh>
      
      {/* Simple cross */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}

export default BasicHospitalModel
