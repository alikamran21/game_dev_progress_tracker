import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingSphere({ position, color, speed, distort, scale }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
  });
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField({ count = 120 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.04;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#9d8fef" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function RingGeometry() {
  const ring = useRef();
  useFrame((state) => {
    if (!ring.current) return;
    ring.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
    ring.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={ring} position={[3, 0, -2]}>
      <torusGeometry args={[2, 0.03, 16, 80]} />
      <meshStandardMaterial color="#7c6fd4" transparent opacity={0.4} metalness={1} roughness={0} />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
      <Canvas camera={{ position:[0,0,8], fov:60 }} gl={{ antialias:true, alpha:true }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10,10,10]} intensity={1} color="#9d8fef" />
        <pointLight position={[-10,-5,-10]} intensity={0.8} color="#22c68a" />
        <Stars radius={80} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
        <ParticleField count={150} />
        <FloatingSphere position={[-4, 2, -3]} color="#6c5fc7" speed={1.2} distort={0.5} scale={1.8} />
        <FloatingSphere position={[4, -1.5, -4]} color="#0d8a60" speed={0.8} distort={0.4} scale={1.4} />
        <FloatingSphere position={[0, 3, -6]} color="#4a3fa0" speed={1.5} distort={0.6} scale={2.2} />
        <RingGeometry />
      </Canvas>
    </div>
  );
}
