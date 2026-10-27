import React, { useEffect, useRef } from 'react';
import fallingRoseGif from '../assets/Falling roses.gif';

export default function FloatingRosesBackground({ count = 16 }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const effectiveCount = isMobile ? 8 : count;

  const containerRef = useRef(null);
  const rosesRef = useRef([]);

  const roseSrc = fallingRoseGif || '/Falling roses.gif';

  useEffect(() => {
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let lastTime = 0;
    const targetFpsMs = isMobile ? 33 : 16; // 30 FPS on mobile, 60 FPS on desktop

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse breeze interaction
    const mouse = { x: -1000, y: -1000, radius: 130 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Initialize rose particle items
    const elements = rosesRef.current;
    if (!elements || elements.length === 0) return;

    const particles = elements.map((el, i) => {
      return {
        el,
        x: Math.random() * width,
        y: Math.random() * height - 50,
        size: Math.random() * 20 + 26, // 26px to 46px
        speedY: Math.random() * 1.1 + 0.7, // Smooth gentle descent
        speedX: Math.random() * 0.6 - 0.3,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.012,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.35 + 0.65,
      };
    });

    const updatePhysics = (now) => {
      animationFrameId = requestAnimationFrame(updatePhysics);
      if (now - lastTime < targetFpsMs) return;
      lastTime = now;

      particles.forEach((p) => {
        if (!p.el) return;

        p.swing += p.swingSpeed;
        p.rotation += p.rotSpeed;

        // Natural horizontal breeze drift
        const wind = Math.sin(p.swing) * 1.1;
        p.x += p.speedX + wind;
        p.y += p.speedY;

        // Interactive mouse / touch breeze reaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 4.5;
          p.y += (dy / dist) * force * 2.5;
        }

        // Recycle to top when fallen off-screen
        if (p.y > height + 60 || p.x < -60 || p.x > width + 60) {
          p.y = -50;
          p.x = Math.random() * width;
          p.speedY = Math.random() * 1.1 + 0.7;
        }

        // Apply hardware-accelerated transform
        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
      });
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effectiveCount]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {Array.from({ length: effectiveCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (rosesRef.current[i] = el)}
          className="absolute top-0 left-0 will-change-transform pointer-events-none"
          style={{
            width: `${32 + (i % 3) * 6}px`,
            height: `${32 + (i % 3) * 6}px`,
            opacity: 0.82,
          }}
        >
          <img
            src={roseSrc}
            alt="Falling Rose"
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}
