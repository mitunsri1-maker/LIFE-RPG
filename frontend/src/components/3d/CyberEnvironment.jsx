import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Realistic Dark Cyberpunk Night Metropolis
function DarkNeonCity({ level = 1 }) {
  const meshRef = useRef();
  const windowsRef = useRef();
  const billboardsRef = useRef();
  const trafficRef = useRef();
  const aerocarsRef = useRef();
  const rainRef = useRef();

  // City scale scales with player progression
  const buildingCount = Math.min(130, 60 + level * 3);
  const citySpread = 90;

  // Generate architectural towers, glowing neon window bands, and holographic billboards
  const {
    buildingData,
    windowData,
    billboardData,
  } = useMemo(() => {
    const buildings = [];
    const windows = [];
    const billboards = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2 + (Math.random() * 0.25);
      const dist = 16 + Math.random() * citySpread;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist - 22;

      // Dark futuristic skyscraper proportions
      const heightBonus = Math.min(45, level * 1.8);
      const height = 16 + Math.random() * (30 + heightBonus);
      const width = 3.2 + Math.random() * 4.5;
      const depth = 3.2 + Math.random() * 4.5;
      const y = height / 2 - 14;

      dummy.position.set(x, y, z);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = (i % 8) * (Math.PI / 4) + 0.05;
      dummy.updateMatrix();
      buildings.push(dummy.matrix.clone());

      // Glowing Neon Window Bands (Cyan, Amber, Violet)
      const numBands = 3 + Math.floor(Math.random() * 5);
      for (let b = 0; b < numBands; b++) {
        const bandY = y + (b / numBands - 0.45) * (height * 0.75);
        dummy.position.set(x, bandY, z + depth * 0.51);
        dummy.scale.set(width * 0.85, 0.5 + Math.random() * 0.4, 0.08);
        dummy.updateMatrix();
        windows.push({
          matrix: dummy.matrix.clone(),
          color: (i + b) % 3 === 0 ? '#00E5FF' : (i + b) % 3 === 1 ? '#FFB84D' : '#FF2DA6',
        });
      }

      // Neon Holographic Billboards (Magenta, Cyan, Violet ads)
      if (i % 5 === 0 && height > 22) {
        dummy.position.set(x, y + (Math.random() - 0.1) * (height * 0.3), z + depth * 0.54);
        dummy.scale.set(width * 0.75, 3.4, 0.1);
        dummy.updateMatrix();
        billboards.push({
          matrix: dummy.matrix.clone(),
          color: i % 15 === 0 ? '#FF2DA6' : i % 15 === 5 ? '#00E5FF' : '#8B5CF6',
        });
      }
    }

    return {
      buildingData: buildings,
      windowData: windows,
      billboardData: billboards,
    };
  }, [buildingCount, level]);

  // Traffic Light Trails on Elevated Highways (Cyan/White headlights Eastbound, Red/Pink taillights Westbound)
  const trafficCount = 38;
  const trafficInitial = useMemo(() => {
    return Array.from({ length: trafficCount }, (_, i) => {
      const isUpper = i % 2 === 0;
      const isEastbound = i % 4 < 2;
      return {
        x: (Math.random() - 0.5) * 110,
        y: isUpper ? 1.4 : -2.8,
        z: isUpper ? -28 + (isEastbound ? 0.8 : -0.8) : -18 + (isEastbound ? 0.8 : -0.8),
        speed: (0.35 + Math.random() * 0.4) * (isEastbound ? 1 : -1),
        isEastbound,
        color: isEastbound ? '#00E5FF' : '#FF2DA6',
        length: 2.2 + Math.random() * 2.0,
      };
    });
  }, [trafficCount]);

  // Flying Neon Aerocars cruising across the skyline
  const aerocarCount = Math.min(20, 10 + Math.floor(level * 1.4));
  const aerocarsInitial = useMemo(() => {
    return Array.from({ length: aerocarCount }, (_, i) => {
      const isEastbound = i % 2 === 0;
      return {
        x: (Math.random() - 0.5) * 85,
        y: 4 + Math.random() * 24,
        z: -12 - Math.random() * 40,
        speed: (0.16 + Math.random() * 0.28) * (isEastbound ? 1 : -1),
        isEastbound,
        color: isEastbound ? '#00E5FF' : '#FF2DA6',
        length: 1.8 + Math.random() * 1.0,
      };
    });
  }, [aerocarCount, level]);

  // Cyber Rain / Digital Mist particles falling gently
  const rainCount = 180;
  const rainParticles = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = Math.random() * 40 - 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 15;
    }
    return pos;
  }, [rainCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Animate Highway Traffic Light Trails
    if (trafficRef.current) {
      trafficRef.current.children.forEach((child, i) => {
        const car = trafficInitial[i];
        if (car) {
          child.position.x += car.speed;
          if (car.isEastbound && child.position.x > 55) child.position.x = -55;
          if (!car.isEastbound && child.position.x < -55) child.position.x = 55;
        }
      });
    }

    // Animate Flying Aerocars
    if (aerocarsRef.current) {
      aerocarsRef.current.children.forEach((child, i) => {
        const car = aerocarsInitial[i];
        if (car) {
          child.position.x += car.speed;
          if (car.isEastbound && child.position.x > 50) child.position.x = -50;
          if (!car.isEastbound && child.position.x < -50) child.position.x = 50;
          child.position.y += Math.sin(t * 1.2 + i) * 0.008;
        }
      });
    }

    // Animate Holographic Billboards pulse
    if (billboardsRef.current) {
      billboardsRef.current.children.forEach((mesh, idx) => {
        if (mesh.material) {
          mesh.material.opacity = 0.72 + Math.sin(t * 2.5 + idx) * 0.18;
        }
      });
    }

    // Animate Rain / Mist falling
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.35; // fall speed
        if (positions[i * 3 + 1] < -12) {
          positions[i * 3 + 1] = 30;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Deep Cyberpunk Atmospheric Night Sky & Fog */}
      <fog attach="fog" args={['#050814', 22, 115]} />

      {/* Atmospheric Deep Blue Night Sky Dome */}
      <mesh position={[0, 20, -50]}>
        <sphereGeometry args={[110, 32, 16]} />
        <meshBasicMaterial color="#080F26" side={THREE.BackSide} />
      </mesh>

      {/* Instanced Dark Monolith Skyscraper Volumes */}
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
          color="#0B1222"
          roughness={0.35}
          metalness={0.75}
        />
      </instancedMesh>

      {/* Vivid Neon Windows on Skyscraper Facades (Cyan, Amber, Magenta, Violet) */}
      <group ref={windowsRef}>
        {windowData.slice(0, 160).map((w, i) => (
          <mesh
            key={`win-${i}`}
            onUpdate={(self) => {
              self.applyMatrix4(w.matrix);
            }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={w.color} />
          </mesh>
        ))}
      </group>

      {/* Glowing Holographic Night Billboards */}
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
              opacity={0.88}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Elevated Viaduct Highway Overpasses (Dark Concrete & Steel) */}
      <mesh position={[0, -3.2, -18]}>
        <boxGeometry args={[130, 0.4, 4.2]} />
        <meshStandardMaterial color="#0A0F1D" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.2, -28]}>
        <boxGeometry args={[140, 0.4, 4.2]} />
        <meshStandardMaterial color="#0A0F1D" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Highway Neon Guardrails & Road Divider Lane Markings */}
      <mesh position={[0, -2.8, -16]}>
        <boxGeometry args={[130, 0.15, 0.15]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <mesh position={[0, -2.8, -20]}>
        <boxGeometry args={[130, 0.15, 0.15]} />
        <meshBasicMaterial color="#FF2DA6" />
      </mesh>
      <mesh position={[0, -2.95, -18]}>
        <boxGeometry args={[130, 0.05, 0.2]} />
        <meshBasicMaterial color="#FFB84D" />
      </mesh>
      <mesh position={[0, 1.6, -26]}>
        <boxGeometry args={[140, 0.15, 0.15]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <mesh position={[0, 1.6, -30]}>
        <boxGeometry args={[140, 0.15, 0.15]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>

      {/* High-Speed Highway Traffic Light Streaks */}
      <group ref={trafficRef}>
        {trafficInitial.map((car, i) => (
          <mesh key={`traffic-${i}`} position={[car.x, car.y, car.z]}>
            <boxGeometry args={[car.length, 0.25, 0.4]} />
            <meshBasicMaterial color={car.color} />
          </mesh>
        ))}
      </group>

      {/* Flying Neon Aerocars */}
      <group ref={aerocarsRef}>
        {aerocarsInitial.map((car, i) => (
          <mesh key={`aerocar-${i}`} position={[car.x, car.y, car.z]}>
            <boxGeometry args={[car.length, 0.28, 0.55]} />
            <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
            {/* Glowing neon side stripe */}
            <mesh position={[0, 0, 0.28]}>
              <boxGeometry args={[car.length * 0.9, 0.08, 0.05]} />
              <meshBasicMaterial color={car.color} />
            </mesh>
          </mesh>
        ))}
      </group>

      {/* Wet Reflective Dark City Asphalt Ground Plane */}
      <mesh position={[0, -14, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial
          color="#060914"
          roughness={0.12}
          metalness={0.92}
        />
      </mesh>

      {/* Cyber Rain / Atmospheric Neon Drizzle */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={rainCount}
            array={rainParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#00E5FF"
          transparent
          opacity={0.45}
          sizeAttenuation
        />
      </points>

      {/* Dark Ambient Lighting + Vivid Volumetric Neon Point Lights */}
      <ambientLight intensity={0.4} color="#0B1730" />
      {/* Cyan Skyscraper Volumetric Light */}
      <pointLight position={[-15, 20, -15]} intensity={4.5} color="#00E5FF" distance={70} />
      {/* Magenta Billboard Volumetric Light */}
      <pointLight position={[18, 16, -18]} intensity={4.5} color="#FF2DA6" distance={70} />
      {/* Violet City Center Fill Light */}
      <pointLight position={[0, 12, -12]} intensity={3.5} color="#8B5CF6" distance={55} />
      {/* Amber Street Rim Light */}
      <pointLight position={[0, -2, -10]} intensity={3.0} color="#FFB84D" distance={45} />
    </group>
  );
}

// Camera Mouse Parallax Controller
function ParallaxRig({ mouseRef }) {
  useFrame((state) => {
    if (!mouseRef.current) return;
    const { x, y } = mouseRef.current;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 3.2, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.2 - y * 1.8, 0.04);
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 1.2, 10], fov: 52, near: 0.1, far: 160 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ParallaxRig mouseRef={mouseRef} />
        <DarkNeonCity level={level} />
      </Canvas>
      {/* Dark vignette & subtle neon atmospheric fog gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/90 via-transparent to-[#050810]/50 pointer-events-none" />
    </div>
  );
}
