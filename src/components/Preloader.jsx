import React, { useState, useEffect } from 'react';
import catRunning from '../assets/cat-running.gif';
import bgPc from '../assets/background pc.jpg';
import bgMobile from '../assets/background mobile.jpg';
import floralGif from '../assets/output-onlinegiftools.gif';
import cakeGif from '../assets/cake.gif';
import catPartyGif from '../assets/Cat Party Sticker.gif';
import danceCatGif from '../assets/Dance Dancing Sticker.gif';
import loveCatGif from '../assets/Love You Cat Sticker.gif';
import fallingRosesGif from '../assets/Falling roses.gif';
import roseBouquetGif from '../assets/May Red Rose Bouquet of flowers.gif';
import roseDropGif from '../assets/May Red Rose drop.gif';
import messageMailGif from '../assets/Message Mail Sticker.gif';
import musicalStickerGif from '../assets/Musical Sticker by stepsmc.gif';
import youWishGif from '../assets/you Wish.gif';
import circleOmarGif from '../assets/Circle Sticker.gif';
import circleShahdGif from '../assets/Circle Sticker Pink.gif';
import lovesongCover from '../assets/Lovesong.jpg';

const ASSETS_TO_PRELOAD = [
  bgPc,
  bgMobile,
  floralGif,
  cakeGif,
  catPartyGif,
  danceCatGif,
  loveCatGif,
  fallingRosesGif,
  roseBouquetGif,
  roseDropGif,
  messageMailGif,
  musicalStickerGif,
  youWishGif,
  circleOmarGif,
  circleShahdGif,
  lovesongCover,
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const totalCount = ASSETS_TO_PRELOAD.length;
    const startTime = Date.now();
    const MIN_DISPLAY_TIME_MS = 1800; // Allow Shahd to appreciate the cute animation

    const updateProgress = () => {
      if (!isMounted) return;
      loadedCount++;
      const actualPct = Math.round((loadedCount / totalCount) * 100);
      setProgress((prev) => Math.max(prev, actualPct));
    };

    // Preload each image/gif
    const imagePromises = ASSETS_TO_PRELOAD.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = () => {
          updateProgress();
          resolve();
        };
      });
    });

    // Wait for all assets to load, plus minimum display time
    Promise.all(imagePromises).then(() => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME_MS - elapsed);

      setTimeout(() => {
        if (!isMounted) return;
        setProgress(100);

        // Brief delay at 100% before starting fade-out
        setTimeout(() => {
          if (!isMounted) return;
          setIsFadingOut(true);

          // Once faded out, notify parent to open curtains
          setTimeout(() => {
            if (isMounted) {
              onComplete?.();
            }
          }, 650);
        }, 300);
      }, remainingTime);
    });

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  const catSrc = catRunning || '/cat-running.gif';

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #380816 0%, #20020b 60%, #120106 100%)',
      }}
    >
      {/* Soft Pink Ambient Glow in Center */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-rose-500/15 blur-3xl pointer-events-none -z-10" />

      {/* Floating Sparkles & Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[20%] left-[25%] text-rose-300/40 text-xl animate-pulse">✨</span>
        <span className="absolute top-[30%] right-[22%] text-pink-400/30 text-lg animate-bounce" style={{ animationDuration: '3s' }}>💖</span>
        <span className="absolute bottom-[28%] left-[20%] text-rose-400/30 text-base animate-pulse" style={{ animationDuration: '2.5s' }}>🌸</span>
        <span className="absolute bottom-[22%] right-[26%] text-pink-300/40 text-xl animate-bounce" style={{ animationDuration: '3.5s' }}>✨</span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 max-w-sm sm:max-w-md text-center">
        {/* The Animated Running Cat GIF */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Subtle glowing halo beneath the cat */}
          <div className="absolute inset-0 rounded-full bg-rose-400/20 blur-xl scale-125" />
          <img
            src={catSrc}
            alt="Waiting for my sweetheart cat"
            className="w-28 sm:w-36 h-auto object-contain filter drop-shadow-[0_8px_20px_rgba(244,63,94,0.35)]"
          />
        </div>

        {/* Romantic Status Title */}
        <h2 className="font-serif italic text-2xl sm:text-3xl text-rose-100 font-semibold tracking-wide drop-shadow-[0_2px_12px_rgba(244,63,94,0.5)] mb-1">
          Waiting for my sweetheart...
        </h2>

        {/* Sweet Subtitle */}
        <p className="font-sans text-xs sm:text-sm text-rose-200/80 tracking-wider mb-6 flex items-center gap-1.5 justify-center">
          <span>Loading magic for my heart</span>
          <span className="inline-block animate-pulse text-rose-400">💕</span>
        </p>

        {/* Progress Bar Container */}
        <div className="w-56 sm:w-64 h-2 rounded-full bg-rose-950/80 p-[1.5px] border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)] mb-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(251,113,133,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <span className="font-mono text-xs text-rose-300/80 tracking-widest font-medium">
          {progress}%
        </span>
      </div>
    </div>
  );
}
