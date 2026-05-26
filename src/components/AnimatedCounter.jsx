import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ value, style }) {
  const [display, setDisplay] = useState(value);
  const [popping, setPopping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    prevRef.current = value;
    const start = display;
    const end = value;
    const diff = end - start;
    if (diff === 0) return;
    const steps = 20;
    let step = 0;
    setPopping(true);
    setTimeout(() => setPopping(false), 400);
    const t = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setDisplay(Math.round(start + diff * ease));
      if (step >= steps) { setDisplay(end); clearInterval(t); }
    }, 16);
    return () => clearInterval(t);
  }, [value]);

  return (
    <span style={{
      ...style,
      display: 'inline-block',
      transition: 'color 0.3s',
      animation: popping ? 'number-pop 0.4s ease' : 'none',
    }}>
      {display}
    </span>
  );
}
