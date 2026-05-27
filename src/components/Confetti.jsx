import React, { useEffect, useState } from 'react';

const COLORS = ['#9d8fef','#22c68a','#fbbf24','#fb7185','#60a5fa','#f97316','#a78bfa','#34d399'];
const SHAPES = ['circle','square','triangle'];

export default function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!trigger) return;
    const p = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 6 + Math.random() * 10,
      delay: Math.random() * 0.6,
      dur: 1.2 + Math.random() * 1,
      rotate: Math.random() * 720 - 360,
      vx: (Math.random() - 0.5) * 200,
    }));
    setParticles(p);
    setTimeout(() => setParticles([]), 2500);
  }, [trigger]);

  if (!particles.length) return null;
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999, overflow:'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:'absolute',
          left: `${p.x}%`, top:'35%',
          width: p.size, height: p.size,
          borderRadius: p.shape==='circle' ? '50%' : p.shape==='square' ? '2px' : '0',
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`,
          clipPath: p.shape==='triangle' ? 'polygon(50% 0%,0% 100%,100% 100%)' : 'none',
          animation: `confetti ${p.dur}s cubic-bezier(0.25,0.46,0.45,0.94) ${p.delay}s both`,
        }} />
      ))}
    </div>
  );
}
