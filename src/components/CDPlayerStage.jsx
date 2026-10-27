import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import lovesongCover from '../assets/Lovesong.jpg';
import { soundManager } from '../utils/audio';

export default function CDPlayerStage({ onPlaySong, onNext }) {
  // States: 'waiting' | 'inserting' | 'playing'
  const [cdState, setCdState] = useState('waiting');

  const coverSrc = lovesongCover || '/Lovesong.jpg';

  const handleInsertAndPlay = () => {
    if (cdState !== 'waiting') return;

    // 1. CD snaps into the platter & plays realistic CD mechanical insert + ticking sounds
    setCdState('inserting');
    soundManager.playCDInsertClicks();

    // 2. Realistic 1-second delay for CD reading/laser calibration before playback starts
    setTimeout(() => {
      setCdState('playing');

      // Start playing Lovesong.mp3 directly
      if (onPlaySong) {
        onPlaySong();
      }
    }, 1100);
  };

  const isInserted = cdState === 'inserting' || cdState === 'playing';
  const isPlaying = cdState === 'playing';

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-[85vh] px-4 py-6 pointer-events-auto w-full max-w-xl mx-auto text-center">
      
      {/* Top Header Prompt */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair italic text-rose-950 mb-1.5">
          {isPlaying
            ? 'Now Playing...'
            : cdState === 'inserting'
            ? 'Reading CD...'
            : 'Put the CD in the Player'}
        </h2>
        <p className="text-xs sm:text-sm font-playfair italic text-rose-700/80">
          {isPlaying
            ? 'Adele — Lovesong'
            : cdState === 'inserting'
            ? 'Reading disc & loading track...'
            : 'Tap the CD to place it in the black circle'}
        </p>
      </div>

      {/* Main Turntable / CD Player Chassis (Top-Down View) */}
      <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-[1.18/1] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-rose-300/80 glass-card rose-glow-border flex items-center justify-between overflow-hidden">
        
        {/* Subtle vintage chassis background highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-rose-50/70 to-pink-50/80 pointer-events-none" />

        {/* ================= 1. THE BLACK CIRCLE (الدايرة السودة / Platter Tray) ================= */}
        <div className="relative z-10 w-[66%] aspect-square rounded-full bg-gradient-to-br from-[#121316] via-[#1a1b20] to-[#262830] p-2.5 shadow-2xl border-4 border-slate-800 flex items-center justify-center">
          
          {/* Inner Recessed Platter Well */}
          <div className="relative w-full h-full rounded-full bg-[#0d0e11] border border-slate-700/70 shadow-inner flex items-center justify-center overflow-hidden">
            
            {/* Concentric Platter Grooves */}
            <div className="absolute inset-3 rounded-full border border-slate-800/80 pointer-events-none" />
            <div className="absolute inset-8 rounded-full border border-slate-800/60 pointer-events-none" />

            {/* Central Spindle Pin */}
            <div className="relative z-30 w-4 h-4 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-500 shadow-md border border-slate-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* ================= CD DISC (When placed in the black circle) ================= */}
            {isInserted && (
              <div
                className={`absolute inset-1 rounded-full shadow-2xl flex items-center justify-center transition-all duration-700 ease-out z-20 ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{
                  animationDuration: '2.2s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                }}
              >
                {/* CD Cover Art */}
                <img
                  src={coverSrc}
                  alt="Lovesong Album Art"
                  className="w-full h-full object-cover rounded-full"
                />

                {/* Y2K Holographic Iridescent Sheen */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none opacity-45 mix-blend-overlay"
                  style={{
                    background:
                      'conic-gradient(from 45deg, transparent 0deg, rgba(255, 182, 193, 0.7) 60deg, rgba(147, 197, 253, 0.7) 120deg, transparent 180deg, rgba(254, 215, 170, 0.7) 240deg, rgba(233, 213, 255, 0.7) 300deg, transparent 360deg)',
                  }}
                />

                {/* Transparent Plastic Inner Hub Ring */}
                <div className="absolute w-[36%] aspect-square rounded-full bg-white/40 border-2 border-white/80 backdrop-blur-[1px] shadow-inner flex items-center justify-center">
                  <div className="w-[42%] aspect-square rounded-full bg-slate-900 border border-slate-700 shadow flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= 2. THE METALLIC ARM ON THE RIGHT (الحديدة اللي على اليمين) ================= */}
        <div className="relative z-10 w-[30%] h-full flex flex-col justify-between items-center pointer-events-none py-2">
          
          {/* Metallic Pivot Base */}
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-slate-200 via-white to-slate-400 border border-slate-300 shadow-lg flex items-center justify-center">
            {/* Pivot screw */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-rose-500 shadow-inner border border-rose-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* The Metallic Arm Bar that pivots and swings over the CD disc */}
            <div
              className="absolute top-5 left-5 origin-top-left transition-transform duration-1000 ease-in-out"
              style={{
                transform: isPlaying ? 'rotate(34deg)' : 'rotate(0deg)',
              }}
            >
              {/* Polished metal arm bar */}
              <div className="w-1.5 h-32 sm:h-36 bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-md rounded-full relative">
                {/* Counterweight top */}
                <div className="absolute -top-3 -left-1 w-3.5 h-4 rounded-sm bg-slate-800 border border-slate-600" />

                {/* Stylus head / needle at bottom (rests on CD groove) */}
                <div className="absolute -bottom-4 -left-1.5 w-4 h-6 rounded bg-gradient-to-b from-slate-800 to-rose-950 border border-amber-400 shadow flex flex-col items-center justify-end">
                  <div className="w-1 h-1.5 bg-amber-300 rounded-full mb-0.5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Speed Indicator / Power dial */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isPlaying
                    ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse'
                    : cdState === 'inserting'
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping'
                    : 'bg-slate-300'
                }`}
              />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                {isPlaying ? 'PLAY' : cdState === 'inserting' ? 'READ' : 'IDLE'}
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 border border-slate-400 shadow flex items-center justify-center">
              <div className="w-2.5 h-0.5 bg-slate-700" />
            </div>
          </div>
        </div>

        {/* ================= 3. CD DISC IN WAITING (Vibrant Red Glowing Highlight, NO hover tooltip) ================= */}
        {!isInserted && (
          <div
            onClick={handleInsertAndPlay}
            className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-4 w-36 h-36 sm:w-44 sm:h-44 rounded-full cursor-pointer z-40 transition-all duration-500 hover:scale-108 active:scale-95 group"
          >
            {/* Vibrant Glowing Red Outer Highlight Aura */}
            <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-red-500 opacity-75 blur-md animate-pulse" />

            {/* The CD Disc with Lovesong.jpg & Glowing Red Border */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-[3.5px] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7),0_0_50px_rgba(225,29,72,0.4)] flex items-center justify-center transition-all duration-300 group-hover:border-red-400 group-hover:shadow-[0_0_35px_rgba(239,68,68,0.9)]">
              <img
                src={coverSrc}
                alt="Lovesong CD"
                className="w-full h-full object-cover rounded-full"
              />

              {/* Holographic Sheen */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background:
                    'conic-gradient(from 45deg, transparent 0deg, rgba(255, 182, 193, 0.7) 60deg, rgba(147, 197, 253, 0.7) 120deg, transparent 180deg, rgba(254, 215, 170, 0.7) 240deg, rgba(233, 213, 255, 0.7) 300deg, transparent 360deg)',
                }}
              />

              {/* Hub */}
              <div className="absolute w-[36%] aspect-square rounded-full bg-white/40 border-2 border-white/80 backdrop-blur-[1px] shadow-inner flex items-center justify-center">
                <div className="w-[42%] aspect-square rounded-full bg-slate-900 border border-slate-700 shadow" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Either Instruction or Next Button */}
      <div className="mt-8 flex justify-center">
        {!isInserted ? (
          <p className="text-xs text-rose-800/80 font-playfair italic animate-pulse">
            Click the CD disc above to place it into the black tray
          </p>
        ) : (
          /* Next Button: User clicks to proceed to Chapter 2 when ready */
          <div className="relative inline-block">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 opacity-70 blur-md animate-pulse" />
            <button
              onClick={onNext}
              className="relative px-8 py-3 rounded-full font-bold text-white text-base shadow-xl transition-all duration-300 transform hover:scale-[1.04] active:scale-95 flex items-center gap-2 font-playfair italic tracking-wider cursor-pointer bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-700"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
