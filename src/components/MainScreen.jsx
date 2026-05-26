import React, { useState, useEffect, useRef } from 'react';
import { PHASES } from '../data/curriculum';
import PlayerCard from './PlayerCard';
import PhaseRow from './PhaseRow';
import CompareView from './CompareView';
import FloatingOrbs from './FloatingOrbs';
import Confetti from './Confetti';

function CopyButton({ roomId }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(roomId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div onClick={copy} style={{
      display:'flex', alignItems:'center', gap:8,
      padding:'8px 14px', borderRadius:14,
      background:'var(--bg)', boxShadow:'var(--clay-shadow-sm)',
      cursor:'pointer', transition:'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      userSelect:'none',
    }}
    onMouseEnter={e => e.currentTarget.style.transform='scale(1.05) translateY(-1px)'}
    onMouseLeave={e => e.currentTarget.style.transform='none'}
    >
      <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-body)' }}>Room</span>
      <span style={{ fontSize:14, fontWeight:900, color:'var(--text-primary)', letterSpacing:'0.12em' }}>{roomId}</span>
      <span style={{ fontSize:14, transition:'all 0.2s', color: copied ? '#22c68a' : 'var(--text-muted)' }}>
        {copied ? '✓' : '⎘'}
      </span>
    </div>
  );
}

function OverallProgress({ mySlot, partnerSlot, myDoneCount, partnerDoneCount, total }) {
  const combined = Math.round((myDoneCount + partnerDoneCount) / (total * 2) * 100);
  return (
    <div className="clay" style={{
      padding:'16px 20px', marginBottom:16,
      background:'linear-gradient(135deg, rgba(139,126,224,0.08), rgba(34,198,138,0.08))',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
          Combined Progress
        </span>
        <span style={{ fontSize:18, fontWeight:900, color:'var(--text-primary)' }}>{combined}%</span>
      </div>
      <div style={{
        height:12, borderRadius:12,
        background:'var(--bg)',
        boxShadow:'var(--clay-inset)',
        overflow:'hidden', position:'relative',
      }}>
        <div style={{
          height:'100%', borderRadius:12,
          background:'linear-gradient(90deg, #8b7ee0, #22c68a)',
          width:`${combined}%`,
          transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:0, left:'-100%', width:'60%', height:'100%',
            background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            animation:'shimmer 2s infinite',
          }} />
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
        <span style={{ fontSize:11, color:'#7c6fd4', fontWeight:700 }}>
          {myDoneCount} done by you
        </span>
        <span style={{ fontSize:11, color:'#1aad7a', fontWeight:700 }}>
          {partnerDoneCount} done by friend
        </span>
      </div>
    </div>
  );
}

export default function MainScreen({
  roomId, mySlot, partnerSlot, myName, partnerName,
  myDoneCount, partnerDoneCount, total,
  isDone, countDoneForPhase, toggleItem, leaveRoom,
}) {
  const [tab, setTab] = useState('phases');
  const [confetti, setConfetti] = useState(0);
  const prevMyDone = useRef(myDoneCount);

  useEffect(() => {
    if (myDoneCount > prevMyDone.current) {
      if (myDoneCount % 10 === 0 || myDoneCount === total) {
        setConfetti(c => c + 1);
      }
    }
    prevMyDone.current = myDoneCount;
  }, [myDoneCount, total]);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:60, position:'relative' }}>
      <FloatingOrbs />
      <Confetti trigger={confetti} />

      {/* Topbar */}
      <div style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(220,227,240,0.82)',
        backdropFilter:'blur(16px)',
        WebkitBackdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(184,192,212,0.3)',
        padding:'12px 20px',
      }}>
        <div style={{ maxWidth:860, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:12,
              background:'linear-gradient(135deg, #8b7ee0, #22c68a)',
              boxShadow:'3px 3px 8px rgba(108,95,199,0.35), -2px -2px 6px #fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18,
              animation:'glow-pulse 3s ease-in-out infinite',
            }}>🎮</div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.3px' }}>Unity Tracker</div>
              <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>
                {myDoneCount} / {total} · {Math.round(myDoneCount/total*100)}% done
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <CopyButton roomId={roomId} />
            <button onClick={leaveRoom} style={{
              padding:'8px 14px', borderRadius:12, border:'none',
              fontFamily:'var(--font)', fontWeight:700, fontSize:12,
              background:'var(--bg)', boxShadow:'var(--clay-shadow-sm)',
              color:'var(--text-secondary)', cursor:'pointer',
              transition:'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform='none'}
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'24px 16px', position:'relative', zIndex:1 }}>
        {/* Share notice */}
        <div className="clay-sm fade-up" style={{
          padding:'12px 16px', marginBottom:18,
          background:'linear-gradient(135deg, rgba(139,126,224,0.12), rgba(34,198,138,0.12))',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ fontSize:18, animation:'wiggle 3s ease-in-out infinite' }}>🔗</span>
          <div style={{ flex:1, fontFamily:'var(--font-body)', fontSize:13, color:'var(--text-secondary)' }}>
            Share code <strong style={{ color:'var(--text-primary)', letterSpacing:'0.1em', fontFamily:'var(--font)' }}>{roomId}</strong> with your friend — they open this site and join with Player {mySlot==='p1' ? '2' : '1'}.
          </div>
        </div>

        {/* Overall progress */}
        <OverallProgress
          mySlot={mySlot} partnerSlot={partnerSlot}
          myDoneCount={myDoneCount} partnerDoneCount={partnerDoneCount}
          total={total}
        />

        {/* Player cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }} className="fade-up">
          <PlayerCard name={myName} slot={mySlot} doneCount={myDoneCount} total={total} isMe={true} />
          <PlayerCard name={partnerName} slot={partnerSlot} doneCount={partnerDoneCount} total={total} isMe={false} />
        </div>

        {/* Tabs */}
        <div className="clay-inset fade-up" style={{ display:'flex', padding:4, borderRadius:18, marginBottom:18, gap:4 }}>
          {[{ key:'phases', label:'📋 Phases' }, { key:'compare', label:'📊 Compare' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'10px', border:'none', borderRadius:14,
              fontFamily:'var(--font)', fontWeight:700, fontSize:14, cursor:'pointer',
              transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              background: tab===t.key ? 'var(--surface2)' : 'transparent',
              color: tab===t.key ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: tab===t.key ? 'var(--clay-shadow-sm)' : 'none',
              transform: tab===t.key ? 'scale(1.02)' : 'scale(1)',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab==='phases' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }} className="fade-up">
            {PHASES.map((phase, i) => (
              <div key={phase.id} style={{ animationDelay:`${i * 0.03}s` }} className="fade-up">
                <PhaseRow
                  phase={phase}
                  mySlot={mySlot} partnerSlot={partnerSlot}
                  myName={myName} partnerName={partnerName}
                  isDone={isDone}
                  countDoneForPhase={countDoneForPhase}
                  toggleItem={toggleItem}
                />
              </div>
            ))}
          </div>
        )}

        {tab==='compare' && (
          <div className="fade-up">
            <CompareView
              mySlot={mySlot} partnerSlot={partnerSlot}
              myName={myName} partnerName={partnerName}
              countDoneForPhase={countDoneForPhase}
            />
          </div>
        )}
      </div>
    </div>
  );
}
