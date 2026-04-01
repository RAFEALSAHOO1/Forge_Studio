import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useCustomizationStore } from '@/stores/customizationStore';

export default function CustomizeScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { customizations } = useCustomizationStore();
  
  // Create a material that responds to customization colors
  const primaryColor = customizations.colors['primary'] || '#ffffff';
  const secondaryColor = customizations.colors['secondary'] || '#222222';
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <spotLight position={[-5, 5, -5]} intensity={0.5} color={primaryColor} />
      <Environment preset="studio" />
      
      <Center>
        <mesh ref={meshRef} castShadow receiveShadow>
          {/* A generic complex shape to serve as the template model */}
          <icosahedronGeometry args={[2, 1]} />
          <meshPhysicalMaterial 
            color={primaryColor}
            emissive={secondaryColor}
            emissiveIntensity={0.2}
            metalness={0.5}
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Center>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}
