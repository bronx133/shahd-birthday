import React, { useState, useEffect, useRef } from 'react';
import youWishImg from '../assets/you Wish.gif';
import circleBlue from '../assets/Circle Sticker.gif';
import circlePink from '../assets/Circle Sticker Pink.gif';

const OMAR_WISHES = [
  { id: 1, shortLabel: 'Forever & Ever',      text: "I really wish for us to stay together — forever and ever. Not just for now, not just through the easy parts. Through every season, every change, every version of each other. I want all of it. Always." },
  { id: 2, shortLabel: 'Every Single Day',    text: "I wish I could look at your beautiful face every single day. Not just in my phone screen, not just when distance decides. I mean waking up and seeing you — and knowing that I get to." },
  { id: 3, shortLabel: 'Count Every Second',  text: "I wish time would pass faster — so we could be officially together without waiting, without the space in between. Every second that brings us closer to that feels like the best second I've ever counted." },
  { id: 4, shortLabel: 'Always There',        text: "I wish I could stay with you and comfort you every day — to be the one there when things get heavy. To sit beside you when you need someone and to actually be that someone. That's all I want." },
  { id: 5, shortLabel: 'What You Did to Me',  text: "I wish you knew how our time together made me feel about life. You didn't just make me happy — you made everything make more sense. Like before you, I was just going through it. Then you happened." },
];

// Sticker radius in pixels
const BALL_R = 32;

function makeNodes(wishes) {
  return wishes.map((w, i) => {
    const total = wishes.length;
    const t = total === 1 ? 0.5 : i / (total - 1);
    return {
      id: w.id,
      wish: w,
      isOmar: w.isOmar !== false,
      nx: 0.14 + t * 0.72,
      ny: 0.18 + Math.sin(t * Math.PI) * 0.22 + (i % 2) * 0.12,
      vx: (Math.random() - 0.5) * 0.00009,
      vy: (Math.random() - 0.5) * 0.00009,
      phase: i * ((Math.PI * 2) / Math.max(wishes.length, 1)),
    };
  });
}

export default function YouWishGiftCard({ onClose }) {
  const [wishes, setWishes] = useState(() => OMAR_WISHES.map(w => ({ ...w, isOmar: true })));
  const [activeWish, setActiveWish] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [downloading, setDownloading] = useState(false);
  const [, setTick] = useState(0);

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const nodesRef = useRef([]);
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);
  const [dims, setDims] = useState({ w: 320, h: 320 });

  // Seed nodes once
  useEffect(() => {
    nodesRef.current = makeNodes(wishes);
  }, []); // eslint-disable-line

  // Add new wish nodes
  useEffect(() => {
    const existing = nodesRef.current;
    const ids = new Set(existing.map(n => n.id));
    const added = wishes
      .filter(w => !ids.has(w.id))
      .map(w => ({
        id: w.id,
        wish: w,
        isOmar: w.isOmar !== false,
        nx: 0.25 + Math.random() * 0.5,
        ny: 0.25 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.0001,
        vy: (Math.random() - 0.5) * 0.0001,
        phase: Math.random() * Math.PI * 2,
      }));
    if (added.length) nodesRef.current = [...existing, ...added];
  }, [wishes]);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ── Physics loop — mobile-optimized with 35 FPS throttle ──
  useEffect(() => {
    const FPS = 35;
    const FRAME_MS = 1000 / FPS;

    const tick = (now) => {
      rafRef.current = requestAnimationFrame(tick);
      if (now - lastFrameRef.current < FRAME_MS) return;
      const dt = Math.min(now - lastFrameRef.current, 50);
      lastFrameRef.current = now;
      timeRef.current += dt;

      const W = dims.w || 320;
      const H = dims.h || 320;
      let nodes = nodesRef.current;

      // 1) Movement & Floating
      nodes = nodes.map(node => {
        let { nx, ny, vx, vy } = node;
        // gentle floating wave
        vy += Math.sin(timeRef.current * 0.0015 + node.phase) * 0.000003;
        vx += Math.cos(timeRef.current * 0.0012 + node.phase) * 0.000003;

        vx *= 0.994;
        vy *= 0.994;

        nx += vx * dt;
        ny += vy * dt;

        // Bounce on boundary walls
        const rw = (BALL_R + 4) / W;
        const rh = (BALL_R + 4) / H;
        if (nx < rw)     { nx = rw;     vx =  Math.abs(vx) * 0.8; }
        if (nx > 1 - rw) { nx = 1 - rw; vx = -Math.abs(vx) * 0.8; }
        if (ny < rh)     { ny = rh;     vy =  Math.abs(vy) * 0.8; }
        if (ny > 1 - rh) { ny = 1 - rh; vy = -Math.abs(vy) * 0.8; }

        return { ...node, nx, ny, vx, vy };
      });

      // 2) Elastic Collision Detection & Resolution
      const minPx = BALL_R * 2 + 2;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (b.nx - a.nx) * W;
          const dy = (b.ny - a.ny) * H;
          const dist = Math.hypot(dx, dy);

          if (dist < minPx && dist > 0.01) {
            const nx_ = dx / dist;
            const ny_ = dy / dist;
            const overlap = minPx - dist;

            // Separate so they never overlap
            nodes[i] = {
              ...a,
              nx: a.nx - (nx_ * overlap * 0.52) / W,
              ny: a.ny - (ny_ * overlap * 0.52) / H,
            };
            nodes[j] = {
              ...b,
              nx: b.nx + (nx_ * overlap * 0.52) / W,
              ny: b.ny + (ny_ * overlap * 0.52) / H,
            };

            // Relative velocity
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx_ + rvy * ny_;

            // If moving towards each other, trigger energetic bounce!
            if (velAlongNormal < 0) {
              const restitution = 0.85;
              const impulse = -(1 + restitution) * velAlongNormal * 0.5;
              nodes[i] = { ...nodes[i], vx: a.vx - impulse * nx_, vy: a.vy - impulse * ny_ };
              nodes[j] = { ...nodes[j], vx: b.vx + impulse * nx_, vy: b.vy + impulse * ny_ };
            }
          }
        }
      }

      nodesRef.current = nodes;
      setTick(t => t + 1);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dims]);

  const handleNodeClick = node => {
    setRevealedIds(prev => new Set([...prev, node.id]));
    setActiveWish(node.wish);
  };

  const handleAddWish = () => {
    const title = inputTitle.trim(), text = inputValue.trim();
    if (!title || !text) return;
    setWishes(prev => [...prev, {
      id: Date.now(),
      shortLabel: title.length > 11 ? title.slice(0, 10) + '…' : title,
      text,
      isOmar: false,
    }]);
    setInputTitle('');
    setInputValue('');
    setShowAddInput(false);
  };

  // Download full network in matching romantic rose theme
  const downloadAsImage = () => {
    if (!svgRef.current || downloading) return;
    setDownloading(true);
    try {
      const W = dims.w || 360, H = dims.h || 360;
      const PAD = 40, CW = W + PAD * 2, CH = H + PAD * 2 + 80;
      const clone = svgRef.current.cloneNode(true);
      clone.setAttribute('width', W);
      clone.setAttribute('height', H);
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = CW;
        canvas.height = CH;
        const ctx = canvas.getContext('2d');
        const bg = ctx.createRadialGradient(CW/2, CH*0.35, 0, CW/2, CH*0.35, CW*0.8);
        bg.addColorStop(0, '#380918');
        bg.addColorStop(0.6, '#20040d');
        bg.addColorStop(1, '#100206');
        ctx.fillStyle = bg;
        ctx.roundRect(0, 0, CW, CH, 20);
        ctx.fill();
        ctx.save();
        ctx.fillStyle='rgba(254, 205, 211, 0.95)';
        ctx.font='italic bold 18px Georgia,serif';
        ctx.textAlign='center';
        ctx.fillText('✨ You Wish — Omar & Shahd', CW/2, 28);
        ctx.restore();
        ctx.drawImage(img, PAD, 50, W, H);
        URL.revokeObjectURL(url);
        const a = document.createElement('a');
        a.download='Our Wishes — Shahd & Omar.png';
        a.href=canvas.toDataURL('image/png');
        a.click();
        setDownloading(false);
      };
      img.onerror = () => { URL.revokeObjectURL(url); setDownloading(false); };
      img.src = url;
    } catch {
      setDownloading(false);
    }
  };

  // Download single wish card in romantic rose theme
  const downloadWishCard = wish => {
    try {
      const CW=480, CH=320, canvas=document.createElement('canvas');
      canvas.width=CW;
      canvas.height=CH;
      const ctx=canvas.getContext('2d');
      const bg=ctx.createRadialGradient(CW/2,CH*0.4,10,CW/2,CH*0.4,CW*0.85);
      bg.addColorStop(0,'#3a0817');
      bg.addColorStop(0.7,'#22050e');
      bg.addColorStop(1,'#120206');
      ctx.fillStyle=bg;
      ctx.roundRect(0,0,CW,CH,22);
      ctx.fill();
      ctx.save();
      ctx.strokeStyle = wish.isOmar ? 'rgba(56, 189, 248, 0.5)' : 'rgba(251, 113, 133, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.roundRect(1, 1, CW - 2, CH - 2, 21);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.fillStyle='rgba(254, 205, 211, 0.95)';
      ctx.font='italic bold 22px Georgia,serif';
      ctx.textAlign='center';
      ctx.fillText(wish.shortLabel, CW/2, 60);
      ctx.restore();
      ctx.save();
      ctx.fillStyle='rgba(255,255,255,0.92)';
      ctx.font='italic 13px Georgia,serif';
      ctx.textAlign='center';
      const maxW=CW-80, lh=20, words=`"${wish.text}"`.split(' ');
      let line='', lines=[];
      for (const w of words) {
        const t=line?line+' '+w:w;
        if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w;}else line=t;
      }
      if(line)lines.push(line);
      lines.forEach((l,i)=>ctx.fillText(l,CW/2,100+i*lh));
      ctx.restore();
      const a=document.createElement('a');
      a.download=`Wish — ${wish.shortLabel}.png`;
      a.href=canvas.toDataURL('image/png');
      a.click();
    } catch(e){
      console.warn(e);
    }
  };

  const nodes = nodesRef.current;
  const W = dims.w;
  const H = dims.h;
  const px = n => n.nx * W;
  const py = n => n.ny * H;

  // Interconnected mesh edges
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push([nodes[i], nodes[j]]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Romantic Wine & Rose Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(22, 3, 9, 0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onClick={() => activeWish && setActiveWish(null)}
      />

      {/* Subtle Romantic Sparkle Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(244,63,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.04,
        }}
      />

      {/* Main Card — Romantic Rose Burgundy matching the website */}
      <div
        className="relative z-10 w-full max-w-md flex flex-col rounded-3xl overflow-hidden shadow-2xl rose-glow-border animate-card-entrance"
        style={{
          maxHeight: '92dvh',
          background: 'linear-gradient(165deg, rgba(38, 6, 16, 0.97) 0%, rgba(52, 10, 22, 0.96) 50%, rgba(28, 4, 11, 0.98) 100%)',
          border: '1.5px solid rgba(244, 63, 94, 0.38)',
          boxShadow: '0 25px 65px -10px rgba(225, 29, 72, 0.35), 0 0 40px 4px rgba(251, 113, 133, 0.2)',
        }}
      >
        {/* Ambient Corner Glows */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div
          className="flex items-center gap-2 px-4 pt-4 pb-3 z-10"
          style={{ borderBottom: '1px solid rgba(244, 63, 94, 0.22)' }}
        >
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold font-playfair italic text-rose-100">
              ✨ You Wish
            </h2>
            <p className="text-[10px] font-playfair italic text-rose-300/80">
              Tap the circles — your wishes await
            </p>
          </div>
          <img src={youWishImg} alt="" className="w-10 h-10 object-contain rounded-full opacity-90 drop-shadow-sm" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full flex items-center justify-center text-rose-200 hover:text-white bg-rose-900/40 hover:bg-rose-800/60 border border-rose-400/30 transition-all cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <p className="text-center text-[11px] font-playfair italic text-rose-200/85 pt-3 pb-1 px-4 z-10">
          Tap on them — your wishes will come true
        </p>

        {/* Floating Arena */}
        <div ref={containerRef} className="relative flex-1 overflow-hidden" style={{ minHeight: '300px', maxHeight: '54dvh' }}>
          <svg
            ref={svgRef}
            width={W}
            height={H}
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            {/* ── Transparent Delicate Threads (As original) ── */}
            {edges.map(([a, b], i) => {
              const x1 = px(a), y1 = py(a);
              const x2 = px(b), y2 = py(b);
              const dist = Math.hypot(x2 - x1, y2 - y1);
              if (dist < BALL_R * 1.5) return null; // touching or too close

              // Offset start and end so line connects to edge of sticker
              const angle = Math.atan2(y2 - y1, x2 - x1);
              const sx = x1 + Math.cos(angle) * (BALL_R * 0.82);
              const sy = y1 + Math.sin(angle) * (BALL_R * 0.82);
              const ex = x2 - Math.cos(angle) * (BALL_R * 0.82);
              const ey = y2 - Math.sin(angle) * (BALL_R * 0.82);

              const maxDist = Math.max(W, H) * 0.85;
              const opacity = Math.max(0.08, 0.45 * (1 - dist / maxDist));
              const bothOmar = a.isOmar && b.isOmar;
              const bothShahd = !a.isOmar && !b.isOmar;

              const stroke = bothOmar
                ? `rgba(96, 165, 250, ${opacity})`
                : bothShahd
                ? `rgba(244, 114, 182, ${opacity})`
                : `rgba(192, 132, 252, ${opacity * 0.85})`;

              return (
                <line
                  key={i}
                  x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke={stroke}
                  strokeWidth={1.2}
                />
              );
            })}

            {/* ── Circle Stickers (Hand-drawn Animated GIF Nodes) ── */}
            {nodes.map(node => {
              const cx = px(node);
              const cy = py(node);
              const isRevealed = revealedIds.has(node.id);
              const stickerSrc = node.isOmar ? circleBlue : circlePink;
              const glowColor = node.isOmar ? 'rgba(56, 189, 248, 0.85)' : 'rgba(251, 113, 133, 0.85)';

              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Deep romantic burgundy disc inside the circle so lines don't show through */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={BALL_R * 0.78}
                    fill="#22050f"
                  />

                  {/* The Hand-Drawn Animated Circle Sticker GIF */}
                  <image
                    href={stickerSrc}
                    x={cx - BALL_R}
                    y={cy - BALL_R}
                    width={BALL_R * 2}
                    height={BALL_R * 2}
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      pointerEvents: 'none',
                      filter: `drop-shadow(0 0 ${isRevealed ? 9 : 5}px ${glowColor})`,
                    }}
                  />

                  {/* Wish Short Title inside circle — bold white text with black border outline */}
                  <text
                    x={cx}
                    y={cy + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7.2"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fontWeight="900"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth={2.4}
                    strokeLinejoin="round"
                    style={{
                      paintOrder: 'stroke fill',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {node.wish.shortLabel}
                  </text>

                  {/* Owner Label below circle — with black outline for clarity */}
                  <text
                    x={cx}
                    y={cy + BALL_R + 13}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7.5"
                    fontFamily="Georgia, serif"
                    fontWeight="900"
                    fill={node.isOmar ? '#68C1C5' : '#ff82af'}
                    stroke="#000000"
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                    style={{
                      paintOrder: 'stroke fill',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {node.isOmar ? 'Omar' : 'Shahd'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Bar — Romantic Rose Styling */}
        <div
          className="px-4 py-3 z-10"
          style={{ borderTop: '1px solid rgba(244, 63, 94, 0.22)' }}
        >
          {showAddInput ? (
            <div className="flex flex-col gap-2 w-full">
              <input
                autoFocus
                value={inputTitle}
                onChange={e => setInputTitle(e.target.value)}
                maxLength={30}
                placeholder="Wish title (e.g. Forever & Ever)"
                className="w-full rounded-full px-4 py-1.5 text-xs font-playfair font-bold text-white placeholder-rose-300/50 outline-none"
                style={{ background: 'rgba(76, 5, 25, 0.55)', border: '1px solid rgba(244, 63, 94, 0.45)' }}
              />
              <div className="flex gap-2 items-start">
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Describe your wish..."
                  className="flex-1 rounded-2xl px-4 py-2 text-xs font-playfair italic text-white placeholder-rose-300/50 outline-none resize-none leading-relaxed"
                  style={{ background: 'rgba(76, 5, 25, 0.55)', border: '1px solid rgba(244, 63, 94, 0.4)' }}
                />
                <button
                  onClick={handleAddWish}
                  disabled={!inputTitle.trim() || !inputValue.trim()}
                  className="px-3 py-1.5 rounded-full text-xs font-bold font-playfair text-white cursor-pointer hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed mt-0.5 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}
                >
                  Add ✨
                </button>
                <button
                  onClick={() => { setShowAddInput(false); setInputTitle(''); setInputValue(''); }}
                  className="text-rose-300 text-xs font-bold cursor-pointer hover:text-white transition-colors px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowAddInput(true)}
                className="px-5 py-2 rounded-full text-xs font-bold font-playfair italic text-white cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                  border: '1px solid rgba(254, 205, 211, 0.4)',
                  boxShadow: '0 0 16px rgba(225, 29, 72, 0.4)',
                }}
              >
                Add Wish ✨
              </button>
              <div className="w-px h-6" style={{ background: 'rgba(244, 63, 94, 0.3)' }} />
              <button
                onClick={downloadAsImage}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold font-playfair italic text-rose-100 cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(76, 5, 25, 0.55)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {downloading ? 'Saving…' : 'Save Memory'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wish Reveal Modal — Rose / Pink Romantic Aesthetic */}
      {activeWish && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-5" onClick={() => setActiveWish(null)}>
          <div
            className="relative w-full max-w-sm rounded-3xl p-5 text-center animate-card-entrance overflow-y-auto"
            style={{
              background: 'linear-gradient(165deg, rgba(42, 8, 18, 0.98) 0%, rgba(56, 11, 23, 0.97) 100%)',
              border: '1.5px solid rgba(244, 63, 94, 0.5)',
              boxShadow: '0 0 50px rgba(225, 29, 72, 0.45)',
              maxHeight: '80dvh',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center shadow-2xl"
              style={{
                background: activeWish.isOmar
                  ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                  : 'linear-gradient(135deg, #e11d48, #be123c)',
                boxShadow: activeWish.isOmar
                  ? '0 0 28px rgba(2, 132, 199, 0.75)'
                  : '0 0 28px rgba(225, 29, 72, 0.75)',
              }}
            >
              <span className="text-white text-xl">✨</span>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest font-playfair text-rose-300 mb-1">
              {activeWish.isOmar ? "Omar's Wish" : "Shahd's Wish"}
            </p>
            <p className="text-base sm:text-lg font-bold font-playfair italic text-rose-100 mb-2">
              {activeWish.shortLabel}
            </p>
            <p className="text-sm font-playfair italic text-rose-100/90 leading-relaxed mb-5 px-1" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              "{activeWish.text}"
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setActiveWish(null)}
                className="px-5 py-2 rounded-full text-xs font-bold font-playfair text-white cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                  boxShadow: '0 0 14px rgba(225, 29, 72, 0.4)',
                }}
              >
                Close ✨
              </button>
              <button
                onClick={() => downloadWishCard(activeWish)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold font-playfair italic text-rose-100 cursor-pointer transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(76, 5, 25, 0.6)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
