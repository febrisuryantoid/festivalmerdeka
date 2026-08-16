import React from "react";
import { motion } from "motion/react";
import { Award, Banknote, Shield, FileText, CheckCircle, Flame, Gamepad } from "lucide-react";
import { Fc26PlayerLogo, Fc26VsBadge } from "../FC26OfficialBracket";

export function BracketSlide() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-3 sm:p-6 bg-gradient-to-b from-[#050b14] via-[#08182b] to-[#050b14] text-slate-900 select-none overflow-y-auto">
      
      {/* Slide Container */}
      <div className="w-full max-w-5xl my-auto flex flex-col items-center">
        
        {/* Widget 1: Slide Header Banner (Delay: 0.0s) */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex items-center justify-between mb-3 pb-2.5 border-b border-white/10 text-white"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-heading">
                BAGAN TURNAMEN FC 26
              </h2>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                6 PEMAIN • SINGLE ELIMINATION (BO3)
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 font-mono">
            <span>LIVE TOURNAMENT BRACKET</span>
          </div>
        </motion.div>

        {/* Bracket White Board Presentation */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-5 border border-slate-200 overflow-x-auto">
          <div className="min-w-[840px] max-w-[940px] mx-auto">
            
            {/* Header Stage Columns: 4 Columns */}
            <div className="grid grid-cols-4 gap-4 mb-4 text-center">
              <div>
                <div className="bg-[#0b2447] text-white rounded-xl py-1.5 px-2 shadow-xs">
                  <div className="text-[10.5px] font-black tracking-wider uppercase">BABAK 1 (PENYISIHAN)</div>
                  <div className="text-[8px] font-bold text-blue-200 uppercase">3 MATCH (BO3)</div>
                </div>
              </div>

              <div>
                <div className="bg-[#0b2447] text-white rounded-xl py-1.5 px-2 shadow-xs">
                  <div className="text-[10.5px] font-black tracking-wider uppercase">SEMI FINAL</div>
                  <div className="text-[8px] font-bold text-blue-200 uppercase">SF1 (BYE) • SF2 (M2 vs M3)</div>
                </div>
              </div>

              <div>
                <div className="bg-[#15803d] text-white rounded-xl py-1.5 px-2 shadow-xs">
                  <div className="text-[10.5px] font-black tracking-wider uppercase">GRAND FINAL</div>
                  <div className="text-[8px] font-bold text-green-200 uppercase">1 MATCH (BO3)</div>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-xl py-1.5 px-2 shadow-xs">
                  <div className="text-[10.5px] font-black tracking-widest uppercase">CHAMPION</div>
                  <div className="text-[8px] font-bold text-amber-100 uppercase">JUARA RESMI</div>
                </div>
              </div>
            </div>

            {/* Bracket Tree Canvas */}
            <div className="relative h-[375px] bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
              
              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                {/* M1 -> SF1 */}
                <g stroke="#0b2447" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 195 44 H 220" />
                </g>
                {/* M2 & M3 -> SF2 */}
                <g stroke="#0b2447" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 195 179 H 207 V 314 H 195" />
                  <path d="M 207 246.5 H 220" />
                </g>
                {/* SF1 & SF2 -> Grand Final */}
                <g stroke="#0b2447" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 415 44 H 435 V 246.5 H 415" />
                  <path d="M 435 145 H 455" />
                </g>
                {/* Grand Final -> Trophy */}
                <g stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 645 145 H 675" />
                </g>
              </svg>

              {/* Widget 2: COLUMN 1 - BABAK 1 / PENYISIHAN (Delay: 0.5s) */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-0 w-[195px] z-10 space-y-[22px]"
              >
                {/* M1 Match: WAHAB vs REPAN */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                      M1
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-500 uppercase">PENYISIHAN 1</span>
                  </div>
                  <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-2 relative flex flex-col justify-between h-[88px] hover:border-blue-400 transition-colors">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs tracking-tight">
                      <Fc26PlayerLogo type="ball" color="blue" size={20} />
                      <span className="truncate uppercase">WAHAB</span>
                    </div>
                    <div className="relative flex items-center justify-center -my-0.5">
                      <div className="absolute left-0 right-0 h-px bg-slate-100" />
                      <Fc26VsBadge variant="navy" />
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs tracking-tight">
                      <Fc26PlayerLogo type="pad" color="green" size={20} />
                      <span className="truncate uppercase">REPAN</span>
                    </div>
                  </div>
                </div>

                {/* M2 Match: RAHMAT vs NAUFAL ABBAS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                      M2
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-500 uppercase">PENYISIHAN 2</span>
                  </div>
                  <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-2 relative flex flex-col justify-between h-[88px] hover:border-blue-400 transition-colors">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs tracking-tight">
                      <Fc26PlayerLogo type="pad" color="purple" size={20} />
                      <span className="truncate uppercase">RAHMAT</span>
                    </div>
                    <div className="relative flex items-center justify-center -my-0.5">
                      <div className="absolute left-0 right-0 h-px bg-slate-100" />
                      <Fc26VsBadge variant="navy" />
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs tracking-tight">
                      <Fc26PlayerLogo type="ball" color="red" size={20} />
                      <span className="truncate uppercase">NAUFAL ABBAS</span>
                    </div>
                  </div>
                </div>

                {/* M3 Match: IFAL WIBAWA vs RIPIANSYAH */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                      M3
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-500 uppercase">PENYISIHAN 3</span>
                  </div>
                  <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-2 relative flex flex-col justify-between h-[88px] hover:border-blue-400 transition-colors">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs tracking-tight">
                      <Fc26PlayerLogo type="ball" color="green" size={20} />
                      <span className="truncate uppercase">IFAL WIBAWA</span>
                    </div>
                    <div className="relative flex items-center justify-center -my-0.5">
                      <div className="absolute left-0 right-0 h-px bg-slate-100" />
                      <Fc26VsBadge variant="navy" />
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs tracking-tight">
                      <Fc26PlayerLogo type="pad" color="red" size={20} />
                      <span className="truncate uppercase">RIPIANSYAH</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Widget 3: COLUMN 2 - SEMI FINAL (Delay: 1.0s) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-[220px] top-0 w-[195px] z-10"
              >
                {/* SF1 Match: PEMENANG M1 vs BYE */}
                <div className="absolute top-0 left-0 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                      SF1
                    </div>
                    <span className="text-[8.5px] font-bold text-emerald-600 font-mono uppercase">BYE ADVANCEMENT</span>
                  </div>
                  <div className="w-full bg-white rounded-xl border-2 border-emerald-500/80 shadow-sm p-2 relative flex flex-col justify-between h-[88px] hover:border-emerald-400 transition-colors">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs tracking-tight">
                      <Fc26PlayerLogo type="placeholder" size={20} />
                      <span className="truncate uppercase font-black text-slate-900">PEMENANG M1</span>
                    </div>
                    <div className="relative flex items-center justify-center -my-0.5">
                      <div className="absolute left-0 right-0 h-px bg-slate-100" />
                      <Fc26VsBadge variant="green" />
                    </div>
                    <div className="flex items-center justify-between gap-1 text-[11px] tracking-tight">
                      <div className="flex items-center gap-1 text-emerald-700 font-bold">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[9px] font-black">✓</span>
                        <span className="truncate uppercase font-black">BYE (LOLOS FINAL)</span>
                      </div>
                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">AUTO GF</span>
                    </div>
                  </div>
                </div>

                {/* SF2 Match: PEMENANG M2 vs PEMENANG M3 */}
                <div className="absolute top-[202px] left-0 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                      SF2
                    </div>
                    <span className="text-[8.5px] font-bold text-blue-600 font-mono uppercase">KNOCKOUT (M2 vs M3)</span>
                  </div>
                  <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-2 relative flex flex-col justify-between h-[88px] hover:border-blue-400 transition-colors">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] tracking-tight">
                      <Fc26PlayerLogo type="placeholder" size={20} />
                      <span className="truncate uppercase font-extrabold">PEMENANG M2</span>
                    </div>
                    <div className="relative flex items-center justify-center -my-0.5">
                      <div className="absolute left-0 right-0 h-px bg-slate-100" />
                      <Fc26VsBadge variant="navy" />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] tracking-tight">
                      <Fc26PlayerLogo type="placeholder" size={20} />
                      <span className="truncate uppercase font-extrabold">PEMENANG M3</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Widget 4: COLUMN 3 - GRAND FINAL (Delay: 1.5s) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-[455px] top-[97px] w-[190px] z-10"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-5 h-5 rounded-md bg-[#15803d] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                    GF
                  </div>
                  <span className="text-[8.5px] font-bold text-green-700 uppercase">FINAL BO3</span>
                </div>
                <div className="w-full bg-white rounded-2xl border-2 border-green-600 shadow-md p-2.5 relative flex flex-col justify-between h-[96px]">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={20} />
                    <span className="uppercase truncate">PEMENANG SF1 (M1)</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-green-100" />
                    <Fc26VsBadge variant="green" />
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={20} />
                    <span className="uppercase truncate">PEMENANG SF2</span>
                  </div>
                </div>
              </motion.div>

              {/* Widget 5: COLUMN 4 - CHAMPION CERTIFICATE & CASH CARD (Delay: 2.0s) */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-[675px] top-[25px] w-[160px] z-10"
              >
                <div className="w-full bg-emerald-50/70 rounded-2xl border border-emerald-300 shadow-sm p-3 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="relative flex items-center justify-center w-20 h-20 my-1">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-emerald-500 drop-shadow-xs">
                      <path d="M22 74 C10 50 16 28 35 12 C26 28 24 48 32 64" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="18" cy="60" r="3" fill="#10b981" />
                      <circle cx="16" cy="44" r="3" fill="#10b981" />
                      <circle cx="20" cy="30" r="3" fill="#10b981" />
                      <path d="M78 74 C90 50 84 28 65 12 C74 28 76 48 68 64" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="82" cy="60" r="3" fill="#10b981" />
                      <circle cx="84" cy="44" r="3" fill="#10b981" />
                      <circle cx="80" cy="30" r="3" fill="#10b981" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center">
                      <Award className="w-10 h-10 text-emerald-600 drop-shadow-md" />
                    </div>
                  </div>
                  <div className="w-full mt-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white rounded-lg py-1 px-1 shadow-xs text-center">
                    <span className="text-[8.5px] font-black tracking-wider uppercase">SERTIFIKAT & TUNAI</span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Widget 6: Quick Summary Note (Delay: 2.5s) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-700">Semua Match Menggunakan Format Best Of 3 (BO3)</span>
              </div>
              <div className="font-mono text-slate-400">
                Pemenang SF1 vs Pemenang SF2 di Grand Final
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
