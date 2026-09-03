import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import SongHyIcon from './SongHyIcon';
import confetti from 'canvas-confetti';

export default function EnvelopeModal({ guest, config, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    
    // Celebratory burst of confetti
    const colors = ['#C8102E', '#E11D48', '#D4AF37', '#FDE047', '#FDA4AF'];
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors
    });

    if (onOpen) {
      onOpen();
    }

    // Smoothly remove modal from DOM after transition
    setTimeout(() => {
      setIsDismissed(true);
    }, 700);
  };

  if (isDismissed) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden transition-all duration-700 ${
        isOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #6e1a20 0%, #511419 50%, #380a0e 100%)'
      }}
    >
      {/* Ambient Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300/30 animate-float"
            style={{
              left: `${(i * 17 + 5) % 95}%`,
              top: `${(i * 23 + 10) % 90}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + (i % 4)}s`,
              fontSize: `${14 + (i % 16)}px`
            }}
          >
            <Heart className="w-full h-full fill-current" />
          </div>
        ))}
      </div>

      {/* Main Envelope Card Container */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
        
        {/* Wax Seal Badge - Pulsing */}
        <div 
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center z-20 shadow-2xl border-2 border-amber-300 animate-pulse"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #8b0000, #380a0e)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
          }}
        >
          <SongHyIcon className="w-8 h-8 text-amber-200" />
        </div>

        {/* Envelope Paper Card */}
        <div className="relative rounded-3xl bg-[#FFFDF9] p-7 sm:p-9 text-center shadow-2xl border-2 border-amber-300/80 overflow-hidden">
          
          {/* Decorative Corner Flourishes */}
          <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-500/50 pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-500/50 pointer-events-none"></div>

          {/* Subtitle */}
          <div className="pt-5 mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-wedding-red-50 text-wedding-red text-xs uppercase font-bold tracking-widest border border-wedding-red-200">
              {config.eventType || "Tiệc Báo Hỷ"}
            </span>
          </div>

          {/* Couple Names */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wedding-red leading-tight my-2">
            <span>{config.groom.shortName}</span>
            <span className="font-script text-2xl sm:text-3xl text-amber-600 mx-2">&amp;</span>
            <span>{config.bride.shortName}</span>
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
            <span className="text-amber-600 text-xs">❦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>

          {/* Date */}
          <p className="font-serif text-sm sm:text-base text-stone-600 mb-5">
            {config.displayDate}
          </p>

          {/* Personalized Guest Greeting */}
          <div className="my-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <p className="text-xs sm:text-sm text-stone-500 uppercase tracking-wider mb-1">
              Trân Trọng Kính Mời
            </p>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-wedding-red">
              {guest.prefix} <span className="underline decoration-amber-400 decoration-2 underline-offset-4">{guest.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-light">
              Đến dự buổi tiệc báo hỷ chung vui cùng chúng mình
            </p>
          </div>

          {/* Shimmering "Mở Thiệp" Button */}
          <button
            onClick={handleOpen}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-wedding-red to-wedding-red-800 text-amber-200 font-bold text-base sm:text-lg shadow-xl hover:shadow-red-900/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden border border-amber-300/60"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span>Mở Thiệp</span>

            {/* Glowing Light Beam Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
