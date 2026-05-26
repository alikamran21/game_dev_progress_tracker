import React, { useEffect, useRef } from 'react';

const ORBS = [
  { w:320, h:320, color:'rgba(124,111,212,0.25)', top:'5%',  left:'2%',  dur:'18s' },
  { w:260, h:260, color:'rgba(26,173,122,0.2)',   top:'60%', left:'75%', dur:'22s' },
  { w:200, h:200, color:'rgba(124,111,212,0.15)', top:'40%', left:'50%', dur:'15s' },
  { w:180, h:180, color:'rgba(251,187,36,0.12)',  top:'80%', left:'10%', dur:'25s' },
  { w:150, h:150, color:'rgba(26,173,122,0.12)',  top:'15%', left:'80%', dur:'20s' },
];

export default function FloatingOrbs() {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      {ORBS.map((o,i) => (
        <div key={i} style={{
          position:'absolute',
          width: o.w, height: o.h,
          borderRadius: '50%',
          background: o.color,
          top: o.top, left: o.left,
          filter: 'blur(55px)',
          animation: `float-orb ${o.dur} ease-in-out infinite`,
          animationDelay: `${i * -3}s`,
        }} />
      ))}
    </div>
  );
}
