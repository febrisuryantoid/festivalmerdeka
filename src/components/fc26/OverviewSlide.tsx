import React from "react";
import { motion } from "motion/react";
import { Gamepad2, Award, Clock, ShieldAlert, Sparkles, CheckCircle2, Zap, Users } from "lucide-react";

export function OverviewSlide() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-8 bg-gradient-to-b from-slate-950 via-[#071324] to-slate-950 text-white select-none overflow-y-auto">
      {/* Container with max constraint */}
      <div className="w-full max-w-5xl flex flex-col justify-between my-auto space-y-5">
        
        {/* Widget 1: Header Section (Delay: 0.0s) */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
              PS4 PRO CONSOLE TOURNAMENT
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase leading-none font-heading">
              FORMAT & ATURAN EA SPORTS FC 26
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Festival eSports Karang Taruna Desa Padasuka • Sistem Knockout BO3
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-lg">
            <Award className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase leading-tight">TOTAL PESERTA</div>
              <div className="text-sm font-black text-emerald-400 uppercase">10 PEMAIN TERVERIFIKASI</div>
            </div>
          </div>
        </motion.div>

        {/* 3 Core Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Widget 2: Card 1 - Struktur & Sistem (Delay: 0.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-4.5 shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide">Sistem Gugur (Knockout)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Semua laga Semi Final & Grand Final dimainkan dengan format <b>Best Of 3 (BO3)</b>.
                </p>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Menang 2 Leg = Lolos Babak Selanjutnya</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Seri 1-1 = Leg 3 Penentuan Golden Goal/Adu Penalti</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              • 100% COMPETITIVE FAIR PLAY
            </div>
          </motion.div>

          {/* Widget 3: Card 2 - Pengaturan Pertandingan (Delay: 1.0s) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-4.5 shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide">Pengaturan Match</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Pengaturan resmi standar turnamen eSports konsol PlayStation 4 Pro.
                </p>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Durasi Babak:</span>
                  <span className="font-bold text-white">6 Menit / Half</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kecepatan Game:</span>
                  <span className="font-bold text-white">Normal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Defending:</span>
                  <span className="font-bold text-white">Tactical Defending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kamera:</span>
                  <span className="font-bold text-white">Tele Broadcast / Co-op</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 text-[10px] font-black uppercase text-blue-400 tracking-wider">
              • STANDARD ESPORTS SETTINGS
            </div>
          </motion.div>

          {/* Widget 4: Card 3 - Tim & Regulasi Kontroler (Delay: 1.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-4.5 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide">Pilihan Klub & Stik</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Bebas memilih Klub atau Negara (Overall 85+ mode / Normal Squad update).
                </p>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>DualShock 4 Disediakan Panitia / Bawa Sendiri</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dilarang Pause saat bola aktif di lapangan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Custom Formation & Tactic diperbolehkan</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 text-[10px] font-black uppercase text-amber-400 tracking-wider">
              • RESPECT & NO RAGE-QUIT
            </div>
          </motion.div>

        </div>

        {/* Widget 5: Bottom Banner Status (Delay: 2.0s) */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-center sm:text-left"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">ROSTER TURNAMEN</div>
            <div className="text-sm font-bold text-white">10 Gladiator Siap Tempur Memperebutkan Mahkota Juara FC26</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
