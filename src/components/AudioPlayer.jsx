import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { extractYouTubeId } from '../utils/youtube';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef(null);

  // Get YouTube URL from localStorage (customized in #admin) or weddingConfig
  const youtubeUrl = localStorage.getItem('wedding_youtube_url') || weddingConfig.music.youtubeUrl;
  const videoId = extractYouTubeId(youtubeUrl);

  useEffect(() => {
    if (!videoId) return;

    // Function to initialize YT Player
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player('yt-hidden-player', {
          height: '1',
          width: '1',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            showinfo: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              setIsReady(true);
              // Try auto-play
              event.target.setVolume(80);
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setHasInteracted(true);
              } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
              }
            },
          },
        });
      } catch (err) {
        console.warn('YouTube Player initialization error:', err);
      }
    };

    // Check if YouTube API script is already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    // Attempt play on first user interaction (touch or click)
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [videoId]);

  const togglePlay = (e) => {
    e.stopPropagation();
    setHasInteracted(true);

    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') {
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center space-x-2 select-none">
      {/* Hidden YouTube iFrame container */}
      <div 
        style={{
          position: 'fixed',
          top: '-100px',
          left: '-100px',
          width: '1px',
          height: '1px',
          opacity: 0.01,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <div id="yt-hidden-player"></div>
      </div>

      {/* Floating Music Button */}
      <button
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-2 border-amber-300 transition-colors duration-300 ${
          isPlaying 
            ? 'bg-wedding-red-700 text-amber-300 ring-2 ring-amber-300/40' 
            : 'bg-stone-900/90 text-stone-300 hover:bg-wedding-red-800 hover:text-white'
        }`}
        title={isPlaying ? "Tắt nhạc cưới" : "Bật nhạc cưới"}
        aria-label="Điều khiển nhạc nền"
      >
        {isPlaying ? (
          <Disc className="w-6 h-6 animate-spin-slow text-amber-300" />
        ) : (
          <VolumeX className="w-5 h-5 opacity-80 group-hover:opacity-100" />
        )}
      </button>

      {/* Pill Label */}
      <div 
        onClick={togglePlay}
        className={`cursor-pointer flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-200 border ${
          isPlaying
            ? 'bg-stone-900/80 text-amber-200 border-amber-300/30'
            : 'bg-wedding-red-800 text-amber-100 border-amber-300/40 hover:bg-wedding-red-700 shadow-md'
        }`}
      >
        {isPlaying ? (
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{weddingConfig.music.title}</span>
        ) : (
          <span className="flex items-center gap-1 font-semibold">
            <Music className="w-3.5 h-3.5 text-amber-300" />
            <span>Chạm để bật nhạc</span>
          </span>
        )}
      </div>
    </div>
  );
}
