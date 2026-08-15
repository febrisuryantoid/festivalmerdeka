import React from "react";
import { Trophy, Check, Award } from "lucide-react";
import { TeamLogo, CheckmarkBadge, VsBadge } from "./FreeFireOfficialBracket";

export function FreeFireDesktopBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-1 px-1">
      {/* Header Kecil Kompak */}
      <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-100 px-2">
        <div className="flex items-center gap-1 opacity-80">
          <div className="w-6 h-2.5 bg-blue-600 transform -skew-x-12 rounded-xs" />
          <div className="w-3 h-2.5 bg-amber-400 transform -skew-x-12 rounded-xs" />
        </div>
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-heading uppercase leading-none">
            BRACKET RESMI FREE FIRE 4V4
          </h2>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            11 TIM • SISTEM GUGUR (KNOCKOUT TOURNAMENT)
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-80">
          <div className="w-3 h-2.5 bg-amber-400 transform skew-x-12 rounded-xs" />
          <div className="w-6 h-2.5 bg-blue-600 transform skew-x-12 rounded-xs" />
        </div>
      </div>

      {/* Main Desktop-Fit Bracket Grid: 5 Columns, No horizontal scroll on desktop */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="relative w-full min-w-[760px] max-w-full mx-auto">
          
          {/* Round Header Labels */}
          <div className="grid grid-cols-5 gap-2.5 mb-2.5 text-center">
            <div className="bg-[#0256c4] text-white rounded-t-lg py-1 px-1.5 shadow-xs">
              <div className="text-[10px] font-black tracking-wider uppercase leading-tight">PENYISIHAN</div>
              <div className="text-[8px] font-bold text-blue-100 uppercase">6 MATCH</div>
            </div>
            <div className="bg-[#0256c4] text-white rounded-t-lg py-1 px-1.5 shadow-xs">
              <div className="text-[10px] font-black tracking-wider uppercase leading-tight">6 BESAR</div>
              <div className="text-[8px] font-bold text-blue-100 uppercase">PEMENANG</div>
            </div>
            <div className="bg-[#0256c4] text-white rounded-t-lg py-1 px-1.5 shadow-xs">
              <div className="text-[10px] font-black tracking-wider uppercase leading-tight">3 BESAR</div>
              <div className="text-[8px] font-bold text-blue-100 uppercase">3 MATCH</div>
            </div>
            <div className="bg-[#e88909] text-white rounded-t-lg py-1 px-1.5 shadow-xs">
              <div className="text-[10px] font-black tracking-wider uppercase leading-tight">SEMI FINAL</div>
              <div className="text-[8px] font-bold text-amber-100 uppercase">2 MATCH</div>
            </div>
            <div className="bg-[#dc2626] text-white rounded-t-lg py-1 px-1.5 shadow-xs">
              <div className="text-[10px] font-black tracking-wider uppercase leading-tight">GRAND FINAL</div>
              <div className="text-[8px] font-bold text-red-100 uppercase">CHAMPION</div>
            </div>
          </div>

          {/* Bracket Canvas Area */}
          <div className="relative h-[480px]">
            {/* SVG Connecting Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <g stroke="#0256c4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Penyisihan to 6 Besar: Col 1 to Col 2 */}
                <path d="M 18% 28 H 20.5%" />
                <path d="M 18% 108 H 20.5%" />
                <path d="M 18% 188 H 20.5%" />
                <path d="M 18% 268 H 20.5%" />
                <path d="M 18% 348 H 20.5%" />
                <path d="M 18% 428 H 20.5%" />

                {/* 6 Besar to 3 Besar */}
                <path d="M 37.5% 28 H 39.5% V 428 H 37.5%" />
                <path d="M 39.5% 70 H 41%" />

                <path d="M 37.5% 108 H 39.5% V 268 H 37.5%" />
                <path d="M 39.5% 228 H 41%" />

                <path d="M 37.5% 188 H 39.5% V 348 H 37.5%" />
                <path d="M 39.5% 384 H 41%" />
              </g>

              {/* 3 Besar to Semi Final */}
              <g stroke="#e88909" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 58% 70 H 60% V 384 H 58%" />
                <path d="M 60% 150 H 61.5%" />

                <path d="M 58% 228 H 60% V 306 H 61.5%" />
              </g>

              {/* Semi Final to Grand Final */}
              <g stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 78.5% 150 H 80.5% V 306 H 78.5%" />
                <path d="M 80.5% 228 H 82%" />
              </g>
            </svg>

            {/* COLUMN 1: BABAK PENYISIHAN (Left: 0 to 18%) */}
            <div className="absolute left-0 top-0 w-[18%] space-y-[18px] z-10">
              {/* M1 */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M1</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="ZIEZAN" size={16} />
                      <span className="truncate">ZIEZAN</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-400 text-[9.5px]">
                      <TeamLogo name="BYE" size={14} />
                      <span>BYE</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* M2 */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M2</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="KACUNG PRET" size={16} />
                      <span className="truncate">KACUNG</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="IHAB" size={16} />
                      <span className="truncate">IHAB</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* M3 */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M3</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="XTC" size={16} />
                      <span className="truncate">XTC</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="DESTA" size={16} />
                      <span className="truncate">DESTA</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* M4 */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M4</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="FF 3" size={16} />
                      <span className="truncate">FF 3</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="KANCIL JAMSHOT" size={16} />
                      <span className="truncate">KANCIL</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* M5 */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M5</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="LEO KACUNG" size={16} />
                      <span className="truncate">LEO</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="SPRINT" size={16} />
                      <span className="truncate">SPRINT</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* M6 */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M6</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="NYAWIT" size={16} />
                      <span className="truncate">NYAWIT</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="IFTAH" size={16} />
                      <span className="truncate">IFTAH</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>
            </div>

            {/* COLUMN 2: 6 BESAR (Left: 20.5% to 37.5%) */}
            <div className="absolute left-[20.5%] top-0 w-[17%] space-y-[38px] z-10">
              {/* C1: ZIEZAN */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1 h-[42px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <TeamLogo name="ZIEZAN" size={20} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[10.5px] leading-tight truncate">ZIEZAN</div>
                    <div className="text-[7.5px] font-bold text-slate-400 uppercase">M1 WIN</div>
                  </div>
                </div>
                <Check className="w-3 h-3 text-emerald-500 stroke-[3] shrink-0" />
              </div>

              {/* C2: KACUNG */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1 h-[42px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <TeamLogo name="KACUNG PRET" size={20} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[10.5px] leading-tight truncate">KACUNG</div>
                    <div className="text-[7.5px] font-bold text-slate-400 uppercase">M2 WIN</div>
                  </div>
                </div>
                <Check className="w-3 h-3 text-emerald-500 stroke-[3] shrink-0" />
              </div>

              {/* C3: XTC */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1 h-[42px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <TeamLogo name="XTC" size={20} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[10.5px] leading-tight truncate">XTC</div>
                    <div className="text-[7.5px] font-bold text-slate-400 uppercase">M3 WIN</div>
                  </div>
                </div>
                <Check className="w-3 h-3 text-emerald-500 stroke-[3] shrink-0" />
              </div>

              {/* C4: FF 3 */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1 h-[42px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <TeamLogo name="FF 3" size={20} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[10.5px] leading-tight truncate">FF 3</div>
                    <div className="text-[7.5px] font-bold text-slate-400 uppercase">M4 WIN</div>
                  </div>
                </div>
                <Check className="w-3 h-3 text-emerald-500 stroke-[3] shrink-0" />
              </div>

              {/* C5: SPRINT */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1 h-[42px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <TeamLogo name="SPRINT" size={20} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[10.5px] leading-tight truncate">SPRINT</div>
                    <div className="text-[7.5px] font-bold text-slate-400 uppercase">M5 WIN</div>
                  </div>
                </div>
                <Check className="w-3 h-3 text-emerald-500 stroke-[3] shrink-0" />
              </div>

              {/* C6: NYAWIT */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1 h-[42px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <TeamLogo name="NYAWIT" size={20} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[10.5px] leading-tight truncate">NYAWIT</div>
                    <div className="text-[7.5px] font-bold text-slate-400 uppercase">M6 WIN</div>
                  </div>
                </div>
                <Check className="w-3 h-3 text-emerald-500 stroke-[3] shrink-0" />
              </div>
            </div>

            {/* COLUMN 3: 3 BESAR (Left: 41% to 58%) */}
            <div className="absolute left-[41%] top-0 w-[17%] z-10">
              {/* M7 */}
              <div className="absolute top-[48px] w-full flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M7</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="ZIEZAN" size={16} />
                      <span className="truncate">ZIEZAN</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="NYAWIT" size={16} />
                      <span className="truncate">NYAWIT</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* M8 */}
              <div className="absolute top-[204px] w-full flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M8</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="KACUNG PRET" size={16} />
                      <span className="truncate">KACUNG</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="FF 3" size={16} />
                      <span className="truncate">FF 3</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* M9 */}
              <div className="absolute top-[360px] w-full flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-[#0256c4] text-white font-black text-[9px] flex items-center justify-center shrink-0">M9</div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="XTC" size={16} />
                      <span className="truncate">XTC</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[10px] truncate">
                      <TeamLogo name="SPRINT" size={16} />
                      <span className="truncate">SPRINT</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>
            </div>

            {/* COLUMN 4: SEMI FINAL (Left: 61.5% to 78.5%) */}
            <div className="absolute left-[61.5%] top-0 w-[17%] z-10">
              {/* SF1 */}
              <div className="absolute top-[120px] w-full">
                <div className="w-5 h-5 rounded bg-[#e88909] text-white font-black text-[9px] flex items-center justify-center shrink-0 mb-1">SF1</div>
                <div className="w-full bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="ZIEZAN" size={16} />
                      <span className="truncate">ZIEZAN</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                        <TeamLogo name="XTC" size={16} />
                        <span className="truncate">XTC</span>
                      </div>
                      <span className="text-[7.5px] font-bold text-red-600 uppercase block pl-5 leading-none">(DISKUALIFIKASI)</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>

              {/* SF2 */}
              <div className="absolute top-[280px] w-full">
                <div className="w-5 h-5 rounded bg-[#e88909] text-white font-black text-[9px] flex items-center justify-center shrink-0 mb-1">SF2</div>
                <div className="w-full bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1 flex items-center justify-between gap-1">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-[10.5px] truncate">
                      <TeamLogo name="KACUNG PRET" size={16} />
                      <span className="truncate">KACUNG</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-400 text-[9.5px]">
                      <TeamLogo name="BYE" size={14} />
                      <span>BYE</span>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0" />
                </div>
              </div>
            </div>

            {/* COLUMN 5: GRAND FINAL & TROPHY (Left: 82%) */}
            <div className="absolute left-[82%] top-[140px] w-[18%] z-10 flex flex-col items-center">
              <div className="self-start w-5 h-5 rounded bg-[#dc2626] text-white font-black text-[9px] flex items-center justify-center shrink-0 mb-1">GF</div>
              
              {/* Grand Final Box */}
              <div className="w-full bg-white rounded-xl border-2 border-red-500 shadow-sm p-2 flex items-center justify-between gap-1">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs truncate">
                    <TeamLogo name="ZIEZAN" size={20} />
                    <span className="truncate">ZIEZAN</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1 py-0.2 rounded">VS</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs truncate">
                    <TeamLogo name="KACUNG PRET" size={20} />
                    <span className="truncate">KACUNG</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
              </div>

              {/* Champion Trophy */}
              <div className="mt-2.5 flex flex-col items-center">
                <Trophy className="w-8 h-8 text-amber-500 drop-shadow-sm" />
                <div className="bg-[#dc2626] text-white font-black text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded shadow-xs mt-1">
                  CHAMPION
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
