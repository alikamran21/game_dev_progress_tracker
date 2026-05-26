import React, { useEffect, useState } from 'react';

const COLORS = ['#8b7ee0','#22c68a','#fbbf24','#fb7185','#60a5fa','#a78bfa'];

export default function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const p = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 6,
      delay: Math.random() * 0.4,
      dur: 0.8 + Math.random() * 0.5,
      rotate: Math.random() * 360,
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 1500);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!particles.length) return null;
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:999, overflow:'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:'absolute',
          left: `${p.x}%`,
          top: '40%',
          width: p.size,
          height: p.size,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          background: p.color,
          animation: `confetti-fall ${p.dur}s ease-in ${p.delay}s both`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  );
}
