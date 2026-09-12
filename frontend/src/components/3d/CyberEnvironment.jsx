import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Cyberpunk Metropolis with Dynamic World Evolution
function CyberCity({ level = 1 }) {
  const meshRef = useRef();
  const windowsCyanRef = useRef();
  const windowsAmberRef = useRef();
  const windowsMagentaRef = useRef();
  const billboardsRef = useRef();
  const trafficRef = useRef();
  const rainRef = useRef();
  const beaconsRef = useRef();

  // Scale city density, height, and activity with Player Level
  const buildingCount = Math.min(130, 45 + level * 4);
  const citySpread = 85;

  // Generate building matrices and multi-colored window matrices
  const {
    buildingData,
    windowsCyan,
    windowsAmber,
    windowsMagenta,
    billboardData,
    beaconData
  } = useMemo(() => {
    const buildings = [];
    const winCyan = [];
    const winAmber = [];
    const winMag = [];
    const billboards = [];
    const beacons = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2 + (Math.random() * 0.25);
      const dist = 14 + Math.random() * citySpread;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist - 20;

      // Buildings get taller and more imposing with level
      const heightBonus = Math.min(36, level * 1.8);
      const height = 12 + Math.random() * (26 + heightBonus);
      const width = 3 + Math.random() * 4.5;
      const depth = 3 + Math.random() * 4.5;
      const y = height / 2 - 14;

      dummy.position.set(x, y, z);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = (i % 4) * (Math.PI / 4) + (Math.random() * 0.2);
      dummy.updateMatrix();
      buildings.push(dummy.matrix.clone());

      // Rooftop communication beacon / antenna
      if (height > 20) {
        dummy.position.set(x, y + height / 2 + 1.2, z);
        dummy.scale.set(0.12, 2.4, 0.12);
        dummy.updateMatrix();
        beacons.push({
          matrix: dummy.matrix.clone(),
          x, y: y + height / 2 + 2.4, z,
          color: i % 2 === 0 ? '#FF003C' : '#00F0FF'
        });
      }

      // Neon Window Matrices across facades (Cyan, Amber, Magenta)
      const numBands = 2 + Math.floor(Math.random() * 3);
      for (let b = 0; b < numBands; b++) {
        const bandY = y + (b / numBands - 0.5) * (height * 0.7);
        dummy.position.set(x, bandY, z + depth * 0.51);
        dummy.scale.set(width * 0.85, 0.4 + Math.random() * 0.5, 0.08);
        dummy.updateMatrix();

        const randColor = (i + b) % 3;
        if (randColor === 0) winCyan.push(dummy.matrix.clone());
        else if (randColor === 1) winAmber.push(dummy.matrix.clone());
        else winMag.push(dummy.matrix.clone());
      }

      // Holographic Digital Billboards mounted on select prominent skyscrapers
      if (i % 5 === 0 && height > 22) {
        dummy.position.set(x, y + (Math.random() - 0.2) * (height * 0.4), z + depth * 0.54);
        dummy.scale.set(width * 0.75, 2.2, 0.1);
        dummy.updateMatrix();
        billboards.push({
          matrix: dummy.matrix.clone(),
          color: i % 10 === 0 ? '#FF007F' : i % 10 === 5 ? '#00F0FF' : '#FFB800'
        });
      }
    }

    return {
      buildingData: buildings,
      windowsCyan: winCyan,
      windowsAmber: winAmber,
      windowsMagenta: winMag,
      billboardData: billboards,
      beaconData: beacons,
    };
  }, [buildingCount, level]);

  // Flying Sky Traffic / Elevated Highway Vehicles (Dual-Lane: Headlights & Taillights)
  const trafficCount = Math.min(32, 16 + level * 2);
  const trafficInitial = useMemo(() => {
    return Array.from({ length: trafficCount }, (_, i) => {
      const isEastbound = i % 2 === 0;
      return {
        x: (Math.random() - 0.5) * 100,
        y: -1 + Math.random() * 22,
        z: -12 - Math.random() * 45,
        speed: (0.2 + Math.random() * 0.4) * (isEastbound ? 1 : -1),
        isEastbound,
        color: isEastbound ? '#00F0FF' : '#FF0055', // Cyan headlights vs Red taillights
        length: 1.2 + Math.random() * 1.5,
      };
    });
  }, [trafficCount, level]);

  // Cyberpunk Rain Particle System (Vertical Streaks)
  const rainCount = 280;
  const rainPositions = useMemo(() => {
    const arr = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = -12 + Math.random() * 40;
      arr[i * 3 + 2] = -5 - Math.random() * 60;
    }
    return arr;
  }, [rainCount]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Animate falling rain streaks
    if (rainRef.current) {
      const pos = rainRef.current.geometry.attributes.position.array;
      for (let i = 0; i < rainCount; i++) {
        pos[i * 3 + 1] -= delta * 35; // Fast downward rainfall
        if (pos[i * 3 + 1] < -14) {
          pos[i * 3 + 1] = 26;
          pos[i * 3] = (Math.random() - 0.5) * 80;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate streaming highway vehicles
    if (trafficRef.current) {
      trafficRef.current.children.forEach((child, i) => {
        const tr = trafficInitial[i];
        if (tr) {
          child.position.x += tr.speed;
          if (tr.isEastbound && child.position.x > 55) child.position.x = -55;
          if (!tr.isEastbound && child.position.x < -55) child.position.x = 55;
        }
      });
    }

    // Subtle pulsing on holographic billboards
    if (billboardsRef.current) {
      const glow = 1 + Math.sin(t * 3) * 0.25;
      billboardsRef.current.children.forEach((mesh) => {
        if (mesh.material) mesh.material.opacity = 0.75 + Math.sin(t * 2.5) * 0.15;
      });
    }
  });

  return (
    <group>
      {/* Deep Navy/Purple Atmospheric Fog */}
      <fog attach="fog" args={['#080D20', 25, 95]} />

      {/* Instanced Dark Obsidian Skyscraper Geometry with Specular Highlights */}
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
          color="#0B132B"
          roughness={0.3}
          metalness={0.85}
        />
      </instancedMesh>

      {/* Instanced Glowing Windows — Cyan (Offices/Hacking Nodes) */}
      <instancedMesh
        ref={windowsCyanRef}
        args={[null, null, windowsCyan.length]}
        onUpdate={(self) => {
          windowsCyan.forEach((mat, i) => self.setMatrixAt(i, mat));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} />
      </instancedMesh>

      {/* Instanced Glowing Windows — Amber/Gold (Executive Towers) */}
      <instancedMesh
        ref={windowsAmberRef}
        args={[null, null, windowsAmber.length]}
        onUpdate={(self) => {
          windowsAmber.forEach((mat, i) => self.setMatrixAt(i, mat));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#FFB800" transparent opacity={0.8} />
      </instancedMesh>

      {/* Instanced Glowing Windows — Magenta/Violet (Nightlife Districts) */}
      <instancedMesh
        ref={windowsMagentaRef}
        args={[null, null, windowsMagenta.length]}
        onUpdate={(self) => {
          windowsMagenta.forEach((mat, i) => self.setMatrixAt(i, mat));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#FF007F" transparent opacity={0.85} />
      </instancedMesh>

      {/* Holographic Digital Billboards Mounted on Skyscrapers */}
      <group ref={billboardsRef}>
        {billboardData.map((b, i) => (
          <mesh
            key={`billboard-${i}`}
            onUpdate={(self) => {
              self.applyMatrix4(b.matrix);
            }}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color={b.color}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Streaming Elevated Sky Highway Vehicles */}
      <group ref={trafficRef}>
        {trafficInitial.map((tr, i) => (
          <mesh key={`traffic-${i}`} position={[tr.x, tr.y, tr.z]}>
            <boxGeometry args={[tr.length, 0.16, 0.28]} />
            <meshBasicMaterial color={tr.color} />
          </mesh>
        ))}
      </group>

      {/* Rooftop Beacons */}
      <group ref={beaconsRef}>
        {beaconData.map((b, i) => (
          <mesh key={`beacon-${i}`} position={[b.x, b.y, b.z]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshBasicMaterial color={b.color} />
          </mesh>
        ))}
      </group>

      {/* Cyberpunk Vertical Rain Particles */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={rainCount}
            array={rainPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#8BD3FF"
          transparent
          opacity={0.5}
        />
      </points>

      {/* Wet Reflective Street Grid Ground Plane */}
      <mesh position={[0, -14, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial
          color="#060A19"
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Elevated Highway Road Line */}
      <mesh position={[0, -1, -22]}>
        <boxGeometry args={[120, 0.2, 3.2]} />
        <meshStandardMaterial color="#0C152F" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Atmospheric City Night Lighting */}
      <ambientLight intensity={0.65} color="#152147" />
      <directionalLight position={[20, 35, 15]} intensity={0.85} color="#00F0FF" />
      <pointLight position={[0, 12, -8]} intensity={4.5} color="#8B5CF6" distance={50} />
      <pointLight position={[-25, 6, -18]} intensity={3.5} color="#00FF9D" distance={40} />
      <pointLight position={[25, 10, -22]} intensity={3.8} color="#FF007F" distance={45} />
      <pointLight position={[0, -5, -15]} intensity={3.0} color="#FFB800" distance={35} />
    </group>
  );
}

// Camera Mouse Parallax Controller
function ParallaxRig({ mouseRef }) {
  useFrame((state) => {
    if (!mouseRef.current) return;
    const { x, y } = mouseRef.current;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 3.2, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.2 - y * 2.0, 0.04);
    state.camera.lookAt(0, 0, -20);
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90">
      <Canvas
        camera={{ position: [0, 1.2, 10], fov: 55, near: 0.1, far: 140 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ParallaxRig mouseRef={mouseRef} />
        <CyberCity level={level} />
      </Canvas>
      {/* Subtle scanline & atmosphere glow overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B19]/90 via-transparent to-[#070B19]/60 pointer-events-none" />
    </div>
  );
}
