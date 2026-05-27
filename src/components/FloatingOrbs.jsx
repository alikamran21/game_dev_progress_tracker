import React from 'react';

// Simple CSS-only ambient background — no Three.js dep here
const ORBS = [
  { w:500, h:500, color:'rgba(108,95,199,0.12)',  top:'-10%', left:'-5%',  dur:'20s', delay:'0s'   },
  { w:400, h:400, color:'rgba(13,138,96,0.10)',   top:'60%',  left:'70%',  dur:'25s', delay:'-8s'  },
  { w:300, h:300, color:'rgba(108,95,199,0.08)',  top:'40%',  left:'40%',  dur:'18s', delay:'-4s'  },
  { w:250, h:250, color:'rgba(251,191,36,0.06)',  top:'80%',  left:'5%',   dur:'30s', delay:'-12s' },
  { w:200, h:200, color:'rgba(13,138,96,0.08)',   top:'10%',  left:'75%',  dur:'22s', delay:'-6s'  },
];

export default function FloatingOrbs() {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      {ORBS.map((o, i) => (
        <div key={i} style={{
          position:'absolute',
          width: o.w, height: o.h,
          borderRadius:'50%',
          background: o.color,
          top: o.top, left: o.left,
          filter:'blur(80px)',
          animation:`float ${o.dur} ease-in-out infinite`,
          animationDelay: o.delay,
        }} />
      ))}
    </div>
  );
}
