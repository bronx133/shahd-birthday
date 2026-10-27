import React from 'react';
import { X, Music2 } from 'lucide-react';
import danceStickerImg from '../assets/Dance Dancing Sticker.gif';

const SPOTIFY_EMBED_URL =
  'https://open.spotify.com/embed/playlist/4T7aSnWqh6UxxHahYl3que?utm_source=generator&theme=0';

export default function PlaylistGiftCard({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{
        background: 'rgba(15, 5, 10, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl animate-card-entrance my-auto rose-glow-border"
        style={{
          background:
            'linear-gradient(165deg, rgba(255, 250, 252, 0.97) 0%, rgba(254, 235, 242, 0.95) 50%, rgba(255, 241, 245, 0.97) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(244, 63, 94, 0.35)',
          boxShadow:
            '0 25px 60px -10px rgba(225, 29, 72, 0.22), 0 0 35px 2px rgba(251, 113, 133, 0.15)',
        }}
      >
        {/* Soft Ambient Rose Glow in Background */}
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-pink-400/25 blur-3xl pointer-events-none" />

        {/* ── Modal Header (Romantic Rose Theme) ── */}
        <div className="relative flex items-center justify-between px-5 pt-4 pb-3 border-b border-rose-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-300/80 flex items-center justify-center text-rose-600 shadow-sm">
              <Music2 size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-playfair italic text-rose-950 tracking-wide leading-tight">
                Shahd's Playlist
              </h2>
              <p className="text-[11px] text-rose-600/90 font-playfair italic">
                Songs that remind me of you
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-600 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300/70 transition-all duration-200 active:scale-90 cursor-pointer shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Spotify Embed Container & Cat Sticker ── */}
        <div className="relative px-3.5 pt-3.5 pb-2.5 sm:px-4 sm:pt-4 sm:pb-3">
          {/* Spotify Frame */}
          <div
            className="w-full rounded-2xl overflow-hidden bg-black shadow-md border-2 border-rose-200/90"
            style={{ minHeight: '352px' }}
          >
            <iframe
              title="Omar & Shahd Spotify Playlist"
              src={SPOTIFY_EMBED_URL}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full block"
              style={{ borderRadius: '14px', border: 'none' }}
            />
          </div>

          {/* ── Bottom Row: Brought much closer to the Spotify Box ── */}
          <div className="flex items-center justify-between mt-1 px-1 relative z-10">
            <div className="text-left py-1">
              <p className="text-xs font-playfair italic text-rose-950 font-semibold leading-tight">
                Turn the music up & vibe 🎶
              </p>
              <p className="text-[10px] font-playfair italic text-rose-600/80 mt-0.5">
                Curated with love by Omar
              </p>
            </div>

            {/* Cat GIF: Positioned snugly right under the music player & enlarged */}
            <div className="relative group select-none -mt-6 sm:-mt-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-rose-400/25 blur-lg group-hover:bg-rose-400/40 transition-all pointer-events-none" />
              <img
                src={danceStickerImg}
                alt="Dance Dancing Sticker"
                className="relative w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-lg transform transition-transform hover:scale-108 active:scale-95"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
