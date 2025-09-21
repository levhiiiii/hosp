import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const SimpleHospitalModel = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()

  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
      
      // Gentle floating motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main building */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial color="#4A90E2" emissive="#001122" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[1.5, 0.8, 4]} />
        <meshStandardMaterial color="#2C5AA0" emissive="#001122" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Cross on top */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-0.6, 0.3, 0.51]}>
        <boxGeometry args={[0.3, 0.4, 0.02]} />
        <meshStandardMaterial color="#87CEEB" emissive="#001133" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.6, 0.3, 0.51]}>
        <boxGeometry args={[0.3, 0.4, 0.02]} />
        <meshStandardMaterial color="#87CEEB" emissive="#001133" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, -0.3, 0.51]}>
        <boxGeometry args={[0.4, 0.6, 0.02]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  )
}

export default SimpleHospitalModel
