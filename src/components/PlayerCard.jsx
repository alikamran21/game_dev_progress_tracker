import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function AnimatedNumber({ value, color }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const start = prev.current; prev.current = value;
    const steps = 24; let step = 0;
    const t = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (value-start) * (1 - Math.pow(1-step/steps,3))));
      if (step >= steps) { setDisplay(value); clearInterval(t); }
    }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <span style={{ color, fontVariantNumeric:'tabular-nums' }}>{display}</span>;
}

export default function PlayerCard({ name, slot, doneCount, total, isMe }) {
  const cardRef = useRef(null);
  const pct = total ? Math.round(doneCount/total*100) : 0;
  const isP1 = slot === 'p1';
  const color = isP1 ? '#9d8fef' : '#22c68a';
  const colorDark = isP1 ? '#6c5fc7' : '#0d8a60';
  const glow = isP1 ? 'rgba(124,111,212,0.4)' : 'rgba(26,173,122,0.4)';
  const glowStrong = isP1 ? 'rgba(124,111,212,0.7)' : 'rgba(26,173,122,0.7)';
  const anim = isP1 ? 'pulse-glow-p1' : 'pulse-glow-p2';

  const onMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width - 0.5;
    const y = (e.clientY-r.top)/r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(10px)`;
    card.style.boxShadow = `${-x*20}px ${-y*20}px 40px ${glow}, 0 0 60px ${glow}`;
  };
  const onLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
    cardRef.current.style.boxShadow = '';
  };

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
      className="glass"
      style={{
        padding:'22px', position:'relative', overflow:'hidden',
        outline: isMe ? `1px solid ${color}55` : '1px solid transparent',
        transition:'transform 0.12s ease, box-shadow 0.3s ease',
        transformStyle:'preserve-3d',
        cursor:'default',
      }}>

      {/* BG glow blob */}
      <div style={{
        position:'absolute', width:180, height:180, borderRadius:'50%',
        background:`radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        bottom:-60, right:-60, pointerEvents:'none',
        animation:`float ${isP1?'8s':'11s'} ease-in-out infinite`,
      }} />
      <div style={{
        position:'absolute', width:100, height:100, borderRadius:'50%',
        background:`radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        top:-30, left:-30, pointerEvents:'none',
        animation:`float ${isP1?'12s':'9s'} ease-in-out infinite`,
        animationDelay:'-4s',
      }} />

      {isMe && (
        <div style={{
          position:'absolute', top:14, right:14, display:'flex', alignItems:'center', gap:6,
        }}>
          <div style={{ position:'relative', width:8, height:8 }}>
            <div style={{ width:8,height:8,borderRadius:'50%',background:'#22c68a',position:'absolute' }} />
            <div style={{ width:8,height:8,borderRadius:'50%',background:'#22c68a',position:'absolute',animation:'ring-out 1.5s ease-out infinite' }} />
          </div>
          <span style={{ fontSize:10, fontWeight:800, color:'#22c68a', letterSpacing:'0.08em' }}>LIVE</span>
          <div style={{ background:`${color}22`, border:`1px solid ${color}44`, color, borderRadius:8, fontSize:10, fontWeight:800, padding:'2px 8px' }}>YOU</div>
        </div>
      )}

      {/* Avatar */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
        <div style={{
          width:52, height:52, borderRadius:18, flexShrink:0,
          background:`linear-gradient(135deg,${color},${colorDark})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:18, fontWeight:900, color:'white', letterSpacing:'-0.5px',
          boxShadow:`0 0 30px ${glow}`,
          animation:`${anim} 3s ease-in-out infinite`,
          animationDelay: isP1 ? '0s' : '1.5s',
        }}>
          {name.slice(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight:800, fontSize:17, color:'var(--text)', marginBottom:3 }}>{name}</div>
          <div style={{ fontSize:12, color:'var(--text2)', fontFamily:'var(--font-body)' }}>
            <AnimatedNumber value={doneCount} color={color} /> <span style={{color:'var(--text3)'}}>/ {total} topics</span>
          </div>
        </div>
      </div>

      {/* Big pct */}
      <div style={{ marginBottom:12 }}>
        <div style={{
          fontSize:48, fontWeight:900, lineHeight:1, letterSpacing:'-2px',
          background:`linear-gradient(135deg,${color},${colorDark})`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text',
        }}>
          <AnimatedNumber value={pct} color={color} />
          <span style={{ fontSize:20 }}>%</span>
        </div>
      </div>

      {/* Bar */}
      <div className="progress-track" style={{ height:10, marginBottom:8 }}>
        <div className={`progress-fill-${slot}`} style={{ width:`${pct}%` }} />
      </div>
      <div style={{ fontSize:12, color:'var(--text3)', fontFamily:'var(--font-body)' }}>{total-doneCount} topics remaining</div>

      {pct === 100 && (
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200}}
          style={{ position:'absolute', inset:0, borderRadius:24, background:'rgba(124,111,212,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>
          🏆
        </motion.div>
      )}
    </div>
  );
}
