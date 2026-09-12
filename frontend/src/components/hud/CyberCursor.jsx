import React, { useEffect, useState } from 'react';

export default function CyberCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const handleDown = () => { setClicked(true); setTimeout(() => setClicked(false), 200); };
    const handleOver = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'button' || tag === 'a' || e.target?.closest('button') || e.target?.closest('a') || e.target?.getAttribute('role') === 'button') {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseover', handleOver);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center Target Point */}
      <div
        className={`fixed w-2.5 h-2.5 rounded-full bg-cyber-cyan -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 shadow-cyber-sm ${
          clicked ? 'scale-50 bg-cyber-magenta' : 'scale-100'
        }`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
      {/* Outer Targeting Ring */}
      <div
        className={`fixed rounded-full border border-cyber-cyan/50 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          hovered ? 'w-8 h-8 border-cyber-magenta shadow-holo-purple scale-125' : 'w-5 h-5 scale-100 opacity-60'
        } ${clicked ? 'w-10 h-10 border-cyber-green opacity-100' : ''}`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
    </div>
  );
}
