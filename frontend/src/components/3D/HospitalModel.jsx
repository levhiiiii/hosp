import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const HospitalModel = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(false)

  // Try to load the GLB model with error handling
  let scene = null
  try {
    const gltf = useGLTF('/base_basic_shaded.glb')
    scene = gltf.scene
    if (scene && !modelLoaded) {
      setModelLoaded(true)
    }
  } catch (error) {
    console.warn('Failed to load GLB model:', error)
    setModelError(true)
  }

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

  // Add some lighting effects when model is loaded
  useEffect(() => {
    if (scene && modelLoaded) {
      const clonedScene = scene.clone()
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          // Add some emissive glow
          if (child.material) {
            child.material.emissive = new THREE.Color(0x001122)
            child.material.emissiveIntensity = 0.1
          }
        }
      })
    }
  }, [scene, modelLoaded])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Render model if loaded successfully */}
      {scene && modelLoaded && !modelError && (
        <primitive object={scene.clone()} />
      )}
      
      {/* Fallback: Show a simple hospital-like structure if model fails to load */}
      {modelError && (
        <group>
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
        </group>
      )}
      
      {/* Add some ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#4A90E2" />
    </group>
  )
}

// Preload the model with error handling
try {
  useGLTF.preload('/base_basic_shaded.glb')
} catch (error) {
  console.warn('Failed to preload GLB model:', error)
}

export default HospitalModel
