import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Home,
  Music,
  ListMusic,
  Sparkles
} from "lucide-react";
import { FC26_TRACKS, FC26Track } from "./FC26AudioController";

interface FC26MinimalNavbarProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onGoHome: () => void;
}

export function FC26MinimalNavbar({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  isAutoPlay,
  onToggleAutoPlay,
  isMusicPlaying,
  onToggleMusic,
  currentTrackIndex,
  onSelectTrack,
  isFullscreen,
  onToggleFullscreen,
  onGoHome,
}: FC26MinimalNavbarProps) {
  const [showTrackMenu, setShowTrackMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pb-3 pt-6 w-[440px] max-w-[96vw] group pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTrackMenu(false);
      }}
    >
      {/* Subtle indicator handle when hidden */}
      <div className="w-12 h-1 bg-white/20 rounded-full mb-1 transition-all duration-300 group-hover:opacity-0" />

      {/* Track Selection Popup Menu */}
      {showTrackMenu && (
        <div className="mb-2 w-64 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase text-emerald-400 border-b border-white/10 mb-1">
            <span className="flex items-center gap-1">
              <Music className="w-3 h-3" /> FC26 Soundtrack
            </span>
            <span className="text-slate-400 font-mono">3 Lagu</span>
          </div>
          {FC26_TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                onSelectTrack(idx);
                setShowTrackMenu(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                currentTrackIndex === idx
                  ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <div className="truncate pr-2">
                <div className="truncate font-semibold">{track.title}</div>
                <div className="text-[9px] text-slate-400 truncate">{track.artist}</div>
              </div>
              {currentTrackIndex === idx && isMusicPlaying && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Minimalist Pill Navbar */}
      <div
        className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-y-0 scale-100 shadow-emerald-500/10"
            : "opacity-20 translate-y-2 hover:opacity-100 hover:translate-y-0"
        }`}
      >
        {/* Home Button */}
        <button
          onClick={onGoHome}
          title="Kembali ke Beranda Utama"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Home"
        >
          <Home className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-white/15 mx-0.5" />

        {/* Prev Slide */}
        <button
          onClick={onPrev}
          title="Slide Sebelumnya (Panah Kiri / Backspace)"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Play / Pause Auto-advance */}
        <button
          onClick={onToggleAutoPlay}
          title={isAutoPlay ? "Jeda Slide Otomatis" : "Putar Slide Otomatis"}
          className={`p-1.5 rounded-full transition-colors ${
            isAutoPlay
              ? "bg-emerald-500 text-slate-950 font-bold shadow-xs hover:bg-emerald-400"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
          aria-label={isAutoPlay ? "Pause Auto-play" : "Play Auto-play"}
        >
          {isAutoPlay ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        {/* Next Slide */}
        <button
          onClick={onNext}
          title="Slide Selanjutnya (Panah Kanan / Spasi)"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Slide Counter Indicator */}
        <div className="px-2 py-0.5 bg-white/10 rounded-full text-[11px] font-mono font-bold text-slate-200 tracking-wider">
          {currentSlide + 1} / {totalSlides}
        </div>

        <div className="w-px h-4 bg-white/15 mx-0.5" />

        {/* Music On / Off Button */}
        <div className="relative flex items-center">
          <button
            onClick={onToggleMusic}
            title={isMusicPlaying ? "Matikan Musik FC26" : "Nyalakan Musik FC26"}
            className={`p-1.5 rounded-full transition-colors ${
              isMusicPlaying
                ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Toggle Music"
          >
            {isMusicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mini Track Menu Opener */}
          <button
            onClick={() => setShowTrackMenu(!showTrackMenu)}
            title="Pilih Lagu Soundtrack FC26"
            className="p-1 text-slate-400 hover:text-white rounded-full text-[10px] -ml-1"
            aria-label="Track list"
          >
            <ListMusic className="w-3 h-3" />
          </button>
        </div>

        <div className="w-px h-4 bg-white/15 mx-0.5" />

        {/* Native Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Keluar Fullscreen" : "Masuk Fullscreen"}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
