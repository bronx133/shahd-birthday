import React from 'react';
import { Pause, Play } from 'lucide-react';
import lovesongCover from '../assets/Lovesong.jpg';

export default function FloatingMusicButton({ isPlaying, onTogglePlay }) {
  const coverSrc = lovesongCover || '/Lovesong.jpg';

  return (
    <button
      onClick={onTogglePlay}
      className="fixed top-4 left-4 sm:top-5 sm:left-6 z-40 flex items-center justify-center cursor-pointer select-none group transition-transform duration-300 hover:scale-108 active:scale-95 bg-transparent border-none p-0 focus:outline-none"
      aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
    >
      {/* Enlarged Circular CD Player Logo (NO AI-like indicator dots) */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1.5 bg-white/95 shadow-2xl border-2 border-rose-300 backdrop-blur-md flex items-center justify-center">
        
        {/* The CD Disc with Lovesong.jpg */}
        <div
          className={`w-full h-full rounded-full overflow-hidden shadow-md flex items-center justify-center relative ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{
            animationDuration: '3.5s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          <img
            src={coverSrc}
            alt="Song Art"
            className="w-full h-full object-cover"
          />

          {/* Holographic Iridescent CD Sheen */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background:
                'conic-gradient(from 45deg, transparent 0deg, rgba(255, 182, 193, 0.7) 60deg, rgba(147, 197, 253, 0.7) 120deg, transparent 180deg, rgba(254, 215, 170, 0.7) 240deg, rgba(233, 213, 255, 0.7) 300deg, transparent 360deg)',
            }}
          />

          {/* Center spindle hole with clear plastic ring */}
          <div className="absolute w-[36%] aspect-square rounded-full bg-white/40 border-2 border-white/80 backdrop-blur-[1px] shadow-inner flex items-center justify-center">
            <div className="w-[42%] aspect-square rounded-full bg-slate-900 border border-slate-700 shadow" />
          </div>
        </div>

        {/* Clean Play/Pause overlay icon in center */}
        <div
          className={`absolute inset-1.5 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-black/30 opacity-0 group-hover:opacity-100 text-white'
              : 'bg-black/45 opacity-100 text-white'
          }`}
        >
          {isPlaying ? (
            <Pause size={20} className="fill-white" />
          ) : (
            <Play size={20} className="fill-white ml-0.5" />
          )}
        </div>
      </div>
    </button>
  );
}
