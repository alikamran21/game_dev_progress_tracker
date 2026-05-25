// src/hooks/useTracker.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, set, onValue, get } from 'firebase/database';
import { db } from '../firebase';
import { PHASES, totalItems, phaseItemCount } from '../data/curriculum';

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function useTracker() {
  const [screen, setScreen] = useState('setup'); // 'setup' | 'main'
  const [roomId, setRoomId] = useState('');
  const [mySlot, setMySlot] = useState('p1'); // 'p1' | 'p2'
  const [myName, setMyName] = useState('');
  const [roomData, setRoomData] = useState(null); // live firebase data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const unsubRef = useRef(null);

  // ── Restore session ──────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ut_session');
      if (saved) {
        const { roomId: r, mySlot: s, myName: n } = JSON.parse(saved);
        if (r && s && n) {
          setRoomId(r); setMySlot(s); setMyName(n);
          subscribeToRoom(r, s, n, true);
        }
      }
    } catch (_) {}
    // eslint-disable-next-line
  }, []);

  // ── Subscribe to firebase room ───────────────────────────────────────────
  const subscribeToRoom = useCallback((rid, slot, name, fromRestore = false) => {
    if (unsubRef.current) unsubRef.current();
    const roomRef = ref(db, `rooms/${rid}`);
    const unsub = onValue(roomRef, (snap) => {
      const val = snap.val();
      if (!val) {
        if (!fromRestore) setError('Room not found. Check the code and try again.');
        setScreen('setup');
        return;
      }
      setRoomData(val);
      setScreen('main');
      setLoading(false);
    }, (err) => {
      setError('Connection error: ' + err.message);
      setLoading(false);
    });
    unsubRef.current = unsub;
  }, []);

  // ── Create room ──────────────────────────────────────────────────────────
  const createRoom = useCallback(async (name, slot) => {
    if (!name.trim()) { setError('Enter your name'); return; }
    setLoading(true); setError('');
    const rid = genCode();
    const initial = {
      names: { p1: slot === 'p1' ? name : 'Waiting...', p2: slot === 'p2' ? name : 'Waiting...' },
      done: { p1: {}, p2: {} },
      createdAt: Date.now(),
    };
    try {
      await set(ref(db, `rooms/${rid}`), initial);
      localStorage.setItem('ut_session', JSON.stringify({ roomId: rid, mySlot: slot, myName: name }));
      setRoomId(rid); setMySlot(slot); setMyName(name);
      subscribeToRoom(rid, slot, name);
    } catch (e) {
      setError('Failed to create room: ' + e.message);
      setLoading(false);
    }
  }, [subscribeToRoom]);

  // ── Join room ────────────────────────────────────────────────────────────
  const joinRoom = useCallback(async (name, slot, code) => {
    if (!name.trim()) { setError('Enter your name'); return; }
    if (!code.trim()) { setError('Enter the room code'); return; }
    setLoading(true); setError('');
    const rid = code.trim().toUpperCase();
    try {
      const snap = await get(ref(db, `rooms/${rid}`));
      if (!snap.exists()) { setError('Room not found. Check the code.'); setLoading(false); return; }
      // Update our name in the room
      await set(ref(db, `rooms/${rid}/names/${slot}`), name);
      localStorage.setItem('ut_session', JSON.stringify({ roomId: rid, mySlot: slot, myName: name }));
      setRoomId(rid); setMySlot(slot); setMyName(name);
      subscribeToRoom(rid, slot, name);
    } catch (e) {
      setError('Failed to join room: ' + e.message);
      setLoading(false);
    }
  }, [subscribeToRoom]);

  // ── Toggle a topic item ──────────────────────────────────────────────────
  const toggleItem = useCallback((phaseId, sectionS, itemIdx, val) => {
    if (!roomId || !mySlot) return;
    const key = `${phaseId}__${sectionS.replace(/[^a-zA-Z0-9]/g, '_')}__${itemIdx}`;
    set(ref(db, `rooms/${roomId}/done/${mySlot}/${key}`), val || null);
  }, [roomId, mySlot]);

  // ── Leave room ───────────────────────────────────────────────────────────
  const leaveRoom = useCallback(() => {
    if (unsubRef.current) unsubRef.current();
    localStorage.removeItem('ut_session');
    setScreen('setup'); setRoomData(null); setRoomId(''); setMySlot('p1'); setMyName(''); setError('');
  }, []);

  // ── Computed helpers ─────────────────────────────────────────────────────
  const getKey = (phaseId, sectionS, itemIdx) =>
    `${phaseId}__${sectionS.replace(/[^a-zA-Z0-9]/g, '_')}__${itemIdx}`;

  const isDone = (slot, phaseId, sectionS, itemIdx) =>
    !!(roomData?.done?.[slot]?.[getKey(phaseId, sectionS, itemIdx)]);

  const countDoneForPlayer = (slot) => {
    if (!roomData?.done?.[slot]) return 0;
    return Object.values(roomData.done[slot]).filter(Boolean).length;
  };

  const countDoneForPhase = (slot, phaseId) => {
    const phase = PHASES.find(p => p.id === phaseId);
    if (!phase) return 0;
    return phase.topics.reduce((a, s) =>
      a + s.items.filter((_, i) => isDone(slot, phaseId, s.s, i)).length, 0);
  };

  const partnerSlot = mySlot === 'p1' ? 'p2' : 'p1';
  const myDisplayName = roomData?.names?.[mySlot] || myName || 'You';
  const partnerDisplayName = roomData?.names?.[partnerSlot] || 'Waiting...';
  const total = totalItems();
  const myDoneCount = countDoneForPlayer(mySlot);
  const partnerDoneCount = countDoneForPlayer(partnerSlot);

  return {
    screen, loading, error, setError,
    roomId, mySlot, partnerSlot,
    myName: myDisplayName, partnerName: partnerDisplayName,
    roomData,
    createRoom, joinRoom, leaveRoom, toggleItem,
    isDone, countDoneForPlayer, countDoneForPhase,
    total, myDoneCount, partnerDoneCount,
    phaseItemCount,
  };
}
