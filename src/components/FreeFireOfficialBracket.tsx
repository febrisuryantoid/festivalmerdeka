import React from "react";
import { Check, Trophy, FileText, Calendar, Award } from "lucide-react";

// Team Logos & Badges as SVG Emblems
export const TeamLogo = ({ name, size = 28 }: { name: string; size?: number }) => {
  const norm = (name || "").toLowerCase().trim();

  if (norm.includes("bye")) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-black text-xs shrink-0 shadow-xs"
      >
        <span className="leading-none mb-0.5">-</span>
      </div>
    );
  }

  if (norm.includes("ziezan") || norm.includes("ziezam")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="ziezan_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path d="M50 5 L88 20 V52 C88 75 50 95 50 95 C50 95 12 75 12 52 V20 Z" fill="url(#ziezan_grad)" stroke="#38bdf8" strokeWidth="4" />
        <path d="M50 15 L78 27 V50 C78 68 50 84 50 84 C50 84 22 68 22 50 V27 Z" fill="#0369a1" />
        {/* Warrior / Spartan Helmet */}
        <path d="M42 30 H58 V48 H52 V64 H48 V48 H42 Z" fill="#ffffff" />
        <path d="M32 38 H68 V45 H32 Z" fill="#38bdf8" />
        <circle cx="50" cy="38" r="4" fill="#facc15" />
        <rect x="26" y="20" width="48" height="9" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        <text x="50" y="27" fill="#ffffff" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">ZIEZAN</text>
      </svg>
    );
  }

  if (norm.includes("kacung") && !norm.includes("leo")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="kacung_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
        </defs>
        <path d="M50 5 L90 22 V50 C90 75 50 95 50 95 C50 95 10 75 10 50 V22 Z" fill="url(#kacung_grad)" stroke="#ef4444" strokeWidth="4" />
        {/* Red Demon Horns */}
        <path d="M25 25 Q15 8 30 14 Q32 25 35 32 Z" fill="#f87171" />
        <path d="M75 25 Q85 8 70 14 Q68 25 65 32 Z" fill="#f87171" />
        <circle cx="38" cy="48" r="5" fill="#fef08a" />
        <circle cx="62" cy="48" r="5" fill="#fef08a" />
        <path d="M35 62 Q50 78 65 62 Q50 68 35 62 Z" fill="#ffffff" />
      </svg>
    );
  }

  if (norm.includes("ihab")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <path d="M50 5 L88 22 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V22 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
        <path d="M50 18 L76 30 V50 C76 68 50 82 50 82 C50 82 24 68 24 50 V30 Z" fill="#334155" />
        {/* Mechanical beast / armor mask */}
        <path d="M35 38 L50 26 L65 38 L50 48 Z" fill="#e2e8f0" />
        <circle cx="40" cy="50" r="4" fill="#38bdf8" />
        <circle cx="60" cy="50" r="4" fill="#38bdf8" />
        <path d="M40 64 L50 72 L60 64 Z" fill="#94a3b8" />
      </svg>
    );
  }

  if (norm.includes("xtc")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <rect x="10" y="10" width="80" height="80" rx="16" fill="#042f2e" stroke="#0d9488" strokeWidth="3" />
        {/* Cyber Blades / Cross */}
        <path d="M22 22 L78 78" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round" />
        <path d="M78 22 L22 78" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round" />
        <path d="M26 26 L74 74" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <path d="M74 26 L26 74" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="14" fill="#042f2e" stroke="#2dd4bf" strokeWidth="3" />
        <text x="50" y="55" fill="#5eead4" fontSize="10" fontWeight="900" textAnchor="middle">XTC</text>
      </svg>
    );
  }

  if (norm.includes("desta")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <path d="M50 5 L88 20 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V20 Z" fill="#3b0764" stroke="#a855f7" strokeWidth="4" />
        {/* Purple dragon / demon emblem */}
        <path d="M50 18 L74 32 V52 C74 68 50 82 50 82 C50 82 26 68 26 52 V32 Z" fill="#581c87" />
        <path d="M36 34 L50 22 L64 34 L50 44 Z" fill="#c084fc" />
        <circle cx="42" cy="50" r="3.5" fill="#f43f5e" />
        <circle cx="58" cy="50" r="3.5" fill="#f43f5e" />
        <path d="M38 62 L50 72 L62 62 Z" fill="#e9d5ff" />
      </svg>
    );
  }

  if (norm.includes("ff 3") || norm.includes("ff3")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <rect x="10" y="10" width="80" height="80" rx="16" fill="#431407" stroke="#ea580c" strokeWidth="3" />
        {/* Fiery F3 Badge */}
        <path d="M22 22 H54 V34 H36 V44 H50 V56 H36 V78 H22 Z" fill="#f97316" />
        <path d="M56 22 H80 V42 H68 V46 H80 V78 H56 V66 H68 V58 H56 Z" fill="#fb923c" />
        <text x="50" y="90" fill="#fed7aa" fontSize="9" fontWeight="900" textAnchor="middle">FIRE 3</text>
      </svg>
    );
  }

  if (norm.includes("kancil")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <path d="M50 5 L88 20 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V20 Z" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
        {/* Green panther / ninja shield */}
        <path d="M50 18 L76 32 V52 C76 68 50 82 50 82 C50 82 24 68 24 52 V32 Z" fill="#047857" />
        <path d="M34 36 L50 24 L66 36 L50 48 Z" fill="#34d399" />
        <circle cx="40" cy="50" r="4" fill="#facc15" />
        <circle cx="60" cy="50" r="4" fill="#facc15" />
        <path d="M42 64 L50 72 L58 64 Z" fill="#a7f3d0" />
      </svg>
    );
  }

  if (norm.includes("leo")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <path d="M50 5 L88 20 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V20 Z" fill="#451a03" stroke="#f59e0b" strokeWidth="4" />
        {/* Golden Lion Shield */}
        <path d="M50 18 L76 32 V52 C76 68 50 82 50 82 C50 82 24 68 24 52 V32 Z" fill="#b45309" />
        <circle cx="50" cy="46" r="18" fill="#d97706" />
        <circle cx="42" cy="44" r="3.5" fill="#fef08a" />
        <circle cx="58" cy="44" r="3.5" fill="#fef08a" />
        <polygon points="50,52 45,60 55,60" fill="#451a03" />
        <path d="M40 64 Q50 72 60 64" stroke="#fef08a" strokeWidth="3" fill="none" />
      </svg>
    );
  }

  if (norm.includes("sprint")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <rect x="10" y="10" width="80" height="80" rx="16" fill="#082f49" stroke="#0284c7" strokeWidth="3" />
        {/* S Lightning Bolt */}
        <path d="M68 22 H36 L28 48 H58 L32 78 L74 46 H44 L54 22 Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
      </svg>
    );
  }

  if (norm.includes("nyawit")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <path d="M50 5 L88 20 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V20 Z" fill="#713f12" stroke="#eab308" strokeWidth="4" />
        {/* Golden Eagle Shield */}
        <path d="M50 18 L76 32 V52 C76 68 50 82 50 82 C50 82 24 68 24 52 V32 Z" fill="#a16207" />
        <polygon points="50,26 30,50 44,50 36,70 68,44 54,44 64,26" fill="#fde047" />
      </svg>
    );
  }

  if (norm.includes("iftah")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <path d="M50 5 L88 20 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V20 Z" fill="#2e1065" stroke="#9333ea" strokeWidth="4" />
        {/* Purple Phantom Mask */}
        <path d="M50 18 L76 32 V52 C76 68 50 82 50 82 C50 82 24 68 24 52 V32 Z" fill="#6b21a8" />
        <circle cx="40" cy="46" r="4.5" fill="#38bdf8" />
        <circle cx="60" cy="46" r="4.5" fill="#38bdf8" />
        <path d="M38 64 Q50 74 62 64" stroke="#ffffff" strokeWidth="3" fill="none" />
      </svg>
    );
  }

  // Generic Esports Shield fallback
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
      <path d="M50 5 L88 20 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V20 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="4" />
      <text x="50" y="58" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
        {name.substring(0, 3).toUpperCase()}
      </text>
    </svg>
  );
};

export const CheckmarkBadge = () => (
  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
  </div>
);

export const VsBadge = () => (
  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-sm leading-none">
    VS
  </div>
);

export function FreeFireOfficialBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-4 px-2 sm:px-6">
      
      {/* Top Banner Header with Esports Accents */}
      <div className="relative w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        {/* Left Wing Accent */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-90">
          <div className="w-10 h-3 bg-blue-600 transform -skew-x-12 rounded-xs shadow-xs" />
          <div className="w-5 h-3 bg-amber-400 transform -skew-x-12 rounded-xs shadow-xs" />
        </div>

        {/* Center Title */}
        <div className="flex-1 text-center">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading uppercase">
            BRACKET TURNAMEN
          </h2>
          <div className="text-xl sm:text-2xl font-black italic tracking-wide text-blue-500 uppercase mt-0.5">
            FREE FIRE 4V4
          </div>
        </div>

        {/* Right Wing Accent */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-90">
          <div className="w-5 h-3 bg-amber-400 transform skew-x-12 rounded-xs shadow-xs" />
          <div className="w-10 h-3 bg-blue-600 transform skew-x-12 rounded-xs shadow-xs" />
        </div>
      </div>

      {/* Main Bracket Interactive Grid with SVG Connectors */}
      <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative min-w-[1080px] max-w-6xl mx-auto px-4">
          
          {/* Round Header Labels */}
          <div className="grid grid-cols-5 gap-7 mb-6 text-center">
            
            {/* Round 1 Header */}
            <div>
              <div className="bg-[#0256c4] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">BABAK PENYISIHAN</div>
                <div className="text-[9.5px] font-bold text-blue-100 uppercase">6 PASANGAN</div>
              </div>
            </div>

            {/* Round 2 Header */}
            <div>
              <div className="bg-[#0256c4] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">6 BESAR</div>
                <div className="text-[9.5px] font-bold text-blue-100 uppercase">PEMENANG</div>
              </div>
            </div>

            {/* Round 3 Header */}
            <div>
              <div className="bg-[#0256c4] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">3 BESAR</div>
                <div className="text-[9.5px] font-bold text-blue-100 uppercase">3 PERTANDINGAN</div>
              </div>
            </div>

            {/* Round 4 Header */}
            <div>
              <div className="bg-[#e88909] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">SEMI FINAL</div>
                <div className="text-[9.5px] font-bold text-amber-100 uppercase">2 PERTANDINGAN</div>
              </div>
            </div>

            {/* Round 5 Header */}
            <div>
              <div className="bg-[#dc2626] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">GRAND FINAL</div>
                <div className="text-[9.5px] font-bold text-red-100 uppercase">PERTANDINGAN PUNCAK</div>
              </div>
            </div>

          </div>

          {/* Bracket Canvas Area with Direct Vector Lines */}
          <div className="relative h-[680px]">
            
            {/* SVG Connecting Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* 1. BLUE LINES: Penyisihan -> 6 Besar (M1 to C1, M2 to C2, M3 to C3, M4 to C4, M5 to C5, M6 to C6) */}
              <g stroke="#0256c4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* M1 -> Card 1 */}
                <path d="M 215 42 H 242" />
                {/* M2 -> Card 2 */}
                <path d="M 215 152 H 242" />
                {/* M3 -> Card 3 */}
                <path d="M 215 262 H 242" />
                {/* M4 -> Card 4 */}
                <path d="M 215 372 H 242" />
                {/* M5 -> Card 5 */}
                <path d="M 215 482 H 242" />
                {/* M6 -> Card 6 */}
                <path d="M 215 592 H 242" />
              </g>

              {/* 2. BLUE LINES: 6 Besar -> 3 Besar */}
              <g stroke="#0256c4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* ZIEZAN (Card 1: Y=42) & NYAWIT (Card 6: Y=592) -> M7 (Y=98) */}
                <path d="M 420 42 H 438 V 592 H 420" />
                <path d="M 438 98 H 455" />

                {/* KACUNG PRET (Card 2: Y=152) & FF 3 (Card 4: Y=372) -> M8 (Y=317) */}
                <path d="M 420 152 H 438 V 372 H 420" />
                <path d="M 438 317 H 455" />

                {/* XTC (Card 3: Y=262) & SPRINT (Card 5: Y=482) -> M9 (Y=537) */}
                <path d="M 420 262 H 438 V 482 H 420" />
                <path d="M 438 537 H 455" />
              </g>

              {/* 3. ORANGE LINES: 3 Besar -> Semi Final */}
              <g stroke="#e88909" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* M7 (Y=98) & M9 (Y=537) -> SF1 (Y=207) */}
                <path d="M 635 98 H 652 V 537 H 635" />
                <path d="M 652 207 H 670" />

                {/* M8 (Y=317) -> SF2 (Y=427) */}
                <path d="M 635 317 H 652 V 427 H 670" />
              </g>

              {/* 4. RED LINES: Semi Final -> Grand Final */}
              <g stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* SF1 (Y=207) & SF2 (Y=427) -> GF (Y=317) */}
                <path d="M 850 207 H 868 V 427 H 850" />
                <path d="M 868 317 H 885" />
              </g>

            </svg>

            {/* ========================================================================= */}
            {/* COLUMN 1: BABAK PENYISIHAN (Left: 0px to 215px) */}
            {/* ========================================================================= */}
            <div className="absolute left-0 top-0 w-[215px] space-y-7 z-10">
              
              {/* M1: ZIEZAN vs BYE */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M1
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="ZIEZAN" size={22} />
                      <span>ZIEZAN</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-400 text-xs">
                      <TeamLogo name="BYE" size={18} />
                      <span>BYE</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M2: KACUNG PRET vs IHAB */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M2
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="KACUNG PRET" size={22} />
                      <span>KACUNG PRET</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="IHAB" size={22} />
                      <span>IHAB</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M3: XTC vs DESTA */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M3
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="XTC" size={22} />
                      <span>XTC</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="DESTA" size={22} />
                      <span>DESTA</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M4: FF 3 vs KANCIL JAMSHOT */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M4
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="FF 3" size={22} />
                      <span>FF 3</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="KANCIL JAMSHOT" size={22} />
                      <span className="text-[11px]">KANCIL JAMSHOT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M5: LEO KACUNG vs SPRINT */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M5
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="LEO KACUNG" size={22} />
                      <span>LEO KACUNG</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="SPRINT" size={22} />
                      <span>SPRINT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M6: NYAWIT vs IFTAH */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M6
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="NYAWIT" size={22} />
                      <span>NYAWIT</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="IFTAH" size={22} />
                      <span>IFTAH</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 2: 6 BESAR (Left: 242px to 420px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[242px] top-0 w-[178px] space-y-[42px] z-10">
              
              {/* Card 1: ZIEZAN */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2 h-[56px]">
                <div className="flex items-center gap-2">
                  <TeamLogo name="ZIEZAN" size={28} />
                  <div>
                    <div className="font-black text-slate-900 text-xs leading-none">ZIEZAN</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">PEMENANG M1</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 2: KACUNG PRET */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2 h-[56px]">
                <div className="flex items-center gap-2">
                  <TeamLogo name="KACUNG PRET" size={28} />
                  <div>
                    <div className="font-black text-slate-900 text-xs leading-none">KACUNG PRET</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">PEMENANG M2</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 3: XTC */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2 h-[56px]">
                <div className="flex items-center gap-2">
                  <TeamLogo name="XTC" size={28} />
                  <div>
                    <div className="font-black text-slate-900 text-xs leading-none">XTC</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">PEMENANG M3</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 4: FF 3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2 h-[56px]">
                <div className="flex items-center gap-2">
                  <TeamLogo name="FF 3" size={28} />
                  <div>
                    <div className="font-black text-slate-900 text-xs leading-none">FF 3</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">PEMENANG M4</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 5: SPRINT */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2 h-[56px]">
                <div className="flex items-center gap-2">
                  <TeamLogo name="SPRINT" size={28} />
                  <div>
                    <div className="font-black text-slate-900 text-xs leading-none">SPRINT</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">PEMENANG M5</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Card 6: NYAWIT */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2 h-[56px]">
                <div className="flex items-center gap-2">
                  <TeamLogo name="NYAWIT" size={28} />
                  <div>
                    <div className="font-black text-slate-900 text-xs leading-none">NYAWIT</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">PEMENANG M6</div>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 3: 3 BESAR (Left: 455px to 635px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[455px] top-0 w-[180px] z-10">
              
              {/* M7: ZIEZAN vs NYAWIT (Y=98) */}
              <div className="absolute top-[52px] w-full flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M7
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="ZIEZAN" size={22} />
                      <span>ZIEZAN</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="NYAWIT" size={22} />
                      <span>NYAWIT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M8: KACUNG PRET vs FF 3 (Y=317) */}
              <div className="absolute top-[271px] w-full flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M8
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="KACUNG PRET" size={22} />
                      <span>KACUNG PRET</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="FF 3" size={22} />
                      <span>FF 3</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* M9: XTC vs SPRINT (Y=537) */}
              <div className="absolute top-[491px] w-full flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0256c4] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  M9
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-sm p-2 flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="XTC" size={22} />
                      <span>XTC</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs tracking-tight">
                      <TeamLogo name="SPRINT" size={22} />
                      <span>SPRINT</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 4: SEMI FINAL (Left: 670px to 850px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[670px] top-0 w-[180px] z-10">
              
              {/* SF1: ZIEZAN vs XTC (DISKUALIFIKASI) (Y=207) */}
              <div className="absolute top-[160px] w-full">
                <div className="w-7 h-7 rounded-lg bg-[#e88909] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                  SF1
                </div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="ZIEZAN" size={24} />
                      <span>ZIEZAN</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                        <TeamLogo name="XTC" size={24} />
                        <span>XTC</span>
                      </div>
                      <div className="text-[8.5px] font-bold text-red-600 uppercase tracking-tight pl-7">
                        (DISKUALIFIKASI)
                      </div>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

              {/* SF2: KACUNG PRET vs BYE (Y=427) */}
              <div className="absolute top-[380px] w-full">
                <div className="w-7 h-7 rounded-lg bg-[#e88909] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                  SF2
                </div>
                <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-sm p-2.5 flex items-center justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
                      <TeamLogo name="KACUNG PRET" size={24} />
                      <span>KACUNG PRET</span>
                    </div>
                    <div className="flex justify-center -my-1">
                      <VsBadge />
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-400 text-xs pl-0.5">
                      <TeamLogo name="BYE" size={20} />
                      <span>BYE</span>
                    </div>
                  </div>
                  <CheckmarkBadge />
                </div>
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 5: GRAND FINAL & TROPHY (Left: 885px) */}
            {/* ========================================================================= */}
            <div className="absolute left-[885px] top-[190px] w-[180px] z-10 flex flex-col items-center">
              
              {/* GF Badge */}
              <div className="self-start w-7 h-7 rounded-lg bg-[#dc2626] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                GF
              </div>

              {/* Grand Final Box with Red Border */}
              <div className="w-full bg-white rounded-2xl border-2 border-red-500 shadow-md p-3 flex items-center justify-between gap-2">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <TeamLogo name="ZIEZAN" size={28} />
                    <span>ZIEZAN</span>
                  </div>
                  <div className="flex justify-center -my-0.5">
                    <VsBadge />
                  </div>
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <TeamLogo name="KACUNG PRET" size={28} />
                    <span>KACUNG PRET</span>
                  </div>
                </div>
                <CheckmarkBadge />
              </div>

              {/* Champion Trophy Graphic & Ribbon */}
              <div className="mt-5 flex flex-col items-center">
                {/* Golden Trophy with Laurel Wreath */}
                <div className="relative flex items-center justify-center w-24 h-24">
                  {/* Laurels */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 drop-shadow-xs">
                    {/* Left Laurel Leaves */}
                    <path d="M22 68 C15 50 18 30 35 15 C28 28 26 48 34 60" fill="none" stroke="#d97706" strokeWidth="3" />
                    <circle cx="20" cy="55" r="3.5" fill="#f59e0b" />
                    <circle cx="18" cy="40" r="3.5" fill="#f59e0b" />
                    <circle cx="22" cy="28" r="3.5" fill="#f59e0b" />
                    <circle cx="32" cy="18" r="3.5" fill="#f59e0b" />
                    {/* Right Laurel Leaves */}
                    <path d="M78 68 C85 50 82 30 65 15 C72 28 74 48 66 60" fill="none" stroke="#d97706" strokeWidth="3" />
                    <circle cx="80" cy="55" r="3.5" fill="#f59e0b" />
                    <circle cx="82" cy="40" r="3.5" fill="#f59e0b" />
                    <circle cx="78" cy="28" r="3.5" fill="#f59e0b" />
                    <circle cx="68" cy="18" r="3.5" fill="#f59e0b" />
                  </svg>
                  {/* Golden Trophy Cup */}
                  <Trophy className="w-14 h-14 text-amber-500 drop-shadow-md relative z-10" />
                </div>

                {/* Ribbon Banner CHAMPION */}
                <div className="relative -mt-2 bg-[#dc2626] text-white font-black text-xs tracking-widest uppercase px-5 py-1 rounded-sm shadow-md flex items-center justify-center">
                  <div className="absolute -left-2 top-0 bottom-0 w-2 bg-[#991b1b] transform -skew-y-12 rounded-l-xs" />
                  <span>CHAMPION</span>
                  <div className="absolute -right-2 top-0 bottom-0 w-2 bg-[#991b1b] transform skew-y-12 rounded-r-xs" />
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* FOOTER SECTION: KETERANGAN, LEGENDA, KODE & BOTTOM BAR */}
          {/* ========================================================================= */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. KETERANGAN Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-black text-blue-900 tracking-wider uppercase text-[11px]">KETERANGAN</div>
                <div className="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Sistem : <b>Single Elimination</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Semua Pertandingan : <b>Best Of 3 (BO3)</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Semi Final & Final : <b>Best Of 3 (BO3)</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Jika seri 1-1, pertandingan ke-3 menentukan pemenang</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LEGENDA Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2 text-xs">
              <div className="font-black text-blue-900 tracking-wider uppercase text-[11px]">LEGENDA</div>
              <div className="space-y-2 pt-1 text-[11.5px] font-semibold text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-[#0256c4] rounded-full" />
                  <span>Babak Penyisihan ke 6 Besar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-[#0256c4] rounded-full" />
                  <span>6 Besar ke 3 Besar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-[#e88909] rounded-full" />
                  <span>3 Besar ke Semi Final</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-[#dc2626] rounded-full" />
                  <span>Semi Final ke Grand Final</span>
                </div>
              </div>
            </div>

            {/* 3. KODE Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2 text-xs">
              <div className="font-black text-blue-900 tracking-wider uppercase text-[11px]">KODE</div>
              <div className="space-y-2 pt-1 text-[11.5px] font-semibold text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 w-8">M</span>
                  <span>= Match / Pertandingan</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 w-8">BYE</span>
                  <span>= Langsung Lolos</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 w-8">DQ</span>
                  <span>= Diskualifikasi</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Blue Angled Banner Bar */}
          <div className="mt-5 relative w-full flex items-center justify-center bg-[#0256c4] text-white py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase shadow-md overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center z-10">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>JUNJUNG TINGGI SPORTIVITAS!</span>
              </div>
              <span className="opacity-50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" />
                <span>BERMAIN ADIL, MENANG TERHORMAT!</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
