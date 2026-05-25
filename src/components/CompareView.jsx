// src/components/CompareView.jsx
import React from 'react';
import { PHASES, phaseItemCount } from '../data/curriculum';

export default function CompareView({ mySlot, partnerSlot, myName, partnerName, countDoneForPhase }) {
  const myColor = mySlot === 'p1' ? '#7c6fd4' : '#1aad7a';
  const ptColor = partnerSlot === 'p1' ? '#7c6fd4' : '#1aad7a';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 12,
    }}>
      {PHASES.map(phase => {
        const total = phaseItemCount(phase);
        const myCount = countDoneForPhase(mySlot, phase.id);
        const ptCount = countDoneForPhase(partnerSlot, phase.id);
        const myPct = Math.round(myCount / total * 100);
        const ptPct = Math.round(ptCount / total * 100);
        const diff = myPct - ptPct;

        let badge, badgeColor, badgeBg;
        if (diff > 0) { badge = 'You ahead'; badgeColor = myColor; badgeBg = mySlot === 'p1' ? '#ede9ff' : '#d4f5ea'; }
        else if (diff < 0) { badge = `${partnerName.split(' ')[0]} ahead`; badgeColor = ptColor; badgeBg = partnerSlot === 'p1' ? '#ede9ff' : '#d4f5ea'; }
        else { badge = 'Tied ✦'; badgeColor = '#9aa3c0'; badgeBg = 'var(--surface)'; }

        return (
          <div key={phase.id} className="clay-sm" style={{ padding: '14px 16px' }}>
            {/* Phase header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `${phase.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, flexShrink: 0,
                boxShadow: '2px 2px 5px rgba(0,0,0,0.07), -2px -2px 5px #fff',
              }}>
                {phase.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: phase.color, marginBottom: 1 }}>Phase {phase.id}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {phase.title}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 10, background: badgeBg, color: badgeColor, flexShrink: 0 }}>
                {badge}
              </span>
            </div>

            {/* Player bars */}
            {[
              { slot: mySlot, name: myName, pct: myPct, count: myCount, color: myColor },
              { slot: partnerSlot, name: partnerName, pct: ptPct, count: ptCount, color: ptColor },
            ].map(({ slot, name, pct, count, color }) => (
              <div key={slot} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color }}>
                    {name.length > 12 ? name.slice(0, 12) + '…' : name}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {count}/{total} · {pct}%
                  </span>
                </div>
                <div className="progress-track" style={{ height: 8 }}>
                  <div className={`progress-fill-${slot}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
