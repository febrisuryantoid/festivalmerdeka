import React from "react";
import { Trophy, FileText } from "lucide-react";
import { Fc26PlayerLogo, Fc26VsBadge } from "./FC26OfficialBracket";

export function FC26ResponsiveBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-2 px-1 sm:px-4">
      {/* Header Elegan Ringkas */}
      <div className="relative w-full max-w-4xl flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-8 h-2.5 bg-[#0b2447] transform -skew-x-12 rounded-xs shadow-xs" />
          <div className="w-4 h-2.5 bg-[#22c55e] transform -skew-x-12 rounded-xs shadow-xs" />
        </div>

        <div className="text-center">
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-heading uppercase leading-none">
            BRACKET RESMI PS 4 PRO FC26
          </h2>
          <div className="text-xs sm:text-sm font-black italic tracking-wide text-[#0b2447] uppercase mt-1">
            4 PEMAIN — SINGLE ELIMINATION
          </div>
        </div>

        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-4 h-2.5 bg-[#22c55e] transform skew-x-12 rounded-xs shadow-xs" />
          <div className="w-8 h-2.5 bg-[#0b2447] transform skew-x-12 rounded-xs shadow-xs" />
        </div>
      </div>

      {/* Main Bracket Canvas: Width scaled down to 780px max */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative w-full min-w-[760px] max-w-[860px] mx-auto px-2">
          
          {/* Round Header Labels */}
          <div className="grid grid-cols-3 gap-6 mb-4 text-center">
            <div>
              <div className="bg-[#0b2447] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">SEMI FINAL</div>
                <div className="text-[8.5px] font-bold text-blue-200 uppercase">2 PERTANDINGAN</div>
              </div>
            </div>

            <div>
              <div className="bg-[#15803d] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">GRAND FINAL</div>
                <div className="text-[8.5px] font-bold text-green-200 uppercase">1 PERTANDINGAN</div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-widest uppercase">CHAMPION</div>
              </div>
            </div>
          </div>

          {/* Bracket Canvas Area */}
          <div className="relative h-[380px]">
            {/* SVG Connecting Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              {/* Dark Navy Line: SF1 (Y=72) & SF2 (Y=248) -> Grand Final (Y=160) */}
              <g stroke="#0b2447" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 230 72 H 255 V 248 H 230" />
                <path d="M 255 160 H 280" />
              </g>

              {/* Green Line: Grand Final (Y=160) -> Trophy (Y=160) */}
              <g stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 500 160 H 540" />
              </g>
            </svg>

            {/* COLUMN 1: SEMI FINAL (Left: 0 to 230px) */}
            <div className="absolute left-0 top-0 w-[230px] space-y-[38px] z-10">
              {/* SF1 Box (Y=72) */}
              <div>
                <div className="w-6 h-6 rounded-md bg-[#0b2447] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">SF1</div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-2 relative flex flex-col justify-between h-[90px]">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="ball" color="green" size={24} />
                    <span className="truncate uppercase">IFAL WIBAWA</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="pad" color="red" size={24} />
                    <span className="truncate uppercase">RIPIANSYAH</span>
                  </div>
                </div>
              </div>

              {/* SF2 Box (Y=248) */}
              <div>
                <div className="w-6 h-6 rounded-md bg-[#0b2447] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">SF2</div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-2 relative flex flex-col justify-between h-[90px]">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="ball" color="blue" size={24} />
                    <span className="truncate uppercase">WAHAB</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="pad" color="purple" size={24} />
                    <span className="truncate uppercase">FADILAH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: GRAND FINAL (Left: 280px to 500px) */}
            <div className="absolute left-[280px] top-[95px] w-[220px] z-10">
              <div className="w-6 h-6 rounded-md bg-[#15803d] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">GF</div>
              <div className="w-full bg-white rounded-2xl border-2 border-green-600 shadow-sm p-2.5 relative flex flex-col justify-between h-[98px]">
                <div className="flex items-center gap-2.5 font-black text-slate-900 text-[11.5px] tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={26} />
                  <span className="uppercase">PEMENANG SF1</span>
                </div>
                <div className="relative flex items-center justify-center -my-0.5">
                  <div className="absolute left-0 right-0 h-px bg-green-100" />
                  <Fc26VsBadge variant="green" />
                </div>
                <div className="flex items-center gap-2.5 font-black text-slate-900 text-[11.5px] tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={26} />
                  <span className="uppercase">PEMENANG SF2</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: CHAMPION PRESENTATION CARD (Left: 540px) */}
            <div className="absolute left-[540px] top-[30px] w-[200px] z-10">
              <div className="w-full bg-amber-50/50 rounded-2xl border border-amber-300/80 shadow-sm p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative flex items-center justify-center w-28 h-28 my-1">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 drop-shadow-xs">
                    <path d="M22 74 C10 50 16 28 35 12 C26 28 24 48 32 64" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="18" cy="60" r="3" fill="#f59e0b" />
                    <circle cx="16" cy="44" r="3" fill="#f59e0b" />
                    <circle cx="20" cy="30" r="3" fill="#f59e0b" />
                    <path d="M78 74 C90 50 84 28 65 12 C74 28 76 48 68 64" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="82" cy="60" r="3" fill="#f59e0b" />
                    <circle cx="84" cy="44" r="3" fill="#f59e0b" />
                    <circle cx="80" cy="30" r="3" fill="#f59e0b" />
                  </svg>
                  <Trophy className="w-14 h-14 text-amber-500 drop-shadow-md relative z-10" />
                </div>
                <div className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 border border-amber-500 rounded-lg py-1 px-2 shadow-sm text-center">
                  <span className="text-[10px] font-black tracking-widest text-amber-900 uppercase">CHAMPION FC26</span>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER SECTION */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0b2447] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <div className="font-black text-[#0b2447] tracking-wider uppercase text-[10px]">KETERANGAN</div>
                <div className="space-y-0.5 text-slate-700 leading-tight">
                  <div>• Sistem : <b>Single Elimination</b></div>
                  <div>• SF & Grand Final : <b>Best Of 3 (BO3)</b></div>
                  <div>• Seri 1-1 : <b>Match 3 Penentuan</b></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 space-y-1 text-[10.5px]">
              <div className="font-black text-[#0b2447] tracking-wider uppercase text-[10px]">LEGENDA</div>
              <div className="space-y-1 text-slate-700 font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#0b2447] rounded-full" />
                  <span>Semi Final</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#15803d] rounded-full" />
                  <span>Grand Final</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-amber-500 rounded-full" />
                  <span>Champion</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0b2447] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Trophy className="w-4 h-4 text-amber-300" />
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <div className="font-black text-[#0b2447] tracking-wider uppercase text-[10px]">CATATAN</div>
                <div className="text-slate-700 leading-tight">
                  <div>Junjung tinggi sportivitas,</div>
                  <div className="text-[#0b2447] font-bold">Bermain fair play & jadilah juara!</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 relative w-full flex items-center justify-center bg-[#0b2447] text-white py-2 px-3 rounded-lg font-black text-xs tracking-wider uppercase shadow-xs overflow-hidden">
            <span>PLAY FAIR, RESPECT EVERYONE • BERMAIN ADIL, MENANG TERHORMAT!</span>
          </div>

        </div>
      </div>
    </div>
  );
}
