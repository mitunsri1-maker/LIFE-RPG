import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function XPParticleFlow({ active = false, onComplete }) {
  const pointsRef = useRef();
  const progressRef = useRef(0);
  const count = 60;

  // Generate curved trajectory from quest panel position to central energy core
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      return {
        offset: Math.random() * 0.25,
        speed: 0.8 + Math.random() * 0.5,
        startPos: new THREE.Vector3(
          2.5 + (Math.random() - 0.5) * 1.2,
          -1.5 + (Math.random() - 0.5) * 0.8,
          1.5 + Math.random() * 0.5
        ),
        midPos: new THREE.Vector3(
          1.0 + (Math.random() - 0.5) * 1.5,
          0.5 + Math.random() * 1.2,
          0.8 + (Math.random() - 0.5) * 1.0
        ),
        endPos: new THREE.Vector3(0, 0.3, 0), // Energy core center
        color: i % 2 === 0 ? new THREE.Color('#00E5FF') : new THREE.Color('#FF2DA6'),
        size: 0.06 + Math.random() * 0.05,
      };
    });
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      arr[i * 3] = p.color.r;
      arr[i * 3 + 1] = p.color.g;
      arr[i * 3 + 2] = p.color.b;
    });
    return arr;
  }, [particles, count]);

  useEffect(() => {
    if (active) {
      progressRef.current = 0;
    }
  }, [active]);

  useFrame((_, delta) => {
    if (!active || !pointsRef.current) return;

    progressRef.current += delta * 1.1;
    const progress = progressRef.current;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const curve = new THREE.QuadraticBezierCurve3();

    particles.forEach((p, i) => {
      const localP = Math.min(1, Math.max(0, (progress - p.offset) * p.speed));
      curve.v0 = p.startPos;
      curve.v1 = p.midPos;
      curve.v2 = p.endPos;

      const point = curve.getPoint(localP);
      posAttr.setXYZ(i, point.x, point.y, point.z);
    });

    posAttr.needsUpdate = true;

    if (progress >= 1.4) {
      onComplete?.();
    }
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
