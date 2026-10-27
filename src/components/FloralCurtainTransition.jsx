import React from 'react';
import floralGif from '../assets/output-onlinegiftools.gif';

export default function FloralCurtainTransition({ stage }) {
  const isClosingOrClosed = stage === 'closing' || stage === 'closed';
  const isVisible = stage !== 'idle';

  if (!isVisible && stage === 'idle') {
    return null;
  }

  const gifSrc = floralGif || '/output-onlinegiftools.gif';

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ================= LEFT THEATER CURTAIN ================= */}
      <div
        className="curtain-panel left-0 w-[50vw] sm:w-[50.05vw] h-full overflow-hidden pointer-events-auto"
        style={{
          transform: isClosingOrClosed ? 'translateX(0%)' : 'translateX(-100%)',
          transition: 'transform 950ms cubic-bezier(0.77, 0, 0.175, 1)',
          background: 'linear-gradient(135deg, #32020e 0%, #530818 35%, #7a0f2e 70%, #9f1239 100%)',
          boxShadow: '8px 0 25px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Velvet Vertical Shading */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 16px, rgba(0,0,0,0.18) 16px, rgba(0,0,0,0.18) 32px)',
          }}
        />

        {/* Left Half of Floral Graphic (Anchored to right edge / center seam) */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[540px] lg:h-[540px] pointer-events-none flex items-center justify-center">
          <img
            src={gifSrc}
            alt="Left Floral Half"
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        </div>

        {/* Center Seam Glow Highlight */}
        <div className="absolute top-0 bottom-0 right-0 w-[1.5px] bg-gradient-to-b from-transparent via-rose-300/40 to-transparent" />
      </div>

      {/* ================= RIGHT THEATER CURTAIN ================= */}
      <div
        className="curtain-panel right-0 w-[50vw] sm:w-[50.05vw] h-full overflow-hidden pointer-events-auto"
        style={{
          transform: isClosingOrClosed ? 'translateX(0%)' : 'translateX(100%)',
          transition: 'transform 950ms cubic-bezier(0.77, 0, 0.175, 1)',
          background: 'linear-gradient(225deg, #32020e 0%, #530818 35%, #7a0f2e 70%, #9f1239 100%)',
          boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Velvet Vertical Shading */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 16px, rgba(0,0,0,0.18) 16px, rgba(0,0,0,0.18) 32px)',
          }}
        />

        {/* Right Half of Floral Graphic (Anchored to left edge / center seam) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[540px] lg:h-[540px] pointer-events-none flex items-center justify-center">
          <img
            src={gifSrc}
            alt="Right Floral Half"
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        </div>

        {/* Center Seam Glow Highlight */}
        <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-transparent via-rose-300/40 to-transparent" />
      </div>
    </div>
  );
}
