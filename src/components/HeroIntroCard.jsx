import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import loveYouCatSticker from '../assets/Love You Cat Sticker.gif';
import catPartySticker from '../assets/Cat Party Sticker.gif';

export default function HeroIntroCard({ onStart }) {
  // Word flip state: alternating between 'Rose' and 'Shahd'
  const [currentWord, setCurrentWord] = useState('Rose');
  const [isFlipping, setIsFlipping] = useState(false);
  const [catPurr, setCatPurr] = useState(false);

  useEffect(() => {
    // Smooth continuous word swap every 2.4s with pure glowing red flow
    const SWAP_INTERVAL = 2400;

    const interval = setInterval(() => {
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentWord((prev) => (prev === 'Rose' ? 'Shahd' : 'Rose'));
        setIsFlipping(false);
      }, 200);
    }, SWAP_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleButtonHover = () => {
    soundManager.playHoverChime();
  };

  const handleButtonClick = () => {
    soundManager.playStartHarp();
    onStart();
  };

  const handleCornerCatClick = () => {
    soundManager.playEasterEggPop();
    setCatPurr(true);
    setTimeout(() => setCatPurr(false), 2000);
  };

  const loveCatSrc = loveYouCatSticker || '/Love You Cat Sticker.gif';
  const cornerCatSrc = catPartySticker || '/Cat Party Sticker.gif';

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-[85vh] px-4 sm:px-6 py-6 pointer-events-auto w-full max-w-lg md:max-w-xl mx-auto">
      {/* Soft Ambient Rose Glow Behind Card */}
      <div className="absolute w-72 sm:w-96 md:w-[30rem] h-72 sm:h-96 rounded-full bg-gradient-to-tr from-rose-400/20 via-pink-300/15 to-rose-200/25 blur-3xl -z-10 pointer-events-none" />

      {/* Main Glassmorphic Center Card */}
      <div className="relative w-full glass-card rounded-3xl p-7 sm:p-10 md:p-11 text-center transition-all duration-500 rose-glow-border group">
        
        {/* Corner Cat Peeking (Top-Right): Click to say "Meow! Happy Birthday Shahd" */}
        <div
          onClick={handleCornerCatClick}
          className={`absolute -top-9 sm:-top-11 -right-3 sm:-right-4 z-30 cursor-pointer select-none transition-transform duration-300 hover:scale-110 ${
            catPurr ? 'animate-bounce' : 'animate-float-slow'
          }`}
        >
          <div className="relative">
            <img
              src={cornerCatSrc}
              alt="Peeking Cat"
              className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 object-contain drop-shadow-md"
            />
            {catPurr && (
              <span className="absolute -top-4 right-0 sm:right-2 bg-white/95 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-rose-200 whitespace-nowrap animate-fade-in font-playfair italic">
                Meow! Happy Birthday Shahd
              </span>
            )}
          </div>
        </div>

        {/* 1. Animated Cat Sticker (Holding Rose): Gracefully placed in the empty white space at the TOP */}
        <div className="flex justify-center mb-2 pointer-events-none select-none">
          <img
            src={loveCatSrc}
            alt="Cat holding rose"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-sm animate-float-slow"
          />
        </div>

        {/* 2. Heading: "Happy Birthday," in solid text, and ONLY "Rose"/"Shahd" has the glowing red flow */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold leading-tight mb-3 font-playfair italic tracking-tight">
          <span className="text-rose-950 inline-block font-playfair italic">
            Happy Birthday,
          </span>{' '}
          <br />
          <span
            className={`word-shimmer-sweep inline-block font-playfair italic transition-all duration-200 ease-out min-w-[3.6ch] text-center ${
              isFlipping
                ? 'opacity-0 scale-95 -translate-y-2 blur-[2px]'
                : 'opacity-100 scale-100 translate-y-0 blur-0'
            }`}
          >
            {currentWord}
          </span>
        </h1>

        {/* 3. Subtitle in solid clean text */}
        <p className="text-base sm:text-lg md:text-xl font-medium text-rose-700/85 mb-8 font-playfair italic tracking-wide">
          Are you ready to start?
        </p>

        {/* 4. Start Button: Clean, Standalone with glowing effect & smooth hover physics */}
        <div className="relative inline-block w-full sm:w-auto">
          {/* Glowing Aura Effect */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 opacity-70 blur-md animate-pulse"></div>

          <button
            onClick={handleButtonClick}
            onMouseEnter={handleButtonHover}
            className="relative w-full sm:w-auto min-w-[160px] sm:min-w-[190px] px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold text-white text-lg sm:text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.04] active:scale-95 flex items-center justify-center font-playfair italic tracking-wider cursor-pointer overflow-hidden group bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-700"
          >
            {/* Shimmer light sweep on button hover */}
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-[100%]" />

            <span className="relative z-10 font-semibold tracking-widest">
              Start
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
