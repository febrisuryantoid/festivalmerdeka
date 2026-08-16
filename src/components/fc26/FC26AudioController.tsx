import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, SkipForward, SkipBack, Music, Disc } from "lucide-react";

export interface FC26Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

export const FC26_TRACKS: FC26Track[] = [
  {
    id: 1,
    title: "To Night",
    artist: "FC26 Official Soundtrack",
    url: "https://audio.jukehost.co.uk/01a00a09-94f3-73ff-beb7-d7e184fc8fb4",
  },
  {
    id: 2,
    title: "The Game",
    artist: "FC26 Official Soundtrack",
    url: "https://audio.jukehost.co.uk/01a00a09-95ba-70e6-8dd8-a4850334424c",
  },
  {
    id: 3,
    title: "The Winner",
    artist: "FC26 Official Soundtrack",
    url: "https://audio.jukehost.co.uk/01a00a09-9bed-7040-a38e-a2dc90cdba33",
  },
];

interface FC26AudioControllerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export function useFC26Audio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const currentTrack = FC26_TRACKS[currentTrackIndex];

  const safePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch {
          // Promise ignored
        }
      }
      playPromiseRef.current = audio.play();
      await playPromiseRef.current;
      setIsPlaying(true);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      if (err?.name === "NotAllowedError") {
        setIsPlaying(false);
        return;
      }
      console.warn("FC26 Audio error:", err);
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
    } catch {
      // ignored
    }
    setIsPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      safePause();
    } else {
      if (isMuted) {
        setIsMuted(false);
      }
      safePlay();
    }
  }, [isPlaying, isMuted, safePause, safePlay]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % FC26_TRACKS.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + FC26_TRACKS.length) % FC26_TRACKS.length);
  }, []);

  // Update track src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.load();
    }

    if (isPlaying) {
      safePlay();
    }
  }, [currentTrackIndex, currentTrack.url, isPlaying, safePlay]);

  // Volume & Mute handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Initial user interaction unlock
  useEffect(() => {
    const handleFirstInteraction = () => {
      // Auto-start music if not playing
      if (!isPlaying) {
        safePlay().catch(() => {});
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [isPlaying, safePlay]);

  // Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return {
    audioElement: (
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="auto"
      />
    ),
    isPlaying,
    setIsPlaying,
    currentTrack,
    currentTrackIndex,
    setCurrentTrackIndex,
    toggleMusic,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    progress,
    duration,
  };
}
