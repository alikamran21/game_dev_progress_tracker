import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene3D from './Scene3D';

function TypingText({ words }) {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx];
    if (!deleting && chars < word.length) {
      const t = setTimeout(() => setChars(c => c+1), 70);
      return () => clearTimeout(t);
    }
    if (!deleting && chars === word.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && chars > 0) {
      const t = setTimeout(() => setChars(c => c-1), 40);
      return () => clearTimeout(t);
    }
    if (deleting && chars === 0) { setDeleting(false); setIdx(i => (i+1)%words.length); }
  }, [chars, deleting, idx, words]);
  return (
    <span>
      {words[idx].slice(0, chars)}
      <span style={{ animation:'pulse-glow-p1 1s ease-in-out infinite', color:'var(--p1)' }}>|</span>
    </span>
  );
}

function MagneticButton({ children, className, style, onClick, disabled }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    ref.current.style.transform = `translate(${x*0.25}px,${y*0.25}px)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <button ref={ref} className={className} style={{ ...style, transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease' }}
      onMouseMove={handleMove} onMouseLeave={handleLeave} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default function SetupScreen({ onCreate, onJoin, loading, error, setError }) {
  const [tab, setTab] = useState('create');
  const [name, setName] = useState('');
  const [slot, setSlot] = useState('p1');
  const [code, setCode] = useState('');

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative' }}>
      <Scene3D />

      {/* Grid lines overlay */}
      <div style={{
        position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        backgroundImage:`linear-gradient(rgba(124,111,212,0.04) 1px, transparent 1px),linear-gradient(90deg,rgba(124,111,212,0.04) 1px, transparent 1px)`,
        backgroundSize:'60px 60px',
      }} />

      <motion.div
        initial={{ opacity:0, y:60, scale:0.95 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.8, ease:[0.34,1.56,0.64,1] }}
        style={{ width:'100%', maxWidth:440, position:'relative', zIndex:2 }}
      >
        {/* Hero text */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <motion.div
            initial={{ scale:0, rotate:-10 }}
            animate={{ scale:1, rotate:0 }}
            transition={{ delay:0.2, duration:0.6, ease:[0.34,1.56,0.64,1] }}
            style={{
              width:80, height:80, borderRadius:28, margin:'0 auto 16px',
              background:'linear-gradient(135deg,#9d8fef,#22c68a)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:38,
              boxShadow:'0 0 60px rgba(124,111,212,0.5), 0 0 120px rgba(26,173,122,0.2)',
              animation:'pulse-glow-p1 3s ease-in-out infinite',
            }}
          >🎮</motion.div>
          <h1 style={{ fontSize:36, fontWeight:900, color:'var(--text)', letterSpacing:'-1px', marginBottom:6 }}
            className="glow-p1">
            Unity Tracker
          </h1>
          <p style={{ fontSize:16, color:'var(--text2)', fontFamily:'var(--font-body)', height:24 }}>
            <TypingText words={['Study together.','Ship together.','Level up.','Build games.','Grind the curriculum.']} />
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong" style={{ padding:'32px 28px' }}>
          {/* Tab */}
          <div className="glass-inset" style={{ display:'flex', padding:4, borderRadius:14, marginBottom:24, gap:4 }}>
            {['create','join'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex:1, padding:'10px', border:'none', borderRadius:10,
                  fontFamily:'var(--font)', fontWeight:700, fontSize:14, cursor:'pointer',
                  transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  background: tab===t ? (t==='create' ? 'linear-gradient(135deg,#9d8fef,#6c5fc7)' : 'linear-gradient(135deg,#22c68a,#0d8a60)') : 'transparent',
                  color: tab===t ? 'white' : 'var(--text3)',
                  boxShadow: tab===t ? (t==='create' ? '0 0 20px rgba(124,111,212,0.4)' : '0 0 20px rgba(26,173,122,0.4)') : 'none',
                  transform: tab===t ? 'scale(1.02)' : 'scale(0.98)',
                }}>
                {t==='create' ? '✦ Create Room' : '⊕ Join Room'}
              </button>
            ))}
          </div>

          {/* Name */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:800, color:'var(--text3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Your Name</label>
            <input type="text" value={name} maxLength={20} placeholder="e.g. Ahmed"
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key==='Enter' && (tab==='create' ? onCreate(name,slot) : onJoin(name,slot,code))}
            />
          </div>

          {/* Slot */}
          <div style={{ marginBottom: tab==='join' ? 14 : 22 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:800, color:'var(--text3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>You Are</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[{val:'p1',label:'Player 1',color:'#9d8fef',glow:'rgba(124,111,212,0.4)'},{val:'p2',label:'Player 2',color:'#22c68a',glow:'rgba(26,173,122,0.4)'}].map(o => (
                <button key={o.val} onClick={() => setSlot(o.val)} style={{
                  padding:'12px', border:`1px solid ${slot===o.val ? o.color+'66' : 'var(--border)'}`,
                  borderRadius:12, fontFamily:'var(--font)', fontWeight:700, fontSize:14, cursor:'pointer',
                  background: slot===o.val ? `${o.color}18` : 'rgba(255,255,255,0.03)',
                  color: slot===o.val ? o.color : 'var(--text3)',
                  boxShadow: slot===o.val ? `0 0 20px ${o.glow}` : 'none',
                  transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  transform: slot===o.val ? 'scale(1.04) translateY(-2px)' : 'scale(1)',
                }}>{o.val==='p1' ? '💜' : '💚'} {o.label}</button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {tab==='join' && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                transition={{duration:0.3}} style={{marginBottom:22,overflow:'hidden'}}>
                <label style={{ display:'block', fontSize:11, fontWeight:800, color:'var(--text3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Room Code</label>
                <input type="text" value={code} maxLength={6} placeholder="XK39PQ"
                  style={{ textTransform:'uppercase', letterSpacing:'0.25em', textAlign:'center', fontSize:22, fontWeight:900, color:'var(--p1)' }}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                  onKeyDown={e => e.key==='Enter' && onJoin(name,slot,code)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                style={{ background:'rgba(220,38,38,0.15)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:12, padding:'10px 14px', fontSize:13, fontWeight:600, marginBottom:16, color:'#fca5a5' }}>
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <MagneticButton className={`btn btn-${slot}`}
            style={{ width:'100%', justifyContent:'center', padding:'16px', fontSize:16, borderRadius:14 }}
            onClick={() => tab==='create' ? onCreate(name,slot) : onJoin(name,slot,code)}
            disabled={loading}>
            {loading
              ? <span style={{ width:20,height:20,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }} />
              : tab==='create' ? '✦ Create Room' : '→ Enter Room'
            }
          </MagneticButton>
        </div>

        <p style={{ textAlign:'center', marginTop:16, fontSize:12, color:'var(--text3)', fontFamily:'var(--font-body)' }}>
          Stored in Firebase · Visible to anyone with the code
        </p>
      </motion.div>
    </div>
  );
}
