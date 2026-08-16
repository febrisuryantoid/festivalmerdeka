import React from "react";
import { motion } from "motion/react";
import { Award, Banknote, FileCheck, Sparkles, HeartHandshake, ShieldCheck, Crown } from "lucide-react";

export function ChampionSlide() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-8 bg-gradient-to-b from-[#0a0714] via-[#100c22] to-[#0a0714] text-white select-none overflow-y-auto">
      <div className="w-full max-w-4xl my-auto flex flex-col items-center text-center space-y-6">
        
        {/* Widget 1: Glow & Badge (Delay: 0.0s) */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-widest"
        >
          <Crown className="w-4 h-4 text-amber-400" />
          HADIAH RESMI EA SPORTS FC 26
        </motion.div>

        {/* Widget 2: Center Certificate & Cash Podium Visual (Delay: 0.5s) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center my-2"
        >
          {/* Animated Halo Glow */}
          <div className="absolute inset-0 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
          
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Laurel Wreath SVG */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-400 drop-shadow-lg">
              <path d="M22 76 C8 48 16 24 38 8 C28 26 26 50 35 68" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="16" cy="62" r="3.5" fill="#fcd34d" />
              <circle cx="14" cy="44" r="3.5" fill="#fcd34d" />
              <circle cx="20" cy="28" r="3.5" fill="#fcd34d" />
              <circle cx="30" cy="16" r="3.5" fill="#fcd34d" />
              <path d="M78 76 C92 48 84 24 62 8 C72 26 74 50 65 68" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="84" cy="62" r="3.5" fill="#fcd34d" />
              <circle cx="86" cy="44" r="3.5" fill="#fcd34d" />
              <circle cx="80" cy="28" r="3.5" fill="#fcd34d" />
              <circle cx="70" cy="16" r="3.5" fill="#fcd34d" />
            </svg>
            
            {/* Certificate and Cash Visual */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-1 shadow-2xl flex items-center justify-center border-2 border-amber-200 animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                  <Award className="w-8 h-8 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-black text-amber-300 uppercase tracking-tighter">JUARA RESMI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 text-slate-950 font-black text-sm uppercase tracking-widest px-6 py-1.5 rounded-full shadow-lg border border-emerald-300">
            SERTIFIKAT PENGHARGAAN & UANG TUNAI
          </div>
        </motion.div>

        {/* Widget 3: Title & Description (Delay: 1.0s) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2 max-w-2xl"
        >
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading">
            SIAPAKAH YANG AKAN MENJADI JUARA?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Saksikan pertarungan sengit di arena PlayStation 4 Pro Festival eSports Karang Taruna Desa Padasuka. 
            Rebut <strong>Sertifikat Penghargaan Resmi</strong> dan <strong>Uang Tunai</strong> sebagai gladiator terbaik!
          </p>
        </motion.div>

        {/* 3 Honour Badges: Widgets 4, 5, 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-2">
          
          {/* Widget 4: Honour Badge 1 (Delay: 1.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center text-center"
          >
            <Award className="w-6 h-6 text-amber-400 mb-1.5" />
            <div className="text-xs font-black uppercase text-white">SERTIFIKAT PENGHARGAAN</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Piagam Resmi Karang Taruna Desa Padasuka</div>
          </motion.div>

          {/* Widget 5: Honour Badge 2 (Delay: 2.0s) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center text-center"
          >
            <Banknote className="w-6 h-6 text-emerald-400 mb-1.5" />
            <div className="text-xs font-black uppercase text-white">HADIAH UANG TUNAI</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Apresiasi Prestasi Juara 1 & Juara 2</div>
          </motion.div>

          {/* Widget 6: Honour Badge 3 (Delay: 2.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center text-center"
          >
            <HeartHandshake className="w-6 h-6 text-blue-400 mb-1.5" />
            <div className="text-xs font-black uppercase text-white">FAIR PLAY & SILATURAHMI</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Bermain Adil, Menang Terhormat</div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
