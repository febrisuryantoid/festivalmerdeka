import React from "react";
import { Award, FileText, Tv, Banknote, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
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
            6 PEMAIN — SINGLE ELIMINATION (BO3)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/fc26"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2447] hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
            title="Buka Mode Slide Presentasi FC26"
          >
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mode Slide</span>
          </Link>
          <div className="flex items-center gap-1.5 opacity-90">
            <div className="w-4 h-2.5 bg-[#22c55e] transform skew-x-12 rounded-xs shadow-xs" />
            <div className="w-8 h-2.5 bg-[#0b2447] transform skew-x-12 rounded-xs shadow-xs" />
          </div>
        </div>
      </div>

      {/* Main Bracket Canvas */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative w-full min-w-[880px] max-w-5xl mx-auto px-2">
          
          {/* Round Header Labels */}
          <div className="grid grid-cols-4 gap-4 mb-4 text-center">
            <div>
              <div className="bg-[#0b2447] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10.5px] font-black tracking-wider uppercase">BABAK 1 (PENYISIHAN)</div>
                <div className="text-[8px] font-bold text-blue-200 uppercase">3 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#0b2447] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10.5px] font-black tracking-wider uppercase">SEMI FINAL</div>
                <div className="text-[8px] font-bold text-blue-200 uppercase">SF1 (BYE) • SF2 (M2 vs M3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#15803d] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10.5px] font-black tracking-wider uppercase">GRAND FINAL</div>
                <div className="text-[8px] font-bold text-green-200 uppercase">1 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10.5px] font-black tracking-widest uppercase">CHAMPION</div>
                <div className="text-[8px] font-bold text-amber-100 uppercase">JUARA RESMI</div>
              </div>
            </div>
          </div>

          {/* Bracket Canvas Area */}
          <div className="relative h-[380px]">
            {/* SVG Connecting Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              {/* M1 -> SF1 */}
              <g stroke="#0b2447" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 200 43 H 225" />
              </g>
              {/* M2 & M3 -> SF2 */}
              <g stroke="#0b2447" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 200 178 H 212 V 313 H 200" />
                <path d="M 212 245.5 H 225" />
              </g>
              {/* SF1 & SF2 -> GF */}
              <g stroke="#0b2447" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 425 43 H 445 V 245.5 H 425" />
                <path d="M 445 144 H 465" />
              </g>
              {/* GF -> Trophy */}
              <g stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 665 144 H 695" />
              </g>
            </svg>

            {/* COLUMN 1: BABAK 1 / PENYISIHAN (Left: 0 to 200px) */}
            <div className="absolute left-0 top-0 w-[200px] z-10 space-y-[22px]">
              {/* M1: WAHAB vs REPAN */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">M1</div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">PENYISIHAN 1</span>
                </div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-2 relative flex flex-col justify-between h-[86px]">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="ball" color="blue" size={20} />
                    <span className="truncate uppercase">WAHAB</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="pad" color="green" size={20} />
                    <span className="truncate uppercase">REPAN</span>
                  </div>
                </div>
              </div>

              {/* M2: RAHMAT vs NAUFAL ABBAS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">M2</div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">PENYISIHAN 2</span>
                </div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-2 relative flex flex-col justify-between h-[86px]">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="pad" color="purple" size={20} />
                    <span className="truncate uppercase">RAHMAT</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="ball" color="red" size={20} />
                    <span className="truncate uppercase">NAUFAL ABBAS</span>
                  </div>
                </div>
              </div>

              {/* M3: IFAL WIBAWA vs RIPIANSYAH */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">M3</div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">PENYISIHAN 3</span>
                </div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-2 relative flex flex-col justify-between h-[86px]">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="ball" color="green" size={20} />
                    <span className="truncate uppercase">IFAL WIBAWA</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="pad" color="red" size={20} />
                    <span className="truncate uppercase">RIPIANSYAH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: SEMI FINAL (Left: 225px to 425px) */}
            <div className="absolute left-[225px] top-0 w-[200px] z-10">
              {/* SF1: PEMENANG M1 vs BYE */}
              <div className="absolute top-0 left-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">SF1</div>
                  <span className="text-[9px] font-bold text-emerald-600 font-mono uppercase">BYE ADVANCEMENT</span>
                </div>
                <div className="w-full bg-white rounded-xl border-2 border-emerald-500/80 shadow-xs p-2 relative flex flex-col justify-between h-[86px]">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={20} />
                    <span className="truncate uppercase font-black text-slate-900">PEMENANG M1</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="green" />
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[10.5px] tracking-tight">
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[9px] font-black">✓</span>
                      <span className="truncate uppercase font-black">BYE (LOLOS FINAL)</span>
                    </div>
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">AUTO GF</span>
                  </div>
                </div>
              </div>

              {/* SF2: PEMENANG M2 vs PEMENANG M3 */}
              <div className="absolute top-[202px] left-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-5 h-5 rounded-md bg-[#0b2447] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">SF2</div>
                  <span className="text-[9px] font-bold text-blue-600 font-mono uppercase">KNOCKOUT (M2 vs M3)</span>
                </div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-2 relative flex flex-col justify-between h-[86px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[10.5px] tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={20} />
                    <span className="truncate uppercase font-extrabold">PEMENANG M2</span>
                  </div>
                  <div className="relative flex items-center justify-center -my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[10.5px] tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={20} />
                    <span className="truncate uppercase font-extrabold">PEMENANG M3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: GRAND FINAL (Left: 465px to 665px) */}
            <div className="absolute left-[465px] top-[96px] w-[200px] z-10">
              <div className="flex items-center justify-between mb-1">
                <div className="w-5 h-5 rounded-md bg-[#15803d] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">GF</div>
                <span className="text-[9px] font-black text-green-700 uppercase">FINAL MATCH</span>
              </div>
              <div className="w-full bg-white rounded-2xl border-2 border-green-600 shadow-sm p-2.5 relative flex flex-col justify-between h-[96px]">
                <div className="flex items-center gap-2 font-black text-slate-900 text-[11px] tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={22} />
                  <span className="uppercase">PEMENANG SF1 (M1)</span>
                </div>
                <div className="relative flex items-center justify-center -my-0.5">
                  <div className="absolute left-0 right-0 h-px bg-green-100" />
                  <Fc26VsBadge variant="green" />
                </div>
                <div className="flex items-center gap-2 font-black text-slate-900 text-[11px] tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={22} />
                  <span className="uppercase">PEMENANG SF2</span>
                </div>
              </div>
            </div>

            {/* COLUMN 4: CHAMPION PRESENTATION CARD (Left: 695px) */}
            <div className="absolute left-[695px] top-[24px] w-[170px] z-10">
              <div className="w-full bg-emerald-50/50 rounded-2xl border border-emerald-300/80 shadow-sm p-3.5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative flex items-center justify-center w-24 h-24 my-1">
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
                  <Award className="w-12 h-12 text-emerald-600 drop-shadow-md relative z-10" />
                </div>
                <div className="w-full mt-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 border border-emerald-400 rounded-lg py-1 px-1.5 shadow-sm text-center">
                  <span className="text-[8.5px] font-black tracking-wider text-white uppercase">SERTIFIKAT & TUNAI</span>
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
                  <div>• Hadiah : <b>Sertifikat & Uang Tunai</b></div>
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
                  <div className="w-6 h-1 bg-emerald-500 rounded-full" />
                  <span>Hadiah Resmi</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0b2447] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <div className="font-black text-[#0b2447] tracking-wider uppercase text-[10px]">CATATAN</div>
                <div className="text-slate-700 leading-tight">
                  <div>Junjung tinggi sportivitas,</div>
                  <div className="text-[#0b2447] font-bold">Bermain fair play & raih penghargaan!</div>
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
