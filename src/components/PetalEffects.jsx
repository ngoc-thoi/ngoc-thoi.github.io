import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

export default function PetalEffects() {
  const triggerConfetti = () => {
    // Red, pink, and gold petals/confetti
    const colors = ['#8B0000', '#B91C1C', '#D4AF37', '#FDE047', '#FDA4AF'];

    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    });
  };

  useEffect(() => {
    // Initial romantic shower
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={triggerConfetti}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-red-700 to-red-800 text-amber-200 text-xs font-semibold rounded-full shadow-lg border border-amber-300/40 hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 transition-all duration-200"
      title="Tung hoa chúc phúc"
    >
      <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
      <span>Chúc Phúc</span>
    </button>
  );
}
