import React, { useState } from 'react';
import mayRoseBouquet from '../assets/May Red Rose Bouquet of flowers.gif';
import mayRoseDrop from '../assets/May Red Rose drop.gif';

// Generate scattered rose positions (non-overlapping)
function generateRosePositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    let placed = false;
    for (let t = 0; t < 300; t++) {
      const x = 10 + Math.random() * 78;
      const y = 8 + Math.random() * 76;
      const tooClose = positions.some((p) => Math.hypot(p.x - x, p.y - y) < 13);
      if (!tooClose) {
        positions.push({ x, y, id: i, rotation: Math.random() * 30 - 15 });
        placed = true;
        break;
      }
    }
    if (!placed) {
      positions.push({
        x: 10 + Math.random() * 78,
        y: 8 + Math.random() * 76,
        id: i,
        rotation: Math.random() * 30 - 15,
      });
    }
  }
  return positions;
}

const TOTAL = 10;

// The single rose reveal shown after collecting all 10
const ROSE_REVEAL = {
  bouquetName: 'Bouquet de Roses',
  roseName: 'Rosa',
  discovered:
    'The rose was first cultivated over 5,000 years ago — ancient records from Persia and Mesopotamia describe gardens filled with its petals as early as 3000 BC. It was later documented extensively by the Romans and Chinese, who used it in celebrations, baths, and medicine.',
  uses:
    'Roses have been used across history in perfume-making, rose water distillation, love rituals, royal ceremonies, and as the universal symbol of romance and beauty — the only flower that has united every culture on earth.',
  romantic: [
    'And yet — with all that history, with five thousand years of kings and poets and painters declaring the rose the most beautiful thing on earth — not one of them had met you.',
    "The rose has been the world's definition of beautiful since before anyone can remember. Then Shahd came along and quietly made that look like an understatement.",
    'The rose is stunning. You are the reason the rose tries so hard.',
  ],
};

export default function BouquetGiftCard({ onClose }) {
  // Phases: 'game' | 'complete'
  const [phase, setPhase] = useState('game');

  // Roses on screen
  const [roses] = useState(() => generateRosePositions(TOTAL));

  // Collected rose IDs
  const [collectedIds, setCollectedIds] = useState(new Set());

  // Floating +1 indicators: [{ uid, x, y }]
  const [plusOnes, setPlusOnes] = useState([]);

  const score = collectedIds.size;

  const handleRoseClick = (rose) => {
    if (collectedIds.has(rose.id)) return;

    // Immediately collect — no popup
    const newCollected = new Set(collectedIds);
    newCollected.add(rose.id);
    setCollectedIds(newCollected);

    // Show a floating "+1 🌹" at rose position
    const uid = `${Date.now()}-${rose.id}`;
    setPlusOnes((prev) => [...prev, { uid, x: rose.x, y: rose.y }]);
    setTimeout(() => {
      setPlusOnes((prev) => prev.filter((p) => p.uid !== uid));
    }, 900);

    // If all collected, transition to complete
    if (newCollected.size >= TOTAL) {
      setTimeout(() => setPhase('complete'), 750);
    }
  };

  const uncollectedCount = TOTAL - score;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-lg glass-card rounded-2xl sm:rounded-3xl rose-glow-border shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '92dvh' }}
      >
        {/* ========== HEADER ========== */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-rose-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-playfair italic text-rose-950">
              {phase === 'game' ? '🌹 Rose Garden' : '💐 Your Bouquet'}
            </h2>
            {phase === 'game' && (
              <p className="text-[10px] sm:text-xs font-playfair italic text-rose-600">
                Tap each rose to collect it — gather all {TOTAL}!
              </p>
            )}
          </div>

          {/* Score Badge */}
          {phase === 'game' && (
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 ml-auto mr-2">
              <span className="text-base leading-none">🌹</span>
              <span className="font-bold text-rose-700 text-sm font-playfair">
                {score} / {TOTAL}
              </span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors text-sm font-bold cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* ========== GAME PHASE: ROSE FIELD ========== */}
        {phase === 'game' && (
          <div
            className="relative flex-1 overflow-hidden"
            style={{ minHeight: '340px', maxHeight: '62dvh' }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50/90 via-pink-50/70 to-white/90" />

            {/* Scattered Roses */}
            {roses.map((rose) => {
              const isCollected = collectedIds.has(rose.id);
              return (
                <button
                  key={rose.id}
                  onClick={() => handleRoseClick(rose)}
                  disabled={isCollected}
                  className="absolute select-none border-none bg-transparent p-0 cursor-pointer group"
                  style={{
                    left: `${rose.x}%`,
                    top: `${rose.y}%`,
                    transform: `translate(-50%, -50%) rotate(${rose.rotation}deg)`,
                    transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
                    opacity: isCollected ? 0 : 1,
                    pointerEvents: isCollected ? 'none' : 'auto',
                    scale: isCollected ? '0' : '1',
                  }}
                >
                  <img
                    src={mayRoseDrop}
                    alt="Rose"
                    className="w-11 h-11 sm:w-13 sm:h-13 object-contain drop-shadow-md group-hover:drop-shadow-[0_0_12px_rgba(225,29,72,0.75)] group-hover:scale-125 group-active:scale-90 transition-transform duration-150"
                    draggable={false}
                  />
                </button>
              );
            })}

            {/* Floating +1 indicators */}
            {plusOnes.map((p) => (
              <div
                key={p.uid}
                className="absolute pointer-events-none font-bold text-rose-600 text-sm font-playfair select-none"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  animation: 'floatUpFade 0.85s ease-out forwards',
                }}
              >
                +1 🌹
              </div>
            ))}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-rose-100">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-500 rounded-r-full"
                style={{ width: `${(score / TOTAL) * 100}%` }}
              />
            </div>

            {/* All collected — building animation */}
            {uncollectedCount === 0 && phase === 'game' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl animate-bounce">💐</p>
                  <p className="text-xs font-playfair italic text-rose-700 mt-1">
                    Building your bouquet...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== COMPLETE PHASE: BOUQUET REVEAL ========== */}
        {phase === 'complete' && (
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-5 py-5 text-center">
            {/* Bouquet Image */}
            <div className="relative inline-block mb-3">
              <div className="absolute -inset-6 rounded-full bg-rose-400/20 blur-2xl animate-pulse pointer-events-none" />
              <img
                src={mayRoseBouquet}
                alt="Your bouquet of roses"
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-2xl animate-card-entrance"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-playfair italic text-rose-950 mb-0.5 animate-text-entrance">
              {ROSE_REVEAL.bouquetName}
            </h2>
            <p className="text-xs font-playfair italic text-rose-500 mb-4 animate-text-entrance">
              A bouquet of 10 hand-picked <em>Roses</em> 🌹
            </p>

            {/* Rose info card */}
            <div
              className="w-full glass-card rounded-2xl p-4 sm:p-5 text-left border border-rose-200/90 shadow-inner animate-card-entrance mb-4"
              style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}
            >
              <p className="text-[11px] sm:text-xs font-bold text-rose-900 uppercase tracking-widest mb-2 font-playfair not-italic">
                🌹 The Rose —{' '}
                <span className="italic font-normal normal-case tracking-normal">Rosa</span>
              </p>

              <p className="text-[11px] sm:text-xs font-playfair italic text-rose-800 leading-relaxed mb-3">
                {ROSE_REVEAL.discovered}
              </p>

              <p className="text-[11px] sm:text-xs text-slate-600 font-playfair italic leading-relaxed mb-3">
                <span className="font-bold text-rose-700 not-italic">Used for: </span>
                {ROSE_REVEAL.uses}
              </p>

              {/* Romantic section */}
              <div className="bg-rose-50/90 border border-rose-200/80 rounded-xl p-3">
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-2 font-playfair not-italic">
                  💌 Between us
                </p>
                {ROSE_REVEAL.romantic.map((para, i) => (
                  <p
                    key={i}
                    className={`text-[11px] sm:text-xs font-playfair italic text-rose-900 leading-relaxed ${
                      i < ROSE_REVEAL.romantic.length - 1 ? 'mb-2' : 'font-bold not-italic'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 text-white font-bold font-playfair italic text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              Keep my bouquet 💐
            </button>
          </div>
        )}
      </div>

      {/* Keyframe for floating +1 */}
      <style>{`
        @keyframes floatUpFade {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          60%  { opacity: 1; transform: translate(-50%, calc(-50% - 28px)) scale(1); }
          100% { opacity: 0; transform: translate(-50%, calc(-50% - 50px)) scale(0.85); }
        }
      `}</style>
    </div>
  );
}
