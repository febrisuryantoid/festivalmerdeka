import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isReadyToExit, setIsReadyToExit] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    // Minimum 2 seconds to ensure high-class feel, maximum 5 seconds
    // Lock scroll
    document.body.style.overflow = 'hidden';

    const minDuration = 2000; 

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate simulated progress based on time
      let newProgress = Math.min((elapsed / minDuration) * 90, 90);
      
      if (document.readyState === 'complete' && elapsed > minDuration * 0.5) {
        // If document is loaded and we passed half time, start pushing to 100
        newProgress = Math.min((elapsed / minDuration) * 100, 100);
      }

      // If document is completely loaded and min duration passed
      if (document.readyState === 'complete' && elapsed > minDuration) {
        newProgress = 100;
      }

      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsReadyToExit(true);
        }, 400); // Hold at 100% for a brief moment
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = '';
    };
  }, []);

  const circleRadius = 70;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <AnimatePresence onExitComplete={onLoadingComplete}>
      {!isReadyToExit && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white"
        >
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg 
              className="absolute w-44 h-44 -rotate-90"
              viewBox="0 0 160 160"
            >
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D61216" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D61216" stopOpacity="0.05" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="2"
              />
              
              {/* Progress Ring */}
              <motion.circle
                cx="80"
                cy="80"
                r={circleRadius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                animate={{ strokeDashoffset }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
                filter="url(#glow)"
              />
            </svg>

            {/* Center Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" 
                alt="Karang Taruna" 
                className="w-16 h-auto drop-shadow-lg object-contain"
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="text-primary font-heading tracking-[0.3em] uppercase text-xs sm:text-sm drop-shadow-sm flex items-center justify-center gap-1">
              <span>M</span><span>E</span><span>M</span><span>U</span><span>A</span><span>T</span>
            </div>
            <div className="mt-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Festival eSports Karang Taruna
            </div>
            <div className="mt-3 text-slate-400 font-bold text-[10px] sm:text-xs tabular-nums tracking-[0.2em]">
              {Math.round(progress)}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
