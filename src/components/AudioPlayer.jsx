import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt auto-play on the first user interaction (touch or click)
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Browser prevented autoplay, wait for explicit user click
        });
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Audio playback error:', err));
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center space-x-2">
      <audio
        ref={audioRef}
        src={weddingConfig.music.url}
        loop
        preload="auto"
      />
      <button
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-2 border-amber-300 transition-all duration-300 ${
          isPlaying 
            ? 'bg-wedding-red-700 text-amber-300 ring-4 ring-amber-300/30' 
            : 'bg-stone-900/80 text-white hover:bg-wedding-red-800'
        }`}
        title={isPlaying ? "Tắt nhạc cưới" : "Bật nhạc cưới"}
        aria-label="Điều khiển nhạc nền"
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Music className="w-5 h-5 animate-spin-slow text-amber-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          </div>
        ) : (
          <VolumeX className="w-5 h-5 opacity-75 group-hover:opacity-100" />
        )}
      </button>

      {/* Music label tooltip */}
      <div className={`hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-opacity duration-300 ${
        isPlaying ? 'bg-black/60 text-amber-200 border border-amber-300/20' : 'bg-black/40 text-stone-300'
      }`}>
        <span className="truncate max-w-[140px]">{weddingConfig.music.title}</span>
      </div>
    </div>
  );
}
