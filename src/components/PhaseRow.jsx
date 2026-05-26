import React, { useState, useRef, useCallback } from 'react';
import { phaseItemCount } from '../data/curriculum';

function ClayCheck({ checked, slot, readOnly, onClick }) {
  const [justChecked, setJustChecked] = useState(false);

  const handleClick = () => {
    if (readOnly) return;
    if (!checked) { setJustChecked(true); setTimeout(() => setJustChecked(false), 400); }
    onClick();
  };

  const cls = checked
    ? slot === 'p1' ? 'clay-check checked-p1' : 'clay-check checked-p2'
    : `clay-check${readOnly ? ' readonly' : ''}`;

  return (
    <div
      className={cls}
      onClick={handleClick}
      style={{
        userSelect:'none',
        animation: justChecked ? 'bounce-in 0.4s ease' : 'none',
        position:'relative',
      }}
    >
      {checked && (
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
          <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {justChecked && (
        <div style={{
          position:'absolute', inset:-6,
          borderRadius:'50%',
          border:`2px solid ${slot === 'p1' ? '#8b7ee0' : '#22c68a'}`,
          animation:'pulse-ring 0.4s ease-out forwards',
          pointerEvents:'none',
        }} />
      )}
    </div>
  );
}

function MiniBar({ pct, slot }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <div style={{
        width:44, height:5, borderRadius:5,
        background:'var(--bg)',
        boxShadow:'inset 2px 2px 5px #b8c0d4, inset -2px -2px 5px #fff',
        overflow:'hidden',
      }}>
        <div className={`progress-fill-${slot}`} style={{ width:`${pct}%`, height:'100%', borderRadius:5 }} />
      </div>
      <span style={{ fontSize:9, fontWeight:700, color:'var(--text-muted)' }}>{pct}%</span>
    </div>
  );
}

function RefLinks({ refs, color }) {
  if (!refs?.length) return null;
  return (
    <div style={{
      margin:'10px 0 4px', padding:'10px 14px', borderRadius:14,
      background:`${color}0d`,
      boxShadow:'inset 2px 2px 6px rgba(0,0,0,0.05), inset -2px -2px 6px rgba(255,255,255,0.6)',
    }}>
      <div style={{
        fontSize:10, fontWeight:800, color, textTransform:'uppercase',
        letterSpacing:'0.08em', marginBottom:8,
        display:'flex', alignItems:'center', gap:6,
      }}>
        <span>▶</span> Video References
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {refs.map((ref, i) => (
          <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
            style={{
              display:'inline-flex', alignItems:'center', gap:5,
              padding:'5px 11px', borderRadius:10,
              background:'var(--surface2)',
              boxShadow:'2px 2px 6px #b8c0d4, -2px -2px 6px #fff',
              fontSize:11, fontWeight:700, color,
              textDecoration:'none',
              transition:'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px) scale(1.04)'; e.currentTarget.style.boxShadow=`3px 3px 10px ${color}44, -2px -2px 6px #fff`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='2px 2px 6px #b8c0d4, -2px -2px 6px #fff'; }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect width="10" height="10" rx="2" fill="#FF0000"/>
              <path d="M4 3L7.5 5L4 7V3Z" fill="white"/>
            </svg>
            {ref.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function SectionProgress({ done, total, color }) {
  const pct = total ? Math.round(done / total * 100) : 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
      <div style={{
        flex:1, height:3, borderRadius:3,
        background:'var(--bg)',
        boxShadow:'inset 1px 1px 3px #b8c0d4, inset -1px -1px 3px #fff',
        overflow:'hidden',
      }}>
        <div style={{
          height:'100%', borderRadius:3,
          background:`linear-gradient(90deg, ${color}, ${color}99)`,
          width:`${pct}%`,
          transition:'width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:0, left:'-100%', width:'60%', height:'100%',
            background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            animation:'shimmer 2s infinite',
          }} />
        </div>
      </div>
      <span style={{ fontSize:9, fontWeight:700, color, minWidth:24, textAlign:'right' }}>{pct}%</span>
    </div>
  );
}

export default function PhaseRow({
  phase, mySlot, partnerSlot, myName, partnerName,
  isDone, countDoneForPhase, toggleItem,
}) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);

  const total = phaseItemCount(phase);
  const myCount = countDoneForPhase(mySlot, phase.id);
  const ptCount = countDoneForPhase(partnerSlot, phase.id);
  const myPct = Math.round(myCount / total * 100);
  const ptPct = Math.round(ptCount / total * 100);
  const isComplete = myPct === 100;

  const addRipple = useCallback((e) => {
    const header = headerRef.current;
    if (!header) return;
    const rect = header.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - rect.left - 10}px`;
    ripple.style.top  = `${e.clientY - rect.top - 10}px`;
    ripple.style.width = ripple.style.height = '20px';
    header.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return (
    <div
      className="clay-sm phase-row-hover"
      style={{
        overflow:'hidden',
        outline: isComplete ? `2px solid ${phase.color}66` : 'none',
        transition:'all 0.25s ease',
      }}
    >
      <div
        ref={headerRef}
        onClick={(e) => { addRipple(e); setOpen(o => !o); }}
        style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'13px 16px', cursor:'pointer', userSelect:'none',
          position:'relative', overflow:'hidden',
        }}
      >
        <div style={{
          width:38, height:38, borderRadius:12, flexShrink:0,
          background:`${phase.color}22`,
          boxShadow:'2px 2px 6px rgba(0,0,0,0.08), -2px -2px 6px #fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:18,
          transition:'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          animation: open ? 'wiggle 0.4s ease' : 'none',
        }}>
          {isComplete ? '✅' : phase.icon}
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:1 }}>
            <span style={{
              fontSize:10, fontWeight:800, color: phase.color,
              background:`${phase.color}18`, padding:'2px 7px', borderRadius:8,
            }}>
              Phase {phase.id}
            </span>
            {phase.refs?.length > 0 && (
              <span style={{
                fontSize:9, fontWeight:700, color:'var(--text-muted)',
                background:'var(--bg)', padding:'2px 6px', borderRadius:6,
                boxShadow:'1px 1px 3px #b8c0d4, -1px -1px 3px #fff',
              }}>
                {phase.refs.length} videos
              </span>
            )}
            {isComplete && (
              <span style={{
                fontSize:9, fontWeight:800,
                background:'linear-gradient(135deg, #fbbf24, #f97316)',
                color:'white', padding:'2px 7px', borderRadius:8,
                animation:'pop 0.3s ease',
              }}>
                DONE ✦
              </span>
            )}
          </div>
          <div style={{
            fontSize:13, fontWeight:700, color:'var(--text-primary)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          }}>
            {phase.title}
          </div>
        </div>

        <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
          <MiniBar pct={myPct} slot={mySlot} />
          <MiniBar pct={ptPct} slot={partnerSlot} />
        </div>

        <div style={{
          width:28, height:28, borderRadius:10, flexShrink:0,
          background:'var(--bg)', boxShadow:'var(--clay-shadow-sm)',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 7L11 1" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {open && (
        <div style={{
          borderTop:'1px solid rgba(184,192,212,0.4)',
          padding:'12px 16px 16px',
          animation:'fadeUp 0.25s ease both',
        }}>
          <div style={{ display:'flex', gap:16, marginBottom:10 }}>
            <span style={{ fontSize:11, fontWeight:700, color: mySlot==='p1'?'#7c6fd4':'#1aad7a' }}>
              ✦ {myName}: {myCount}/{total}
            </span>
            <span style={{ fontSize:11, fontWeight:700, color: partnerSlot==='p1'?'#7c6fd4':'#1aad7a' }}>
              ✦ {partnerName}: {ptCount}/{total}
            </span>
          </div>

          <RefLinks refs={phase.refs} color={phase.color} />

          {phase.topics.map((section, si) => {
            const secDone = section.items.filter((_, i) => isDone(mySlot, phase.id, section.s, i)).length;
            return (
              <div key={section.s} style={{ marginBottom:14, marginTop:10 }}>
                <div style={{
                  fontSize:10, fontWeight:800, color: phase.color,
                  textTransform:'uppercase', letterSpacing:'0.08em',
                  marginBottom:4,
                  display:'flex', alignItems:'center', gap:6,
                }}>
                  <div style={{ flex:1, height:1, background:`${phase.color}33` }} />
                  {section.s}
                  <div style={{ flex:1, height:1, background:`${phase.color}33` }} />
                </div>
                <SectionProgress done={secDone} total={section.items.length} color={phase.color} />

                {section.items.map((item, i) => {
                  const myChecked = isDone(mySlot, phase.id, section.s, i);
                  const ptChecked = isDone(partnerSlot, phase.id, section.s, i);
                  return (
                    <div key={i} style={{
                      display:'flex', alignItems:'flex-start', gap:10,
                      padding:'7px 6px', borderRadius:8,
                      borderBottom: i < section.items.length - 1 ? '1px solid rgba(184,192,212,0.2)' : 'none',
                      transition:'background 0.15s ease',
                      cursor:'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(124,111,212,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    onClick={() => toggleItem(phase.id, section.s, i, !myChecked)}
                    >
                      <ClayCheck checked={myChecked} slot={mySlot} readOnly={false} onClick={() => {}} />
                      <span style={{
                        flex:1, fontSize:13, fontFamily:'var(--font-body)',
                        color: myChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: myChecked ? 'line-through' : 'none',
                        lineHeight:1.5,
                        transition:'all 0.25s ease',
                      }}>
                        {item}
                      </span>
                      <div onClick={e => e.stopPropagation()}>
                        <ClayCheck checked={ptChecked} slot={partnerSlot} readOnly={true} onClick={() => {}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
