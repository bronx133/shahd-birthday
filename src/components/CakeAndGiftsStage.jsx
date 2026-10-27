import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import cakeGif from '../assets/cake.gif';
import bouquetImg from '../assets/May Red Rose Bouquet of flowers.gif';
import youWishImg from '../assets/you Wish.gif';
import musicalStickerImg from '../assets/Musical Sticker by stepsmc.gif';
import messageStickerImg from '../assets/Message Mail Sticker.gif';
import { Gift, RefreshCw } from 'lucide-react';
import BouquetGiftCard from './BouquetGiftCard';
import YouWishGiftCard from './YouWishGiftCard';
import PlaylistGiftCard from './PlaylistGiftCard';
import MessageGiftCard from './MessageGiftCard';

export default function CakeAndGiftsStage({ onReplayIntro, onPlaylistOpenChange }) {
  // Phases: 'cake' | 'celebrating' | 'fading_out' | 'gifts'
  const [phase, setPhase] = useState('cake');
  // Which gift modal is open: null | 'bouquet' | 'youwish' | 'playlist'
  const [openGift, setOpenGift] = useState(null);

  // Notify parent when playlist modal opens or closes
  useEffect(() => {
    onPlaylistOpenChange?.(openGift === 'playlist');
    return () => {
      onPlaylistOpenChange?.(false);
    };
  }, [openGift, onPlaylistOpenChange]);

  const cakeSrc = cakeGif || '/cake.gif';

  const handleCakeClick = () => {
    if (phase !== 'cake') return;

    // 1. Play real party popper boom sound
    soundManager.playPartyPopperBoom();
    setPhase('celebrating');

    // 2. Real festive party popper explosion cannons (Left, Right, Center)
    try {
      // Left cannon
      confetti({
        particleCount: 65,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.75 },
        colors: ['#e11d48', '#fb7185', '#fbbf24', '#38bdf8', '#a855f7', '#ffffff'],
      });
      // Right cannon
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.75 },
        colors: ['#e11d48', '#fb7185', '#fbbf24', '#38bdf8', '#a855f7', '#ffffff'],
      });
      // Center burst
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#e11d48', '#f43f5e', '#fcd34d', '#4ade80', '#c084fc', '#ffffff'],
      });
    } catch {
      // fallback
    }

    // 3. Smooth Fade-Out after ~2.2 seconds
    setTimeout(() => {
      setPhase('fading_out');
    }, 2200);

    // 4. Smooth Fade-In of "Your Gifts" at 3.0 seconds exactly as requested
    setTimeout(() => {
      setPhase('gifts');
    }, 2900);
  };

  const handleResetCake = () => {
    setPhase('cake');
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-[85vh] px-4 py-5 pointer-events-auto w-full max-w-md mx-auto text-center">
      
      {/* Top Bar Navigation Actions */}
      <div className="w-full flex justify-between items-center mb-3">
        {phase === 'gifts' && (
          <button
            onClick={handleResetCake}
            className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-rose-700 hover:text-rose-900 border border-rose-200 shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer font-playfair italic"
          >
            <RefreshCw size={11} className="text-rose-500" />
            <span>Cake Again</span>
          </button>
        )}

        <div className="ml-auto">
          <button
            onClick={onReplayIntro}
            className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-rose-700 hover:text-rose-900 border border-rose-200 shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer font-playfair italic"
          >
            <RefreshCw size={11} className="text-rose-500" />
            <span>Replay Intro</span>
          </button>
        </div>
      </div>

      {/* ================= STAGE 1: CAKE TIME (With Smooth Fade-out) ================= */}
      {phase !== 'gifts' && (
        <div
          className={`w-full glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-center transition-all duration-700 rose-glow-border ${
            phase === 'celebrating'
              ? 'animate-pulse-glow scale-102'
              : phase === 'fading_out'
              ? 'opacity-0 scale-90 -translate-y-4 pointer-events-none'
              : 'opacity-100 scale-100'
          }`}
        >
          {/* Header Title: Cake Time */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair italic tracking-tight text-rose-950 mb-1.5">
            Cake Time
          </h1>

          <p className="text-xs sm:text-sm font-playfair italic text-rose-700/80 mb-4">
            Make a wish & tap the cake to celebrate!
          </p>

          {/* Animated Cake GIF: Clickable */}
          <div
            onClick={handleCakeClick}
            className="relative inline-flex items-center justify-center cursor-pointer select-none transition-transform duration-300 hover:scale-108 active:scale-95 group"
          >
            {/* Glowing Aura Behind Cake */}
            <div className="absolute -inset-3 rounded-full bg-rose-400/20 blur-xl group-hover:bg-rose-400/35 transition-colors pointer-events-none" />

            <img
              src={cakeSrc}
              alt="Birthday Cake with Candles"
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-lg"
            />
          </div>

          <div className="mt-4">
            <span
              className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold font-playfair italic tracking-wide transition-all ${
                phase === 'celebrating'
                  ? 'bg-rose-600 text-white shadow-md animate-bounce'
                  : 'bg-rose-50 border border-rose-200/90 text-rose-800 animate-pulse'
              }`}
            >
              {phase === 'celebrating' ? 'Happy Birthday Shahd!' : 'Tap the cake'}
            </span>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: YOUR GIFTS (Choreographed Staggered Entrance & Compact Size) ================= */}
      {phase === 'gifts' && (
        <div className="w-full glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center animate-card-entrance rose-glow-border shadow-xl">
          
          {/* Step 2: Text Entrance (Heading & Subtitle) */}
          <div className="animate-text-entrance">
            <h1 className="text-2xl sm:text-3xl font-bold font-playfair italic tracking-tight text-rose-950 mb-1">
              Your Gifts
            </h1>

            <p className="text-xs sm:text-sm font-playfair italic text-rose-700/80 mb-4 sm:mb-5">
              Four special surprises waiting just for you.
            </p>
          </div>

          {/* Step 3: The 4 Gifts enter one by one in equal timing (Staggered Animation) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 w-full max-w-[280px] sm:max-w-[320px] mx-auto mb-3">
            
            {/* ── GIFT 1: Bouquet of Flowers (Unlocked) ── */}
            <div
              onClick={() => setOpenGift('bouquet')}
              className="aspect-square rounded-xl sm:rounded-2xl border-2 border-rose-400/80 hover:border-rose-500 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center p-3 relative group cursor-pointer overflow-hidden bg-rose-50/90 hover:bg-rose-50 animate-gift-item"
              style={{ animationDelay: '0.42s', animationFillMode: 'backwards' }}
            >
              {/* Glowing pulse border */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-400/15 to-pink-300/20 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />

              {/* Bouquet Thumbnail — larger size */}
              <img
                src={bouquetImg}
                alt="Bouquet of Flowers"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform mb-1"
              />

              <span className="text-[11px] sm:text-xs font-bold text-rose-900 font-playfair italic tracking-wide leading-tight text-center">
                Bouquet
              </span>
              <span className="text-[9px] sm:text-[10px] text-rose-600 font-playfair italic mt-0.5">
                Tap to open! 🌹
              </span>
            </div>

            {/* ── GIFTS 2: You Wish (Unlocked) ── */}
            <div
              onClick={() => setOpenGift('youwish')}
              className="aspect-square rounded-xl sm:rounded-2xl border-2 border-blue-400/70 hover:border-blue-400 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center p-3 relative group cursor-pointer overflow-hidden animate-gift-item"
              style={{
                animationDelay: '0.62s',
                animationFillMode: 'backwards',
                background: 'linear-gradient(135deg, rgba(30,58,138,0.12) 0%, rgba(96,165,250,0.08) 100%)',
              }}
            >
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-400/10 to-blue-200/10 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />

              {/* You Wish thumbnail */}
              <img
                src={youWishImg}
                alt="You Wish"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform mb-1"
              />

              <span className="text-[11px] sm:text-xs font-bold text-blue-800 font-playfair italic tracking-wide leading-tight text-center">
                You Wish
              </span>
              <span className="text-[9px] sm:text-[10px] text-blue-600 font-playfair italic mt-0.5">
                Tap to open! ✨
              </span>
            </div>

            {/* ── GIFT 3: Playlist (Unlocked) ── */}
            <div
              onClick={() => setOpenGift('playlist')}
              className="aspect-square rounded-xl sm:rounded-2xl border-2 border-rose-300/90 hover:border-rose-400 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center p-3 relative group cursor-pointer overflow-hidden animate-gift-item"
              style={{
                animationDelay: '0.82s',
                animationFillMode: 'backwards',
                background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(251,113,133,0.08) 100%)',
              }}
            >
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-400/10 to-pink-200/10 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />

              {/* Musical Sticker thumbnail */}
              <img
                src={musicalStickerImg}
                alt="Playlist"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform mb-1"
              />

              <span className="text-[11px] sm:text-xs font-bold text-rose-950 font-playfair italic tracking-wide leading-tight text-center">
                Playlist
              </span>
              <span className="text-[9px] sm:text-[10px] text-rose-600 font-playfair italic mt-0.5">
                Tap to listen! 🎵
              </span>
            </div>

            {/* ── GIFT 4: Message / Love Letter (Unlocked) ── */}
            <div
              onClick={() => setOpenGift('message')}
              className="aspect-square rounded-xl sm:rounded-2xl border-2 border-blue-400/70 hover:border-blue-400 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center p-3 relative group cursor-pointer overflow-hidden animate-gift-item"
              style={{
                animationDelay: '1.02s',
                animationFillMode: 'backwards',
                background: 'linear-gradient(135deg, rgba(30,58,138,0.12) 0%, rgba(96,165,250,0.08) 100%)',
              }}
            >
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-400/10 to-blue-200/10 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />

              {/* Message Sticker thumbnail - scaled to match other gifts */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-1 relative">
                <img
                  src={messageStickerImg}
                  alt="Love Letter"
                  className="w-24 h-24 sm:w-28 sm:h-28 max-w-none object-contain drop-shadow-md group-hover:scale-115 transition-transform select-none pointer-events-none"
                />
              </div>

              <span className="text-[11px] sm:text-xs font-bold text-blue-800 font-playfair italic tracking-wide leading-tight text-center">
                Message
              </span>
              <span className="text-[9px] sm:text-[10px] text-blue-600 font-playfair italic mt-0.5">
                Tap to open! 💌
              </span>
            </div>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-500 font-playfair italic mt-3 animate-text-entrance">
            Created with endless love by Omar
          </p>
        </div>
      )}

      {/* ================= BOUQUET GIFT MODAL ================= */}
      {openGift === 'bouquet' && (
        <BouquetGiftCard onClose={() => setOpenGift(null)} />
      )}

      {/* ================= YOU WISH GIFT MODAL ================= */}
      {openGift === 'youwish' && (
        <YouWishGiftCard onClose={() => setOpenGift(null)} />
      )}

      {/* ================= PLAYLIST GIFT MODAL ================= */}
      {openGift === 'playlist' && (
        <PlaylistGiftCard onClose={() => setOpenGift(null)} />
      )}

      {/* ================= MESSAGE GIFT MODAL ================= */}
      {openGift === 'message' && (
        <MessageGiftCard onClose={() => setOpenGift(null)} />
      )}
    </div>
  );
}
