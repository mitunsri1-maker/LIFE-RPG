import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CoreMesh({ xpPercent = 0, justGainedXP = false, accent = '#7C3AED' }) {
  const coreRef = useRef();
  const wireRef = useRef();
  const particlesRef = useRef();
  const pulse = useRef(0);

  // Orbiting XP particles — count/speed scale gently with level progress
  const particleCount = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.6;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Base slow rotation, speeds up slightly as XP% climbs
    const speedFactor = 0.3 + xpPercent / 150;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * speedFactor;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * speedFactor * 0.6;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * speedFactor * 0.8;
    }

    // Pulse decays over time; justGainedXP re-triggers it to full strength
    if (justGainedXP) pulse.current = 1;
    pulse.current = THREE.MathUtils.lerp(pulse.current, 0, Math.min(1, delta * 2.5));

    if (coreRef.current) {
      const baseScale = 1 + Math.sin(t * 1.5) * 0.03; // idle breathing
      const burstScale = baseScale + pulse.current * 0.35;
      coreRef.current.scale.setScalar(burstScale);
      if (coreRef.current.material) {
        coreRef.current.material.emissiveIntensity =
          1.2 + xpPercent / 60 + pulse.current * 3.5;
      }
    }
  });

  return (
    <group>
      {/* Inner glowing core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.6}
          wireframe={false}
        />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={wireRef} scale={1.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.4} />
      </mesh>

      {/* Orbiting XP particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={accent} size={0.06} sizeAttenuation transparent opacity={0.9} />
      </points>

      {/* Ambient + point light so the core actually glows against dark bg */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 3]} intensity={2.5} color={accent} distance={10} />
    </group>
  );
}

export default function XPCore({ xpPercent = 0, justGainedXP = false, accent = '#7C3AED', height = '240px', className = '' }) {
  return (
    <div style={{ width: '100%', height }} className={`relative select-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <CoreMesh xpPercent={xpPercent} justGainedXP={justGainedXP} accent={accent} />
      </Canvas>
    </div>
  );
}
