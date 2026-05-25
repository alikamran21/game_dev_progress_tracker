// src/App.js
import React from 'react';
import useTracker from './hooks/useTracker';
import SetupScreen from './components/SetupScreen';
import MainScreen from './components/MainScreen';

export default function App() {
  const tracker = useTracker();

  if (tracker.screen === 'setup') {
    return (
      <SetupScreen
        onCreate={tracker.createRoom}
        onJoin={tracker.joinRoom}
        loading={tracker.loading}
        error={tracker.error}
        setError={tracker.setError}
      />
    );
  }

  return (
    <MainScreen
      roomId={tracker.roomId}
      mySlot={tracker.mySlot}
      partnerSlot={tracker.partnerSlot}
      myName={tracker.myName}
      partnerName={tracker.partnerName}
      myDoneCount={tracker.myDoneCount}
      partnerDoneCount={tracker.partnerDoneCount}
      total={tracker.total}
      isDone={tracker.isDone}
      countDoneForPhase={tracker.countDoneForPhase}
      toggleItem={tracker.toggleItem}
      leaveRoom={tracker.leaveRoom}
    />
  );
}
