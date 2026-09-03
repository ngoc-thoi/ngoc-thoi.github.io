import React from 'react';
import { Calendar, MapPin, Heart, ChevronDown } from 'lucide-react';
import SongHyIcon from './SongHyIcon';
import { weddingConfig } from '../config/weddingConfig';

export default function Hero({ guest, config = weddingConfig }) {
  const scrollToDetails = () => {
    const section = document.getElementById('event-details');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroImage = config.heroPhoto || "https://cdn.chungdoi.com/uploads/f7ad6966-5f55-4377-8d63-9f3386eb2442.jpg";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between text-center overflow-hidden bg-gradient-to-b from-wedding-red-900 via-wedding-red-800 to-wedding-red-900 text-amber-50 px-4 py-10 sm:py-16">
      {/* Decorative Traditional Corner Accents */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-400/60 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-400/60 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-400/60 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-400/60 pointer-events-none"></div>

      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/30 pointer-events-none"></div>

      {/* Top Header Badge */}
      <div className="relative z-10 pt-2 flex flex-col items-center space-y-2">
        <SongHyIcon className="w-14 h-14 text-amber-300 drop-shadow-md" />
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-amber-300/90 font-medium">
          Save Our Date • Tiệc Báo Hỷ
        </p>
      </div>

      {/* Featured Couple Portrait from ChungDoi */}
      <div className="relative z-10 my-4">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto rounded-full overflow-hidden border-4 border-amber-300 shadow-2xl shadow-black/50 ring-4 ring-amber-400/20">
          <img
            src={heroImage}
            alt={`${config.groom.shortName} & ${config.bride.shortName}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Main Couple Names */}
      <div className="relative z-10 my-2 space-y-2 max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-md">
          {config.groom.shortName} <span className="font-script text-3xl sm:text-5xl text-amber-400">&</span> {config.bride.shortName}
        </h1>
        <p className="text-stone-300 font-serif italic text-sm sm:text-base">
          {config.groom.fullName} &amp; {config.bride.fullName}
        </p>
      </div>

      {/* Personalized Invitation Card for Close Friend */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-wedding-red-950/90 rounded-2xl border-2 border-amber-400/40 p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
        <div className="inline-block px-3 py-1 mb-3 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs tracking-wider uppercase font-semibold">
          Thiệp Mời Báo Hỷ Thân Mật
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
          <p className="mt-3 text-amber-100/90 text-sm sm:text-base font-serif italic px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/20">
            "{guest.message}"
          </p>
        )}

        {/* Guest Group Tag */}
        {guest.group && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-amber-400/20 text-xs sm:text-sm text-amber-200/90">
            <span className="px-3 py-1 rounded-full bg-white/10 text-stone-200">
              {guest.group}
            </span>
          </div>
        )}

        <p className="mt-4 text-xs sm:text-sm text-stone-300">
          Đến tham dự buổi tiệc báo hỷ chung vui cùng chúng mình vào:
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wedding-red-700/70 border border-amber-300/30 text-amber-200 text-sm sm:text-base font-medium shadow-inner">
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>{config.displayDate}</span>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 pt-6 pb-2 flex flex-col items-center">
        <button
          onClick={scrollToDetails}
          className="group flex flex-col items-center gap-1.5 text-amber-200/80 hover:text-amber-100 transition-colors"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Xem Chi Tiết &amp; Chỉ Đường</span>
          <ChevronDown className="w-5 h-5 text-amber-300 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
