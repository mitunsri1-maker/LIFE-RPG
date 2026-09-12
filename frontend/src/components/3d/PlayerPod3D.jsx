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
    if (ringsRef1.current) ringsRef1.current.rotation.z += delta * 0.5;
    if (ringsRef2.current) ringsRef2.current.rotation.x += delta * 0.4;
    if (ringsRef3.current) ringsRef3.current.rotation.y -= delta * 0.6;

    // Vertical Laser Scanning Sweep
    if (scanLaserRef.current) {
      scanLaserRef.current.position.y = Math.sin(t * 2) * 1.6;
    }

    // Floating breathing motion for center hologram
    if (avatarCoreRef.current) {
      avatarCoreRef.current.position.y = Math.sin(t * 1.5) * 0.1;
      avatarCoreRef.current.rotation.y += delta * 0.3;
    }

    // Orbiting attribute nodes
    if (orbsGroupRef.current) {
      orbsGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  const attributes = [
    { name: 'STR', color: '#FF003C', pos: [1.8, 0.4, 0] },
    { name: 'INT', color: '#00F0FF', pos: [-1.4, 0.8, 1.2] },
    { name: 'VIT', color: '#00FF9D', pos: [0, -0.6, 1.8] },
    { name: 'WIS', color: '#BD00FF', pos: [-1.6, -0.4, -1.2] },
    { name: 'DIS', color: '#FFE600', pos: [1.2, 0.9, -1.4] },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Base Holographic Projection Pedestal */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.3, 32]} />
        <meshStandardMaterial color="#0E172F" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glowing Energy Ring on Pedestal */}
      <mesh position={[0, -1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 2.1, 32]} />
        <meshBasicMaterial color="#00F0FF" side={THREE.DoubleSide} />
      </mesh>

      {/* Central Holographic Avatar Figure */}
      <group ref={avatarCoreRef} position={[0, 0, 0]}>
        {/* Head */}
        <mesh position={[0, 0.9, 0]}>
          <octahedronGeometry args={[0.38, 1]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={1.2}
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Torso / Cyber Armor */}
        <mesh position={[0, 0.2, 0]}>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#7C3AED"
            emissive="#7C3AED"
            emissiveIntensity={0.8}
            wireframe={false}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Inner Spark Core */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#00FF9D" />
        </mesh>
      </group>

      {/* Gyro Holographic Containment Rings */}
      <mesh ref={ringsRef1}>
        <torusGeometry args={[2.4, 0.02, 16, 64]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringsRef2}>
        <torusGeometry args={[2.7, 0.02, 16, 64]} />
        <meshBasicMaterial color="#BD00FF" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringsRef3}>
        <torusGeometry args={[3.0, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00FF9D" transparent opacity={0.3} />
      </mesh>

      {/* Scanning Laser Disc */}
      <mesh ref={scanLaserRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 2.6, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting 5 Attribute Crystals */}
      <group ref={orbsGroupRef}>
        {attributes.map((attr, idx) => (
          <mesh key={idx} position={attr.pos}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color={attr.color}
              emissive={attr.color}
              emissiveIntensity={2}
            />
          </mesh>
        ))}
      </group>

      {/* Lights */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 2]} intensity={3} color="#00F0FF" distance={6} />
      <pointLight position={[0, -1, -2]} intensity={2} color="#BD00FF" distance={6} />
    </group>
  );
}

export default function PlayerPod3D({ level = 1, username = "HERO", stats = {}, height = "320px" }) {
  return (
    <div style={{ width: '100%', height }} className="relative select-none">
      <Canvas
        camera={{ position: [0, 0.5, 5.8], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <HologramChamber level={level} username={username} stats={stats} />
      </Canvas>
      {/* Tech Corner Overlays */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-cyber-cyan font-bold tracking-widest bg-cyber-panel/80 px-2 py-0.5 rounded border border-cyber-cyan/30">
        POD // V4.2 ACTIVE
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyber-green font-bold tracking-widest bg-cyber-panel/80 px-2 py-0.5 rounded border border-cyber-green/30">
        RESONANCE: 100%
      </div>
    </div>
  );
}
