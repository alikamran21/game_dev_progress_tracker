import React, { useRef, useCallback, useState, useEffect } from 'react';
import AnimatedCounter from './AnimatedCounter';

function Avatar({ name, slot, size = 44 }) {
  const initials = name.slice(0, 2).toUpperCase();
  const isP1 = slot === 'p1';
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [name]);

  return (
    <div style={{ position:'relative', flexShrink:0 }}>
      {pulse && (
        <div style={{
          position:'absolute', inset:-4,
          borderRadius:'50%',
          border: `2px solid ${isP1 ? '#8b7ee0' : '#22c68a'}`,
          animation:'pulse-ring 0.6s ease-out forwards',
        }} />
      )}
      <div style={{
        width: size, height: size, borderRadius: size * 0.38,
        background: isP1
          ? 'linear-gradient(135deg, #8b7ee0, #6c5fc7)'
          : 'linear-gradient(135deg, #22c68a, #16a370)',
        boxShadow: isP1
          ? '3px 3px 8px rgba(108,95,199,0.45), -2px -2px 6px rgba(255,255,255,0.9)'
          : '3px 3px 8px rgba(22,163,112,0.45), -2px -2px 6px rgba(255,255,255,0.9)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'white', fontWeight:800, fontSize: size * 0.36,
        letterSpacing:'-0.5px',
        animation: 'glow-pulse 3s ease-in-out infinite',
        animationDelay: isP1 ? '0s' : '1.5s',
      }}>
        {initials}
      </div>
    </div>
  );
}

function LiveDot() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <div style={{ position:'relative', width:8, height:8 }}>
        <div style={{
          width:8, height:8, borderRadius:'50%', background:'#22c68a',
          position:'absolute',
        }} />
        <div style={{
          width:8, height:8, borderRadius:'50%', background:'#22c68a',
          position:'absolute',
          animation:'pulse-ring 1.5s ease-out infinite',
        }} />
      </div>
      <span style={{ fontSize:10, fontWeight:700, color:'#1aad7a' }}>LIVE</span>
    </div>
  );
}

export default function PlayerCard({ name, slot, doneCount, total, isMe }) {
  const cardRef = useRef(null);
  const pct = total ? Math.round(doneCount / total * 100) : 0;
  const isP1 = slot === 'p1';
  const color = isP1 ? '#7c6fd4' : '#1aad7a';
  const lightColor = isP1 ? '#ede9ff' : '#d4f5ea';

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px) scale(1.01)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="clay tilt-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding:'18px 20px',
        outline: isMe ? `2px solid ${color}55` : 'none',
        position:'relative', overflow:'hidden',
        transition:'transform 0.15s ease, box-shadow 0.25s ease',
        cursor:'default',
      }}
    >
      {/* Animated bg blob */}
      <div style={{
        position:'absolute', bottom:-30, right:-30,
        width:120, height:120, borderRadius:'50%',
        background:`${color}12`,
        animation:`float-orb ${isP1 ? '8s' : '10s'} ease-in-out infinite`,
        pointerEvents:'none',
      }} />
      <div style={{
        position:'absolute', top:-20, left:-20,
        width:80, height:80, borderRadius:'50%',
        background:`${color}08`,
        animation:`float-orb ${isP1 ? '12s' : '9s'} ease-in-out infinite`,
        animationDelay:'-3s',
        pointerEvents:'none',
      }} />

      {isMe && (
        <div style={{
          position:'absolute', top:12, right:12,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <LiveDot />
          <div style={{
            background: lightColor, color, borderRadius:10,
            fontSize:10, fontWeight:800, padding:'3px 8px',
            letterSpacing:'0.05em',
          }}>YOU</div>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
        <Avatar name={name} slot={slot} size={46} />
        <div>
          <div style={{ fontWeight:800, fontSize:16, color:'var(--text-primary)', marginBottom:2 }}>{name}</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-body)' }}>
            <AnimatedCounter value={doneCount} style={{ fontWeight:700, color }} /> / {total} topics
          </div>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:10 }}>
        <AnimatedCounter value={pct} style={{
          fontSize:34, fontWeight:900, color,
          letterSpacing:'-1px', lineHeight:1,
        }} />
        <span style={{ fontSize:16, fontWeight:700, color }}>{pct > 0 ? '%' : '%'}</span>
      </div>

      <div className="progress-track" style={{ marginBottom:8 }}>
        <div className={`progress-fill-${slot}`} style={{ width:`${pct}%` }} />
      </div>

      <div style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-body)' }}>
        {total - doneCount} topics remaining
      </div>

      {pct === 100 && (
        <div style={{
          position:'absolute', inset:0, borderRadius:'var(--radius-lg)',
          background:'linear-gradient(135deg, rgba(124,111,212,0.08), rgba(26,173,122,0.08))',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:32,
          animation:'pop 0.5s ease',
        }}>
          🎉
        </div>
      )}
    </div>
  );
}
