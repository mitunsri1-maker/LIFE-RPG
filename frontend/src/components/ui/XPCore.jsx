import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CoreMesh({ xpPercent = 0, justGainedXP = false, accent = '#00E5FF' }) {
  const coreRef = useRef();
  const wireRef = useRef();
  const ringsRef = useRef();
  const particlesRef = useRef();
  const pulse = useRef(0);

  // Orbiting XP particles
  const particleCount = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.8;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Base slow rotation, speeds up as XP% climbs
    const speedFactor = 0.4 + xpPercent / 120;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * speedFactor;
      coreRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * speedFactor * 0.7;
      wireRef.current.rotation.z = Math.cos(t * 0.3) * 0.15;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.6;
      ringsRef.current.rotation.x = Math.sin(t * 0.5) * 0.4;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * speedFactor * 0.9;
    }

    // Pulse decays over time; justGainedXP re-triggers it
    if (justGainedXP) pulse.current = 1.2;
    pulse.current = THREE.MathUtils.lerp(pulse.current, 0, Math.min(1, delta * 2.2));

    if (coreRef.current) {
      const baseScale = 1 + Math.sin(t * 2) * 0.04;
      const burstScale = baseScale + pulse.current * 0.45;
      coreRef.current.scale.setScalar(burstScale);
      if (coreRef.current.material) {
        coreRef.current.material.emissiveIntensity =
          1.8 + xpPercent / 40 + pulse.current * 5.0;
      }
    }
  });

  return (
    <group>
      {/* Inner glowing faceted diamond crystal hologram */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive={accent}
          emissiveIntensity={2.0}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Outer geodesic wireframe containment shell */}
      <mesh ref={wireRef} scale={1.42}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.45} />
      </mesh>

      {/* Holographic Gyro Rings (Cyan & Vivid Magenta) */}
      <group ref={ringsRef}>
        <mesh>
          <torusGeometry args={[1.75, 0.015, 16, 64]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.9, 0.012, 16, 64]} />
          <meshBasicMaterial color="#FF2DA6" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Orbiting XP energy particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#00E5FF" size={0.075} sizeAttenuation transparent opacity={0.9} />
      </points>

      {/* Dark Ambient & Vivid Neon Illumination */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={3.5} color="#00E5FF" distance={15} />
      <pointLight position={[0, 2, -2]} intensity={2.8} color="#FF2DA6" distance={12} />
    </group>
  );
}

export default function XPCore({ xpPercent = 0, justGainedXP = false, accent = '#00E5FF', height = '240px', className = '' }) {
  return (
    <div style={{ width: '100%', height }} className={`relative select-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.3], fov: 44 }} gl={{ alpha: true, antialias: true }}>
        <CoreMesh xpPercent={xpPercent} justGainedXP={justGainedXP} accent={accent} />
      </Canvas>
    </div>
  );
}
