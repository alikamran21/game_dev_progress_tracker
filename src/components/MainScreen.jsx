// src/components/MainScreen.jsx
import React, { useState } from 'react';
import { PHASES } from '../data/curriculum';
import PlayerCard from './PlayerCard';
import PhaseRow from './PhaseRow';
import CompareView from './CompareView';

function CopyButton({ roomId }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(roomId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      onClick={copy}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: 14,
        background: 'var(--bg)', boxShadow: 'var(--clay-shadow-sm)',
        cursor: 'pointer', transition: 'all 0.15s',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Room</span>
      <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.12em' }}>{roomId}</span>
      <span style={{ fontSize: 12 }}>{copied ? '✓' : '⎘'}</span>
    </div>
  );
}

export default function MainScreen({
  roomId, mySlot, partnerSlot, myName, partnerName,
  myDoneCount, partnerDoneCount, total,
  isDone, countDoneForPhase, toggleItem, leaveRoom,
}) {
  const [tab, setTab] = useState('phases'); // 'phases' | 'compare'

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      paddingBottom: 40,
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(220, 227, 240, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(184,192,212,0.35)',
        padding: '12px 20px',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'linear-gradient(135deg, #8b7ee0, #22c68a)',
              boxShadow: '3px 3px 8px rgba(108,95,199,0.35), -2px -2px 6px #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🎮</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Unity Tracker</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CopyButton roomId={roomId} />
            <button
              onClick={leaveRoom}
              style={{
                padding: '8px 14px', borderRadius: 12, border: 'none',
                fontFamily: 'var(--font)', fontWeight: 700, fontSize: 12,
                background: 'var(--bg)', boxShadow: 'var(--clay-shadow-sm)',
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>
        {/* Share notice */}
        <div className="clay-sm fade-up" style={{
          padding: '12px 16px', marginBottom: 20,
          background: 'linear-gradient(135deg, #ede9ff 0%, #d4f5ea 100%)',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '3px 3px 10px rgba(124,111,212,0.15), -3px -3px 10px #fff',
        }}>
          <span style={{ fontSize: 18 }}>🔗</span>
          <div style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)' }}>
            Share room code <strong style={{ color: 'var(--text-primary)', letterSpacing: '0.1em' }}>{roomId}</strong> with your friend — they open this site and join.
          </div>
        </div>

        {/* Player cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }} className="fade-up">
          <PlayerCard name={myName} slot={mySlot} doneCount={myDoneCount} total={total} isMe={true} />
          <PlayerCard name={partnerName} slot={partnerSlot} doneCount={partnerDoneCount} total={total} isMe={false} />
        </div>

        {/* Tab switcher */}
        <div className="clay-inset fade-up" style={{ display: 'flex', padding: 4, borderRadius: 18, marginBottom: 20, gap: 4 }}>
          {[
            { key: 'phases', label: '📋 Phases' },
            { key: 'compare', label: '📊 Compare' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 14,
              fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s',
              background: tab === t.key ? 'var(--surface2)' : 'transparent',
              color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: tab === t.key ? 'var(--clay-shadow-sm)' : 'none',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Phases view */}
        {tab === 'phases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="fade-up">
            {PHASES.map(phase => (
              <PhaseRow
                key={phase.id}
                phase={phase}
                mySlot={mySlot}
                partnerSlot={partnerSlot}
                myName={myName}
                partnerName={partnerName}
                isDone={isDone}
                countDoneForPhase={countDoneForPhase}
                toggleItem={toggleItem}
              />
            ))}
          </div>
        )}

        {/* Compare view */}
        {tab === 'compare' && (
          <div className="fade-up">
            <CompareView
              mySlot={mySlot}
              partnerSlot={partnerSlot}
              myName={myName}
              partnerName={partnerName}
              countDoneForPhase={countDoneForPhase}
            />
          </div>
        )}
      </div>
    </div>
  );
}
