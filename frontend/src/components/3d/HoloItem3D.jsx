import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ArtifactMesh({ type = 'equipment', name = '' }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.9;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
  });

  // Render procedural geometric shape based on item type and name
  const isSword = name.toLowerCase().includes('sword');
  const isTome = name.toLowerCase().includes('tome');
  const isBoots = name.toLowerCase().includes('boot');
  const isHat = name.toLowerCase().includes('hat') || name.toLowerCase().includes('chip');
  const isTheme = type === 'theme';
  const isBadge = type === 'badge';

  return (
    <group ref={meshRef}>
      {isSword && (
        <group>
          {/* Blade */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.15, 1.4, 0.04]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1.2} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Hilt */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
            <meshStandardMaterial color="#FFE600" emissive="#FFB800" emissiveIntensity={0.6} />
          </mesh>
          {/* Crossguard */}
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.08, 0.1]} />
            <meshStandardMaterial color="#FF007F" />
          </mesh>
        </group>
      )}

      {isTome && (
        <group>
          <mesh>
            <boxGeometry args={[0.9, 1.1, 0.3]} />
            <meshStandardMaterial color="#8B5CF6" emissive="#7C3AED" emissiveIntensity={1} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color="#00FF9D" />
          </mesh>
        </group>
      )}

      {(isHat || isBoots || (!isSword && !isTome && !isTheme && !isBadge)) && (
        <group>
          <mesh>
            <icosahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial color="#00F0FF" emissive="#0080FF" emissiveIntensity={1.4} wireframe />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.35, 0]} />
            <meshBasicMaterial color="#FF007F" />
          </mesh>
        </group>
      )}

      {isTheme && (
        <group>
          <mesh>
            <torusKnotGeometry args={[0.5, 0.14, 64, 16]} />
            <meshStandardMaterial color="#FF007F" emissive="#BD00FF" emissiveIntensity={1.5} roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      )}

      {isBadge && (
        <group>
          <mesh>
            <cylinderGeometry args={[0.65, 0.65, 0.1, 6]} />
            <meshStandardMaterial color="#FFE600" emissive="#FFB800" emissiveIntensity={1.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#FF003C" />
          </mesh>
        </group>
      )}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={2.5} color="#00F0FF" />
    </group>
  );
}

export default function HoloItem3D({ type = 'equipment', name = '', height = "140px" }) {
  return (
    <div style={{ width: '100%', height }} className="relative select-none pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} gl={{ alpha: true }}>
        <ArtifactMesh type={type} name={name} />
      </Canvas>
    </div>
  );
}
