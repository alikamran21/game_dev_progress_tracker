// src/components/PlayerCard.jsx
import React from 'react';

function Avatar({ name, slot, size = 44 }) {
  const initials = name.slice(0, 2).toUpperCase();
  const isP1 = slot === 'p1';
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.38,
      background: isP1
        ? 'linear-gradient(135deg, #8b7ee0, #6c5fc7)'
        : 'linear-gradient(135deg, #22c68a, #16a370)',
      boxShadow: isP1
        ? '3px 3px 8px rgba(108,95,199,0.45), -2px -2px 6px rgba(255,255,255,0.9)'
        : '3px 3px 8px rgba(22,163,112,0.45), -2px -2px 6px rgba(255,255,255,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 800, fontSize: size * 0.36, flexShrink: 0,
      letterSpacing: '-0.5px',
    }}>
      {initials}
    </div>
  );
}

export default function PlayerCard({ name, slot, doneCount, total, isMe }) {
  const pct = total ? Math.round(doneCount / total * 100) : 0;
  const isP1 = slot === 'p1';
  const color = isP1 ? '#7c6fd4' : '#1aad7a';
  const lightColor = isP1 ? '#ede9ff' : '#d4f5ea';

  return (
    <div className="clay" style={{
      padding: '18px 20px',
      outline: isMe ? `2px solid ${color}55` : 'none',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Me badge */}
      {isMe && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: lightColor, color, borderRadius: 10,
          fontSize: 10, fontWeight: 800, padding: '3px 8px',
          letterSpacing: '0.05em',
        }}>YOU</div>
      )}

      {/* Decorative circle */}
      <div style={{
        position: 'absolute', bottom: -20, right: -20,
        width: 90, height: 90, borderRadius: '50%',
        background: `${color}0d`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <Avatar name={name} slot={slot} size={46} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 2 }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            {doneCount} / {total} topics
          </div>
        </div>
      </div>

      {/* Big percentage */}
      <div style={{ fontSize: 34, fontWeight: 900, color, letterSpacing: '-1px', marginBottom: 10, lineHeight: 1 }}>
        {pct}<span style={{ fontSize: 16, fontWeight: 700 }}>%</span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div className={`progress-fill-${slot}`} style={{ width: `${pct}%` }} />
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
        {total - doneCount} topics remaining
      </div>
    </div>
  );
}
