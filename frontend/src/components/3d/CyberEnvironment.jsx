import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Realistic Daylight Cyberpunk Metropolis
function DayCity({ level = 1 }) {
  const meshRef = useRef();
  const glassRef = useRef();
  const gardensRef = useRef();
  const billboardsRef = useRef();
  const trainsRef = useRef();
  const aerocarsRef = useRef();
  const dronesRef = useRef();
  const cloudRef = useRef();

  // City scale scales slightly with player progression
  const buildingCount = Math.min(140, 60 + level * 3);
  const citySpread = 90;

  // Generate architectural towers, glass arrays, rooftop gardens, and holographic billboards
  const {
    buildingData,
    glassData,
    gardenData,
    billboardData
  } = useMemo(() => {
    const buildings = [];
    const glassPanels = [];
    const gardens = [];
    const billboards = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2 + (Math.random() * 0.2);
      const dist = 16 + Math.random() * citySpread;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist - 22;

      // Daylight architecture: sleek white/silver stepped towers
      const heightBonus = Math.min(40, level * 1.6);
      const height = 14 + Math.random() * (28 + heightBonus);
      const width = 3.5 + Math.random() * 4.5;
      const depth = 3.5 + Math.random() * 4.5;
      const y = height / 2 - 14;

      dummy.position.set(x, y, z);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = (i % 6) * (Math.PI / 6) + 0.1;
      dummy.updateMatrix();
      buildings.push(dummy.matrix.clone());

      // Sleek Azure Glass Facade Bands
      const numBands = 2 + Math.floor(Math.random() * 3);
      for (let b = 0; b < numBands; b++) {
        const bandY = y + (b / numBands - 0.45) * (height * 0.7);
        dummy.position.set(x, bandY, z + depth * 0.51);
        dummy.scale.set(width * 0.88, 1.2 + Math.random() * 0.8, 0.1);
        dummy.updateMatrix();
        glassPanels.push(dummy.matrix.clone());
      }

      // Rooftop Sky Gardens / Greenery Terraces (Solarpunk aesthetic)
      if (height > 18 && i % 2 === 0) {
        dummy.position.set(x, y + height / 2 + 0.15, z);
        dummy.scale.set(width * 0.7, 0.3, depth * 0.7);
        dummy.updateMatrix();
        gardens.push(dummy.matrix.clone());
      }

      // Daylight Holographic Billboards (Cyan, Magenta, Violet, Emerald)
      if (i % 6 === 0 && height > 24) {
        dummy.position.set(x, y + (Math.random() - 0.1) * (height * 0.35), z + depth * 0.54);
        dummy.scale.set(width * 0.7, 3.2, 0.1);
        dummy.updateMatrix();
        billboards.push({
          matrix: dummy.matrix.clone(),
          color: i % 12 === 0 ? '#E11D48' : i % 12 === 6 ? '#00B4D8' : '#9333EA',
        });
      }
    }

    return {
      buildingData: buildings,
      glassData: glassPanels,
      gardenData: gardens,
      billboardData: billboards,
    };
  }, [buildingCount, level]);

  // Flying Sky Aerocars & Shuttles cruising in daylight
  const aerocarCount = Math.min(24, 12 + Math.floor(level * 1.5));
  const aerocarsInitial = useMemo(() => {
    return Array.from({ length: aerocarCount }, (_, i) => {
      const isEastbound = i % 2 === 0;
      return {
        x: (Math.random() - 0.5) * 90,
        y: 2 + Math.random() * 20,
        z: -10 - Math.random() * 45,
        speed: (0.18 + Math.random() * 0.35) * (isEastbound ? 1 : -1),
        isEastbound,
        color: isEastbound ? '#FFFFFF' : '#E2E8F0',
        length: 1.4 + Math.random() * 1.2,
      };
    });
  }, [aerocarCount, level]);

  // Autonomous Drone Swarms
  const droneCount = 14;
  const dronesInitial = useMemo(() => {
    return Array.from({ length: droneCount }, (_, i) => ({
      x: (Math.random() - 0.5) * 60,
      y: 6 + Math.random() * 18,
      z: -8 - Math.random() * 35,
      radius: 3 + Math.random() * 6,
      speed: 0.6 + Math.random() * 0.8,
      offset: i * ((Math.PI * 2) / droneCount),
    }));
  }, [droneCount]);

  // High-Speed Sky Train / Monorail on elevated transit viaduct
  const skyTrains = useMemo(() => [
    { x: -40, y: -2.8, z: -18, speed: 0.42, length: 7, color: '#FFFFFF' },
    { x: 30, y: 1.5, z: -28, speed: -0.38, length: 8, color: '#F8FAFC' },
  ], []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Animate Aerocars cruising between towers
    if (aerocarsRef.current) {
      aerocarsRef.current.children.forEach((child, i) => {
        const car = aerocarsInitial[i];
        if (car) {
          child.position.x += car.speed;
          if (car.isEastbound && child.position.x > 50) child.position.x = -50;
          if (!car.isEastbound && child.position.x < -50) child.position.x = 50;
          child.position.y += Math.sin(t * 1.5 + i) * 0.008; // Subtle flight buoyancy
        }
      });
    }

    // Animate Drone orbits
    if (dronesRef.current) {
      dronesRef.current.children.forEach((child, i) => {
        const d = dronesInitial[i];
        if (d) {
          child.position.x = d.x + Math.cos(t * d.speed + d.offset) * d.radius;
          child.position.y = d.y + Math.sin(t * d.speed * 1.4 + d.offset) * 0.6;
          child.position.z = d.z + Math.sin(t * d.speed + d.offset) * d.radius * 0.5;
        }
      });
    }

    // Animate High-speed Sky Trains
    if (trainsRef.current) {
      trainsRef.current.children.forEach((child, i) => {
        const train = skyTrains[i];
        if (train) {
          child.position.x += train.speed;
          if (train.speed > 0 && child.position.x > 60) child.position.x = -60;
          if (train.speed < 0 && child.position.x < -60) child.position.x = 60;
        }
      });
    }

    // Animate gentle daytime clouds drift
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.008;
    }

    // Daylight holographic ads shimmer
    if (billboardsRef.current) {
      billboardsRef.current.children.forEach((mesh, idx) => {
        if (mesh.material) {
          mesh.material.opacity = 0.75 + Math.sin(t * 2 + idx) * 0.15;
        }
      });
    }
  });

  return (
    <group>
      {/* Soft Daylight Atmospheric Blue-White Fog */}
      <fog attach="fog" args={['#C5E1F9', 30, 115]} />

      {/* Daylight Sky Dome Gradient */}
      <mesh position={[0, 20, -50]}>
        <sphereGeometry args={[110, 32, 16]} />
        <meshBasicMaterial color="#7EB6E8" side={THREE.BackSide} />
      </mesh>

      {/* Gentle Atmospheric Daylight Clouds */}
      <group ref={cloudRef} position={[0, 25, -30]}>
        {[-35, -15, 12, 38].map((cx, idx) => (
          <mesh key={`cloud-${idx}`} position={[cx, 8 + Math.sin(idx) * 3, -15 - idx * 4]}>
            <sphereGeometry args={[7 + idx * 1.5, 16, 12]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>

      {/* Instanced White / Silver Architectural Skyscraper Volumes */}
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
          color="#F1F5F9"
          roughness={0.25}
          metalness={0.3}
        />
      </instancedMesh>

      {/* Instanced Azure Reflective Glass Windows on Facades */}
      <instancedMesh
        ref={glassRef}
        args={[null, null, glassData.length]}
        onUpdate={(self) => {
          glassData.forEach((mat, i) => self.setMatrixAt(i, mat));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </instancedMesh>

      {/* Instanced Rooftop Greenery / Sky Gardens */}
      <instancedMesh
        ref={gardensRef}
        args={[null, null, gardenData.length]}
        onUpdate={(self) => {
          gardenData.forEach((mat, i) => self.setMatrixAt(i, mat));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#10B981"
          roughness={0.8}
          metalness={0.1}
        />
      </instancedMesh>

      {/* Holographic Day Billboards */}
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
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Flying Sky Aerocars & Shuttles */}
      <group ref={aerocarsRef}>
        {aerocarsInitial.map((car, i) => (
          <mesh key={`aerocar-${i}`} position={[car.x, car.y, car.z]}>
            <boxGeometry args={[car.length, 0.35, 0.7]} />
            <meshStandardMaterial color={car.color} roughness={0.2} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Autonomous Delivery Drones */}
      <group ref={dronesRef}>
        {dronesInitial.map((_, i) => (
          <mesh key={`drone-${i}`}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshStandardMaterial color="#0284C7" emissive="#00B4D8" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Elevated Viaduct Highway Overpasses */}
      <mesh position={[0, -3.2, -18]}>
        <boxGeometry args={[130, 0.4, 3.8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.2, -28]}>
        <boxGeometry args={[140, 0.4, 3.8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* High-Speed Sky Trains running on Viaducts */}
      <group ref={trainsRef}>
        {skyTrains.map((tr, i) => (
          <mesh key={`train-${i}`} position={[tr.x, tr.y + 0.5, tr.z]}>
            <boxGeometry args={[tr.length, 0.65, 1.1]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Sparkling Urban River / Waterway Basin Ground Plane */}
      <mesh position={[0, -14, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial
          color="#2563EB"
          roughness={0.08}
          metalness={0.85}
        />
      </mesh>

      {/* Lush Greenery Waterfront Parks & City Embankment */}
      <mesh position={[0, -13.8, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[150, 24]} />
        <meshStandardMaterial color="#059669" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Realistic Bright Daylight Illumination */}
      <ambientLight intensity={1.1} color="#E0F2FE" />
      <directionalLight
        position={[45, 60, 30]}
        intensity={2.2}
        color="#FFFBEB"
        castShadow
      />
      {/* Daylight Sky Fill Bounce Light */}
      <directionalLight
        position={[-30, 30, -20]}
        intensity={0.8}
        color="#BAE6FD"
      />
      {/* Cyan Holographic Accent Fill */}
      <pointLight position={[0, 15, -10]} intensity={2.0} color="#00B4D8" distance={60} />
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
        <DayCity level={level} />
      </Canvas>
      {/* Subtle daylight atmospheric gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#EAF3FA]/80 via-transparent to-[#BAE6FD]/30 pointer-events-none" />
    </div>
  );
}
