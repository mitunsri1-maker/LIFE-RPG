import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function QuestNetwork({ quests = [], onSelectQuest }) {
  const groupRef = useRef();

  // Position nodes along a futuristic cyber neural web
  const nodes = useMemo(() => {
    return quests.slice(0, 8).map((q, idx) => {
      const angle = (idx / Math.max(1, Math.min(8, quests.length))) * Math.PI * 2;
      const radius = 2.2 + (idx % 2 === 0 ? 0.4 : -0.4);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.75);
      const z = (Math.random() - 0.5) * 0.8;
      const color = q.status === 'completed'
        ? '#00FF9D'
        : q.difficulty === 'hard'
        ? '#FF003C'
        : q.difficulty === 'easy'
        ? '#00F0FF'
        : '#FFE600';
      return { ...q, x, y, z, color };
    });
  }, [quests]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Cyber Hub */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#BD00FF" emissive="#BD00FF" emissiveIntensity={1.5} wireframe />
      </mesh>

      {/* Connection Beams */}
      {nodes.map((n, i) => (
        <line key={`line-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, n.x, n.y, n.z])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={n.color} transparent opacity={0.5} linewidth={2} />
        </line>
      ))}

      {/* Floating Mission Nodes */}
      {nodes.map((n, i) => (
        <group key={`node-${i}`} position={[n.x, n.y, n.z]}>
          {/* Main Node Diamond */}
          <mesh
            onClick={() => onSelectQuest?.(n)}
            cursor="pointer"
          >
            <icosahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial
              color={n.color}
              emissive={n.color}
              emissiveIntensity={n.status === 'active' ? 2 : 0.8}
            />
          </mesh>

          {/* Pulsing ring for active missions */}
          {n.status === 'active' && (
            <mesh>
              <ringGeometry args={[0.32, 0.38, 16]} />
              <meshBasicMaterial color={n.color} transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      ))}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 4]} intensity={2} color="#00F0FF" />
    </group>
  );
}

export default function QuestNodeMap3D({ quests = [], onSelectQuest, height = "280px" }) {
  if (!quests || quests.length === 0) return null;

  return (
    <div style={{ width: '100%', height }} className="relative select-none bg-cyber-panel/60 border-3 border-cyber-border rounded-lg p-3 overflow-hidden shadow-holo-cyan">
      <div className="absolute top-2 left-3 text-[10px] font-mono text-cyber-cyan font-bold tracking-wider z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
        3D MISSION NEURAL MAP // INTERACTIVE
      </div>
      <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <QuestNetwork quests={quests} onSelectQuest={onSelectQuest} />
      </Canvas>
    </div>
  );
}
