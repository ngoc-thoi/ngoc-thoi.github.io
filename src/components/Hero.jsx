import React from 'react';
import { Calendar, MapPin, Heart, ChevronDown, Utensils } from 'lucide-react';
import SongHyIcon from './SongHyIcon';
import { weddingConfig } from '../config/weddingConfig';

export default function Hero({ guest }) {
  const scrollToDetails = () => {
    const section = document.getElementById('event-details');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between text-center overflow-hidden bg-gradient-to-b from-wedding-red-900 via-wedding-red-800 to-wedding-red-900 text-amber-50 px-4 py-12 sm:py-16">
      {/* Decorative Traditional Corner Accents */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-400/60 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-400/60 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-400/60 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-400/60 pointer-events-none"></div>

      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/30 pointer-events-none"></div>

      {/* Top Header */}
      <div className="relative z-10 pt-4 flex flex-col items-center space-y-2">
        <SongHyIcon className="w-16 h-16 text-amber-300 drop-shadow" />
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-amber-300/90 font-medium">
          Save Our Date • Lễ Thành Hôn
        </p>
      </div>

      {/* Main Couple Names */}
      <div className="relative z-10 my-8 space-y-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-md">
          {weddingConfig.groom.shortName} <span className="font-script text-3xl sm:text-5xl text-amber-400">&</span> {weddingConfig.bride.shortName}
        </h1>
        <p className="text-stone-300 font-serif italic text-base sm:text-lg">
          {weddingConfig.groom.fullName} &amp; {weddingConfig.bride.fullName}
        </p>
      </div>

      {/* Personalized Invitation Card for Friend */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-wedding-red-950/90 rounded-2xl border-2 border-amber-400/40 p-6 sm:p-8 shadow-2xl shadow-black/50">
        <div className="inline-block px-3 py-1 mb-3 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs tracking-wider uppercase">
          Thiệp Mời Thân Mật
        </div>

        <p className="text-stone-300 text-sm sm:text-base font-light mb-1">
          Trân trọng kính mời
        </p>

        {/* Personalized Guest Name */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-amber-200 py-1 drop-shadow">
          {guest.prefix} <span className="text-white underline decoration-amber-400/60 decoration-2 underline-offset-4">{guest.name}</span>
        </h2>

        {/* Custom Personal Message if available */}
        {guest.message && (
          <p className="mt-3 text-amber-100/90 text-sm sm:text-base font-serif italic px-2 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/20">
            "{guest.message}"
          </p>
        )}

        {/* Guest Group or Table Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-amber-400/20 text-xs sm:text-sm text-amber-200/90">
          {guest.table && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 font-semibold">
              <Utensils className="w-3.5 h-3.5 text-amber-300" />
              {guest.table}
            </span>
          )}
          {guest.group && (
            <span className="px-3 py-1 rounded-full bg-white/10 text-stone-200">
              {guest.group}
            </span>
          )}
        </div>

        <p className="mt-4 text-xs sm:text-sm text-stone-300">
          Đến tham dự buổi tiệc chung vui cùng gia đình chúng mình vào:
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wedding-red-700/70 border border-amber-300/30 text-amber-200 text-sm sm:text-base font-medium">
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>{weddingConfig.displayDate}</span>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 pt-8 pb-4 flex flex-col items-center">
        <button
          onClick={scrollToDetails}
          className="group flex flex-col items-center gap-2 text-amber-200/80 hover:text-amber-100 transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Xem Chi Tiết &amp; Chỉ Đường</span>
          <ChevronDown className="w-5 h-5 text-amber-300 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
