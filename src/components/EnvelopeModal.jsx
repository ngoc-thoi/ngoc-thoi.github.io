import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import SongHyIcon from './SongHyIcon';
import confetti from 'canvas-confetti';

export default function EnvelopeModal({ guest, config, onOpen, onClose }) {
  const [stage, setStage] = useState('closed'); // 'closed' -> 'opening' -> 'extracted' -> 'dismissed'

  const handleOpen = () => {
    if (stage !== 'closed') return;

    // Step 1: Flap flips open in 3D
    setStage('opening');

    // Confetti celebration burst
    const colors = ['#C8102E', '#E11D48', '#D4AF37', '#FDE047', '#FDA4AF', '#FFFFFF'];
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.6 },
      colors
    });

    // Step 2: Letter card slides up out of envelope pocket
    setTimeout(() => {
      setStage('extracted');
    }, 500);

    // Step 3: Trigger music and unfold into full site
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 1100);

    // Step 4: Fully dismiss overlay
    setTimeout(() => {
      setStage('dismissed');
      if (onClose) onClose();
    }, 1600);
  };

  if (stage === 'dismissed') return null;

  const isFlapOpen = stage === 'opening' || stage === 'extracted';
  const isCardExtracted = stage === 'extracted';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden transition-all duration-700 ${
        stage === 'extracted' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #4A0E17 0%, #2A080C 50%, #170406 100%)'
      }}
    >
      {/* Ambient Floating Hearts & Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300/25 animate-float select-none"
            style={{
              left: `${(i * 13 + 4) % 94}%`,
              top: `${(i * 19 + 7) % 92}%`,
              animationDelay: `${i * 0.35}s`,
              animationDuration: `${4 + (i % 5)}s`,
              fontSize: `${12 + (i % 18)}px`
            }}
          >
            <Heart className="w-full h-full fill-current" />
          </div>
        ))}
      </div>

      {/* 3D Envelope Container with Real Perspective */}
      <div 
        className="relative w-full max-w-[340px] sm:max-w-[420px] h-[480px] sm:h-[520px] flex items-center justify-center select-none"
        style={{ perspective: '1200px' }}
      >
        {/* PHYSICAL RED ENVELOPE BOX */}
        <div className="relative w-full h-[320px] sm:h-[350px]">
          
          {/* 1. ENVELOPE BACK WALL (Đáy phong bì) */}
          <div 
            className="absolute inset-0 rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #6B111A 0%, #520B13 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(107, 17, 26, 0.4)'
            }}
          />

          {/* 2. THE INVITATION LETTER CARD INSIDE (Tờ thiệp mời trượt lên) */}
          <div 
            onClick={handleOpen}
            className={`absolute left-3 right-3 sm:left-4 sm:right-4 rounded-2xl bg-[#FFFDF9] p-5 sm:p-6 text-center border-2 border-amber-300/80 shadow-xl transition-all duration-700 ease-out cursor-pointer ${
              isCardExtracted 
                ? 'z-40 -translate-y-40 sm:-translate-y-48 scale-105 shadow-2xl' 
                : 'z-10 top-2 bottom-3'
            }`}
            style={{
              willChange: 'transform, z-index',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Gold Corner Accents */}
            <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-amber-500/60 pointer-events-none"></div>
            <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-amber-500/60 pointer-events-none"></div>
            <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-amber-500/60 pointer-events-none"></div>
            <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-amber-500/60 pointer-events-none"></div>

            {/* Event Tag */}
            <div className="pt-2 mb-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-wedding-red-50 text-wedding-red text-[11px] sm:text-xs uppercase font-bold tracking-widest border border-wedding-red-200">
                {config.eventType || "Tiệc Báo Hỷ"}
              </span>
            </div>

            {/* Couple Names */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wedding-red leading-tight my-1.5">
              <span>{config.groom.shortName}</span>
              <span className="font-script text-xl sm:text-2xl text-amber-600 mx-2">&amp;</span>
              <span>{config.bride.shortName}</span>
            </h1>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-xs">❦</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>

            {/* Event Date */}
            <p className="font-serif text-xs sm:text-sm text-stone-600 font-medium mb-3">
              {config.displayDate}
            </p>

            {/* Personalized Guest Greeting */}
            <div className="my-2 p-3 sm:p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-center">
              <p className="text-[11px] sm:text-xs text-stone-500 uppercase tracking-wider mb-0.5">
                Trân Trọng Kính Mời
              </p>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-wedding-red">
                {guest.prefix} <span className="underline decoration-amber-400 decoration-2 underline-offset-2">{guest.name}</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-600 mt-1 font-light">
                Đến dự buổi tiệc báo hỷ chung vui cùng gia đình chúng mình
              </p>
            </div>

            {/* Shimmering "Mở Thiệp" Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-wedding-red to-wedding-red-800 text-amber-100 font-bold text-sm sm:text-base shadow-lg hover:shadow-red-900/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden border border-amber-300/70 mt-1"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>Chạm Để Mở Thiệp</span>

              {/* Shimmering Light Sweep Beam */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            </button>
          </div>

          {/* 3. ENVELOPE FRONT POCKET (Túi bao thư phía trước che nửa dưới thiệp) */}
          <div 
            className="absolute inset-x-0 bottom-0 h-[210px] sm:h-[230px] rounded-b-2xl pointer-events-none z-20 overflow-hidden"
            style={{
              clipPath: 'polygon(0 35%, 50% 8%, 100% 35%, 100% 100%, 0 100%)',
              background: 'linear-gradient(180deg, #7F131E 0%, #5A0C14 100%)',
              borderBottom: '2px solid rgba(212, 175, 55, 0.4)'
            }}
          >
            {/* Subtle pocket shadow and border trim */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-b from-amber-400/40 to-transparent" />
          </div>

          {/* 4. ENVELOPE 3D TOP FLAP (Nắp bao thư gập mở 3D 180 độ) */}
          <div
            onClick={handleOpen}
            className={`absolute top-0 inset-x-0 h-[170px] sm:h-[185px] transition-all duration-700 ease-in-out cursor-pointer ${
              isFlapOpen ? 'z-5 pointer-events-none' : 'z-30'
            }`}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              willChange: 'transform'
            }}
          >
            {/* Triangular Flap Shape */}
            <div 
              className="w-full h-full rounded-t-2xl shadow-xl relative"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #8A1622 0%, #680E17 100%)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Gold rim on flap */}
              <div 
                className="absolute bottom-0 inset-x-0 h-2"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.6) 0%, transparent 70%)'
                }}
              />
            </div>

            {/* 5. ROYAL WAX SEAL BADGE (Con dấu sáp Song Hỷ nhấp nháy nhịp tim) */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 bottom-1 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                isFlapOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100 hover:scale-110 active:scale-95 animate-pulse'
              }`}
              style={{
                background: 'radial-gradient(circle at 35% 30%, #C8102E, #500810)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                border: '2px solid rgba(251, 191, 36, 0.9)'
              }}
              title="Bấm để mở phong bì thiệp cưới"
            >
              <SongHyIcon className="w-8 h-8 sm:w-9 sm:h-9 text-amber-200 drop-shadow" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
