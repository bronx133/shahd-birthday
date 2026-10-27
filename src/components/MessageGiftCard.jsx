import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Heart, Sparkles, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';
import catPartySticker from '../assets/Cat Party Sticker.gif';


// Full letter text broken into paragraphs
const LETTER_PARAGRAPHS = [
  "Before I met you, I was really living in a dark place created by my own mind. But then you came along, and we started talking and playing games together. You were like a light that helped me escape the darkness.",
  "Ever since I met you, I started falling in love with you, but I was scared to tell you something like that, so I decided to keep my feelings to myself. Then, after a while, you told me that you loved me, and I was genuinely happy to know that we shared the same feelings for each other.",
  "Ever since we started dating, I've felt happier than ever. Talking to you every day has made me realize just how beautiful of a person you are. You're truly beautiful, both inside and out.",
  "I really, really love you, and I hope we get to enjoy our lives together, forever and ever. I want to keep making memories with you, laughing with you, playing games with you, and loving you through every moment of our lives.",
  "I love you, my little red. Thank you again for giving me a chance and letting me be the one who loves you. I'll always be grateful that we found each other.",
];

const FULL_TEXT = LETTER_PARAGRAPHS.join('\n\n');

// Typing speed in ms per character
const TYPE_SPEED = 22;

export default function MessageGiftCard({ onClose }) {
  /*
   * Stages:
   *  'sealed'   — envelope closed, wax seal visible
   *  'opening'  — flap rotating 180° open
   *  'peeking'  — letter has peeked above envelope top, shaking + hint to tap
   *  'typing'   — letter is fully shown, text typing out character by character
   *  'done'     — typing complete, full letter displayed
   */
  const [stage, setStage] = useState('sealed');
  const [letterShaking, setLetterShaking] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [typeIdx, setTypeIdx] = useState(0);
  const typingRef = useRef(null);
  const shakeIntervalRef = useRef(null);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(true); // auto-scroll enabled until user scrolls up manually

  // ── Shake the letter repeatedly on a timer ──
  const startShaking = useCallback(() => {
    const doShake = () => {
      setLetterShaking(false);
      // tiny re-render gap so animation restarts
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLetterShaking(true);
          soundManager.playPaperRustle();
        });
      });
    };
    doShake();
    shakeIntervalRef.current = setInterval(doShake, 1800);
  }, []);

  const stopShaking = useCallback(() => {
    clearInterval(shakeIntervalRef.current);
    setLetterShaking(false);
  }, []);

  // ── Open Envelope ──
  const handleOpenEnvelope = () => {
    if (stage !== 'sealed') return;
    soundManager.playLetterUnseal();
    setStage('opening');

    // After flap opens → letter peeks out + starts shaking
    setTimeout(() => {
      setStage('peeking');
      startShaking();
    }, 950);
  };

  // ── Tap Letter → start typing ──
  const handleTapLetter = () => {
    if (stage !== 'peeking') return;
    stopShaking();
    setStage('typing');
    setTypeIdx(0);
    setTypedText('');
    autoScrollRef.current = true; // re-enable auto-scroll for fresh read
  };

  // ── Typing effect ──
  useEffect(() => {
    if (stage !== 'typing') return;

    if (typeIdx < FULL_TEXT.length) {
      typingRef.current = setTimeout(() => {
        const ch = FULL_TEXT[typeIdx];
        setTypedText((prev) => prev + ch);
        setTypeIdx((i) => i + 1);
        // play tap only for non-whitespace chars, but not every single char
        if (ch !== ' ' && ch !== '\n' && typeIdx % 3 === 0) {
          soundManager.playTypeTap();
        }
        // auto-scroll to bottom while typing (if user hasn't scrolled up)
        if (autoScrollRef.current && scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, TYPE_SPEED);
    } else {
      setStage('done');
    }

    return () => clearTimeout(typingRef.current);
  }, [stage, typeIdx]);

  // ── Handle manual scroll — disable auto-scroll if user scrolls up ──
  const handleLetterScroll = useCallback((e) => {
    const el = e.currentTarget;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distFromBottom > 30) {
      autoScrollRef.current = false;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(shakeIntervalRef.current);
      clearTimeout(typingRef.current);
    };
  }, []);

  // ── Refold ──
  const handleRefold = () => {
    stopShaking();
    clearTimeout(typingRef.current);
    setTypedText('');
    setTypeIdx(0);
    setStage('sealed');
  };

  // Build rendered typed paragraphs from typedText
  const renderTypedParagraphs = () => {
    const parts = typedText.split('\n\n');
    return parts.map((para, i) => (
      <p key={i} className="leading-relaxed">
        {para}
        {i === parts.length - 1 && stage === 'typing' && (
          <span className="animate-blink-cursor text-rose-700 font-bold">|</span>
        )}
      </p>
    ));
  };

  const isEnvelopeVisible = stage === 'sealed' || stage === 'opening' || stage === 'peeking';
  const isLetterFullScreen = stage === 'typing' || stage === 'done';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      style={{
        background: 'rgba(25, 4, 10, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-3xl overflow-hidden shadow-2xl animate-card-entrance my-auto flex flex-col items-center rose-glow-border"
        style={{
          minHeight: isLetterFullScreen ? '560px' : '480px',
          background:
            'linear-gradient(165deg, rgba(42, 8, 18, 0.96) 0%, rgba(58, 12, 24, 0.95) 50%, rgba(30, 5, 12, 0.97) 100%)',
          border: '1.5px solid rgba(244, 63, 94, 0.4)',
          boxShadow:
            '0 25px 65px -10px rgba(225, 29, 72, 0.4), 0 0 40px 4px rgba(251, 113, 133, 0.25)',
          transition: 'min-height 0.6s ease',
        }}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-rose-500/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        {/* ── Top Bar ── */}
        <div className="w-full flex items-center justify-between px-5 pt-4 pb-2.5 border-b border-rose-500/25 z-30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">💌</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-playfair italic text-rose-100 leading-tight">
                A Letter For Shahd
              </h2>
              <p className="text-[10px] text-rose-300/80 font-playfair italic">
                From Omar with all his heart
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-200 hover:text-white bg-rose-900/40 hover:bg-rose-800/60 border border-rose-400/30 transition-all duration-200 active:scale-90 cursor-pointer shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center p-5 sm:p-6 overflow-hidden">

          {/* ═══════════ ENVELOPE SCENE (sealed / opening / peeking) ═══════════ */}
          {isEnvelopeVisible && (
            <div className="relative flex flex-col items-center justify-center w-full">

              {/* Hint text */}
              <div className="mb-4 text-center">
                {stage === 'sealed' && (
                  <p className="text-xs sm:text-sm font-playfair italic text-rose-200 flex items-center justify-center gap-1.5">
                    <Sparkles size={13} className="text-amber-300 animate-pulse" />
                    <span>Tap the wax seal to open</span>
                    <Sparkles size={13} className="text-amber-300 animate-pulse" />
                  </p>
                )}
                {stage === 'peeking' && (
                  <p className="text-xs sm:text-sm font-playfair italic text-amber-200 flex items-center justify-center gap-1.5 animate-pulse">
                    <span>✨ Tap the letter to read it ✨</span>
                  </p>
                )}
              </div>

              {/* 3D Envelope */}
              <div
                className="relative select-none"
                style={{
                  width: '300px',
                  height: stage === 'peeking' ? '240px' : '200px',
                  perspective: '1000px',
                  transition: 'height 0.4s ease',
                }}
              >
                {/* ── Letter that peeks (visible after flap opens) ── */}
                {(stage === 'opening' || stage === 'peeking') && (
                  <div
                    onClick={handleTapLetter}
                    className={`absolute left-4 right-4 bottom-12 rounded-xl z-10 p-3 cursor-pointer select-none
                      ${stage === 'peeking' ? 'animate-letter-peek' : ''}
                      ${letterShaking ? 'animate-paper-shake' : ''}
                    `}
                    style={{
                      height: '160px',
                      background: 'linear-gradient(170deg, #fffdf8 0%, #fef8ee 100%)',
                      border: '1.5px solid rgba(217, 119, 6, 0.45)',
                      boxShadow: '0 -8px 24px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Letter preview content */}
                    <div className="border-b border-amber-300/60 pb-1 flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold font-playfair italic text-amber-950">
                        From: Omar
                      </span>
                      <Heart size={10} className="text-rose-600 fill-rose-600" />
                    </div>
                    <div className="space-y-1.5 opacity-70">
                      <div className="h-1.5 bg-amber-200/80 rounded w-full" />
                      <div className="h-1.5 bg-amber-200/65 rounded w-5/6" />
                      <div className="h-1.5 bg-amber-200/50 rounded w-4/6" />
                    </div>
                    {stage === 'peeking' && (
                      <div className="mt-2 text-center">
                        <span className="text-[10px] font-playfair italic text-amber-700 font-semibold">
                          👆 Tap to read
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Envelope body (back) ── */}
                <div
                  className="absolute inset-0 rounded-2xl shadow-2xl border border-rose-500/40"
                  style={{
                    bottom: 0,
                    top: 'auto',
                    height: '200px',
                    background: 'linear-gradient(145deg, #4c0519 0%, #29040e 100%)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  }}
                />

                {/* ── Envelope: Side & Bottom Folds ── */}
                {/* Left fold */}
                <div
                  className="absolute z-20 pointer-events-none"
                  style={{
                    inset: '0 0 0 0',
                    height: '200px',
                    bottom: 0,
                    top: 'auto',
                    clipPath: 'polygon(0 0, 0 100%, 50% 55%)',
                    background: 'linear-gradient(135deg, #be123c 0%, #881337 100%)',
                    borderLeft: '1px solid rgba(251,113,133,0.4)',
                  }}
                />
                {/* Right fold */}
                <div
                  className="absolute z-20 pointer-events-none"
                  style={{
                    inset: '0 0 0 0',
                    height: '200px',
                    bottom: 0,
                    top: 'auto',
                    clipPath: 'polygon(100% 0, 100% 100%, 50% 55%)',
                    background: 'linear-gradient(225deg, #be123c 0%, #881337 100%)',
                    borderRight: '1px solid rgba(251,113,133,0.4)',
                  }}
                />
                {/* Bottom fold */}
                <div
                  className="absolute z-25 pointer-events-none"
                  style={{
                    inset: '0 0 0 0',
                    height: '200px',
                    bottom: 0,
                    top: 'auto',
                    clipPath: 'polygon(0 100%, 100% 100%, 50% 55%)',
                    background: 'linear-gradient(0deg, #9f1239 0%, #e11d48 100%)',
                    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.3)',
                  }}
                />

                {/* ── Top Flap (rotates open) ── */}
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: 0,
                    height: '100px',
                    transformOrigin: 'top center',
                    transform: stage === 'sealed' ? 'rotateX(0deg)' : 'rotateX(180deg)',
                    transition: 'transform 0.9s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    zIndex: stage === 'sealed' ? 30 : 5,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    background: 'linear-gradient(180deg, #f43f5e 0%, #be123c 60%, #9f1239 100%)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                />

                {/* ── Wax Seal (only when sealed) ── */}
                {stage === 'sealed' && (
                  <button
                    onClick={handleOpenEnvelope}
                    className="absolute top-[70px] left-1/2 -translate-x-1/2 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 group/seal shadow-2xl"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 60%, #92400e 100%)',
                      border: '2px solid rgba(254,240,138,0.95)',
                      boxShadow: '0 0 25px rgba(245,158,11,0.75), inset 0 2px 4px rgba(255,255,255,0.7)',
                    }}
                  >
                    <Heart size={18} className="text-white fill-white drop-shadow group-hover/seal:scale-125 transition-transform" />
                    <span className="text-[8px] font-bold tracking-wider text-amber-100 uppercase font-playfair mt-0.5">
                      Open
                    </span>
                  </button>
                )}

                {/* ── Cat Party Sticker corner — only visible when sealed ── */}
                {stage === 'sealed' && (
                  <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 z-35 pointer-events-none select-none">
                    <img
                      src={catPartySticker}
                      alt="Cat"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_4px_14px_rgba(225,29,72,0.45)]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ LETTER FULL SCREEN (typing / done) ═══════════ */}
          {isLetterFullScreen && (
            <div
              className="relative w-full rounded-2xl p-4 sm:p-5 text-left animate-card-entrance shadow-2xl overflow-hidden max-h-[74dvh] flex flex-col"
              style={{
                background: 'linear-gradient(175deg, #fffdfa 0%, #fefaf0 40%, #fdf6e6 100%)',
                border: '2px solid rgba(217, 119, 6, 0.45)',
                boxShadow: '0 20px 45px rgba(0,0,0,0.45), inset 0 0 35px rgba(245,158,11,0.08)',
              }}
            >
              {/* Inner border filigree */}
              <div className="absolute inset-1.5 sm:inset-2.5 rounded-xl border border-amber-300/40 pointer-events-none" />
              {/* Corner glyphs */}
              <div className="absolute top-2 left-2 text-amber-500/40 text-xs font-serif pointer-events-none select-none">❦</div>
              <div className="absolute top-2 right-2 text-amber-500/40 text-xs font-serif pointer-events-none select-none">❧</div>
              <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs font-serif pointer-events-none select-none">❧</div>
              <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs font-serif pointer-events-none select-none">❦</div>

              {/* Cat on letter — top right */}
              <div className="absolute top-1 right-2 sm:right-3 z-20 pointer-events-none select-none">
                <img
                  src={catPartySticker}
                  alt="Cat Party Sticker"
                  className="w-13 h-13 sm:w-15 sm:h-15 object-contain drop-shadow-md"
                />
              </div>

              {/* Scrollable letter content */}
              <div
                ref={scrollRef}
                onScroll={handleLetterScroll}
                className="relative z-10 overflow-y-auto pr-1.5 custom-scrollbar text-slate-800 space-y-3 sm:space-y-4"
              >
                {/* Letter head */}
                <div className="border-b border-amber-300/60 pb-3 pr-10">
                  {/* November 1st — prominent, left-aligned */}
                  <p className="text-base sm:text-lg font-bold font-playfair italic text-amber-900 leading-tight">
                    November 1st
                  </p>
                  <p className="text-[11px] font-playfair italic text-amber-700 mt-0.5">
                    Special Birthday Delivery 💌
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs sm:text-sm font-bold font-playfair italic text-amber-950">
                      From: <span className="font-semibold text-rose-700">Omar</span>
                    </p>
                    <p className="text-[11px] font-playfair italic text-amber-800/80 pl-3">
                      (I've never been good at writing messages, but for you... I'll write forever.)
                    </p>
                    <p className="text-xs sm:text-sm font-bold font-playfair italic text-amber-950 pt-1">
                      To: <span className="font-semibold text-rose-700">My Love &amp; My Soul</span>
                    </p>
                  </div>
                </div>

                {/* Typed body */}
                <div className="text-xs sm:text-sm font-playfair italic leading-relaxed text-slate-800/90 space-y-2.5">
                  {renderTypedParagraphs()}
                </div>

                {/* Sign-off — only show after typing done */}
                {stage === 'done' && (
                  <div className="pt-2 border-t border-amber-300/50 flex items-center justify-between animate-card-entrance">
                    <div>
                      <p className="text-xs sm:text-sm font-playfair italic text-amber-950">With all my love,</p>
                      <p className="text-xs sm:text-sm font-playfair italic text-amber-950">Your boyfriend,</p>
                      <p className="text-sm sm:text-base font-bold font-playfair italic text-rose-700 tracking-wide mt-0.5">Omar ❤️</p>
                    </div>
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md select-none flex-shrink-0"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 70%, #92400e 100%)',
                        border: '1.5px solid rgba(254,240,138,0.8)',
                      }}
                    >
                      <Heart size={14} className="text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Re-fold button — only after done */}
                {stage === 'done' && (
                  <div className="pt-1 pb-1 flex justify-center animate-card-entrance">
                    <button
                      onClick={handleRefold}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-playfair italic font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300/70 transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      <RotateCcw size={11} />
                      <span>Fold Back Into Envelope</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
