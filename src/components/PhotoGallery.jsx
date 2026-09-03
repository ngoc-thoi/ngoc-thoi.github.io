import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export default function PhotoGallery() {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const openLightbox = (idx) => setSelectedIdx(idx);
  const closeLightbox = () => setSelectedIdx(null);

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % weddingConfig.gallery.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + weddingConfig.gallery.length) % weddingConfig.gallery.length);
  };

  return (
    <section className="py-20 px-4 bg-[#FFFDF9]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-wedding-red mb-1">
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Khoảnh Khắc Đẹp</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl text-wedding-red font-bold mb-3">
            Album Ảnh Kỷ Niệm
          </h3>
          <p className="text-stone-600 text-sm sm:text-base">
            Những khoảnh khắc hạnh phúc được lưu giữ theo năm tháng.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {weddingConfig.gallery.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="group relative h-48 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={photo.url}
                alt={photo.caption || `Wedding Photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs sm:text-sm font-serif italic">
                  {photo.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedIdx !== null && (
          <div
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={weddingConfig.gallery[selectedIdx].url}
                alt={weddingConfig.gallery[selectedIdx].caption}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/20"
              />
              <p className="mt-4 text-amber-200 font-serif italic text-base">
                {weddingConfig.gallery[selectedIdx].caption}
              </p>
            </div>

            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
