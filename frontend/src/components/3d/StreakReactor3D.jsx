import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function PlasmaCore({ streak = 0 }) {
  const coreRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  // Streak intensity factor
  const intensity = Math.min(3.5, 1 + streak * 0.2);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 1.5;
      coreRef.current.rotation.z += delta * 0.8;
      const pulse = 1 + Math.sin(t * (4 + streak * 0.5)) * 0.12;
      coreRef.current.scale.setScalar(pulse);
    }
    if (ringRef1.current) ringRef1.current.rotation.x += delta * 2;
    if (ringRef2.current) ringRef2.current.rotation.y -= delta * 1.8;
  });

  return (
    <group>
      {/* Central Plasma Star */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#FF385C"
          emissive="#FF003C"
          emissiveIntensity={intensity}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Plasma Containment Torus Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[1.1, 0.04, 16, 32]} />
        <meshBasicMaterial color="#FFE600" transparent opacity={0.7} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[1.3, 0.03, 16, 32]} />
        <meshBasicMaterial color="#FF007F" transparent opacity={0.5} />
      </mesh>

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 2]} intensity={2.5} color="#FF003C" />
    </group>
  );
}

export default function StreakReactor3D({ streak = 0, height = "120px" }) {
  return (
    <div style={{ width: '100%', height }} className="relative select-none pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} gl={{ alpha: true }}>
        <PlasmaCore streak={streak} />
      </Canvas>
    </div>
  );
}
