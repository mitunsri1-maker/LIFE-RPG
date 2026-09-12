import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// CAMERA CONTROLLER: Human-Eye / Cinematic Drone street perspective
// ----------------------------------------------------------------------
function StreetCamera() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Extremely smooth, subtle parallax & breathing drift (zero violent moves)
    const targetX = mx * 0.9;
    const targetY = 1.9 - my * 0.45 + Math.sin(t * 0.7) * 0.05;
    const targetZ = 13.5 + Math.cos(t * 0.5) * 0.15;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.035);

    // Look down the street canyon vanishing point
    const lookTarget = new THREE.Vector3(
      mx * 0.4,
      2.3 + Math.sin(t * 0.6) * 0.04,
      -50
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

// ----------------------------------------------------------------------
// WET STREET ROADWAY & REFLECTIVE NEON PUDDLES
// ----------------------------------------------------------------------
function WetStreet() {
  // Specular puddle reflections mirroring the neon signs directly above
  const puddleData = useMemo(() => [
    { x: -2.8, z: 2.0, w: 2.6, l: 6.0, color: '#FF2DA6', op: 0.45 },
    { x: 2.5, z: 0.0, w: 2.4, l: 7.0, color: '#00E5FF', op: 0.5 },
    { x: -1.5, z: -8.0, w: 2.8, l: 8.5, color: '#FF9E00', op: 0.42 },
    { x: 1.8, z: -14.0, w: 3.2, l: 9.0, color: '#FF2DA6', op: 0.48 },
    { x: -2.2, z: -22.0, w: 2.5, l: 8.0, color: '#00E5FF', op: 0.45 },
    { x: 0.8, z: -28.0, w: 3.0, l: 10.0, color: '#8B5CF6', op: 0.4 },
    { x: -1.2, z: -38.0, w: 2.8, l: 9.0, color: '#FF2DA6', op: 0.45 },
    { x: 1.6, z: -46.0, w: 2.6, l: 8.0, color: '#00E5FF', op: 0.42 },
  ], []);

  // Road lane dividers (dashed neon cyan stripes along center)
  const laneDashes = useMemo(() => {
    const dashes = [];
    for (let z = 12; z >= -80; z -= 4.5) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Dark Asphalt Street Ground */}
      <mesh position={[0, -0.01, -35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 140]} />
        <meshStandardMaterial
          color="#070C16"
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* Sidewalk Curbs (Left & Right) */}
      <mesh position={[-6.2, 0.1, -35]}>
        <boxGeometry args={[2.4, 0.22, 140]} />
        <meshStandardMaterial color="#0E1626" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[6.2, 0.1, -35]}>
        <boxGeometry args={[2.4, 0.22, 140]} />
        <meshStandardMaterial color="#0E1626" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Curb edge glowing guide lines */}
      <mesh position={[-5.01, 0.22, -35]}>
        <boxGeometry args={[0.06, 0.02, 140]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.35} />
      </mesh>
      <mesh position={[5.01, 0.22, -35]}>
        <boxGeometry args={[0.06, 0.02, 140]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.35} />
      </mesh>

      {/* Laser Yellow Digital Ticker Ribbon along sidewalk curb (matching Night City reference) */}
      <mesh position={[4.98, 0.23, -35]}>
        <boxGeometry args={[0.08, 0.04, 140]} />
        <meshStandardMaterial
          color="#FFCC00"
          emissive="#FFCC00"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Center Dashed Lane Markings */}
      {laneDashes.map((z, idx) => (
        <mesh key={idx} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 2.4]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.45} />
        </mesh>
      ))}

      {/* Wet Road Mirror Sheen Puddles */}
      {puddleData.map((p, idx) => (
        <mesh key={idx} position={[p.x, 0.02, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[p.w, p.l]} />
          <meshBasicMaterial
            color={p.color}
            transparent
            opacity={p.op}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------
// OVERHANGING CATENARY POWER CABLES
// ----------------------------------------------------------------------
function OverheadCables() {
  const cableGeometries = useMemo(() => {
    const cables = [
      { start: [-6.5, 7.5, 8], mid: [0, 5.8, 8], end: [6.5, 8.2, 8] },
      { start: [-6.8, 6.8, 4], mid: [0, 5.2, 4], end: [6.8, 7.0, 4] },
      { start: [-7.0, 8.4, -4], mid: [0, 6.4, -4], end: [7.0, 8.8, -4] },
      { start: [-7.2, 9.2, -12], mid: [0, 7.2, -12], end: [7.2, 9.6, -12] },
      { start: [-7.5, 10.0, -22], mid: [0, 8.0, -22], end: [7.5, 10.5, -22] },
      { start: [-7.8, 11.2, -34], mid: [0, 9.2, -34], end: [7.8, 11.6, -34] },
    ];

    return cables.map((c) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...c.start),
        new THREE.Vector3(...c.mid),
        new THREE.Vector3(...c.end)
      );
      return new THREE.TubeGeometry(curve, 20, 0.035, 6, false);
    });
  }, []);

  return (
    <group>
      {cableGeometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshStandardMaterial color="#0A101C" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------
// GOOSENECK STREET LAMPS (Warm Amber downlight pools)
// ----------------------------------------------------------------------
function StreetLamps() {
  const lampPositions = [
    { x: -5.2, z: 6, rot: 0 },
    { x: 5.2, z: 3, rot: Math.PI },
    { x: -5.2, z: -8, rot: 0 },
    { x: 5.2, z: -13, rot: Math.PI },
    { x: -5.2, z: -24, rot: 0 },
    { x: 5.2, z: -32, rot: Math.PI },
    { x: -5.2, z: -44, rot: 0 },
  ];

  return (
    <group>
      {lampPositions.map((pos, idx) => (
        <group key={idx} position={[pos.x, 0, pos.z]} rotation={[0, pos.rot, 0]}>
          {/* Vertical Pole */}
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 4.4, 8]} />
            <meshStandardMaterial color="#111B2C" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Overarching Gooseneck Arm */}
          <mesh position={[0.45, 4.35, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.05, 0.06, 1.2, 8]} />
            <meshStandardMaterial color="#111B2C" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Glowing Amber Lamp Head */}
          <mesh position={[0.9, 4.65, 0]}>
            <boxGeometry args={[0.35, 0.12, 0.22]} />
            <meshStandardMaterial
              color="#FF9E00"
              emissive="#FF9E00"
              emissiveIntensity={2.5}
            />
          </mesh>
          {/* Warm Amber Point Light casting onto street */}
          <pointLight
            position={[0.9, 4.4, 0]}
            color="#FF9E00"
            intensity={2.8}
            distance={9}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------
// CURBSIDE CYBERPUNK VEHICLES / AEROPODS
// ----------------------------------------------------------------------
function CurbsideVehicles() {
  return (
    <group>
      {/* Front Left Orange/Red Pod (Iconic from reference image) */}
      <group position={[-3.8, 0.65, 5.5]} rotation={[0, 0.08, 0]}>
        {/* Main Body Chassis */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.7, 0.85, 3.2]} />
          <meshStandardMaterial color="#D9381E" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Cockpit Canopy */}
        <mesh position={[0, 0.45, -0.2]}>
          <boxGeometry args={[1.4, 0.55, 1.8]} />
          <meshStandardMaterial color="#0A101D" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Glowing Headlights (Cyan) */}
        <mesh position={[0.55, -0.1, 1.62]}>
          <boxGeometry args={[0.35, 0.1, 0.05]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
        <mesh position={[-0.55, -0.1, 1.62]}>
          <boxGeometry args={[0.35, 0.1, 0.05]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
        {/* Neon Undercarriage Glow */}
        <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.9, 3.4]} />
          <meshBasicMaterial color="#FF3366" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Mid Right Parked Cyber Sedan */}
      <group position={[3.8, 0.6, -18]} rotation={[0, Math.PI - 0.05, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.8, 3.6]} />
          <meshStandardMaterial color="#162238" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.42, -0.1]}>
          <boxGeometry args={[1.5, 0.5, 2.0]} />
          <meshStandardMaterial color="#0A0F1A" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Tail Light Strip (Magenta) */}
        <mesh position={[0, 0.1, 1.82]}>
          <boxGeometry args={[1.6, 0.08, 0.05]} />
          <meshBasicMaterial color="#FF2DA6" />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------
// CANYON ARCHITECTURE: Left & Right Street Buildings + Shopfronts + Signs
// ----------------------------------------------------------------------
function StreetBuildings({ level = 1 }) {
  const leftBuildings = useMemo(() => [
    { z: 6, h: 22, w: 7, d: 9, color: '#0F1829', store: { color: '#FF2DA6', label: 'NEO・RAMEN' } },
    { z: -4, h: 32, w: 7, d: 9, color: '#0C1322', store: { color: '#00E5FF', label: 'CYBER・DECK' } },
    { z: -14, h: 42, w: 8, d: 10, color: '#111B30', isHQ: true }, // OPERATIVE HQ
    { z: -25, h: 28, w: 7, d: 10, color: '#0A111E', store: { color: '#FF9E00', label: 'KINETIC・LAB' } },
    { z: -37, h: 36, w: 8, d: 11, color: '#0E1728', store: { color: '#8B5CF6', label: 'SYNAPSE・BAR' } },
    { z: -50, h: 48, w: 8, d: 12, color: '#0B1220', store: { color: '#00E5FF', label: 'NEO・CHIP' } },
    { z: -65, h: 56, w: 9, d: 14, color: '#080E1A', store: { color: '#FF2DA6', label: 'MATRIX・EX' } },
  ], []);

  const rightBuildings = useMemo(() => [
    { z: 4, h: 26, w: 7, d: 9, color: '#0D1525', store: { color: '#00E5FF', label: 'NEO・CLINIC' } },
    { z: -6, h: 38, w: 7, d: 9, color: '#10192C', store: { color: '#FF2DA6', label: 'GLITCH・ARCADE' } },
    { z: -17, h: 30, w: 8, d: 10, color: '#0C1322', store: { color: '#39FF88', label: 'BIO・MODS' } },
    { z: -29, h: 45, w: 8, d: 10, color: '#121C32', store: { color: '#FF9E00', label: 'CORP・TOWER' } },
    { z: -42, h: 35, w: 8, d: 11, color: '#09101C', store: { color: '#00E5FF', label: 'DATA・HAVEN' } },
    { z: -55, h: 52, w: 9, d: 12, color: '#0E1728', store: { color: '#8B5CF6', label: 'AERO・CORP' } },
    { z: -70, h: 62, w: 9, d: 14, color: '#080E18', store: { color: '#FF2DA6', label: 'QUANTUM・HQ' } },
  ], []);

  // Vertical blade neon signs protruding perpendicular from buildings into the street
  const verticalSigns = useMemo(() => [
    // Left side signs
    { x: -7.6, y: 7.5, z: 8, h: 4.8, w: 0.8, color: '#FF2DA6', rotY: 0 },
    { x: -7.6, y: 12.0, z: 7, h: 6.2, w: 1.1, color: '#00E5FF', rotY: 0 },
    { x: -7.6, y: 8.5, z: -2, h: 5.5, w: 0.9, color: '#FF9E00', rotY: 0 },
    { x: -7.6, y: 15.0, z: -12, h: 8.0, w: 1.3, color: '#00E5FF', isHQSign: true, rotY: 0 },
    { x: -7.6, y: 8.0, z: -22, h: 5.2, w: 0.9, color: '#8B5CF6', rotY: 0 },
    { x: -7.6, y: 11.5, z: -35, h: 6.5, w: 1.0, color: '#FF2DA6', rotY: 0 },
    { x: -7.6, y: 14.0, z: -48, h: 7.5, w: 1.2, color: '#00E5FF', rotY: 0 },

    // Right side signs (Iconic Japanese/cyber glyph signs from reference image)
    { x: 7.6, y: 8.0, z: 6, h: 5.4, w: 0.9, color: '#00E5FF', rotY: Math.PI },
    { x: 7.6, y: 13.5, z: 5, h: 7.0, w: 1.2, color: '#FF2DA6', rotY: Math.PI },
    { x: 7.6, y: 7.0, z: -4, h: 4.8, w: 0.85, color: '#39FF88', rotY: Math.PI },
    { x: 7.6, y: 11.0, z: -15, h: 6.0, w: 1.0, color: '#FF9E00', rotY: Math.PI },
    { x: 7.6, y: 9.5, z: -27, h: 5.8, w: 0.95, color: '#FF2DA6', rotY: Math.PI },
    { x: 7.6, y: 14.0, z: -40, h: 7.2, w: 1.2, color: '#00E5FF', rotY: Math.PI },
  ], []);

  return (
    <group>
      {/* Left Buildings */}
      {leftBuildings.map((b, idx) => (
        <group key={`lb-${idx}`} position={[-11, b.h / 2, b.z]}>
          {/* Main Facade */}
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} metalness={0.75} roughness={0.3} />
          </mesh>

          {/* Storefront / Ground Floor Interior (Amber/Cyan/Magenta glowing entrance) */}
          {b.store && (
            <group position={[b.w / 2 - 0.2, -b.h / 2 + 1.8, 0]}>
              <mesh>
                <boxGeometry args={[0.5, 3.2, b.d * 0.7]} />
                <meshStandardMaterial
                  color={b.store.color}
                  emissive={b.store.color}
                  emissiveIntensity={1.4}
                />
              </mesh>
              {/* Storefront Awning */}
              <mesh position={[0.4, 1.8, 0]} rotation={[0, 0, -Math.PI / 10]}>
                <boxGeometry args={[0.9, 0.1, b.d * 0.8]} />
                <meshStandardMaterial color="#0A101C" metalness={0.8} />
              </mesh>
              {/* Point Light casting street glow */}
              <pointLight color={b.store.color} intensity={2.0} distance={7} />
            </group>
          )}

          {/* OPERATIVE HQ SPECIAL STRUCTURE */}
          {b.isHQ && (
            <group position={[b.w / 2 + 0.1, 0, 0]}>
              {/* Glowing High-Tech Edge Trims */}
              <mesh position={[0, 0, b.d * 0.45]}>
                <boxGeometry args={[0.2, b.h * 0.9, 0.2]} />
                <meshBasicMaterial color="#00E5FF" />
              </mesh>
              <mesh position={[0, 0, -b.d * 0.45]}>
                <boxGeometry args={[0.2, b.h * 0.9, 0.2]} />
                <meshBasicMaterial color="#00E5FF" />
              </mesh>
              {/* Holographic Rooftop Spire */}
              <mesh position={[-b.w / 2, b.h / 2 + 4, 0]}>
                <coneGeometry args={[1.2, 8, 4]} />
                <meshStandardMaterial
                  color="#00E5FF"
                  emissive="#00E5FF"
                  emissiveIntensity={2.5}
                  wireframe
                />
              </mesh>
              {/* Beacon Light */}
              <pointLight position={[0, b.h / 2 + 6, 0]} color="#00E5FF" intensity={4.5} distance={20} />
            </group>
          )}
        </group>
      ))}

      {/* Right Buildings */}
      {rightBuildings.map((b, idx) => (
        <group key={`rb-${idx}`} position={[11, b.h / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} metalness={0.75} roughness={0.3} />
          </mesh>

          {/* ICONIC HOT MAGENTA MOTEL SIGN (Matching Night City reference image) */}
          {idx === 0 && (
            <group position={[-b.w / 2 - 0.2, -b.h / 2 + 3.8, 0]}>
              {/* Neon Outer Rounded Marquee Box */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.2, 1.2, b.d * 0.75]} />
                <meshStandardMaterial color="#0A0E18" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Hot Magenta Neon Border Tubes */}
              <mesh position={[-0.12, 0, 0]}>
                <boxGeometry args={[0.08, 1.05, b.d * 0.72]} />
                <meshStandardMaterial
                  color="#FF0055"
                  emissive="#FF0055"
                  emissiveIntensity={3.6}
                />
              </mesh>
              {/* Inner Glowing Cyan Marquee Text Core (NO-TELL MOTEL // NO VACANCY) */}
              <mesh position={[-0.14, 0, -0.6]}>
                <boxGeometry args={[0.06, 0.55, b.d * 0.38]} />
                <meshStandardMaterial
                  color="#00F3FF"
                  emissive="#00F3FF"
                  emissiveIntensity={2.8}
                />
              </mesh>
              {/* Secondary Red-Orange "NO VACANCY" Glow */}
              <mesh position={[-0.14, 0, 1.2]}>
                <boxGeometry args={[0.06, 0.45, 1.6]} />
                <meshStandardMaterial
                  color="#FF3366"
                  emissive="#FF3366"
                  emissiveIntensity={2.4}
                />
              </mesh>
              {/* Industrial Overhanging Balconies */}
              <mesh position={[-0.6, 2.5, 0]}>
                <boxGeometry args={[1.6, 0.2, b.d * 0.85]} />
                <meshStandardMaterial color="#121A2C" metalness={0.85} roughness={0.35} />
              </mesh>
              <mesh position={[-0.6, 5.5, 0]}>
                <boxGeometry args={[1.6, 0.2, b.d * 0.85]} />
                <meshStandardMaterial color="#121A2C" metalness={0.85} roughness={0.35} />
              </mesh>
              {/* Vibrant Hot Magenta Downward Glow onto pavement */}
              <pointLight position={[-0.8, -1.0, 0]} color="#FF0055" intensity={4.5} distance={10} decay={2} />
            </group>
          )}

          {b.store && (
            <group position={[-b.w / 2 + 0.2, -b.h / 2 + 1.8, 0]}>
              <mesh>
                <boxGeometry args={[0.5, 3.2, b.d * 0.7]} />
                <meshStandardMaterial
                  color={b.store.color}
                  emissive={b.store.color}
                  emissiveIntensity={1.4}
                />
              </mesh>
              <mesh position={[-0.4, 1.8, 0]} rotation={[0, 0, Math.PI / 10]}>
                <boxGeometry args={[0.9, 0.1, b.d * 0.8]} />
                <meshStandardMaterial color="#0A101C" metalness={0.8} />
              </mesh>
              <pointLight color={b.store.color} intensity={2.0} distance={7} />
            </group>
          )}
        </group>
      ))}

      {/* Protruding Vertical Neon Blade Signs (Signature Japanese / Cyberpunk Street Look) */}
      {verticalSigns.map((s, idx) => (
        <group key={`vs-${idx}`} position={[s.x, s.y, s.z]} rotation={[0, s.rotY, 0]}>
          {/* Neon Blade Backing Plate */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, s.h, s.w]} />
            <meshStandardMaterial color="#080D18" metalness={0.8} />
          </mesh>
          {/* Outer Glowing Neon Rim Border */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.14, s.h * 0.96, s.w * 0.9]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={2.8}
            />
          </mesh>
          {/* Point Light casting ambient glow */}
          <pointLight color={s.color} intensity={1.8} distance={6} />
        </group>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------
// DISTANT SKYLINE MEGASTRUCTURES (Center Vanishing Point in Mist)
// ----------------------------------------------------------------------
function DistantSkyline() {
  const spires = useMemo(() => [
    { x: 0, y: 48, z: -95, w: 9, h: 96, d: 9, color: '#090F1E', accent: '#00E5FF' },
    { x: -14, y: 40, z: -85, w: 10, h: 80, d: 10, color: '#080D1A', accent: '#FF2DA6' },
    { x: 15, y: 44, z: -90, w: 11, h: 88, d: 11, color: '#070C17', accent: '#8B5CF6' },
    { x: -28, y: 35, z: -105, w: 14, h: 70, d: 14, color: '#060A14', accent: '#00E5FF' },
    { x: 29, y: 36, z: -108, w: 15, h: 72, d: 15, color: '#060A14', accent: '#FF9E00' },
  ], []);

  // Moving Traffic Light Trails on Mid-Distance Elevated Highway Bridge
  const trafficCount = 18;
  const trafficRef = useRef();

  useFrame((_, delta) => {
    if (trafficRef.current) {
      trafficRef.current.children.forEach((mesh, idx) => {
        const isEast = idx % 2 === 0;
        mesh.position.x += delta * (isEast ? 8.5 : -8.5);
        if (isEast && mesh.position.x > 35) mesh.position.x = -35;
        if (!isEast && mesh.position.x < -35) mesh.position.x = 35;
      });
    }
  });

  return (
    <group>
      {/* Elevated Highway Bridge Crossing Mid-Distance */}
      <group position={[0, 8.5, -48]}>
        {/* Bridge Girder Span */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[70, 0.8, 4.2]} />
          <meshStandardMaterial color="#0B1322" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Neon Safety Rails */}
        <mesh position={[0, 0.6, 2.0]}>
          <boxGeometry args={[70, 0.15, 0.1]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
        <mesh position={[0, 0.6, -2.0]}>
          <boxGeometry args={[70, 0.15, 0.1]} />
          <meshBasicMaterial color="#FF2DA6" />
        </mesh>

        {/* Traffic Light Trails */}
        <group ref={trafficRef}>
          {Array.from({ length: trafficCount }, (_, idx) => {
            const isEast = idx % 2 === 0;
            const startX = -32 + (idx / trafficCount) * 64;
            return (
              <mesh
                key={idx}
                position={[startX, 0.45, isEast ? 0.9 : -0.9]}
              >
                <boxGeometry args={[2.2, 0.12, 0.2]} />
                <meshBasicMaterial color={isEast ? '#00E5FF' : '#FF2DA6'} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Massive Megastructure Towers */}
      {spires.map((s, idx) => (
        <group key={`sp-${idx}`} position={[s.x, s.y, s.z]}>
          <mesh>
            <boxGeometry args={[s.w, s.h, s.d]} />
            <meshStandardMaterial color={s.color} metalness={0.8} roughness={0.35} />
          </mesh>
          {/* Spire Antenna */}
          <mesh position={[0, s.h / 2 + 6, 0]}>
            <cylinderGeometry args={[0.08, 0.4, 12, 6]} />
            <meshStandardMaterial color={s.accent} emissive={s.accent} emissiveIntensity={1.6} />
          </mesh>
          {/* Aircraft Warning Beacon (Blinking) */}
          <pointLight position={[0, s.h / 2 + 12, 0]} color="#FF3366" intensity={2.5} distance={15} />
        </group>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------
// FLYING AEROCARS & DIGITAL RAIN MIST
// ----------------------------------------------------------------------
function AtmosphereAndTraffic({ level = 1 }) {
  const aerocarsRef = useRef();
  const rainRef = useRef();
  const rainCount = 120;

  // Cruising Aerocars in the high sky between towers
  const aerocars = useMemo(() => [
    { x: -18, y: 18, z: -15, speed: 6.5, dir: 1, color: '#00E5FF' },
    { x: 22, y: 24, z: -30, speed: 7.2, dir: -1, color: '#FF2DA6' },
    { x: -12, y: 32, z: -45, speed: 5.8, dir: 1, color: '#FF9E00' },
  ], []);

  // Gentle Cyber Mist Drizzle
  const rainPositions = useMemo(() => {
    const arr = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 20;
      arr[i * 3 + 2] = -50 + Math.random() * 65;
    }
    return arr;
  }, [rainCount]);

  useFrame((_, delta) => {
    // Aerocars flying motion
    if (aerocarsRef.current) {
      aerocarsRef.current.children.forEach((group, idx) => {
        const car = aerocars[idx];
        group.position.x += delta * car.speed * car.dir;
        if (car.dir === 1 && group.position.x > 35) group.position.x = -35;
        if (car.dir === -1 && group.position.x < -35) group.position.x = 35;
      });
    }

    // Gentle rain fall
    if (rainRef.current) {
      const posAttr = rainRef.current.geometry.attributes.position;
      for (let i = 0; i < rainCount; i++) {
        let y = posAttr.getY(i) - delta * 9.0;
        if (y < 0) y = 20;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* High Sky Aerocars */}
      <group ref={aerocarsRef}>
        {aerocars.map((c, idx) => (
          <group key={idx} position={[c.x, c.y, c.z]}>
            <mesh>
              <boxGeometry args={[2.4, 0.5, 1.2]} />
              <meshStandardMaterial color="#0A101C" metalness={0.9} />
            </mesh>
            {/* Glowing neon side stripe */}
            <mesh position={[0, 0, 0.61]}>
              <boxGeometry args={[2.2, 0.1, 0.04]} />
              <meshBasicMaterial color={c.color} />
            </mesh>
            <mesh position={[0, 0, -0.61]}>
              <boxGeometry args={[2.2, 0.1, 0.04]} />
              <meshBasicMaterial color={c.color} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Cyber Rain Mist */}
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
          size={0.07}
          color="#00E5FF"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ----------------------------------------------------------------------
// MAIN EXPORT: 3D Cyberpunk City Simulation
// ----------------------------------------------------------------------
export default function CyberEnvironment({ level = 1 }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#050814',
      }}
    >
      <Canvas
        camera={{ position: [0, 1.9, 14], fov: 48, near: 0.1, far: 220 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ scene }) => {
          // Atmospheric Cyberpunk Violet/Indigo Fog matching reference image
          scene.fog = new THREE.FogExp2('#060A18', 0.012);
        }}
      >
        {/* Street Human-Eye Perspective Camera */}
        <StreetCamera />

        {/* Dynamic City Lighting */}
        <ambientLight intensity={0.75} color="#0A1428" />
        <directionalLight position={[0, 25, 10]} intensity={0.65} color="#1E293B" />

        {/* Key Atmospheric Ambient Street Lights */}
        <pointLight position={[0, 10, 5]} intensity={2.5} color="#FF2DA6" distance={25} />
        <pointLight position={[0, 12, -20]} intensity={2.8} color="#00E5FF" distance={30} />
        <pointLight position={[0, 15, -45]} intensity={3.2} color="#8B5CF6" distance={35} />

        {/* 3D Cyberpunk City Components */}
        <WetStreet />
        <StreetBuildings level={level} />
        <StreetLamps />
        <CurbsideVehicles />
        <OverheadCables />
        <DistantSkyline />
        <AtmosphereAndTraffic level={level} />
      </Canvas>
    </div>
  );
}
