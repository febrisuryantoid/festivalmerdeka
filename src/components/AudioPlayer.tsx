import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Repeat, Repeat1, X, Music, Volume2, ListMusic,
  VolumeX, AlertCircle
} from 'lucide-react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  fallbackUrl?: string;
}

const TRACKS: Track[] = [
  { 
    id: 1, 
    title: "Greetings", 
    artist: "eSports Karang Taruna", 
    url: "https://audio.jukehost.co.uk/019ffdf9-8ed3-70db-bf0a-86a37efccc53" 
  },
  { 
    id: 2, 
    title: "Welcome", 
    artist: "eSports Karang Taruna", 
    url: "https://audio.jukehost.co.uk/019ffc91-9731-70ed-9260-23c743fb696d" 
  },
  { 
    id: 3, 
    title: "In Game", 
    artist: "eSports Karang Taruna", 
    url: "https://audio.jukehost.co.uk/019ffc9e-02ce-70c1-b0f8-61e314b70eb7" 
  },
  { 
    id: 4, 
    title: "The Champion", 
    artist: "eSports Karang Taruna", 
    url: "https://audio.jukehost.co.uk/019ffc91-97a3-70ab-a23d-38173f4f8722" 
  },
  { 
    id: 5, 
    title: "The Winner's", 
    artist: "eSports Karang Taruna", 
    url: "https://audio.jukehost.co.uk/019ffc9e-0165-7374-8b36-8cca2183e6ab" 
  },
  { 
    id: 6, 
    title: "Thank You", 
    artist: "eSports Karang Taruna", 
    url: "https://audio.jukehost.co.uk/019ffcfb-8328-7332-b931-4491a9d46896" 
  },
];

export function AudioPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loopMode, setLoopMode] = useState<'all' | 'one' | 'none'>('all');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const isChangingTrackRef = useRef(false);
  
  const currentTrack = TRACKS[currentTrackIndex];

  // Safe playback execution preventing interrupted load / play promises
  const safePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // If there's an ongoing play promise, await it or catch its rejection
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch {
          // Previous play promise handled
        }
      }

      setLoadError(null);
      playPromiseRef.current = audio.play();
      await playPromiseRef.current;
      setIsPlaying(true);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // AbortError is normal when switching tracks rapidly or reloading
        return;
      }
      if (err?.name === 'NotAllowedError') {
        // Autoplay policy prevented playback until user interaction
        setIsPlaying(false);
        return;
      }
      console.warn("Audio playback notice:", err?.message || err);
      setIsPlaying(false);
    } finally {
      playPromiseRef.current = null;
    }
  }, []);

  const safePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.pause();
    } catch (err) {
      console.warn("Error pausing audio:", err);
    }
    setIsPlaying(false);
  }, []);

  // Handle volume & mute
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      const restoreVol = volume > 0 ? volume : 0.85;
      audioRef.current.muted = false;
      audioRef.current.volume = restoreVol;
      setIsMuted(false);
      setVolume(restoreVol);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // 1. Initial Autoplay with interaction fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // Attempt autoplay
    safePlay().catch(() => {
      // Autoplay blocked by browser policy
    });

    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      if (!isPlaying) {
        safePlay();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [safePlay]);

  // 2. Controlled Track Change Effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    isChangingTrackRef.current = true;
    setProgress(0);
    setLoadError(null);

    // Update src directly on audio element for synchronized loading
    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.load();
    }

    if (isPlaying || hasUserInteracted) {
      safePlay().finally(() => {
        isChangingTrackRef.current = false;
      });
    } else {
      isChangingTrackRef.current = false;
    }
  }, [currentTrackIndex, currentTrack.url, safePlay, hasUserInteracted]);

  const togglePlay = () => {
    setHasUserInteracted(true);
    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  };

  const handleNext = useCallback(() => {
    setHasUserInteracted(true);
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    setHasUserInteracted(true);
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const toggleLoop = () => {
    if (loopMode === 'all') setLoopMode('one');
    else if (loopMode === 'one') setLoopMode('none');
    else setLoopMode('all');
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    if (loopMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        safePlay();
      }
    } else if (loopMode === 'all') {
      handleNext();
    } else {
      if (currentTrackIndex < TRACKS.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const mediaError = (e.target as HTMLAudioElement).error;
    if (mediaError) {
      console.warn("Audio element error code:", mediaError.code, mediaError.message);
      // If error occurs, inform user and smoothly allow retry
      setLoadError("Koneksi audio terganggu. Klik lagu lain atau putar ulang.");
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderPlaylistContent = () => (
    <div className="p-4 md:p-6 md:h-full max-h-[250px] md:max-h-none overflow-y-auto space-y-1">
      <h3 className="text-slate-800 font-bold mb-3 hidden md:block px-2">Daftar Lagu BGM</h3>
      {TRACKS.map((track, idx) => (
        <button
          key={track.id}
          onClick={() => {
            setHasUserInteracted(true);
            setCurrentTrackIndex(idx);
            setIsPlaying(true);
          }}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
            idx === currentTrackIndex 
              ? 'bg-rose-500/10 text-rose-600 font-bold shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="w-6 text-center text-xs opacity-60 font-bold">{idx + 1}</div>
          <div className="flex-1 truncate">
            <div className="truncate">{track.title}</div>
            <div className="text-[10px] font-medium opacity-70">{track.artist}</div>
          </div>
          {idx === currentTrackIndex && isPlaying && (
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0"></div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Managed Audio Element (No uncontrolled autoPlay to prevent race conditions) */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        onError={handleAudioError}
        preload="auto"
      />

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open BGM Music Player"
          className="relative w-14 h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center text-rose-600 group transition-all duration-300 hover:shadow-rose-500/20"
        >
          {isPlaying ? (
            <div className="flex gap-1 items-end h-5">
              <span className="w-1 bg-rose-500 h-2 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 bg-rose-500 h-5 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 bg-rose-500 h-3 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          ) : (
            <Music className="w-6 h-6 group-hover:scale-110 transition-transform text-rose-500" />
          )}
          
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
        </motion.button>
      </div>

      {/* Audio Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Backdrop click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs pointer-events-auto"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex flex-col md:flex-row items-stretch pointer-events-auto gap-3 md:gap-4 w-full md:w-auto justify-center relative z-10"
            >
              {/* Main Player */}
              <div className="w-full max-w-sm md:w-[360px] mx-auto shrink-0 bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)] rounded-[32px] overflow-hidden flex flex-col relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-5 pb-3">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest">
                    <Volume2 className="w-4 h-4" /> BGM Player
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowPlaylist(!showPlaylist)}
                      aria-label="Toggle Playlist"
                      className={`p-2 rounded-full transition-colors ${showPlaylist ? 'bg-rose-500/10 text-rose-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                      <ListMusic className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      aria-label="Close Player"
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Player Body */}
                <div className="px-6 pb-6 pt-2 text-center space-y-6">
                
                  {/* Artwork */}
                  <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-1 shadow-lg shadow-rose-500/20">
                    <div className="w-full h-full rounded-full border-4 border-white/70 overflow-hidden flex items-center justify-center bg-white relative">
                      <Music className={`w-10 h-10 text-rose-500/40 ${isPlaying ? 'animate-pulse' : ''}`} />
                      {/* Spinning ring when playing */}
                      <svg className={`absolute inset-0 w-full h-full text-rose-500/30 ${isPlaying ? 'animate-spin-slow' : ''}`} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="60 40" />
                      </svg>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div>
                    <h3 className="text-slate-900 font-bold text-base truncate px-4">{currentTrack.title}</h3>
                    <p className="text-slate-500 font-medium text-xs mt-1">{currentTrack.artist}</p>
                    
                    {loadError && (
                      <div className="mt-2 text-[11px] text-amber-600 bg-amber-50 rounded-lg py-1 px-2.5 flex items-center justify-center gap-1.5 font-medium border border-amber-200/60">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{loadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Scrubber */}
                  <div className="space-y-1.5">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={progress}
                      onChange={handleSeek}
                      aria-label="Audio Seek Bar"
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-rose-500 hover:accent-rose-600 transition-colors"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 tabular-nums">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={toggleLoop}
                      aria-label="Toggle Loop Mode"
                      className={`p-2.5 rounded-full transition-all ${loopMode !== 'none' ? 'text-rose-600 bg-rose-500/10 font-bold' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                      {loopMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                    </button>
                    
                    <button 
                      onClick={handlePrev}
                      aria-label="Previous Track"
                      className="p-3 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
                    >
                      <SkipBack className="w-6 h-6 fill-current" />
                    </button>
                    
                    <button 
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause Track" : "Play Track"}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                    </button>
                    
                    <button 
                      onClick={handleNext}
                      aria-label="Next Track"
                      className="p-3 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
                    >
                      <SkipForward className="w-6 h-6 fill-current" />
                    </button>
                    
                    <div 
                      className="relative"
                      onMouseEnter={() => setShowVolume(true)}
                      onMouseLeave={() => setShowVolume(false)}
                    >
                      <button 
                        onClick={toggleMute}
                        aria-label="Mute or Unmute"
                        className={`p-2.5 rounded-full transition-all ${isMuted || showVolume ? 'text-rose-600 bg-rose-500/10' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>

                      <AnimatePresence>
                        {showVolume && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-3 z-50"
                          >
                            <div className="h-24 w-6 flex items-center justify-center">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                aria-label="Volume Slider"
                                className="w-24 h-1.5 appearance-none bg-slate-200 rounded-full cursor-pointer accent-rose-500 -rotate-90 origin-center"
                              />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 tabular-nums">
                              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Mobile Playlist Drawer (Hidden on Desktop) */}
                <div className="md:hidden">
                  <AnimatePresence>
                    {showPlaylist && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50/90 border-t border-slate-200/60"
                      >
                        {renderPlaylistContent()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
              </div> {/* End Main Player */}

              {/* Desktop Playlist Drawer (Hidden on Mobile) */}
              <div className="hidden md:block">
                <AnimatePresence>
                  {showPlaylist && (
                    <motion.div
                      initial={{ width: 0, opacity: 0, x: -20 }}
                      animate={{ width: 320, opacity: 1, x: 0 }}
                      exit={{ width: 0, opacity: 0, x: -20 }}
                      className="h-full bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)] rounded-[32px] overflow-hidden"
                    >
                      {renderPlaylistContent()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

