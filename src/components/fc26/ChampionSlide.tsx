import React from "react";
import { motion } from "motion/react";
import { Award, Banknote, Sparkles, HeartHandshake, Crown, Trophy, CheckCircle2 } from "lucide-react";
import { Fc26PlayerLogo } from "../FC26OfficialBracket";

export function ChampionSlide() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-8 bg-gradient-to-b from-[#0a0714] via-[#100c22] to-[#0a0714] text-white select-none overflow-y-auto">
      <div className="w-full max-w-4xl my-auto flex flex-col items-center text-center space-y-5">
        
        {/* Widget 1: Glow & Badge (Delay: 0.0s) */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-widest"
        >
          <Crown className="w-4 h-4 text-amber-400" />
          HASIL RESMI TURNAMEN EA SPORTS FC 26
        </motion.div>

        {/* Widget 2: Center Podium Display (Delay: 0.5s) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl my-2"
        >
          {/* JUARA 1: RAHMAT */}
          <div className="relative bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-400/80 p-5 shadow-2xl flex flex-col items-center text-center overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 blur-2xl rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg mb-3">
              <Trophy className="w-7 h-7 text-slate-950 fill-slate-950" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-2">
              🏆 JUARA 1 (CHAMPION)
            </div>
            <div className="flex items-center gap-2.5 my-1">
              <Fc26PlayerLogo type="pad" color="purple" size={32} />
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
                RAHMAT
              </h3>
            </div>
            <p className="text-xs text-amber-200/80 font-medium mt-1">
              Pemenang Grand Final • Tak Terkalahkan
            </p>
            <div className="mt-3 w-full pt-3 border-t border-amber-500/20 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
              <Banknote className="w-4 h-4" />
              <span>Sertifikat Juara 1 & Uang Tunai</span>
            </div>
          </div>

          {/* JUARA 2: REPAN */}
          <div className="relative bg-gradient-to-b from-slate-400/15 via-slate-900 to-slate-950 rounded-3xl border-2 border-slate-400/60 p-5 shadow-2xl flex flex-col items-center text-center overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/10 blur-2xl rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-slate-300 text-slate-950 flex items-center justify-center font-black shadow-lg mb-3">
              <Award className="w-7 h-7 text-slate-950" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-400/20 border border-slate-300/40 text-slate-200 text-[10px] font-black uppercase tracking-wider mb-2">
              🥈 JUARA 2 (RUNNER-UP)
            </div>
            <div className="flex items-center gap-2.5 my-1">
              <Fc26PlayerLogo type="pad" color="green" size={32} />
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
                REPAN
              </h3>
            </div>
            <p className="text-xs text-slate-300/80 font-medium mt-1">
              Finalis Tangguh • Runner-Up Resmi
            </p>
            <div className="mt-3 w-full pt-3 border-t border-slate-500/20 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
              <Banknote className="w-4 h-4" />
              <span>Sertifikat Juara 2 & Uang Tunai</span>
            </div>
          </div>
        </motion.div>

        {/* Widget 3: Congratulatory Note (Delay: 1.0s) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-1.5 max-w-2xl"
        >
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-heading">
            SELAMAT KEPADA PARA JUARA!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Apresiasi setinggi-tingginya kepada seluruh gladiator yang telah bertanding dengan semangat sportivitas dan fair play pada turnamen eSports PlayStation 4 Pro Karang Taruna Desa Padasuka.
          </p>
        </motion.div>

        {/* 3 Honour Badges: Widgets 4, 5, 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-2">
          
          {/* Widget 4: Honour Badge 1 (Delay: 1.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center text-center"
          >
            <Award className="w-5 h-5 text-amber-400 mb-1" />
            <div className="text-xs font-black uppercase text-white">PIAGAM PENGHARGAAN</div>
            <div className="text-[10.5px] text-slate-400 mt-0.5">Sertifikat Resmi Karang Taruna</div>
          </motion.div>

          {/* Widget 5: Honour Badge 2 (Delay: 2.0s) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center text-center"
          >
            <Banknote className="w-5 h-5 text-emerald-400 mb-1" />
            <div className="text-xs font-black uppercase text-white">APRESIASI UANG TUNAI</div>
            <div className="text-[10.5px] text-slate-400 mt-0.5">Hadiah Cash Juara 1 & Juara 2</div>
          </motion.div>

          {/* Widget 6: Honour Badge 3 (Delay: 2.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center text-center"
          >
            <HeartHandshake className="w-5 h-5 text-blue-400 mb-1" />
            <div className="text-xs font-black uppercase text-white">FAIR PLAY & SILATURAHMI</div>
            <div className="text-[10.5px] text-slate-400 mt-0.5">Bermain Adil, Menang Terhormat</div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

