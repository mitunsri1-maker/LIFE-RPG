import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Cyberpunk City with Instanced Buildings & Dynamic World Evolution
function CyberCity({ level = 1 }) {
  const meshRef = useRef();
  const windowsRef = useRef();
  const trafficRef = useRef();
  const particlesRef = useRef();

  // Scale city complexity and height with Player Level
  const buildingCount = Math.min(120, 40 + level * 4);
  const citySpread = 70;

  // Generate building matrices
  const { buildingData, windowData } = useMemo(() => {
    const buildings = [];
    const windows = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2 + (Math.random() * 0.2);
      const dist = 12 + Math.random() * citySpread;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist - 15;
      
      // Buildings get taller as player levels up (World Evolution)
      const heightBonus = Math.min(30, level * 1.5);
      const height = 8 + Math.random() * (24 + heightBonus);
      const width = 2.5 + Math.random() * 3.5;
      const depth = 2.5 + Math.random() * 3.5;
      const y = height / 2 - 12;

      dummy.position.set(x, y, z);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = Math.random() * 0.4;
      dummy.updateMatrix();
      buildings.push(dummy.matrix.clone());

      // Cyberpunk glowing window stripes
      if (Math.random() > 0.3) {
        dummy.position.set(x, y + (Math.random() - 0.5) * (height * 0.6), z + depth * 0.51);
        dummy.scale.set(width * 0.8, 0.4 + Math.random() * 0.6, 0.1);
        dummy.updateMatrix();
        windows.push(dummy.matrix.clone());
      }
    }
    return { buildingData: buildings, windowData: windows };
  }, [buildingCount, level]);

  // Flying Sky Traffic / Cyber Drones
  const trafficCount = 18;
  const trafficInitial = useMemo(() => {
    return Array.from({ length: trafficCount }, () => ({
      x: (Math.random() - 0.5) * 80,
      y: 2 + Math.random() * 18,
      z: -10 - Math.random() * 40,
      speed: 0.15 + Math.random() * 0.35,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.6 ? '#00F0FF' : Math.random() > 0.3 ? '#FF007F' : '#FFE600'
    }));
  }, [trafficCount]);

  // Atmospheric Cyber Dust Particles
  const particleCount = 150;
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = -10 + Math.random() * 35;
      arr[i * 3 + 2] = -5 - Math.random() * 50;
    }
    return arr;
  }, [particleCount]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    // Slow atmospheric floating of particles
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += delta * 1.2;
        if (pos[i * 3 + 1] > 25) pos[i * 3 + 1] = -10;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Move traffic vehicles
    if (trafficRef.current) {
      trafficRef.current.children.forEach((child, i) => {
        const tr = trafficInitial[i];
        if (tr) {
          child.position.x += tr.speed * tr.direction;
          if (child.position.x > 45) child.position.x = -45;
          if (child.position.x < -45) child.position.x = 45;
        }
      });
    }
  });

  return (
    <group>
      {/* Fog for Atmospheric Cyberpunk Depth */}
      <fog attach="fog" args={['#05070E', 15, 75]} />

      {/* Instanced Dark Obsidian Skyscraper Geometry */}
      <instancedMesh
        ref={meshRef}
        args={[null, null, buildingData.length]}
        onUpdate={(self) => {
          buildingData.forEach((mat, i) => self.setMatrixAt(i, mat));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#0B1120"
          roughness={0.8}
          metalness={0.9}
        />
      </instancedMesh>

      {/* Glowing Cyberpunk Windows / Neon Signs */}
      <instancedMesh
        ref={windowsRef}
        args={[null, null, windowData.length]}
        onUpdate={(self) => {
          windowData.forEach((mat, i) => self.setMatrixAt(i, mat));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.85}
        />
      </instancedMesh>

      {/* Floating Sky Vehicles */}
      <group ref={trafficRef}>
        {trafficInitial.map((tr, i) => (
          <mesh key={i} position={[tr.x, tr.y, tr.z]}>
            <boxGeometry args={[0.8, 0.15, 0.3]} />
            <meshBasicMaterial color={tr.color} />
          </mesh>
        ))}
      </group>

      {/* Atmospheric Energy Dust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#00F0FF"
          transparent
          opacity={0.6}
        />
      </points>

      {/* Cyber Grid Floor */}
      <gridHelper
        args={[100, 50, '#00F0FF', '#BD00FF']}
        position={[0, -12, -15]}
      />

      {/* Cyber City Ambient & Neon Point Lights */}
      <ambientLight intensity={0.4} color="#0E172F" />
      <directionalLight position={[10, 25, 10]} intensity={0.6} color="#00F0FF" />
      <pointLight position={[0, 10, -5]} intensity={3} color="#BD00FF" distance={40} />
      <pointLight position={[-20, 5, -15]} intensity={2.5} color="#00FF9D" distance={30} />
      <pointLight position={[20, 8, -20]} intensity={2.5} color="#FF007F" distance={35} />
    </group>
  );
}

// Camera Mouse Parallax Controller
function ParallaxRig({ mouseRef }) {
  useFrame((state) => {
    if (!mouseRef.current) return;
    const { x, y } = mouseRef.current;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 2.5, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1 - y * 1.5, 0.04);
    state.camera.lookAt(0, 0, -15);
  });
  return null;
}

export default function CyberEnvironment({ level = 1, enabled = true }) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 55, near: 0.1, far: 120 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ParallaxRig mouseRef={mouseRef} />
        <CyberCity level={level} />
      </Canvas>
      {/* Subtle scanline & vignette overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070E] via-transparent to-[#05070E]/70 pointer-events-none" />
    </div>
  );
}
