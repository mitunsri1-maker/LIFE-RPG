import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HologramChamber({ level = 1, username = "HERO", stats = {}, justGainedXP = false, xpPercent = 50 }) {
  const chamberGroupRef = useRef();
  const ringsRef1 = useRef();
  const ringsRef2 = useRef();
  const ringsRef3 = useRef();
  const scanLaserRef = useRef();
  const avatarCoreRef = useRef();
  const orbsGroupRef = useRef();
  const coreRef = useRef();
  const pulseRef = useRef(0);

  // Orbiting particle positions for energy chamber
  const particleCount = 45;
  const particlesPos = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const r = 1.2 + Math.random() * 0.9;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Smooth subtle mouse parallax
    if (chamberGroupRef.current) {
      const targetY = state.mouse.x * 0.4;
      const targetX = -state.mouse.y * 0.25;
      chamberGroupRef.current.rotation.y = THREE.MathUtils.lerp(chamberGroupRef.current.rotation.y, targetY, 0.05);
      chamberGroupRef.current.rotation.x = THREE.MathUtils.lerp(chamberGroupRef.current.rotation.x, targetX, 0.05);
    }

    // Gyroscopic Hologram Ring Rotations
    if (ringsRef1.current) ringsRef1.current.rotation.z += delta * 0.55;
    if (ringsRef2.current) ringsRef2.current.rotation.x += delta * 0.45;
    if (ringsRef3.current) ringsRef3.current.rotation.y -= delta * 0.65;

    // Vertical Laser Scanning Sweep
    if (scanLaserRef.current) {
      scanLaserRef.current.position.y = Math.sin(t * 2.2) * 1.6;
    }

    // Floating breathing motion for center hologram
    if (avatarCoreRef.current) {
      avatarCoreRef.current.position.y = Math.sin(t * 1.6) * 0.1;
      avatarCoreRef.current.rotation.y += delta * 0.35;
    }

    // Orbiting attribute nodes
    if (orbsGroupRef.current) {
      orbsGroupRef.current.rotation.y += delta * 0.5;
    }

    // Reactive XP gain pulse
    if (justGainedXP) pulseRef.current = 1.0;
    pulseRef.current = THREE.MathUtils.lerp(pulseRef.current, 0, Math.min(1, delta * 2.5));

    if (coreRef.current) {
      const scale = 1 + pulseRef.current * 0.4 + Math.sin(t * 3) * 0.05;
      coreRef.current.scale.setScalar(scale);
      if (coreRef.current.material) {
        coreRef.current.material.emissiveIntensity = 2.0 + pulseRef.current * 4.0;
      }
    }
  });

  const attributes = [
    { name: 'STR', color: '#FF3366', pos: [1.8, 0.4, 0] },
    { name: 'INT', color: '#00E5FF', pos: [-1.4, 0.8, 1.2] },
    { name: 'VIT', color: '#39FF88', pos: [0, -0.5, 1.8] },
    { name: 'WIS', color: '#8B5CF6', pos: [-1.6, -0.3, -1.2] },
    { name: 'DIS', color: '#FFB84D', pos: [1.2, 0.8, -1.4] },
  ];

  return (
    <group ref={chamberGroupRef} position={[0, 0, 0]}>
      {/* Base Hexagonal Projection Pedestal (Dark Obsidian Metal) */}
      <mesh position={[0, -1.75, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.3, 6]} />
        <meshStandardMaterial color="#0A1020" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Outer Pedestal Neon Rim */}
      <mesh position={[0, -1.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.2, 32]} />
        <meshBasicMaterial color="#00E5FF" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>

      {/* Central Futuristic Holographic Operative Figure */}
      <group ref={avatarCoreRef} position={[0, 0, 0]}>
        {/* Head / Cyber Visor */}
        <mesh position={[0, 0.95, 0]}>
          <octahedronGeometry args={[0.34, 1]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={1.4}
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Glowing Visor Horizontal Line */}
        <mesh position={[0, 0.95, 0.25]}>
          <boxGeometry args={[0.3, 0.06, 0.08]} />
          <meshBasicMaterial color="#FF2DA6" />
        </mesh>

        {/* Shoulders & Torso / Faceted Cyber Armor */}
        <mesh position={[0, 0.3, 0]}>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#0E172E"
            emissive="#00E5FF"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Inner Reactor Energy Core */}
        <mesh ref={coreRef} position={[0, 0.3, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={2.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Lower Chassis / Floating Energy Conduit */}
        <mesh position={[0, -0.42, 0]}>
          <coneGeometry args={[0.32, 0.65, 5]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.9}
            wireframe
          />
        </mesh>
      </group>

      {/* Gyro Holographic Containment Rings */}
      <mesh ref={ringsRef1}>
        <torusGeometry args={[2.2, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.75} />
      </mesh>
      <mesh ref={ringsRef2}>
        <torusGeometry args={[2.5, 0.014, 16, 64]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringsRef3}>
        <torusGeometry args={[2.8, 0.012, 16, 64]} />
        <meshBasicMaterial color="#FF2DA6" transparent opacity={0.5} />
      </mesh>

      {/* Scanning Laser Disc */}
      <mesh ref={scanLaserRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 2.5, 32]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting 5 Attribute Crystals */}
      <group ref={orbsGroupRef}>
        {attributes.map((attr, idx) => (
          <mesh key={idx} position={attr.pos}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color={attr.color}
              emissive={attr.color}
              emissiveIntensity={2.2}
            />
          </mesh>
        ))}
      </group>

      {/* Holographic Particle Field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlesPos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#00E5FF" transparent opacity={0.65} />
      </points>

      {/* Atmospheric Pod Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 2, 2]} intensity={3.0} color="#00E5FF" distance={7} />
      <pointLight position={[0, -1, -2]} intensity={2.0} color="#8B5CF6" distance={7} />
    </group>
  );
}

export default function PlayerPod3D({
  level = 1,
  username = "HERO",
  stats = {},
  justGainedXP = false,
  xpPercent = 50,
  height = "320px"
}) {
  return (
    <div style={{ width: '100%', height }} className="relative select-none">
      <Canvas
        camera={{ position: [0, 0.5, 5.4], fov: 44 }}
        gl={{ alpha: true, antialias: true }}
      >
        <HologramChamber
          level={level}
          username={username}
          stats={stats}
          justGainedXP={justGainedXP}
          xpPercent={xpPercent}
        />
      </Canvas>
      {/* Tech Corner Overlays */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-cyber-cyan font-bold tracking-widest city-glass px-2.5 py-0.5 rounded border border-cyber-cyan/35 shadow-cyber-sm">
        OPERATIVE POD // ONLINE
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyber-green font-bold tracking-widest city-glass px-2.5 py-0.5 rounded border border-cyber-green/35 shadow-cyber-sm">
        MATRIX RESONANCE // 100%
      </div>
    </div>
  );
}
