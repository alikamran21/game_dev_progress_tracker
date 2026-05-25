// src/components/SetupScreen.jsx
import React, { useState } from 'react';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
    <div style={{
      width: 52, height: 52, borderRadius: 16,
      background: 'linear-gradient(135deg, #8b7ee0, #22c68a)',
      boxShadow: '4px 4px 12px rgba(108,95,199,0.4), -4px -4px 12px #fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 26,
    }}>🎮</div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#2d3561', letterSpacing: '-0.5px' }}>
        Unity Tracker
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9aa3c0' }}>
        Study together. Ship together.
      </div>
    </div>
  </div>
);

export default function SetupScreen({ onCreate, onJoin, loading, error, setError }) {
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const [name, setName] = useState('');
  const [slot, setSlot] = useState('p1');
  const [code, setCode] = useState('');

  const handleCreate = () => onCreate(name, slot);
  const handleJoin = () => onJoin(name, slot, code);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Card */}
        <div className="clay fade-up" style={{ padding: '32px 28px' }}>
          <Logo />
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '16px 0 24px', fontFamily: 'var(--font-body)' }}>
            Track your Unity curriculum progress with a friend — each on your own device. 
            One creates a room, the other joins with the code.
          </p>

          {/* Tab switcher */}
          <div className="clay-inset" style={{ display: 'flex', padding: 4, borderRadius: 16, marginBottom: 24, gap: 4 }}>
            {['create', 'join'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: 12,
                  fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: tab === t ? 'var(--surface2)' : 'transparent',
                  color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: tab === t ? 'var(--clay-shadow-sm)' : 'none',
                }}
              >
                {t === 'create' ? '✦ Create Room' : '⊕ Join Room'}
              </button>
            ))}
          </div>

          {/* Name field */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Your Name
            </label>
            <input
              type="text" value={name} maxLength={20} placeholder="e.g. Ahmed"
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
            />
          </div>

          {/* Player slot */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              You Are
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { val: 'p1', label: 'Player 1', emoji: '💜', color: '#8b7ee0' },
                { val: 'p2', label: 'Player 2', emoji: '💚', color: '#22c68a' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setSlot(opt.val)}
                  style={{
                    padding: '12px', border: 'none', borderRadius: 14,
                    fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: slot === opt.val ? `${opt.color}22` : 'var(--bg)',
                    color: slot === opt.val ? opt.color : 'var(--text-secondary)',
                    boxShadow: slot === opt.val ? `3px 3px 8px rgba(0,0,0,0.08), -3px -3px 8px #fff, inset 0 0 0 2px ${opt.color}44` : 'var(--clay-shadow-sm)',
                  }}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code field for join */}
          {tab === 'join' && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Room Code
              </label>
              <input
                type="text" value={code} maxLength={6} placeholder="e.g. XK39PQ"
                style={{ textTransform: 'uppercase', letterSpacing: '0.2em', textAlign: 'center', fontSize: 18, fontWeight: 800 }}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#ffe8e8', color: '#b91c1c', borderRadius: 12,
              padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 14,
              boxShadow: 'inset 2px 2px 6px rgba(185,28,28,0.1)',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Action button */}
          <button
            className={`btn btn-${slot}`}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, borderRadius: 16 }}
            onClick={tab === 'create' ? handleCreate : handleJoin}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            ) : tab === 'create' ? '✦ Create Room' : '⊕ Join Room'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          Room data is stored in Firebase and visible to anyone with the code.
        </p>
      </div>
    </div>
  );
}
