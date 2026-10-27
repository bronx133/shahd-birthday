import React, { useState, useRef } from 'react';
import FloatingRosesBackground from './components/FloatingRosesBackground';
import HeroIntroCard from './components/HeroIntroCard';
import CDPlayerStage from './components/CDPlayerStage';
import CakeAndGiftsStage from './components/CakeAndGiftsStage';
import FloatingMusicButton from './components/FloatingMusicButton';
import FloralCurtainTransition from './components/FloralCurtainTransition';
import lovesongAudio from './assets/Lovesong.mp3';
import bgPc from './assets/background pc.jpg';
import bgMobile from './assets/background mobile.jpg';

export default function App() {
  // Views: 'hero' (Screen 1) | 'cd_stage' (CD insert stage) | 'cake_stage' (Screen 3: Cake Time & Your Gifts)
  const [currentView, setCurrentView] = useState('hero');

  // Curtain transition state: 'idle' | 'closing' | 'closed' | 'opening'
  const [curtainStage, setCurtainStage] = useState('idle');

  // Track if music has been initiated by inserting the CD
  const [hasStartedMusic, setHasStartedMusic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Track if playlist gift modal is open to auto-pause background music & hide floating CD
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const wasPlayingBeforePlaylistRef = useRef(false);

  // Auto pause/resume background music and hide/show CD when playlist modal opens/closes
  const handlePlaylistOpenChange = (isOpen) => {
    setIsPlaylistOpen(isOpen);

    if (isOpen) {
      // If music is playing, remember and pause it
      if (audioRef.current && (!audioRef.current.paused || isPlaying)) {
        wasPlayingBeforePlaylistRef.current = true;
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        wasPlayingBeforePlaylistRef.current = false;
      }
    } else {
      // When playlist closes, resume music from the exact spot if it was playing before
      if (wasPlayingBeforePlaylistRef.current && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio resume error:', err);
            setIsPlaying(true);
          });
        wasPlayingBeforePlaylistRef.current = false;
      }
    }
  };

  // Transition helper with floral curtains
  const triggerTransitionTo = (nextView) => {
    if (curtainStage !== 'idle') return;

    // Phase 1: Curtains sweep in
    setCurtainStage('closing');

    // Phase 2: Curtains meet at center
    setTimeout(() => {
      setCurtainStage('closed');
      setCurrentView(nextView);

      // Phase 3: Pause briefly to show the full blooming flower, then slide apart
      setTimeout(() => {
        setCurtainStage('opening');

        // Phase 4: Curtains fully open
        setTimeout(() => {
          setCurtainStage('idle');
        }, 1000);
      }, 700);
    }, 950);
  };

  // 1. When clicking "Start" on Screen 1 (Hero):
  const handleStartFromHero = () => {
    triggerTransitionTo('cd_stage');
  };

  // 2. When the CD is tapped and inserted into the black circle:
  const handlePlaySong = () => {
    setHasStartedMusic(true);

    // Play Lovesong.mp3 directly
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio playback policy/error:', err);
          setIsPlaying(true);
        });
    } else {
      setIsPlaying(true);
    }
  };

  // 3. When clicking "Next" on the CD stage:
  const handleNextFromCD = () => {
    triggerTransitionTo('cake_stage');
  };

  // 4. Toggle play/pause from the floating button
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(true));
    }
  };

  const handleReplayIntro = () => {
    // Stop music if returning to intro
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setHasStartedMusic(false);
    setIsPlaylistOpen(false);
    wasPlayingBeforePlaylistRef.current = false;
    triggerTransitionTo('hero');
  };

  const audioSrc = lovesongAudio || '/Lovesong.mp3';
  const pcBgSrc = bgPc || '/background pc.jpg';
  const mobileBgSrc = bgMobile || '/background mobile.jpg';

  // Only show the floating music controller starting from the page AFTER the CD stage (Screen 3 and beyond)
  // And hide it completely when the playlist modal is open
  const showFloatingMusicButton =
    hasStartedMusic && currentView === 'cake_stage' && !isPlaylistOpen;

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-x-hidden flex flex-col justify-center items-center selection:bg-rose-500 selection:text-white">
      {/* 0. Fullscreen Responsive Illustrated Background Layer */}
      <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden select-none">
        {/* Desktop / PC Background (Widescreen) */}
        <img
          src={pcBgSrc}
          alt="Romantic Illustration Background PC"
          className="hidden md:block w-full h-full object-cover object-center"
        />
        {/* Mobile Background (Portrait) */}
        <img
          src={mobileBgSrc}
          alt="Romantic Illustration Background Mobile"
          className="block md:hidden w-full h-full object-cover object-center"
        />

        {/* Soft pink ambient lighting wash */}
        <div className="absolute inset-0 bg-pink-900/10 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Background HTML5 Audio Element for Lovesong.mp3 (Never unmounts, continuous playback) */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />

      {/* Floating Music Button (Shown ONLY after CD starts playing, NEVER on hero page or CD stage) */}
      {showFloatingMusicButton && (
        <FloatingMusicButton
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
        />
      )}

      {/* 1. Dynamic Falling Roses Background using custom Falling roses.gif */}
      <FloatingRosesBackground count={20} />

      {/* 2. Main View Flow depending on stage */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center w-full px-4 py-8">
        {currentView === 'hero' && (
          <HeroIntroCard onStart={handleStartFromHero} />
        )}
        {currentView === 'cd_stage' && (
          <CDPlayerStage
            onPlaySong={handlePlaySong}
            onNext={handleNextFromCD}
          />
        )}
        {currentView === 'cake_stage' && (
          <CakeAndGiftsStage
            onReplayIntro={handleReplayIntro}
            onPlaylistOpenChange={handlePlaylistOpenChange}
          />
        )}
      </main>

      {/* 3. Custom Animated Floral Theater Curtain Transition */}
      <FloralCurtainTransition stage={curtainStage} />
    </div>
  );
}
