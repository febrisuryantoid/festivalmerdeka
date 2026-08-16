import React from "react";
import { Star, Shield, FileText, Award, Check } from "lucide-react";
import { MlbbTeamLogo, MlbbVsBadge, MlbbCheckmarkBadge } from "./MobileLegendsOfficialBracket";

export function MobileLegendsResponsiveBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-2 px-1 sm:px-4">
      {/* Header Elegan Ringkas */}
      <div className="relative w-full max-w-4xl flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-8 h-2.5 bg-[#0047ba] transform -skew-x-12 rounded-xs shadow-xs" />
          <div className="w-4 h-2.5 bg-[#d9980d] transform -skew-x-12 rounded-xs shadow-xs" />
        </div>

        <div className="text-center">
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-heading uppercase leading-none">
            BRACKET RESMI MOBILE LEGENDS
          </h2>
          <div className="text-xs sm:text-sm font-black italic tracking-wide text-[#0047ba] uppercase mt-1">
            8 TEAM — SINGLE ELIMINATION
          </div>
        </div>

        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-4 h-2.5 bg-[#d9980d] transform skew-x-12 rounded-xs shadow-xs" />
          <div className="w-8 h-2.5 bg-[#0047ba] transform skew-x-12 rounded-xs shadow-xs" />
        </div>
      </div>

      {/* Main Bracket Canvas */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative w-full min-w-[860px] max-w-[960px] mx-auto px-2">
          
          {/* Round Header Labels */}
          <div className="grid grid-cols-4 gap-4 mb-4 text-center">
            <div>
              <div className="bg-[#003b95] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">PEREMPAT FINAL</div>
                <div className="text-[8.5px] font-bold text-blue-100 uppercase">8 TEAM</div>
              </div>
            </div>

            <div>
              <div className="bg-[#003b95] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">SEMI FINAL</div>
                <div className="text-[8.5px] font-bold text-blue-100 uppercase">4 TEAM</div>
              </div>
            </div>

            <div>
              <div className="bg-[#003b95] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">GRAND FINAL</div>
                <div className="text-[8.5px] font-bold text-blue-100 uppercase">2 TEAM</div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-widest uppercase">HASIL JUARA</div>
              </div>
            </div>
          </div>

          {/* Bracket Canvas Area */}
          <div className="relative h-[490px]">
            {/* SVG Connecting Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <g stroke="#003b95" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* 1. QF1 (Y=42) & QF2 (Y=146) -> SF1 (Y=94) */}
                <path d="M 195 42 H 212 V 146 H 195" />
                <path d="M 212 94 H 238" />

                {/* 2. QF3 (Y=266) & QF4 (Y=370) -> SF2 (Y=318) */}
                <path d="M 195 266 H 212 V 370 H 195" />
                <path d="M 212 318 H 238" />

                {/* 3. SF1 (Y=94) & SF2 (Y=318) -> GF (Y=206) */}
                <path d="M 408 94 H 434 V 318 H 408" />
                <path d="M 434 206 H 460" />

                {/* 4. GF (Y=206) -> Champion (Y=206) */}
                <path d="M 630 206 H 660" />
              </g>
            </svg>

            {/* COLUMN 1: PEREMPAT FINAL (Left: 0 to 195px) */}
            <div className="absolute left-0 top-0 w-[195px] space-y-[34px] z-10">
              {/* QF1: BEE3SKA vs KACUNG PRET (Y=42) */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#003b95] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">QF1</div>
                <div className="flex-1 bg-white rounded-xl border-2 border-emerald-500/80 shadow-xs p-1.5 relative flex flex-col justify-between h-[70px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] truncate">
                      <MlbbTeamLogo name="BEE3SKA" size={18} />
                      <span className="truncate">BEE3SKA</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[11px] truncate">
                    <MlbbTeamLogo name="KACUNG PRET" size={18} />
                    <span className="truncate line-through decoration-slate-300">KACUNG PRET</span>
                  </div>
                </div>
              </div>

              {/* QF2: ZIEZAN vs BKR (Y=146) */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#003b95] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">QF2</div>
                <div className="flex-1 bg-white rounded-xl border-2 border-emerald-500/80 shadow-xs p-1.5 relative flex flex-col justify-between h-[70px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[11px] truncate">
                    <MlbbTeamLogo name="ZIEZAN" size={18} />
                    <span className="truncate line-through decoration-slate-300">ZIEZAN</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] truncate">
                      <MlbbTeamLogo name="BKR" size={18} />
                      <span className="truncate">BKR</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* QF3: HARIMAU GOLD LINE vs PATAH HATI (Y=266) */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#003b95] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">QF3</div>
                <div className="flex-1 bg-white rounded-xl border-2 border-emerald-500/80 shadow-xs p-1.5 relative flex flex-col justify-between h-[70px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-[10.5px] truncate">
                      <MlbbTeamLogo name="HARIMAU GOLD LINE" size={18} />
                      <span className="truncate">HARIMAU GOLD</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[11px] truncate">
                    <MlbbTeamLogo name="PATAH HATI" size={18} />
                    <span className="truncate line-through decoration-slate-300">PATAH HATI</span>
                  </div>
                </div>
              </div>

              {/* QF4: DENSUS vs O2 (Y=370) */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#003b95] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">QF4</div>
                <div className="flex-1 bg-white rounded-xl border-2 border-emerald-500/80 shadow-xs p-1.5 relative flex flex-col justify-between h-[70px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[11px] truncate">
                    <MlbbTeamLogo name="DENSUS" size={18} />
                    <span className="truncate line-through decoration-slate-300">DENSUS</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] truncate">
                      <MlbbTeamLogo name="O2" size={18} />
                      <span className="truncate">O2</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: SEMI FINAL (Left: 238px to 408px) */}
            <div className="absolute left-[238px] top-0 w-[170px] z-10">
              {/* SF1 Box: BEE3SKA vs BKR (Y=94) */}
              <div className="absolute top-[55px] w-full">
                <div className="w-6 h-6 rounded-md bg-[#003b95] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">SF1</div>
                <div className="w-full bg-white rounded-xl border-2 border-emerald-500/80 shadow-xs p-2 relative flex flex-col justify-between h-[78px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MlbbTeamLogo name="BEE3SKA" size={20} />
                      <span className="font-black text-slate-900 text-xs truncate">BEE3SKA</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-400 text-xs">
                    <MlbbTeamLogo name="BKR" size={20} />
                    <span className="line-through decoration-slate-300">BKR</span>
                  </div>
                </div>
              </div>

              {/* SF2 Box: HARIMAU GOLD LINE vs O2 (Y=318) */}
              <div className="absolute top-[279px] w-full">
                <div className="w-6 h-6 rounded-md bg-[#003b95] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">SF2</div>
                <div className="w-full bg-white rounded-xl border-2 border-emerald-500/80 shadow-xs p-2 relative flex flex-col justify-between h-[78px]">
                  <div className="flex items-center gap-2 font-bold text-slate-400 text-[11px] truncate">
                    <MlbbTeamLogo name="HARIMAU GOLD LINE" size={20} />
                    <span className="truncate line-through decoration-slate-300">HARIMAU GOLD</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MlbbTeamLogo name="O2" size={20} />
                      <span className="font-black text-slate-900 text-xs truncate">O2</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: GRAND FINAL (Left: 460px to 630px) */}
            <div className="absolute left-[460px] top-[167px] w-[170px] z-10">
              <div className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">GF</div>
              <div className="w-full bg-white rounded-xl border-2 border-amber-500 shadow-md p-2 relative flex flex-col justify-between h-[78px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MlbbTeamLogo name="BEE3SKA" size={20} />
                    <span className="font-black text-slate-900 text-xs truncate">BEE3SKA</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
                <div className="relative flex items-center justify-center -my-0.5">
                  <div className="absolute left-0 right-0 h-px bg-slate-100" />
                  <MlbbVsBadge />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600 text-xs">
                    <MlbbTeamLogo name="O2" size={20} />
                    <span className="truncate">O2 (OXYGEN)</span>
                  </div>
                  <span className="text-[8px] font-black bg-slate-100 text-slate-600 px-1 py-0.2 rounded">J2</span>
                </div>
              </div>
            </div>

            {/* COLUMN 4: CHAMPION CERTIFICATE & CASH CARD (Left: 660px) */}
            <div className="absolute left-[660px] top-[40px] w-[190px] z-10">
              <div className="w-full bg-gradient-to-b from-blue-50/90 via-white to-amber-50/80 rounded-2xl border-2 border-amber-400 shadow-md p-3 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative flex items-center justify-center w-20 h-20 my-0.5">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 drop-shadow-xs">
                    <path d="M22 72 C12 50 16 28 35 12 C26 28 24 48 32 64" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="18" cy="58" r="3" fill="#f59e0b" />
                    <circle cx="16" cy="42" r="3" fill="#f59e0b" />
                    <circle cx="20" cy="28" r="3" fill="#f59e0b" />
                    <path d="M78 72 C88 50 84 28 65 12 C74 28 76 48 68 64" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="82" cy="58" r="3" fill="#f59e0b" />
                    <circle cx="84" cy="42" r="3" fill="#f59e0b" />
                    <circle cx="80" cy="28" r="3" fill="#f59e0b" />
                  </svg>
                  <Award className="w-10 h-10 text-amber-600 drop-shadow-md relative z-10" />
                </div>
                
                <div className="w-full mt-1 bg-[#003b95] text-white rounded-lg py-1 px-1 text-center shadow-xs">
                  <span className="text-[8px] font-black tracking-wider uppercase">SERTIFIKAT & UANG TUNAI</span>
                </div>

                <div className="w-full mt-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg p-1.5 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MlbbTeamLogo name="BEE3SKA" size={22} />
                    <div className="text-left leading-tight">
                      <div className="text-[7.5px] font-black text-amber-950 uppercase tracking-wider">JUARA 1</div>
                      <div className="text-[11px] font-black text-slate-900 truncate">BEE3SKA</div>
                    </div>
                  </div>
                  <Star className="w-3.5 h-3.5 text-amber-950 fill-amber-950 shrink-0" />
                </div>

                <div className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MlbbTeamLogo name="O2" size={18} />
                    <div className="text-left leading-tight">
                      <div className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider">JUARA 2</div>
                      <div className="text-[10px] font-bold text-slate-800 truncate">(O2) OXYGEN</div>
                    </div>
                  </div>
                  <span className="text-[7.5px] font-bold text-slate-500 bg-slate-200 px-1 py-0.2 rounded">Runner Up</span>
                </div>

              </div>
            </div>

          </div>

          {/* FOOTER SECTION: KETERANGAN, LEGENDA & CATATAN */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <div className="font-black text-[#003b95] tracking-wider uppercase text-[10px]">KETERANGAN</div>
                <div className="space-y-0.5 text-slate-700 leading-tight">
                  <div>• Sistem : <b>Single Elimination</b></div>
                  <div>• QF & SF : <b>Best Of 3 (BO3)</b></div>
                  <div>• Grand Final : <b>Best Of 5 (BO5)</b></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 space-y-1 text-[10.5px]">
              <div className="font-black text-[#003b95] tracking-wider uppercase text-[10px]">LEGENDA</div>
              <div className="space-y-1 text-slate-700 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-4 rounded bg-[#003b95] text-white text-[8px] font-black flex items-center justify-center">QF</span>
                  <span>Perempat Final</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-4 rounded bg-[#003b95] text-white text-[8px] font-black flex items-center justify-center">SF</span>
                  <span>Semi Final</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-4 rounded bg-[#003b95] text-white text-[8px] font-black flex items-center justify-center">GF</span>
                  <span>Grand Final</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Star className="w-4 h-4 fill-white text-white" />
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <div className="font-black text-[#003b95] tracking-wider uppercase text-[10px]">CATATAN</div>
                <div className="text-slate-700 leading-tight">
                  <div>Junjung tinggi sportivitas,</div>
                  <div className="text-[#003b95] font-bold">Bermain adil, menang terhormat!</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 relative w-full flex items-center justify-center bg-[#003b95] text-white py-2 px-3 rounded-lg font-black text-xs tracking-wider uppercase shadow-xs overflow-hidden">
            <span>PLAY TO WIN, RESPECT TOGETHER • JUNJUNG SPORTIVITAS!</span>
          </div>

        </div>
      </div>
    </div>
  );
}
