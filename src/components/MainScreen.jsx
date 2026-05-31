import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PHASES } from '../data/curriculum';
import PlayerCard from './PlayerCard';
import PhaseRow from './PhaseRow';
import CompareView from './CompareView';
import Scene3D from './Scene3D';
import Confetti from './Confetti';

/* ── Copy room code button ─────────────────────────────────────── */
function CopyButton({ roomId }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(roomId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div
      whileHover={{ scale:1.05, y:-1 }} whileTap={{ scale:0.97 }}
      onClick={copy}
      style={{
        display:'flex', alignItems:'center', gap:8, padding:'8px 14px',
        borderRadius:12, background:'rgba(255,255,255,0.06)',
        border:'1px solid rgba(255,255,255,0.12)', cursor:'pointer', userSelect:'none',
      }}
    >
      <span style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--font-body)' }}>ROOM</span>
      <span style={{ fontSize:15, fontWeight:900, color:'var(--text)', letterSpacing:'0.15em' }}>{roomId}</span>
      <motion.span
        animate={{ color: copied ? '#22c68a' : '#606080' }}
        style={{ fontSize:14 }}
      >{copied ? '✓' : '⎘'}</motion.span>
    </motion.div>
  );
}

/* ── Combined gradient progress bar ────────────────────────────── */
function CombinedBar({ mySlot, partnerSlot, myDoneCount, partnerDoneCount, total }) {
  const combined = total ? Math.round((myDoneCount + partnerDoneCount) / (total * 2) * 100) : 0;
  const myPct    = total ? Math.round(myDoneCount    / total * 100) : 0;
  const ptPct    = total ? Math.round(partnerDoneCount / total * 100) : 0;

  return (
    <div className="glass" style={{ padding:'18px 22px', marginBottom:18 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
        <span style={{ fontSize:12, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          Combined Progress
        </span>
        <span style={{ fontSize:22, fontWeight:900, background:'linear-gradient(135deg,#9d8fef,#22c68a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          {combined}%
        </span>
      </div>

      {/* Dual-layer bar */}
      <div style={{ height:14, borderRadius:14, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden', position:'relative' }}>
        {/* p2 fills from right */}
        <div style={{
          position:'absolute', right:0, top:0, bottom:0,
          width:`${ptPct}%`,
          background:`linear-gradient(270deg,${partnerSlot==='p1'?'#6c5fc7':'#0d8a60'},${partnerSlot==='p1'?'#9d8fef':'#22c68a'})`,
          opacity:0.5, borderRadius:'0 14px 14px 0',
          transition:'width 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
        {/* p1 fills from left */}
        <div style={{
          position:'absolute', left:0, top:0, bottom:0,
          width:`${myPct}%`,
          background:`linear-gradient(90deg,${mySlot==='p1'?'#6c5fc7':'#0d8a60'},${mySlot==='p1'?'#9d8fef':'#22c68a'})`,
          borderRadius:'14px 0 0 14px',
          transition:'width 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow:`0 0 16px ${mySlot==='p1'?'rgba(124,111,212,0.7)':'rgba(26,173,122,0.7)'}`,
          overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:'-100%', width:'60%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', animation:'shimmer 2s infinite' }} />
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
        <span style={{ fontSize:11, fontWeight:700, color: mySlot==='p1'?'#9d8fef':'#22c68a' }}>
          You: {myDoneCount} topics
        </span>
        <span style={{ fontSize:11, fontWeight:700, color: partnerSlot==='p1'?'#9d8fef':'#22c68a' }}>
          Friend: {partnerDoneCount} topics
        </span>
      </div>
    </div>
  );
}

/* ── Floating action stats strip ───────────────────────────────── */
function StatStrip({ myDoneCount, total, mySlot }) {
  const pct = total ? Math.round(myDoneCount/total*100) : 0;
  const color = mySlot==='p1' ? '#9d8fef' : '#22c68a';
  const remaining = total - myDoneCount;
  const stats = [
    { label:'Done',      val: myDoneCount, suffix:'' },
    { label:'Progress',  val: pct,         suffix:'%' },
    { label:'Left',      val: remaining,   suffix:'' },
    { label:'Phases',    val: 25,          suffix:'' },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:18 }}>
      {stats.map((s, i) => (
        <motion.div key={s.label} className="glass-sm"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.1 + i*0.07, ease:[0.34,1.56,0.64,1] }}
          whileHover={{ y:-4, boxShadow:`0 0 30px ${color}33` }}
          style={{ padding:'12px 10px', textAlign:'center' }}
        >
          <div style={{ fontSize:22, fontWeight:900, color, letterSpacing:'-0.5px', lineHeight:1 }}>
            {s.val}{s.suffix}
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:4 }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Main screen ────────────────────────────────────────────────── */
export default function MainScreen({
  roomId, mySlot, partnerSlot, myName, partnerName,
  myDoneCount, partnerDoneCount, total,
  isDone, countDoneForPhase, toggleItem, leaveRoom,
}) {
  const [tab, setTab]         = useState('phases');
  const [confetti, setConfetti] = useState(0);
  const prevDone              = useRef(myDoneCount);

  // Fire confetti every 10 topics or on completion
  useEffect(() => {
    if (myDoneCount > prevDone.current) {
      if (myDoneCount % 10 === 0 || myDoneCount === total) {
        setConfetti(c => c + 1);
      }
    }
    prevDone.current = myDoneCount;
  }, [myDoneCount, total]);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:80, position:'relative' }}>
      <Scene3D />
      <Confetti trigger={confetti} />

      {/* Grid overlay */}
      <div style={{
        position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        backgroundImage:`linear-gradient(rgba(124,111,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,111,212,0.03) 1px,transparent 1px)`,
        backgroundSize:'60px 60px',
      }} />

      {/* ── Topbar ── */}
      <div style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(10,10,15,0.75)',
        backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        padding:'12px 24px',
      }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <motion.div
              animate={{ boxShadow:['0 0 20px rgba(124,111,212,0.4)','0 0 50px rgba(124,111,212,0.7)','0 0 20px rgba(124,111,212,0.4)'] }}
              transition={{ duration:3, repeat:Infinity }}
              style={{ width:38, height:38, borderRadius:13, background:'linear-gradient(135deg,#9d8fef,#22c68a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}
            >🎮</motion.div>
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:'var(--text)', letterSpacing:'-0.3px' }}>Unity Tracker</div>
              <div style={{ fontSize:11, color:'var(--text3)', fontWeight:600 }}>
                {myDoneCount}/{total} done · {Math.round(myDoneCount/total*100)}%
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <CopyButton roomId={roomId} />
            <motion.button
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={leaveRoom}
              style={{ padding:'8px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', fontFamily:'var(--font)', fontWeight:700, fontSize:12, background:'rgba(255,255,255,0.04)', color:'var(--text3)', cursor:'pointer' }}
            >Leave</motion.button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'28px 16px', position:'relative', zIndex:2 }}>

        {/* Share notice */}
        <motion.div
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          className="glass-sm"
          style={{ padding:'12px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:12,
            background:'linear-gradient(135deg,rgba(108,95,199,0.12),rgba(13,138,96,0.12))',
            border:'1px solid rgba(124,111,212,0.2)',
          }}
        >
          <motion.span
            animate={{ rotate:[0,-10,10,-10,0] }}
            transition={{ duration:2, repeat:Infinity, repeatDelay:3 }}
            style={{ fontSize:20 }}
          >🔗</motion.span>
          <span style={{ fontSize:13, color:'var(--text2)', fontFamily:'var(--font-body)', flex:1 }}>
            Share code{' '}
            <strong style={{ color:'var(--text)', letterSpacing:'0.12em', fontFamily:'var(--font)' }}>{roomId}</strong>
            {' '}— friend opens this site and joins as Player {mySlot==='p1'?'2':'1'}
          </span>
        </motion.div>

        {/* Stats strip */}
        <StatStrip myDoneCount={myDoneCount} total={total} mySlot={mySlot} />

        {/* Combined bar */}
        <CombinedBar
          mySlot={mySlot} partnerSlot={partnerSlot}
          myDoneCount={myDoneCount} partnerDoneCount={partnerDoneCount}
          total={total}
        />

        {/* Player cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:24 }}>
          {[
            { name:myName,      slot:mySlot,      done:myDoneCount,      isMe:true  },
            { name:partnerName, slot:partnerSlot, done:partnerDoneCount, isMe:false },
          ].map((p, i) => (
            <motion.div key={p.slot}
              initial={{ opacity:0, x: i===0 ? -40 : 40 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.15+i*0.1, duration:0.5, ease:[0.34,1.56,0.64,1] }}
            >
              <PlayerCard name={p.name} slot={p.slot} doneCount={p.done} total={total} isMe={p.isMe} />
            </motion.div>
          ))}
        </div>

        {/* Tab switcher */}
        <div style={{
          display:'flex', gap:4, padding:4,
          background:'rgba(0,0,0,0.3)', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)',
          marginBottom:20,
        }}>
          {[
            { key:'phases',  label:'📋  Phases'  },
            { key:'compare', label:'📊  Compare' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'10px', border:'none', borderRadius:10,
              fontFamily:'var(--font)', fontWeight:700, fontSize:14, cursor:'pointer',
              transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              background: tab===t.key
                ? 'linear-gradient(135deg,rgba(108,95,199,0.3),rgba(13,138,96,0.2))'
                : 'transparent',
              color: tab===t.key ? 'var(--text)' : 'var(--text3)',
              boxShadow: tab===t.key ? '0 0 20px rgba(124,111,212,0.2)' : 'none',
              transform: tab===t.key ? 'scale(1.01)' : 'scale(0.99)',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab==='phases' ? (
            <motion.div key="phases"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              transition={{ duration:0.3 }}
              style={{ display:'flex', flexDirection:'column', gap:8 }}
            >
              {PHASES.map((phase, i) => (
                <motion.div key={phase.id}
                  initial={{ opacity:0, x:-20 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay: i*0.025, duration:0.35, ease:[0.34,1.56,0.64,1] }}
                >
                  <PhaseRow
                    phase={phase}
                    mySlot={mySlot} partnerSlot={partnerSlot}
                    myName={myName} partnerName={partnerName}
                    isDone={isDone} countDoneForPhase={countDoneForPhase} toggleItem={toggleItem}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="compare"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              transition={{ duration:0.3 }}
            >
              <CompareView
                mySlot={mySlot} partnerSlot={partnerSlot}
                myName={myName} partnerName={partnerName}
                countDoneForPhase={countDoneForPhase}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
