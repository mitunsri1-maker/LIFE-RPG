import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DISTRICT_SECTORS = [
  { name: 'CODING DISTRICT', category: 'coding', x: -2.8, z: -1.6, color: '#00F0FF', icon: '⚡' },
  { name: 'FITNESS DISTRICT', category: 'gym', x: 2.8, z: -1.6, color: '#FF3366', icon: '⚔️' },
  { name: 'STUDY DISTRICT', category: 'study', x: -2.6, z: 2.0, color: '#8B5CF6', icon: '🔮' },
  { name: 'PERSONAL DISTRICT', category: 'habits', x: 2.6, z: 2.0, color: '#FFB800', icon: '🧘' },
];

function CityDistrictMap({ quests = [], onSelectQuest }) {
  const groupRef = useRef();

  // Match quests to district sectors
  const mappedNodes = useMemo(() => {
    return quests.slice(0, 10).map((q, idx) => {
      const cat = (q.category || '').toLowerCase();
      let sector = DISTRICT_SECTORS.find((s) => cat.includes(s.category));
      if (!sector) {
        sector = DISTRICT_SECTORS[idx % DISTRICT_SECTORS.length];
      }

      // Offset slightly around district center
      const angle = (idx * 1.5) % (Math.PI * 2);
      const offsetRadius = 0.6 + (idx % 3) * 0.25;
      const x = sector.x + Math.cos(angle) * offsetRadius;
      const z = sector.z + Math.sin(angle) * offsetRadius;
      const y = 0.3 + (idx % 3) * 0.25;

      const isCompleted = q.status === 'completed';
      const color = isCompleted ? '#00FF9D' : sector.color;

      return {
        ...q,
        x,
        y,
        z,
        color,
        district: sector.name,
        isCompleted,
      };
    });
  }, [quests]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Gentle orbital pan
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground City District Grid */}
      <gridHelper args={[16, 20, '#00F0FF', '#152147']} position={[0, -0.6, 0]} />

      {/* Central Command Tower Nexus */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.8, 2.0, 6]} />
          <meshStandardMaterial color="#0B132B" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2.5} />
        </mesh>
        {/* Tower beacon ring */}
        <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.1, 32]} />
          <meshBasicMaterial color="#00F0FF" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* District Sector Hub Pods */}
      {DISTRICT_SECTORS.map((s, i) => (
        <group key={`sector-${i}`} position={[s.x, -0.4, s.z]}>
          <mesh>
            <cylinderGeometry args={[1.2, 1.4, 0.3, 16]} />
            <meshStandardMaterial color="#0E1638" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.15, 32]} />
            <meshBasicMaterial color={s.color} side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
          {/* Light conduit connecting central tower to district */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0.4, 0, -s.x, 0.4, -s.z])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={s.color} transparent opacity={0.4} />
          </line>
        </group>
      ))}

      {/* Holographic 3D Waypoint Beacons for Quests */}
      {mappedNodes.map((n, i) => (
        <group
          key={`node-${i}`}
          position={[n.x, n.y, n.z]}
          onClick={() => onSelectQuest?.(n)}
        >
          {/* Vertical Light Beacon Column */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, -0.8, 0, 0, 1.2, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={n.color} transparent opacity={0.65} />
          </line>

          {/* Holographic Beacon Diamond */}
          <mesh position={[0, 0.3, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color={n.color}
              emissive={n.color}
              emissiveIntensity={n.isCompleted ? 1.5 : 3.0}
            />
          </mesh>

          {/* Pulse Ring for Active Missions */}
          {!n.isCompleted && (
            <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.4, 16]} />
              <meshBasicMaterial color={n.color} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      ))}

      {/* Atmospheric District Map Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={3.5} color="#00F0FF" distance={20} />
      <pointLight position={[-4, 3, -4]} intensity={2.5} color="#8B5CF6" distance={15} />
      <pointLight position={[4, 3, 4]} intensity={2.5} color="#FF3366" distance={15} />
    </group>
  );
}

export default function QuestNodeMap3D({ quests = [], onSelectQuest, height = '360px' }) {
  return (
    <div style={{ width: '100%', height }} className="relative city-glass rounded-xl border border-cyber-border/40 overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 5.5, 7.5], fov: 46 }}
        gl={{ alpha: true, antialias: true }}
      >
        <CityDistrictMap quests={quests} onSelectQuest={onSelectQuest} />
      </Canvas>

      {/* HUD District Legend Overlay */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
        {DISTRICT_SECTORS.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 city-glass px-2.5 py-1 rounded border border-cyber-border/30 text-[10px] font-mono">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-cyber-text font-bold">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 right-3 font-mono text-[10px] text-cyber-cyan city-glass px-2.5 py-1 rounded border border-cyber-cyan/30">
        MISSION MAP // SECTOR MATRIX ONLINE
      </div>
    </div>
  );
}
