import React from 'react';
import { weddingConfig } from '../config/weddingConfig';
import SongHyIcon from './SongHyIcon';

export default function CoupleStory({ config = weddingConfig }) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#FFFDF9] via-rose-50/30 to-[#FFFDF9]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center space-x-2 mb-3">
          <span className="h-px w-8 bg-amber-400"></span>
          <SongHyIcon className="w-8 h-8 text-wedding-red" />
          <span className="h-px w-8 bg-amber-400"></span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl text-wedding-red font-bold mb-2">
          Cô Dâu &amp; Chú Rể
        </h3>
        <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base mb-12">
          "Hai con người, hai trái tim, cùng chung một nhịp đập và một lời hẹn ước suốt cuộc đời."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* Groom (Chú Rể) */}
          <div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-amber-200/60 transition-transform duration-300 hover:-translate-y-1">
            <div className="relative mb-5">
              <img
                src={config.groom.avatar}
                alt={config.groom.fullName}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover object-center border-4 border-amber-300 shadow-md"
              />
              <span className="absolute bottom-1 right-2 px-3 py-1 bg-wedding-red text-amber-200 text-xs font-semibold rounded-full shadow border border-amber-300">
                Chú Rể
              </span>
            </div>
            <h4 className="font-serif text-2xl font-bold text-stone-800 mb-1">
              {config.groom.fullName}
            </h4>
            <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-4">
              Nhà Trai • {config.groom.address}
            </p>
            <div className="text-sm text-stone-600 space-y-1 border-t border-stone-100 pt-3 w-full">
              <p><span className="font-medium text-stone-700">Thân phụ:</span> {config.groom.father}</p>
              <p><span className="font-medium text-stone-700">Thân mẫu:</span> {config.groom.mother}</p>
            </div>
          </div>

          {/* Bride (Cô Dâu) */}
          <div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-amber-200/60 transition-transform duration-300 hover:-translate-y-1">
            <div className="relative mb-5">
              <img
                src={config.bride.avatar}
                alt={config.bride.fullName}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover object-center border-4 border-amber-300 shadow-md"
              />
              <span className="absolute bottom-1 right-2 px-3 py-1 bg-wedding-red text-amber-200 text-xs font-semibold rounded-full shadow border border-amber-300">
                Cô Dâu
              </span>
            </div>
            <h4 className="font-serif text-2xl font-bold text-stone-800 mb-1">
              {config.bride.fullName}
            </h4>
            <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-4">
              Nhà Gái • {config.bride.address}
            </p>
            <div className="text-sm text-stone-600 space-y-1 border-t border-stone-100 pt-3 w-full">
              <p><span className="font-medium text-stone-700">Thân phụ:</span> {config.bride.father}</p>
              <p><span className="font-medium text-stone-700">Thân mẫu:</span> {config.bride.mother}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
