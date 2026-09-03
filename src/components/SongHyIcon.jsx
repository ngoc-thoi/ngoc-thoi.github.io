import React from 'react';

export default function SongHyIcon({ className = "w-12 h-12", color = "#D4AF37" }) {
  return (
    <div className={`inline-flex items-center justify-center font-serif font-bold select-none ${className}`} style={{ color }}>
      <span className="text-3xl sm:text-4xl tracking-tighter drop-shadow-sm">囍</span>
    </div>
  );
}
