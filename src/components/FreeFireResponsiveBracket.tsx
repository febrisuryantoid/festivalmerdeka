import React from "react";
import { Trophy, Award, Calendar, FileText, Check, Shield } from "lucide-react";
import { TeamLogo, CheckmarkBadge, VsBadge } from "./FreeFireOfficialBracket";

export function FreeFireResponsiveBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-2 px-1 sm:px-3">
      {/* Header Elegan & Rapi */}
      <div className="relative w-full max-w-4xl flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-8 h-2.5 bg-[#0256c4] transform -skew-x-12 rounded-xs shadow-xs" />
          <div className="w-4 h-2.5 bg-amber-400 transform -skew-x-12 rounded-xs shadow-xs" />
        </div>

        <div className="text-center">
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-heading uppercase leading-none">
            BRACKET RESMI FREE FIRE 4V4
          </h2>
          <div className="text-xs sm:text-sm font-black italic tracking-wide text-[#0256c4] uppercase mt-1">
            11 TIM • SISTEM GUGUR (KNOCKOUT TOURNAMENT)
          </div>
        </div>

        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-4 h-2.5 bg-amber-400 transform skew-x-12 rounded-xs shadow-xs" />
          <div className="w-8 h-2.5 bg-[#0256c4] transform skew-x-12 rounded-xs shadow-xs" />
        </div>
      </div>

      {/* Main Bracket Interactive Grid: Scaled to 1050px width */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative w-[1050px] min-w-[1050px] mx-auto px-1">
          
          {/* Round Header Labels - Exact Widths matching columns */}
          <div className="flex items-center gap-[35px] mb-3 text-center">
            {/* Col 1 Header: 200px */}
            <div className="w-[200px]">
              <div className="bg-[#0256c4] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase leading-tight">BABAK PENYISIHAN</div>
                <div className="text-[8.5px] font-bold text-blue-100 uppercase">6 MATCH (11 TIM)</div>
              </div>
            </div>

            {/* Col 2 Header: 175px */}
            <div className="w-[175px]">
              <div className="bg-[#0256c4] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase leading-tight">6 BESAR</div>
                <div className="text-[8.5px] font-bold text-blue-100 uppercase">PEMENANG MATCH</div>
              </div>
            </div>

            {/* Col 3 Header: 185px */}
            <div className="w-[185px]">
              <div className="bg-[#0256c4] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase leading-tight">3 BESAR</div>
                <div className="text-[8.5px] font-bold text-blue-100 uppercase">3 PERTANDINGAN</div>
              </div>
            </div>

            {/* Col 4 Header: 185px */}
            <div className="w-[185px]">
              <div className="bg-[#e88909] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase leading-tight">SEMI FINAL</div>
                <div className="text-[8.5px] font-bold text-amber-100 uppercase">2 PERTANDINGAN</div>
              </div>
            </div>

            {/* Col 5 Header: 175px */}
            <div className="w-[175px]">
              <div className="bg-[#dc2626] text-white rounded-t-xl py-1.5 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase leading-tight">GRAND FINAL</div>
                <div className="text-[8.5px] font-bold text-red-100 uppercase">FINAL & CHAMPION</div>
              </div>
            </div>
          </div>

          {/* Bracket Canvas Area - Exact 620px Height */}
          <div className="relative h-[620px] bg-slate-50/40 rounded-2xl border border-slate-100 p-2">
            
            {/* SVG Connecting Lines Overlay - Mathematically Aligned */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* 1. BLUE LINES: Penyisihan (X=200) -> 6 Besar (X=235) */}
              {/* Y coordinates: 42, 148, 254, 360, 466, 572 */}
              <g stroke="#0256c4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 200 42 H 235" />
                <path d="M 200 148 H 235" />
                <path d="M 200 254 H 235" />
                <path d="M 200 360 H 235" />
                <path d="M 200 466 H 235" />
                <path d="M 200 572 H 235" />
              </g>

              {/* 2. BLUE LINES: 6 Besar (X=410) -> 3 Besar (X=445) */}
              <g stroke="#0256c4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* C1 (Y=42) & C6 (Y=572) -> M7 (Y=95) */}
                <path d="M 410 42 H 427.5 V 572 H 410" />
                <path d="M 427.5 95 H 445" />

                {/* C2 (Y=148) & C4 (Y=360) -> M8 (Y=307) */}
                <path d="M 410 148 H 427.5 V 360 H 410" />
                <path d="M 427.5 307 H 445" />

                {/* C3 (Y=254) & C5 (Y=466) -> M9 (Y=519) */}
                <path d="M 410 254 H 427.5 V 466 H 410" />
                <path d="M 427.5 519 H 445" />
              </g>

              {/* 3. ORANGE LINES: 3 Besar (X=630) -> Semi Final (X=665) */}
              <g stroke="#e88909" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* M7 (Y=95) & M9 (Y=519) -> SF1 (Y=201) */}
                <path d="M 630 95 H 647.5 V 519 H 630" />
                <path d="M 647.5 201 H 665" />

                {/* M8 (Y=307) -> SF2 (Y=413) */}
                <path d="M 630 307 H 647.5 V 413 H 665" />
              </g>

              {/* 4. RED LINES: Semi Final (X=850) -> Grand Final (X=885) */}
              <g stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* SF1 (Y=201) & SF2 (Y=413) -> GF (Y=201) */}
                <path d="M 850 201 H 867.5 V 413 H 850" />
                <path d="M 867.5 201 H 885" />
              </g>
            </svg>

            {/* ========================================================================= */}
            {/* COLUMN 1: BABAK PENYISIHAN (Left: 0px, Width: 200px) */}
            {/* ========================================================================= */}
            <div className="absolute left-0 top-0 w-[200px] h-full z-10">
              
              {/* M1 (Center Y = 42px -> top = 14px) */}
              <div className="absolute top-[14px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M1</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1.5 h-[56px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="ZIEZAN" size={20} />
                      <span className="truncate">ZIEZAN</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[10px] truncate">
                      <TeamLogo name="BYE" size={16} />
                      <span>BYE</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M2 (Center Y = 148px -> top = 120px) */}
              <div className="absolute top-[120px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M2</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1.5 h-[56px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="KACUNG PRET" size={20} />
                      <span className="truncate">KACUNG PRET</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10.5px] truncate">
                      <TeamLogo name="IHAB" size={20} />
                      <span className="truncate">IHAB</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M3 (Center Y = 254px -> top = 226px) */}
              <div className="absolute top-[226px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M3</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1.5 h-[56px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="XTC" size={20} />
                      <span className="truncate">XTC</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10.5px] truncate">
                      <TeamLogo name="DESTA" size={20} />
                      <span className="truncate">DESTA</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M4 (Center Y = 360px -> top = 332px) */}
              <div className="absolute top-[332px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M4</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1.5 h-[56px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="FF 3" size={20} />
                      <span className="truncate">FF 3</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10px] truncate">
                      <TeamLogo name="KANCIL JAMSHOT" size={20} />
                      <span className="truncate">KANCIL JAMSHOT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M5 (Center Y = 466px -> top = 438px) */}
              <div className="absolute top-[438px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M5</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1.5 h-[56px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="LEO KACUNG" size={20} />
                      <span className="truncate">LEO KACUNG</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10.5px] truncate">
                      <TeamLogo name="SPRINT" size={20} />
                      <span className="truncate">SPRINT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M6 (Center Y = 572px -> top = 544px) */}
              <div className="absolute top-[544px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M6</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1.5 h-[56px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="NYAWIT" size={20} />
                      <span className="truncate">NYAWIT</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10.5px] truncate">
                      <TeamLogo name="IFTAH" size={20} />
                      <span className="truncate">IFTAH</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMN 2: 6 BESAR (Left: 235px, Width: 175px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[235px] top-0 w-[175px] h-full z-10">
              
              {/* Card 1: ZIEZAN (Center Y = 42px -> top = 14px) */}
              <div className="absolute top-[14px] left-0 w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1.5 h-[56px]">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamLogo name="ZIEZAN" size={24} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[11px] leading-tight truncate">ZIEZAN</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">MENANG M1</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 2: KACUNG PRET (Center Y = 148px -> top = 120px) */}
              <div className="absolute top-[120px] left-0 w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1.5 h-[56px]">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamLogo name="KACUNG PRET" size={24} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[11px] leading-tight truncate">KACUNG PRET</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">MENANG M2</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 3: XTC (Center Y = 254px -> top = 226px) */}
              <div className="absolute top-[226px] left-0 w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1.5 h-[56px]">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamLogo name="XTC" size={24} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[11px] leading-tight truncate">XTC</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">MENANG M3</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 4: FF 3 (Center Y = 360px -> top = 332px) */}
              <div className="absolute top-[332px] left-0 w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1.5 h-[56px]">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamLogo name="FF 3" size={24} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[11px] leading-tight truncate">FF 3</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">MENANG M4</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 5: SPRINT (Center Y = 466px -> top = 438px) */}
              <div className="absolute top-[438px] left-0 w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1.5 h-[56px]">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamLogo name="SPRINT" size={24} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[11px] leading-tight truncate">SPRINT</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">MENANG M5</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 6: NYAWIT (Center Y = 572px -> top = 544px) */}
              <div className="absolute top-[544px] left-0 w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1.5 h-[56px]">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamLogo name="NYAWIT" size={24} />
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 text-[11px] leading-tight truncate">NYAWIT</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">MENANG M6</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMN 3: 3 BESAR (Left: 445px, Width: 185px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[445px] top-0 w-[185px] h-full z-10">
              
              {/* M7 (Center Y = 95px -> top = 64px, height = 62px) */}
              <div className="absolute top-[64px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M7</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1 h-[62px]">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="ZIEZAN" size={18} />
                      <span className="truncate">ZIEZAN</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10.5px] truncate">
                      <TeamLogo name="NYAWIT" size={18} />
                      <span className="truncate">NYAWIT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M8 (Center Y = 307px -> top = 276px, height = 62px) */}
              <div className="absolute top-[276px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M8</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1 h-[62px]">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="KACUNG PRET" size={18} />
                      <span className="truncate">KACUNG PRET</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10.5px] truncate">
                      <TeamLogo name="FF 3" size={18} />
                      <span className="truncate">FF 3</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M9 (Center Y = 519px -> top = 488px, height = 62px) */}
              <div className="absolute top-[488px] left-0 w-full flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#0256c4] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">M9</div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center justify-between gap-1 h-[62px]">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="XTC" size={18} />
                      <span className="truncate">XTC</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[10.5px] truncate">
                      <TeamLogo name="SPRINT" size={18} />
                      <span className="truncate">SPRINT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMN 4: SEMI FINAL (Left: 665px, Width: 185px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[665px] top-0 w-[185px] h-full z-10">
              
              {/* SF1 (Center Y = 201px -> top = 158px, height = 86px) */}
              <div className="absolute top-[158px] left-0 w-full">
                <div className="w-6 h-6 rounded-md bg-[#e88909] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">SF1</div>
                <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1 h-[86px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="ZIEZAN" size={20} />
                      <span className="truncate">ZIEZAN</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                        <TeamLogo name="XTC" size={20} />
                        <span className="truncate">XTC</span>
                      </div>
                      <div className="text-[7.5px] font-bold text-red-600 uppercase pl-6 leading-none mt-0.5">
                        (DISKUALIFIKASI)
                      </div>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* SF2 (Center Y = 413px -> top = 370px, height = 86px) */}
              <div className="absolute top-[370px] left-0 w-full">
                <div className="w-6 h-6 rounded-md bg-[#e88909] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">SF2</div>
                <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex items-center justify-between gap-1 h-[86px]">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-[11px] truncate">
                      <TeamLogo name="KACUNG PRET" size={20} />
                      <span className="truncate">KACUNG PRET</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[10px]">
                      <TeamLogo name="BYE" size={16} />
                      <span>BYE</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMN 5: GRAND FINAL & PODIUM (Left: 885px, Width: 175px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[885px] top-0 w-[175px] h-full z-10 flex flex-col items-center">
              
              {/* Grand Final Card (Center Y = 201px -> top = 120px) */}
              <div className="absolute top-[120px] left-0 w-full">
                <div className="w-6 h-6 rounded-md bg-[#dc2626] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs mb-1">GF</div>
                
                <div className="w-full bg-white rounded-2xl border-2 border-red-500 shadow-sm p-2 flex flex-col justify-between gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] truncate">
                      <TeamLogo name="ZIEZAN" size={20} />
                      <span className="truncate">ZIEZAN</span>
                    </div>
                    <span className="text-[8px] font-black bg-slate-100 text-slate-600 px-1 py-0.5 rounded">J2</span>
                  </div>
                  <div className="flex justify-center -my-1">
                    <VsBadge />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-[11px] truncate">
                      <TeamLogo name="KACUNK PRET" size={20} />
                      <span className="truncate text-red-700">KACUNK PRET</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3.5]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Champion Certificate & Cash Podium Box (Top = 270px) */}
              <div className="absolute top-[270px] left-0 w-full bg-gradient-to-b from-red-50/90 via-white to-amber-50/70 rounded-2xl border-2 border-red-400 p-2.5 shadow-md flex flex-col items-center">
                <div className="relative flex items-center justify-center w-16 h-16">
                  {/* Laurels Graphic */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-red-500 drop-shadow-xs">
                    <path d="M22 68 C15 50 18 30 35 15 C28 28 26 48 34 60" fill="none" stroke="#dc2626" strokeWidth="3" />
                    <circle cx="20" cy="55" r="3.5" fill="#ef4444" />
                    <circle cx="18" cy="40" r="3.5" fill="#ef4444" />
                    <circle cx="22" cy="28" r="3.5" fill="#ef4444" />
                    <path d="M78 68 C85 50 82 30 65 15 C72 28 74 48 66 60" fill="none" stroke="#dc2626" strokeWidth="3" />
                    <circle cx="80" cy="55" r="3.5" fill="#ef4444" />
                    <circle cx="82" cy="40" r="3.5" fill="#ef4444" />
                    <circle cx="78" cy="28" r="3.5" fill="#ef4444" />
                  </svg>
                  <Award className="w-8 h-8 text-red-600 drop-shadow-md relative z-10" />
                </div>

                {/* Plaque: SERTIFIKAT & UANG TUNAI */}
                <div className="w-full mt-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-black text-[7.5px] tracking-wider uppercase py-1 px-1 rounded-lg shadow-xs text-center">
                  SERTIFIKAT & UANG TUNAI
                </div>

                {/* JUARA 1 */}
                <div className="w-full mt-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg p-1.5 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-1 min-w-0">
                    <TeamLogo name="KACUNK PRET" size={20} />
                    <div className="text-left leading-tight">
                      <div className="text-[7px] font-black text-amber-950 uppercase">JUARA 1</div>
                      <div className="text-[10px] font-black text-slate-900 truncate">KACUNK PRET</div>
                    </div>
                  </div>
                </div>

                {/* JUARA 2 */}
                <div className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-1 min-w-0">
                    <TeamLogo name="ZIEZAN" size={18} />
                    <div className="text-left leading-tight">
                      <div className="text-[7px] font-black text-slate-500 uppercase">JUARA 2</div>
                      <div className="text-[10px] font-bold text-slate-800 truncate">ZIEZAN</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* FOOTER SECTION: KETERANGAN, LEGENDA & CATATAN */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. KETERANGAN */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0256c4] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <div className="font-black text-blue-900 tracking-wider uppercase text-[10px]">KETERANGAN</div>
                <div className="space-y-0.5 text-slate-700 leading-tight">
                  <div>• Sistem : <b>Single Elimination (Knockout)</b></div>
                  <div>• Semua Pertandingan : <b>Best Of 3 (BO3)</b></div>
                  <div>• Seri 1-1 : <b>Match 3 Penentuan</b></div>
                </div>
              </div>
            </div>

            {/* 2. LEGENDA */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 space-y-1 text-[10.5px]">
              <div className="font-black text-blue-900 tracking-wider uppercase text-[10px]">LEGENDA</div>
              <div className="space-y-1 text-slate-700 font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#0256c4] rounded-full" />
                  <span>Penyisihan & 6 Besar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#e88909] rounded-full" />
                  <span>Semi Final</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#dc2626] rounded-full" />
                  <span>Grand Final & Juara</span>
                </div>
              </div>
            </div>

            {/* 3. KODE & SPORTIVITAS */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0256c4] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-4 h-4 text-amber-300" />
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <div className="font-black text-blue-900 tracking-wider uppercase text-[10px]">FAIR PLAY</div>
                <div className="text-slate-700 leading-tight">
                  <div><b>M</b> = Match • <b>BYE</b> = Lolos Langsung</div>
                  <div className="text-[#0256c4] font-bold">Junjung Tinggi Sportivitas!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Blue Banner */}
          <div className="mt-3 relative w-full flex items-center justify-center bg-[#0256c4] text-white py-2 px-3 rounded-lg font-black text-xs tracking-wider uppercase shadow-xs overflow-hidden">
            <span>PLAY FAIR, RESPECT EVERYONE • BERMAIN ADIL, MENANG TERHORMAT!</span>
          </div>

        </div>
      </div>
    </div>
  );
}
