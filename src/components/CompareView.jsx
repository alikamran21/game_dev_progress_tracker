import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PHASES, phaseItemCount } from '../data/curriculum';

export default function CompareView({ mySlot, partnerSlot, myName, partnerName, countDoneForPhase }) {
  const [hovered, setHovered] = useState(null);
  const myColor  = mySlot==='p1'      ? '#9d8fef' : '#22c68a';
  const ptColor  = partnerSlot==='p1' ? '#9d8fef' : '#22c68a';
  const myGlow   = mySlot==='p1'      ? 'rgba(124,111,212,0.35)' : 'rgba(26,173,122,0.35)';
  const ptGlow   = partnerSlot==='p1' ? 'rgba(124,111,212,0.35)' : 'rgba(26,173,122,0.35)';

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:12 }}>
      {PHASES.map((phase, idx) => {
        const total  = phaseItemCount(phase);
        const myC    = countDoneForPhase(mySlot,      phase.id);
        const ptC    = countDoneForPhase(partnerSlot, phase.id);
        const myPct  = Math.round(myC/total*100);
        const ptPct  = Math.round(ptC/total*100);
        const diff   = myPct - ptPct;
        const isHov  = hovered === phase.id;

        let badge, bColor, bBg;
        if (diff > 0)       { badge='You ahead';                        bColor=myColor; bBg=`${myColor}22`; }
        else if (diff < 0)  { badge=`${partnerName.split(' ')[0]} ahead`; bColor=ptColor; bBg=`${ptColor}22`; }
        else                { badge='Tied ✦';                           bColor='#606080'; bBg='rgba(255,255,255,0.05)'; }

        return (
          <motion.div
            key={phase.id}
            className="glass-sm"
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: idx * 0.04, duration:0.4, ease:[0.34,1.56,0.64,1] }}
            whileHover={{
              y:-6, scale:1.02,
              boxShadow:`0 0 40px ${phase.color}33, 0 20px 40px rgba(0,0,0,0.5)`,
            }}
            onMouseEnter={() => setHovered(phase.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ padding:'16px', cursor:'default', position:'relative', overflow:'hidden' }}
          >
            {/* bg glow */}
            <div style={{
              position:'absolute', inset:0, borderRadius:16, pointerEvents:'none',
              background:`radial-gradient(ellipse at top left, ${phase.color}0a 0%, transparent 60%)`,
              transition:'opacity 0.3s', opacity: isHov ? 1 : 0.5,
            }} />

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <motion.div
                animate={{ rotate: isHov ? -8 : 0, scale: isHov ? 1.15 : 1 }}
                transition={{ type:'spring', stiffness:300 }}
                style={{
                  width:34, height:34, borderRadius:11, flexShrink:0,
                  background:`${phase.color}18`, border:`1px solid ${phase.color}33`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
                  boxShadow: isHov ? `0 0 16px ${phase.color}66` : 'none',
                }}
              >{phase.icon}</motion.div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:10, fontWeight:800, color:phase.color, marginBottom:1, letterSpacing:'0.05em' }}>
                  PHASE {phase.id}
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {phase.title}
                </div>
              </div>

              <span style={{ fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:8, background:bBg, color:bColor, border:`1px solid ${bColor}33`, flexShrink:0 }}>
                {badge}
              </span>
            </div>

            {/* Bars */}
            {[
              { slot:mySlot,      name:myName,      pct:myPct, count:myC,  color:myColor, glow:myGlow  },
              { slot:partnerSlot, name:partnerName, pct:ptPct, count:ptC,  color:ptColor, glow:ptGlow  },
            ].map(({ slot, name, pct, count, color, glow }) => (
              <div key={slot} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:11, fontWeight:700, color }}>
                    {name.length > 14 ? name.slice(0,14)+'…' : name}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, color:'var(--text3)' }}>
                    {count}/{total} · {pct}%
                  </span>
                </div>
                <div className="progress-track" style={{ height:7 }}>
                  <div className={`progress-fill-${slot}`} style={{ width:`${pct}%` }} />
                </div>
              </div>
            ))}

            {/* Radar-style diff indicator */}
            {Math.abs(diff) > 0 && (
              <div style={{
                marginTop:10, paddingTop:10,
                borderTop:'1px solid rgba(255,255,255,0.06)',
                display:'flex', alignItems:'center', gap:6,
              }}>
                <div style={{
                  flex: Math.abs(diff), height:3, borderRadius:3,
                  background: diff > 0 ? myColor : ptColor,
                  boxShadow:`0 0 6px ${diff > 0 ? myGlow : ptGlow}`,
                  maxWidth:`${Math.abs(diff)}%`,
                  transition:'all 0.6s ease',
                }} />
                <span style={{ fontSize:10, color:'var(--text3)', fontWeight:700 }}>
                  {Math.abs(diff)}pt gap
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
