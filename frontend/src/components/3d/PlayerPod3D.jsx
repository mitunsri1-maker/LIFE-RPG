import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HologramChamber({ level = 1, username = "HERO", stats = {} }) {
  const ringsRef1 = useRef();
  const ringsRef2 = useRef();
  const ringsRef3 = useRef();
  const scanLaserRef = useRef();
  const avatarCoreRef = useRef();
  const orbsGroupRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Gyroscopic Hologram Ring Rotations
    if (ringsRef1.current) ringsRef1.current.rotation.z += delta * 0.55;
    if (ringsRef2.current) ringsRef2.current.rotation.x += delta * 0.45;
    if (ringsRef3.current) ringsRef3.current.rotation.y -= delta * 0.65;

    // Vertical Laser Scanning Sweep
    if (scanLaserRef.current) {
      scanLaserRef.current.position.y = Math.sin(t * 2.2) * 1.7;
    }

    // Floating breathing motion for center hologram
    if (avatarCoreRef.current) {
      avatarCoreRef.current.position.y = Math.sin(t * 1.6) * 0.12;
      avatarCoreRef.current.rotation.y += delta * 0.35;
    }

    // Orbiting attribute nodes
    if (orbsGroupRef.current) {
      orbsGroupRef.current.rotation.y += delta * 0.5;
    }
  });

  const attributes = [
    { name: 'STR', color: '#FF3366', pos: [1.9, 0.4, 0] },
    { name: 'INT', color: '#00F0FF', pos: [-1.5, 0.8, 1.3] },
    { name: 'VIT', color: '#00FF9D', pos: [0, -0.6, 1.9] },
    { name: 'WIS', color: '#8B5CF6', pos: [-1.7, -0.4, -1.3] },
    { name: 'DIS', color: '#FFB800', pos: [1.3, 0.9, -1.5] },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Base Hexagonal Projection Pedestal (White/Silver Daylight Finish) */}
      <mesh position={[0, -1.85, 0]}>
        <cylinderGeometry args={[2.3, 2.6, 0.35, 6]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Glowing Energy Ring on Pedestal */}
      <mesh position={[0, -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 2.2, 32]} />
        <meshBasicMaterial color="#00B4D8" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>

      {/* Central Futuristic Holographic Operative Figure */}
      <group ref={avatarCoreRef} position={[0, 0, 0]}>
        {/* Head / Cyber Visor */}
        <mesh position={[0, 1.05, 0]}>
          <octahedronGeometry args={[0.38, 1]} />
          <meshStandardMaterial
            color="#0284C7"
            emissive="#00B4D8"
            emissiveIntensity={1.2}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Glowing Visor Light */}
        <mesh position={[0, 1.05, 0.28]}>
          <boxGeometry args={[0.32, 0.08, 0.1]} />
          <meshBasicMaterial color="#E11D48" />
        </mesh>

        {/* Shoulders & Torso / Faceted Cyber Armor */}
        <mesh position={[0, 0.35, 0]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#0284C7"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>

        {/* Inner Spark Energy Core */}
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>

        {/* Lower Chassis / Floating Energy Conduit */}
        <mesh position={[0, -0.45, 0]}>
          <coneGeometry args={[0.35, 0.7, 5]} />
          <meshStandardMaterial
            color="#00B4D8"
            emissive="#00B4D8"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>
      </group>

      {/* Gyro Holographic Containment Rings */}
      <mesh ref={ringsRef1}>
        <torusGeometry args={[2.4, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.65} />
      </mesh>
      <mesh ref={ringsRef2}>
        <torusGeometry args={[2.7, 0.015, 16, 64]} />
        <meshBasicMaterial color="#9333EA" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ringsRef3}>
        <torusGeometry args={[3.0, 0.012, 16, 64]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.4} />
      </mesh>

      {/* Scanning Laser Disc */}
      <mesh ref={scanLaserRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 2.7, 32]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting 5 Attribute Crystals */}
      <group ref={orbsGroupRef}>
        {attributes.map((attr, idx) => (
          <mesh key={idx} position={attr.pos}>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              color={attr.color}
              emissive={attr.color}
              emissiveIntensity={1.8}
            />
          </mesh>
        ))}
      </group>

      {/* Lighting */}
      <ambientLight intensity={1.1} />
      <pointLight position={[0, 2.5, 2.5]} intensity={2.5} color="#00B4D8" distance={8} />
      <pointLight position={[0, -1, -2.5]} intensity={1.8} color="#9333EA" distance={8} />
    </group>
  );
}

export default function PlayerPod3D({ level = 1, username = "HERO", stats = {}, height = "320px" }) {
  return (
    <div style={{ width: '100%', height }} className="relative select-none">
      <Canvas
        camera={{ position: [0, 0.6, 5.8], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <HologramChamber level={level} username={username} stats={stats} />
      </Canvas>
      {/* Tech Corner Overlays */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-cyber-cyan font-bold tracking-widest city-glass px-2.5 py-0.5 rounded border border-cyber-cyan/35 shadow-cyber-sm">
        POD // V4.2 ACTIVE
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyber-green font-bold tracking-widest city-glass px-2.5 py-0.5 rounded border border-cyber-green/35 shadow-cyber-sm">
        RESONANCE: 100%
      </div>
    </div>
  );
}
