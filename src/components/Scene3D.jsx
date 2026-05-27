import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Shared mouse position in normalized [-1,1] space, updated from DOM
const mouse = { x: 0, y: 0, vx: 0, vy: 0 };

// ── Interactive particle field — particles flee the cursor ──────────────────
function InteractiveParticles({ count = 300 }) {
  const mesh      = useRef();
  const colorMesh = useRef();

  // Store base positions + current positions + velocities
  const { base, current, velocities, colors } = useMemo(() => {
    const base       = new Float32Array(count * 3);
    const current    = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors     = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 10 - 2;
      base[i*3]   = current[i*3]   = x;
      base[i*3+1] = current[i*3+1] = y;
      base[i*3+2] = current[i*3+2] = z;
      velocities[i*3] = velocities[i*3+1] = velocities[i*3+2] = 0;

      // Colour: mostly purple-blue, some green accents
      const t = Math.random();
      if (t < 0.6) {
        colors[i*3]   = 0.55 + Math.random()*0.2;  // r
        colors[i*3+1] = 0.44 + Math.random()*0.2;  // g
        colors[i*3+2] = 0.85 + Math.random()*0.15; // b
      } else if (t < 0.85) {
        colors[i*3]   = 0.1;
        colors[i*3+1] = 0.6 + Math.random()*0.3;
        colors[i*3+2] = 0.4 + Math.random()*0.2;
      } else {
        colors[i*3]   = colors[i*3+1] = colors[i*3+2] = 0.9; // white star
      }
    }
    return { base, current, velocities, colors };
  }, [count]);

  const { camera, size } = useThree();

  useFrame(() => {
    if (!mesh.current) return;
    const geo  = mesh.current.geometry;
    const pos  = geo.attributes.position.array;

    // Project mouse from NDC to world space at z=0
    const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const cursorWorld = new THREE.Vector3().addVectors(camera.position, dir.multiplyScalar(dist));

    const REPEL_RADIUS  = 3.5;   // world-units radius of cursor influence
    const REPEL_FORCE   = 0.22;  // how hard particles are pushed
    const RETURN_FORCE  = 0.018; // spring constant back to home
    const DAMPING       = 0.88;  // velocity damping per frame

    for (let i = 0; i < count; i++) {
      const ix = i*3, iy = i*3+1, iz = i*3+2;

      const cx = current[ix], cy = current[iy];
      const dx = cx - cursorWorld.x;
      const dy = cy - cursorWorld.y;
      const distSq = dx*dx + dy*dy;
      const d = Math.sqrt(distSq);

      if (d < REPEL_RADIUS && d > 0.001) {
        // Stronger push the closer you are
        const force = (REPEL_RADIUS - d) / REPEL_RADIUS * REPEL_FORCE;
        velocities[ix] += (dx / d) * force;
        velocities[iy] += (dy / d) * force;
      }

      // Spring back to base position
      velocities[ix] += (base[ix] - cx) * RETURN_FORCE;
      velocities[iy] += (base[iy] - cy) * RETURN_FORCE;

      // Damp and integrate
      velocities[ix] *= DAMPING;
      velocities[iy] *= DAMPING;

      current[ix] += velocities[ix];
      current[iy] += velocities[iy];

      pos[ix] = current[ix];
      pos[iy] = current[iy];
      pos[iz] = base[iz];
    }

    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={current}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

// ── Cursor attractor light that follows mouse ───────────────────────────────
function CursorLight() {
  const light  = useRef();
  const target = useRef({ x: 0, y: 0 });
  const { camera, size } = useThree();

  useFrame(() => {
    if (!light.current) return;
    // Smooth follow
    target.current.x += (mouse.x * 6 - target.current.x) * 0.08;
    target.current.y += (mouse.y * 4 - target.current.y) * 0.08;
    light.current.position.set(target.current.x, target.current.y, 3);
  });

  return (
    <pointLight
      ref={light}
      intensity={1.8}
      distance={10}
      color="#9d8fef"
    />
  );
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
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.55}
        />
      </Sphere>
    </Float>
  );
}

// ── Spinning ring that tilts toward cursor ──────────────────────────────────
function CursorRing() {
  const ring = useRef();
  useFrame((state) => {
    if (!ring.current) return;
    ring.current.rotation.y  = state.clock.elapsedTime * 0.2;
    // Tilt toward cursor
    ring.current.rotation.x += (mouse.y * 0.6 - ring.current.rotation.x) * 0.04;
    ring.current.rotation.z += (-mouse.x * 0.3 - ring.current.rotation.z) * 0.04;
  });
  return (
    <mesh ref={ring} position={[3, 0, -2]}>
      <torusGeometry args={[2.2, 0.025, 16, 100]} />
      <meshStandardMaterial color="#7c6fd4" transparent opacity={0.35} metalness={1} roughness={0} />
    </mesh>
  );
}

// ── Cursor trail constellation ──────────────────────────────────────────────
function CursorTrail() {
  const mesh    = useRef();
  const TRAIL   = 40;
  const history = useRef(Array(TRAIL).fill([0, 0, -1]));
  const frame   = useRef(0);
  const { camera } = useThree();

  const positions = useMemo(() => new Float32Array(TRAIL * 3), []);

  useFrame(() => {
    if (!mesh.current) return;

    // Project mouse to world
    const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vec.unproject(camera);
    const dir  = vec.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const wp   = new THREE.Vector3().addVectors(camera.position, dir.multiplyScalar(dist));

    // Shift history
    history.current.unshift([wp.x, wp.y, 0]);
    history.current = history.current.slice(0, TRAIL);

    const arr = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < TRAIL; i++) {
      arr[i*3]   = history.current[i][0];
      arr[i*3+1] = history.current[i][1];
      arr[i*3+2] = history.current[i][2];
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;

    // Fade size and opacity by index
    const mat = mesh.current.material;
    mat.opacity = 0.55;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={TRAIL} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#c4b8ff"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ── Root component ──────────────────────────────────────────────────────────
export default function Scene3D() {
  // Track mouse in normalised device coords [-1,1]
  useEffect(() => {
    const onMove = (e) => {
      mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]}   intensity={0.8} color="#9d8fef" />
        <pointLight position={[-10,-5,-10]}   intensity={0.6} color="#22c68a" />
        <CursorLight />

        <Stars radius={100} depth={60} count={3000} factor={3} saturation={0} fade speed={0.3} />
        <InteractiveParticles count={350} />
        <CursorTrail />

        <FloatingSphere position={[-4,  2,  -3]} color="#6c5fc7" speed={1.2} distort={0.5} scale={1.8} />
        <FloatingSphere position={[ 4, -1.5,-4]} color="#0d8a60" speed={0.8} distort={0.4} scale={1.4} />
        <FloatingSphere position={[ 0,  3,  -6]} color="#4a3fa0" speed={1.5} distort={0.6} scale={2.2} />
        <CursorRing />
      </Canvas>
    </div>
  );
}
