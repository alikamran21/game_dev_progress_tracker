// src/components/PhaseRow.jsx
import React, { useState } from 'react';
import { phaseItemCount } from '../data/curriculum';

function ClayCheck({ checked, slot, readOnly, onClick }) {
  const cls = checked
    ? slot === 'p1' ? 'clay-check checked-p1' : 'clay-check checked-p2'
    : `clay-check${readOnly ? ' readonly' : ''}`;
  return (
    <div className={cls} onClick={readOnly ? undefined : onClick} style={{ userSelect: 'none' }}>
      {checked && (
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
          <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function MiniBar({ pct, slot }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{
        width: 44, height: 5, borderRadius: 5,
        background: 'var(--bg)', boxShadow: 'inset 2px 2px 5px #b8c0d4, inset -2px -2px 5px #fff',
        overflow: 'hidden',
      }}>
        <div className={`progress-fill-${slot}`} style={{ width: `${pct}%`, height: '100%', borderRadius: 5 }} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>{pct}%</span>
    </div>
  );
}

export default function PhaseRow({
  phase, mySlot, partnerSlot, myName, partnerName,
  isDone, countDoneForPhase, toggleItem,
}) {
  const [open, setOpen] = useState(false);
  const total = phaseItemCount(phase);
  const myCount = countDoneForPhase(mySlot, phase.id);
  const ptCount = countDoneForPhase(partnerSlot, phase.id);
  const myPct = Math.round(myCount / total * 100);
  const ptPct = Math.round(ptCount / total * 100);

  return (
    <div className="clay-sm" style={{ overflow: 'hidden', transition: 'all 0.2s' }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 16px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Phase icon + badge */}
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: `${phase.color}22`,
          boxShadow: `2px 2px 6px rgba(0,0,0,0.08), -2px -2px 6px #fff`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          {phase.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: phase.color, background: `${phase.color}18`, padding: '2px 7px', borderRadius: 8 }}>
              Phase {phase.id}
            </span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {phase.title}
          </div>
        </div>

        {/* Mini bars */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <MiniBar pct={myPct} slot={mySlot} />
          <MiniBar pct={ptPct} slot={partnerSlot} />
        </div>

        {/* Chevron */}
        <div style={{
          width: 28, height: 28, borderRadius: 10, flexShrink: 0,
          background: 'var(--bg)', boxShadow: 'var(--clay-shadow-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.25s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 7L11 1" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{
          borderTop: '1px solid rgba(184,192,212,0.4)',
          padding: '12px 16px 16px',
          animation: 'fadeUp 0.2s ease both',
        }}>
          {/* Player legend */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: mySlot === 'p1' ? '#7c6fd4' : '#1aad7a' }}>
              {myName}: {myCount}/{total}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: partnerSlot === 'p1' ? '#7c6fd4' : '#1aad7a' }}>
              {partnerName}: {ptCount}/{total}
            </span>
          </div>

          {phase.topics.map((section) => (
            <div key={section.s} style={{ marginBottom: 14 }}>
              {/* Section label */}
              <div style={{
                fontSize: 10, fontWeight: 800, color: phase.color,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ flex: 1, height: 1, background: `${phase.color}33` }} />
                {section.s}
                <div style={{ flex: 1, height: 1, background: `${phase.color}33` }} />
              </div>

              {/* Topic items */}
              {section.items.map((item, i) => {
                const myChecked = isDone(mySlot, phase.id, section.s, i);
                const ptChecked = isDone(partnerSlot, phase.id, section.s, i);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '7px 0',
                    borderBottom: i < section.items.length - 1 ? '1px solid rgba(184,192,212,0.25)' : 'none',
                  }}>
                    <ClayCheck
                      checked={myChecked}
                      slot={mySlot}
                      readOnly={false}
                      onClick={() => toggleItem(phase.id, section.s, i, !myChecked)}
                    />
                    <span style={{
                      flex: 1, fontSize: 13, fontFamily: 'var(--font-body)',
                      color: myChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: myChecked ? 'line-through' : 'none',
                      lineHeight: 1.5,
                      transition: 'color 0.2s',
                    }}>
                      {item}
                    </span>
                    <ClayCheck
                      checked={ptChecked}
                      slot={partnerSlot}
                      readOnly={true}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
