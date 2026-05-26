import React, { useState } from 'react';
import { PHASES, phaseItemCount } from '../data/curriculum';

export default function CompareView({ mySlot, partnerSlot, myName, partnerName, countDoneForPhase }) {
  const [hovered, setHovered] = useState(null);
  const myColor = mySlot==='p1' ? '#7c6fd4' : '#1aad7a';
  const ptColor = partnerSlot==='p1' ? '#7c6fd4' : '#1aad7a';

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
      {PHASES.map(phase => {
        const total = phaseItemCount(phase);
        const myCount = countDoneForPhase(mySlot, phase.id);
        const ptCount = countDoneForPhase(partnerSlot, phase.id);
        const myPct = Math.round(myCount/total*100);
        const ptPct = Math.round(ptCount/total*100);
        const diff = myPct - ptPct;
        const isHov = hovered === phase.id;

        let badge, badgeColor, badgeBg;
        if (diff > 0) { badge='You ahead'; badgeColor=myColor; badgeBg=mySlot==='p1'?'#ede9ff':'#d4f5ea'; }
        else if (diff < 0) { badge=`${partnerName.split(' ')[0]} ahead`; badgeColor=ptColor; badgeBg=partnerSlot==='p1'?'#ede9ff':'#d4f5ea'; }
        else { badge='Tied ✦'; badgeColor='#9aa3c0'; badgeBg='var(--surface)'; }

        return (
          <div key={phase.id} className="clay-sm" style={{
            padding:'14px 16px',
            transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            transform: isHov ? 'translateY(-5px) scale(1.02)' : 'none',
            boxShadow: isHov ? '8px 8px 22px #b0b9ce, -6px -6px 18px #ffffff' : undefined,
            outline: isHov ? `1px solid ${phase.color}44` : 'none',
          }}
          onMouseEnter={() => setHovered(phase.id)}
          onMouseLeave={() => setHovered(null)}
          >
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{
                width:32, height:32, borderRadius:10,
                background:`${phase.color}22`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:15, flexShrink:0,
                boxShadow:'2px 2px 5px rgba(0,0,0,0.07), -2px -2px 5px #fff',
                transition:'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                transform: isHov ? 'rotate(-8deg) scale(1.1)' : 'none',
              }}>
                {phase.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:10, fontWeight:800, color:phase.color, marginBottom:1 }}>Phase {phase.id}</div>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {phase.title}
                </div>
              </div>
              <span style={{ fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:10, background:badgeBg, color:badgeColor, flexShrink:0 }}>
                {badge}
              </span>
            </div>

            {[
              { slot:mySlot, name:myName, pct:myPct, count:myCount, color:myColor },
              { slot:partnerSlot, name:partnerName, pct:ptPct, count:ptCount, color:ptColor },
            ].map(({ slot, name, pct, count, color }) => (
              <div key={slot} style={{ marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, color }}>
                    {name.length > 12 ? name.slice(0,12)+'…' : name}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, color:'var(--text-secondary)' }}>
                    {count}/{total} · {pct}%
                  </span>
                </div>
                <div className="progress-track" style={{ height:8 }}>
                  <div className={`progress-fill-${slot}`} style={{ width:`${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
