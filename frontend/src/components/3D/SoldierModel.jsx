import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const SoldierModel = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()

  // Load the soldier GLB model
  const { scene } = useGLTF('/soldier_glb_3.glb')

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

  // Clone the scene to avoid conflicts
  const clonedScene = scene.clone()

  // Add some lighting effects
  useEffect(() => {
    if (clonedScene) {
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
  }, [clonedScene])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Preload the soldier model
useGLTF.preload('/soldier_glb_3.glb')

export default SoldierModel
