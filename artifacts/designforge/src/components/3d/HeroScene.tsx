import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function HeroScene() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#6366f1" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />
      
      <group ref={group}>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[0, 0, 0]}>
            <torusKnotGeometry args={[2, 0.6, 128, 32]} />
            <MeshDistortMaterial 
              color="#6d28d9" 
              envMapIntensity={1} 
              clearcoat={1} 
              clearcoatRoughness={0.1} 
              metalness={0.8} 
              roughness={0.2} 
              distort={0.3} 
              speed={2} 
            />
          </mesh>
        </Float>
        
        <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
          <mesh position={[-4, 2, -2]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="#4f46e5" metalness={0.9} roughness={0.1} />
          </mesh>
        </Float>
        
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
          <mesh position={[4, -2, 1]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#c026d3" metalness={0.7} roughness={0.2} wireframe />
          </mesh>
        </Float>
      </group>
    </>
  );
}
