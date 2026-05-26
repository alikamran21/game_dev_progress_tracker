import React, { useState, useEffect } from 'react';
import FloatingOrbs from './FloatingOrbs';

function TypingText({ words }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[idx];
    if (!del && char < word.length) {
      const t = setTimeout(() => setChar(c => c + 1), 80);
      return () => clearTimeout(t);
    }
    if (!del && char === word.length) {
      const t = setTimeout(() => setDel(true), 1800);
      return () => clearTimeout(t);
    }
    if (del && char > 0) {
      const t = setTimeout(() => setChar(c => c - 1), 45);
      return () => clearTimeout(t);
    }
    if (del && char === 0) {
      setDel(false);
      setIdx(i => (i + 1) % words.length);
    }
  }, [char, del, idx, words]);

  return (
    <span style={{ color:'var(--p1)', fontWeight:800 }}>
      {words[idx].slice(0, char)}
      <span style={{ animation:'pulse-ring 0.8s ease-in-out infinite', opacity: 0.7 }}>|</span>
    </span>
  );
}

export default function SetupScreen({ onCreate, onJoin, loading, error, setError }) {
  const [tab, setTab] = useState('create');
  const [name, setName] = useState('');
  const [slot, setSlot] = useState('p1');
  const [code, setCode] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'24px 16px', position:'relative', overflow:'hidden',
    }}>
      <FloatingOrbs />

      <div style={{
        width:'100%', maxWidth:420, position:'relative', zIndex:1,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        transition:'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Logo card */}
        <div className="clay" style={{ padding:'28px', marginBottom:0, borderRadius:'24px 24px 0 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
            <div style={{
              width:56, height:56, borderRadius:18,
              background:'linear-gradient(135deg, #8b7ee0, #22c68a)',
              boxShadow:'5px 5px 14px rgba(108,95,199,0.45), -4px -4px 12px #fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:28,
              animation:'glow-pulse 3s ease-in-out infinite',
            }}>🎮</div>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.5px' }}>
                Unity Tracker
              </div>
              <div style={{ fontSize:13, color:'var(--text-muted)' }}>
                <TypingText words={['Study together.','Ship together.','Level up.','Build games.']} />
              </div>
            </div>
          </div>

          <p style={{
            fontSize:13, color:'var(--text-secondary)', lineHeight:1.7,
            fontFamily:'var(--font-body)', marginBottom:0,
          }}>
            Track your Unity curriculum with a friend — each on your own device. One creates a room, the other joins with the code.
          </p>
        </div>

        <div className="clay" style={{ padding:'24px 28px', borderRadius:'0 0 24px 24px', marginTop:3 }}>
          {/* Tabs */}
          <div className="clay-inset" style={{ display:'flex', padding:4, borderRadius:16, marginBottom:22, gap:4 }}>
            {['create','join'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
                flex:1, padding:'10px', border:'none', borderRadius:12,
                fontFamily:'var(--font)', fontWeight:700, fontSize:14, cursor:'pointer',
                transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                background: tab===t ? 'var(--surface2)' : 'transparent',
                color: tab===t ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: tab===t ? 'var(--clay-shadow-sm)' : 'none',
                transform: tab===t ? 'scale(1.02)' : 'scale(1)',
              }}>
                {t==='create' ? '✦ Create Room' : '⊕ Join Room'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Your Name
            </label>
            <input type="text" value={name} maxLength={20} placeholder="e.g. Ahmed"
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key==='Enter' && (tab==='create' ? onCreate(name,slot) : onJoin(name,slot,code))}
            />
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              You Are
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { val:'p1', label:'Player 1', emoji:'💜', color:'#8b7ee0' },
                { val:'p2', label:'Player 2', emoji:'💚', color:'#22c68a' },
              ].map(opt => (
                <button key={opt.val} onClick={() => setSlot(opt.val)} style={{
                  padding:'12px', border:'none', borderRadius:14,
                  fontFamily:'var(--font)', fontWeight:700, fontSize:14, cursor:'pointer',
                  transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  background: slot===opt.val ? `${opt.color}22` : 'var(--bg)',
                  color: slot===opt.val ? opt.color : 'var(--text-secondary)',
                  boxShadow: slot===opt.val
                    ? `3px 3px 8px rgba(0,0,0,0.08), -3px -3px 8px #fff, inset 0 0 0 2px ${opt.color}44`
                    : 'var(--clay-shadow-sm)',
                  transform: slot===opt.val ? 'scale(1.04) translateY(-1px)' : 'scale(1)',
                }}>
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {tab==='join' && (
            <div style={{ marginBottom:14, animation:'fadeUp 0.25s ease' }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                Room Code
              </label>
              <input type="text" value={code} maxLength={6} placeholder="e.g. XK39PQ"
                style={{ textTransform:'uppercase', letterSpacing:'0.2em', textAlign:'center', fontSize:20, fontWeight:900 }}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={e => e.key==='Enter' && onJoin(name,slot,code)}
              />
            </div>
          )}

          {error && (
            <div style={{
              background:'#ffe8e8', color:'#b91c1c', borderRadius:12,
              padding:'10px 14px', fontSize:13, fontWeight:600, marginBottom:14,
              animation:'fadeUp 0.2s ease',
            }}>⚠ {error}</div>
          )}

          <button
            className={`btn btn-${slot}`}
            style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:15, borderRadius:16 }}
            onClick={() => tab==='create' ? onCreate(name,slot) : onJoin(name,slot,code)}
            disabled={loading}
          >
            {loading
              ? <span style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
              : tab==='create' ? '✦ Create Room' : '⊕ Join Room'
            }
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-body)' }}>
          Room data stored in Firebase · visible to anyone with the code
        </p>
      </div>
    </div>
  );
}
