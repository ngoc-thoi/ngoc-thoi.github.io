import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export default function PhotoGallery({ config = weddingConfig }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const gallery = config.gallery && config.gallery.length > 0 ? config.gallery : weddingConfig.gallery;

  const openLightbox = (idx) => setSelectedIdx(idx);
  const closeLightbox = () => setSelectedIdx(null);

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % gallery.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <section className="py-20 px-4 bg-[#FFFDF9]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-wedding-red mb-1">
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Album Ảnh Kỷ Niệm</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl text-wedding-red font-bold mb-3">
            Khoảnh Khắc Chung Đôi
          </h3>
          <p className="text-stone-600 text-sm sm:text-base">
            Những khoảnh khắc hạnh phúc ngập tràn yêu thương của Ngọc Thời &amp; Khánh Hồng.
          </p>
        </div>

        {/* Gallery Grid of All Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {gallery.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="group relative h-44 sm:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-stone-100"
            >
              <img
                src={photo.url}
                alt={photo.caption || `Kỷ niệm ${idx + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                <span className="text-amber-200 text-xs sm:text-sm font-serif italic line-clamp-1">
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              title="Đóng"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/40 hover:bg-black/70 transition-colors z-20"
              title="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[88vh] flex flex-col items-center"
            >
              <img
                src={gallery[selectedIdx].url}
                alt={gallery[selectedIdx].caption}
                className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
              <div className="mt-3 text-center">
                <p className="text-amber-200 font-serif italic text-sm sm:text-base">
                  {gallery[selectedIdx].caption}
                </p>
                <p className="text-stone-400 text-xs mt-0.5">
                  {selectedIdx + 1} / {gallery.length}
                </p>
              </div>
            </div>

            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/40 hover:bg-black/70 transition-colors z-20"
              title="Ảnh tiếp"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
