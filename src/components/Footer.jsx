import React from 'react';
import { Heart, Settings } from 'lucide-react';
import SongHyIcon from './SongHyIcon';
import { weddingConfig } from '../config/weddingConfig';

export default function Footer({ onOpenAdmin, config = weddingConfig }) {
  return (
    <footer className="py-16 px-4 bg-gradient-to-b from-wedding-red-900 to-wedding-red-deep text-center text-amber-100 relative overflow-hidden border-t-2 border-amber-400/30">
      <div className="max-w-md mx-auto space-y-4 relative z-10">
        <SongHyIcon className="w-12 h-12 text-amber-300 mx-auto" />

        <h4 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
          {config.groom.shortName} &amp; {config.bride.shortName}
        </h4>

        <p className="text-xs sm:text-sm text-stone-300 font-serif italic">
          "Cảm ơn bạn đã luôn là một phần tươi đẹp trong hành trình hạnh phúc của chúng mình!"
        </p>

        <div className="pt-6 border-t border-amber-400/20 flex items-center justify-between text-xs text-stone-400">
          <span>{config.weddingDate.substring(0, 4)} • Wedding Invitation</span>
          
          {/* Discreet Admin Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-stone-300 hover:text-amber-200 transition-colors"
            title="Quản lý khách mời & Google Sheet"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Quản Lý</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
