import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Repeat, Repeat1, X, Music, Volume2, ListMusic,
  Maximize2, Minimize2
} from 'lucide-react';

const TRACKS = [
  { 
    id: 1, 
    title: "Participants", 
    artist: "eSports Karang Taruna", 
    url: "https://audio.jukehost.co.uk/019ffcfb-8084-7139-ac10-386763e6e9c4" 
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
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const renderPlaylistContent = () => (
    <div className="p-4 md:p-6 md:h-full max-h-[250px] md:max-h-none overflow-y-auto space-y-1">
      <h3 className="text-slate-800 mb-3 hidden md:block px-2">Track List</h3>
      {TRACKS.map((track, idx) => (
        <button
          key={track.id}
          onClick={() => {
            setCurrentTrackIndex(idx);
            setIsPlaying(true);
          }}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 ${
            idx === currentTrackIndex 
              ? 'bg-primary/10 text-primary' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="w-6 text-center text-xs opacity-60 font-bold">{idx + 1}</div>
          <div className="flex-1 truncate">
            <div className="truncate">{track.title}</div>
            <div className="text-[10px] font-medium opacity-70">{track.artist}</div>
          </div>
          {idx === currentTrackIndex && isPlaying && (
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );

  // 1. Studio Quality Audio Enhancements (Web Audio API)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Prevent double initialization in strict mode
    if ((audio as any)._audioCtxInitialized) return;
    (audio as any)._audioCtxInitialized = true;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);

      // Studio Mastering Chain
      // A. Warm Bass Boost
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.value = 120; // Hz
      lowShelf.gain.value = 3.5; // +3.5dB for punchy low end

      // B. High-End Clarity / Air
      const highShelf = ctx.createBiquadFilter();
      highShelf.type = 'highshelf';
      highShelf.frequency.value = 8000; // Hz
      highShelf.gain.value = 2.5; // +2.5dB for crisp highs

      // C. Glue Compressor
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      // Connect pipeline: source -> EQ -> Compressor -> Output
      source.connect(lowShelf);
      lowShelf.connect(highShelf);
      highShelf.connect(compressor);
      compressor.connect(ctx.destination);

      // Handle AudioContext suspension (browsers pause audio context until user interaction)
      const resumeAudioContext = () => {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      };
      
      document.addEventListener('click', resumeAudioContext, { once: true });
      document.addEventListener('touchstart', resumeAudioContext, { once: true });
      document.addEventListener('keydown', resumeAudioContext, { once: true });

    } catch (err) {
      console.warn("Studio audio enhancement not available or blocked by CORS. Falling back to standard audio.", err);
    }
  }, []);

  // 2. Autoplay Logic with Interaction Fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try playing immediately
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log("Autoplay blocked by browser. Waiting for user interaction...", err);
      
      // If autoplay fails, wait for any interaction to start playing
      const onInteract = () => {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
        
        // Remove listeners once interacted
        document.removeEventListener('click', onInteract);
        document.removeEventListener('touchstart', onInteract);
        document.removeEventListener('keydown', onInteract);
      };
      
      document.addEventListener('click', onInteract);
      document.addEventListener('touchstart', onInteract);
      document.addEventListener('keydown', onInteract);
    });
  }, []);

  // Handle Track Changes
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed during track change:", e);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleLoop = () => {
    if (loopMode === 'all') setLoopMode('one');
    else if (loopMode === 'one') setLoopMode('none');
    else setLoopMode('all');
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (loopMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
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

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        crossOrigin="anonymous"
        autoPlay
      />

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center text-primary group transition-all duration-300"
        >
          {isPlaying ? (
            <div className="flex gap-1 items-end h-5">
              <span className="w-1 bg-primary h-2 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 bg-primary h-5 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 bg-primary h-3 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          ) : (
            <Music className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
          
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
        </motion.button>
      </div>

      {/* Audio Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex flex-col md:flex-row items-stretch pointer-events-auto gap-3 md:gap-4 w-full md:w-auto justify-center"
            >
              {/* Main Player */}
              <div className="w-full max-w-sm md:w-[360px] mx-auto shrink-0 bg-white/85 backdrop-blur-2xl border border-white/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2)] rounded-[32px] overflow-hidden flex flex-col relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-5 pb-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Volume2 className="w-4 h-4" /> BGM Player
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowPlaylist(!showPlaylist)}
                      className={`p-2 rounded-full transition-colors ${showPlaylist ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100'}`}
                    >
                      <ListMusic className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Player Body */}
                <div className="px-6 pb-6 pt-2 text-center space-y-6">
                
                {/* Artwork */}
                <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-primary to-rose-400 p-1 shadow-lg shadow-primary/20">
                  <div className="w-full h-full rounded-full border-4 border-white/50 overflow-hidden flex items-center justify-center bg-white relative">
                    <Music className={`w-12 h-12 text-primary/30 ${isPlaying ? 'animate-pulse' : ''}`} />
                    {/* Spinning ring when playing */}
                    <svg className={`absolute inset-0 w-full h-full text-white/40 ${isPlaying ? 'animate-spin-slow' : ''}`} viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="60 40" />
                    </svg>
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="text-slate-900 truncate px-4">{currentTrack.title}</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">{currentTrack.artist}</p>
                </div>

                {/* Scrubber */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary hover:accent-rose-500 transition-colors"
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
                    className={`p-2.5 rounded-full transition-all ${loopMode !== 'none' ? 'text-primary bg-primary/10' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    {loopMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                  </button>
                  
                  <button 
                    onClick={handlePrev}
                    className="p-3 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <SkipBack className="w-6 h-6 fill-current" />
                  </button>
                  
                  <button 
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                  </button>
                  
                  <button 
                    onClick={handleNext}
                    className="p-3 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <SkipForward className="w-6 h-6 fill-current" />
                  </button>
                  
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowVolume(true)}
                    onMouseLeave={() => setShowVolume(false)}
                  >
                    <button 
                      onClick={() => setShowVolume(!showVolume)}
                      className={`p-2.5 rounded-full transition-all ${showVolume ? 'text-primary bg-primary/10' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                      <Volume2 className="w-5 h-5" />
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
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-24 h-1.5 appearance-none bg-slate-200 rounded-full cursor-pointer accent-primary -rotate-90 origin-center"
                            />
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 tabular-nums">
                            {Math.round(volume * 100)}%
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
                      className="bg-slate-50/80 border-t border-slate-200/60"
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
                    className="h-full bg-white/85 backdrop-blur-2xl border border-white/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2)] rounded-[32px] overflow-hidden"
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
