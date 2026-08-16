import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CoverSlide } from "./components/fc26/CoverSlide";
import { OverviewSlide } from "./components/fc26/OverviewSlide";
import { BracketSlide } from "./components/fc26/BracketSlide";
import { ChampionSlide } from "./components/fc26/ChampionSlide";
import { FC26MinimalNavbar } from "./components/fc26/FC26MinimalNavbar";
import { useFC26Audio, FC26_TRACKS } from "./components/fc26/FC26AudioController";

// Durasi masing-masing slide:
// Slide 1 (Cover): 10 detik (10.000 ms)
// Slide 2 (Overview): 5 widget @ 0.5s (2.5s animasi) + jeda 10s = 12.5 detik (12.500 ms)
// Slide 3 (Bracket): 6 widget @ 0.5s (3.0s animasi) + jeda 10s = 13.0 detik (13.000 ms)
// Slide 4 (Champion): 6 widget @ 0.5s (3.0s animasi) + jeda 10s = 13.0 detik (13.000 ms)
const SLIDE_DURATIONS: number[] = [10000, 12500, 13000, 13000];

export default function FC26SlidePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true); // Default Auto Play aktif
  const [isAspect169, setIsAspect169] = useState(false); // false = Full screen width, true = 16:9 container
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Dedicated Audio Hook for FC26 page
  const {
    audioElement,
    isPlaying: isMusicPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    toggleMusic,
    isMuted,
    setIsMuted,
  } = useFC26Audio();

  const totalSlides = 4;

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play timer per-slide
  useEffect(() => {
    if (!isAutoPlay) return;

    const duration = SLIDE_DURATIONS[currentSlide] ?? 10000;
    const timer = setTimeout(() => {
      handleNext();
    }, duration);

    return () => clearTimeout(timer);
  }, [isAutoPlay, currentSlide, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        toggleMusic();
      } else if (e.key === "Escape") {
        // Exit
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, toggleMusic]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // Fullscreen toggle API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Render current slide based on index
  const renderSlideContent = (index: number) => {
    switch (index) {
      case 0:
        return <CoverSlide onStartPresentation={handleNext} />;
      case 1:
        return <OverviewSlide />;
      case 2:
        return <BracketSlide />;
      case 3:
        return <ChampionSlide />;
      default:
        return <CoverSlide />;
    }
  };

  const currentDuration = SLIDE_DURATIONS[currentSlide] ?? 10000;

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-black text-white relative select-none flex items-center justify-center font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dedicated audio element */}
      {audioElement}

      {/* Top Ambient Progress Bar for Auto-play */}
      {isAutoPlay && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-40 overflow-hidden pointer-events-none">
          <motion.div
            key={currentSlide}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: currentDuration / 1000, ease: "linear" }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          />
        </div>
      )}

      {/* Presentation Stage Container (Full width or 16:9 ratio) */}
      <div
        className={`relative transition-all duration-500 overflow-hidden flex items-center justify-center ${
          isAspect169
            ? "w-full max-w-[177.78vh] aspect-video max-h-screen shadow-2xl rounded-2xl border border-white/10"
            : "w-full h-full"
        }`}
      >
        {/* Animated Slide Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.02, x: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {renderSlideContent(currentSlide)}
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Floating Auto-hide Navbar */}
        <FC26MinimalNavbar
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrev={handlePrev}
          onNext={handleNext}
          isAutoPlay={isAutoPlay}
          onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={toggleMusic}
          currentTrackIndex={currentTrackIndex}
          onSelectTrack={(idx) => setCurrentTrackIndex(idx)}
          isAspect169={isAspect169}
          onToggleAspectRatio={() => setIsAspect169(!isAspect169)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onGoHome={() => navigate("/")}
        />
      </div>
    </div>
  );
}
