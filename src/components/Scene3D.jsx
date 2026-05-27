import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const mouse = { x: 0, y: 0 };

// ── Particles that gently drift away from cursor ────────────────────────────
function InteractiveParticles({ count = 300 }) {
  const mesh = useRef();

  const { base, current, velocities, colors } = useMemo(() => {
    const base       = new Float32Array(count * 3);
    const current    = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors     = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 10 - 2;
      base[i*3] = current[i*3] = x;
      base[i*3+1] = current[i*3+1] = y;
      base[i*3+2] = current[i*3+2] = z;

      const t = Math.random();
      if (t < 0.6) {
        colors[i*3]   = 0.55 + Math.random()*0.2;
        colors[i*3+1] = 0.44 + Math.random()*0.2;
        colors[i*3+2] = 0.85 + Math.random()*0.15;
      } else if (t < 0.85) {
        colors[i*3]   = 0.1;
        colors[i*3+1] = 0.6 + Math.random()*0.3;
        colors[i*3+2] = 0.4 + Math.random()*0.2;
      } else {
        colors[i*3] = colors[i*3+1] = colors[i*3+2] = 0.9;
      }
    }
    return { base, current, velocities, colors };
  }, [count]);

  const { camera } = useThree();

  useFrame(() => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;

    // Project mouse to world space
    const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vec.unproject(camera);
    const dir  = vec.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const cursorWorld = new THREE.Vector3().addVectors(camera.position, dir.multiplyScalar(dist));

    const REPEL_RADIUS = 3.2;
    const REPEL_FORCE  = 0.06;  // very gentle push
    const RETURN_FORCE = 0.012; // slow spring back
    const DAMPING      = 0.92;  // heavy damping = slow, floaty feel

    for (let i = 0; i < count; i++) {
      const ix = i*3, iy = i*3+1;
      const cx = current[ix], cy = current[iy];
      const dx = cx - cursorWorld.x;
      const dy = cy - cursorWorld.y;
      const d  = Math.sqrt(dx*dx + dy*dy);

      if (d < REPEL_RADIUS && d > 0.001) {
        const force = (REPEL_RADIUS - d) / REPEL_RADIUS * REPEL_FORCE;
        velocities[ix] += (dx / d) * force;
        velocities[iy] += (dy / d) * force;
      }

      // Spring back home
      velocities[ix] += (base[ix] - cx) * RETURN_FORCE;
      velocities[iy] += (base[iy] - cy) * RETURN_FORCE;

      // Damp & integrate
      velocities[ix] *= DAMPING;
      velocities[iy] *= DAMPING;
      current[ix] += velocities[ix];
      current[iy] += velocities[iy];

      pos[ix] = current[ix];
      pos[iy] = current[iy];
      pos[i*3+2] = base[i*3+2];
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={current} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colors}  count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ── Cursor light that softly follows mouse ──────────────────────────────────
function CursorLight() {
  const light  = useRef();
  const smooth = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!light.current) return;
    smooth.current.x += (mouse.x * 6 - smooth.current.x) * 0.05;
    smooth.current.y += (mouse.y * 4 - smooth.current.y) * 0.05;
    light.current.position.set(smooth.current.x, smooth.current.y, 4);
  });

  return <pointLight ref={light} intensity={1.5} distance={12} color="#9d8fef" />;
}

// ── Floating distorted spheres ──────────────────────────────────────────────
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
          color={color} attach="material" distort={distort} speed={2}
          roughness={0.1} metalness={0.8} transparent opacity={0.55}
        />
      </Sphere>
    </Float>
  );
}

// ── Ring that gently tilts toward cursor ────────────────────────────────────
function CursorRing() {
  const ring = useRef();
  useFrame((state) => {
    if (!ring.current) return;
    ring.current.rotation.y  = state.clock.elapsedTime * 0.2;
    ring.current.rotation.x += (mouse.y * 0.5 - ring.current.rotation.x) * 0.03;
    ring.current.rotation.z += (-mouse.x * 0.25 - ring.current.rotation.z) * 0.03;
  });
  return (
    <mesh ref={ring} position={[3, 0, -2]}>
      <torusGeometry args={[2.2, 0.025, 16, 100]} />
      <meshStandardMaterial color="#7c6fd4" transparent opacity={0.35} metalness={1} roughness={0} />
    </mesh>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────
export default function Scene3D() {
  useEffect(() => {
    const onMove = (e) => {
      mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
      <Canvas camera={{ position:[0,0,8], fov:60 }} gl={{ antialias:true, alpha:true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10,10,10]}  intensity={0.8} color="#9d8fef" />
        <pointLight position={[-10,-5,-10]} intensity={0.6} color="#22c68a" />
        <CursorLight />

        {/* Deep background stars — very slow, barely moving */}
        <Stars radius={120} depth={80} count={3000} factor={2.5} saturation={0} fade speed={0.2} />

        <InteractiveParticles count={300} />

        <FloatingSphere position={[-4,  2, -3]} color="#6c5fc7" speed={1.2} distort={0.5} scale={1.8} />
        <FloatingSphere position={[ 4, -1.5,-4]} color="#0d8a60" speed={0.8} distort={0.4} scale={1.4} />
        <FloatingSphere position={[ 0,  3, -6]} color="#4a3fa0" speed={1.5} distort={0.6} scale={2.2} />
        <CursorRing />
      </Canvas>
    </div>
  );
}
