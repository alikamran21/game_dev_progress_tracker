import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { phaseItemCount } from '../data/curriculum';

function NeonCheck({ checked, slot, readOnly, onClick }) {
  const color = slot==='p1' ? '#9d8fef' : '#22c68a';
  const glow = slot==='p1' ? 'rgba(124,111,212,0.6)' : 'rgba(26,173,122,0.6)';
  return (
    <div onClick={readOnly ? undefined : onClick}
      style={{
        width:22, height:22, borderRadius:7, flexShrink:0, cursor: readOnly ? 'default' : 'pointer',
        border:`1.5px solid ${checked ? color : 'rgba(255,255,255,0.15)'}`,
        background: checked ? `linear-gradient(135deg,${color},${color}99)` : 'rgba(255,255,255,0.03)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow: checked ? `0 0 12px ${glow}, inset 0 0 8px rgba(255,255,255,0.2)` : 'none',
        transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: checked ? 'scale(1.08)' : 'scale(1)',
        userSelect:'none',
      }}>
      <AnimatePresence>
        {checked && (
          <motion.svg initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}} exit={{scale:0}}
            transition={{type:'spring',stiffness:300}} width="13" height="10" viewBox="0 0 13 10" fill="none">
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniProgressArc({ pct, color }) {
  const r = 14, circ = 2*Math.PI*r;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink:0 }}>
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        strokeLinecap="round" transform="rotate(-90 18 18)"
        style={{ transition:'stroke-dashoffset 0.6s cubic-bezier(0.34,1.56,0.64,1)', filter:`drop-shadow(0 0 4px ${color})` }}
      />
      <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="800" fill={color}>{pct}</text>
    </svg>
  );
}

function RefLinks({ refs, color }) {
  if (!refs?.length) return null;
  return (
    <div style={{ marginBottom:14, padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize:10, fontWeight:800, color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
        <svg width="12" height="12" viewBox="0 0 12 12"><rect width="12" height="12" rx="2" fill="#FF0000"/><path d="M5 3.5L9 6L5 8.5V3.5Z" fill="white"/></svg>
        Video References
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {refs.map((r,i) => (
          <motion.a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
            whileHover={{ y:-3, scale:1.04 }} whileTap={{ scale:0.96 }}
            style={{
              display:'inline-flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:8,
              background:'rgba(255,255,255,0.06)', border:`1px solid ${color}33`,
              fontSize:11, fontWeight:700, color, textDecoration:'none',
            }}>
            <svg width="8" height="8" viewBox="0 0 10 10"><rect width="10" height="10" rx="2" fill="#FF0000"/><path d="M4 3L7.5 5L4 7V3Z" fill="white"/></svg>
            {r.label}
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default function PhaseRow({ phase, mySlot, partnerSlot, myName, partnerName, isDone, countDoneForPhase, toggleItem }) {
  const [open, setOpen] = useState(false);
  const total = phaseItemCount(phase);
  const myCount = countDoneForPhase(mySlot, phase.id);
  const ptCount = countDoneForPhase(partnerSlot, phase.id);
  const myPct = Math.round(myCount/total*100);
  const ptPct = Math.round(ptCount/total*100);
  const myColor = mySlot==='p1' ? '#9d8fef' : '#22c68a';
  const ptColor = partnerSlot==='p1' ? '#9d8fef' : '#22c68a';
  const isComplete = myPct === 100;

  const addRipple = useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const rip = document.createElement('div');
    rip.style.cssText = `position:absolute;width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,0.15);transform:scale(0);animation:pop 0.5s ease forwards;left:${e.clientX-r.left-10}px;top:${e.clientY-r.top-10}px;pointer-events:none;`;
    el.appendChild(rip);
    setTimeout(()=>rip.remove(),500);
  },[]);

  return (
    <motion.div
      layout
      className="glass-sm"
      whileHover={{ x:4, boxShadow:`0 0 30px ${phase.color}22, 0 8px 32px rgba(0,0,0,0.4)` }}
      transition={{ type:'spring', stiffness:300, damping:30 }}
      style={{ overflow:'hidden', outline: isComplete ? `1px solid ${phase.color}66` : '1px solid transparent' }}
    >
      {/* Header */}
      <div onClick={(e)=>{ addRipple(e); setOpen(o=>!o); }}
        style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', cursor:'pointer', userSelect:'none', position:'relative', overflow:'hidden' }}>

        {/* Left glow line */}
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, borderRadius:'0 2px 2px 0',
          background:`linear-gradient(180deg,${phase.color},${phase.color}44)`,
          boxShadow:`0 0 10px ${phase.color}`,
          opacity: open ? 1 : 0.4, transition:'opacity 0.3s' }} />

        <motion.div
          animate={{ rotate: open ? 10 : 0, scale: open ? 1.15 : 1 }}
          transition={{ type:'spring', stiffness:300 }}
          style={{
            width:40, height:40, borderRadius:14, flexShrink:0,
            background:`rgba(${phase.color==='#a78bfa'?'167,139,250':phase.color.slice(1).match(/../g).map(h=>parseInt(h,16)).join(',')},0.12)`,
            border:`1px solid ${phase.color}33`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
            boxShadow: open ? `0 0 20px ${phase.color}44` : 'none',
          }}>
          {isComplete ? '✅' : phase.icon}
        </motion.div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
            <span style={{ fontSize:10, fontWeight:800, color:phase.color, letterSpacing:'0.05em' }}>
              PHASE {phase.id}
            </span>
            {isComplete && (
              <motion.span initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:300}}
                style={{ fontSize:9, fontWeight:800, background:`linear-gradient(135deg,#fbbf24,#f97316)`, color:'white', padding:'2px 7px', borderRadius:6 }}>
                COMPLETE ✦
              </motion.span>
            )}
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {phase.title}
          </div>
        </div>

        {/* Arc progress indicators */}
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <MiniProgressArc pct={myPct} color={myColor} />
          <MiniProgressArc pct={ptPct} color={ptColor} />
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.3, ease:[0.34,1.56,0.64,1] }}
          style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 7L11 1" stroke="var(--text3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.div>
      </div>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.35,ease:[0.4,0,0.2,1]}}
            style={{ borderTop:'1px solid var(--border)', overflow:'hidden' }}>
            <div style={{ padding:'14px 16px 18px' }}>
              <div style={{ display:'flex', gap:16, marginBottom:14 }}>
                <span style={{ fontSize:11, fontWeight:700, color:myColor }}>You: {myCount}/{total}</span>
                <span style={{ fontSize:11, fontWeight:700, color:ptColor }}>{partnerName}: {ptCount}/{total}</span>
              </div>

              <RefLinks refs={phase.refs} color={phase.color} />

              {phase.topics.map((section) => {
                const secDone = section.items.filter((_,i)=>isDone(mySlot,phase.id,section.s,i)).length;
                const secPct = Math.round(secDone/section.items.length*100);
                return (
                  <div key={section.s} style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${phase.color}44,transparent)` }} />
                      <span style={{ fontSize:10, fontWeight:800, color:phase.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{section.s}</span>
                      <div style={{ flex:1, height:1, background:`linear-gradient(270deg,${phase.color}44,transparent)` }} />
                      <span style={{ fontSize:10, fontWeight:700, color:phase.color }}>{secPct}%</span>
                    </div>
                    {/* Section micro-bar */}
                    <div style={{ height:2, borderRadius:2, background:'rgba(255,255,255,0.06)', marginBottom:8, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${secPct}%`, background:phase.color, boxShadow:`0 0 8px ${phase.color}`, transition:'width 0.5s cubic-bezier(0.34,1.56,0.64,1)', borderRadius:2 }} />
                    </div>

                    {section.items.map((item, i) => {
                      const myChecked = isDone(mySlot, phase.id, section.s, i);
                      const ptChecked = isDone(partnerSlot, phase.id, section.s, i);
                      return (
                        <motion.div key={i}
                          whileHover={{ x:4, background:'rgba(255,255,255,0.03)' }}
                          onClick={()=>toggleItem(phase.id,section.s,i,!myChecked)}
                          style={{
                            display:'flex', alignItems:'flex-start', gap:10,
                            padding:'8px 6px', borderRadius:8, cursor:'pointer',
                            borderBottom: i<section.items.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            transition:'background 0.15s ease',
                          }}>
                          <NeonCheck checked={myChecked} slot={mySlot} readOnly={false} onClick={()=>{}} />
                          <motion.span
                            animate={{ opacity: myChecked?0.4:1, x: myChecked?4:0 }}
                            style={{ flex:1, fontSize:13, fontFamily:'var(--font-body)', color:myChecked?'var(--text3)':'var(--text2)', textDecoration:myChecked?'line-through':'none', lineHeight:1.5 }}>
                            {item}
                          </motion.span>
                          <div onClick={e=>e.stopPropagation()}>
                            <NeonCheck checked={ptChecked} slot={partnerSlot} readOnly={true} onClick={()=>{}} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
