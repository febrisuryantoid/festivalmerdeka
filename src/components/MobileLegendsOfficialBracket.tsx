import React from "react";
import { FileText, Star, Shield } from "lucide-react";

// Team Logos specifically designed for MLBB Tournament
export const MlbbTeamLogo = ({ name, size = 28 }: { name: string; size?: number }) => {
  const norm = (name || "").toLowerCase().trim();

  // Placeholder shield for TBD matches in Semi Final and Grand Final
  if (!name || norm === "" || norm.includes("tbd") || norm.includes("placeholder")) {
    return (
      <div 
        style={{ width: size, height: size * 1.15 }} 
        className="rounded-md bg-slate-300/80 flex items-center justify-center shrink-0 shadow-xs"
      >
        <Shield className="w-4 h-4 text-slate-400 fill-slate-400" />
      </div>
    );
  }

  // 1. BEE3SKA
  if (norm.includes("bee3ska") || norm.includes("bee")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="bee_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>
        <polygon points="50,5 88,25 88,75 50,95 12,75 12,25" fill="#1c1917" stroke="#eab308" strokeWidth="4" />
        {/* Hornet / Wasp head & stripes */}
        <polygon points="50,20 75,35 68,55 50,48 32,55 25,35" fill="url(#bee_grad)" />
        {/* Black Hornet Eyes */}
        <ellipse cx="40" cy="38" rx="5" ry="8" fill="#0c0a09" transform="rotate(-15 40 38)" />
        <ellipse cx="60" cy="38" rx="5" ry="8" fill="#0c0a09" transform="rotate(15 60 38)" />
        {/* Antennae */}
        <path d="M42 22 Q30 10 24 14" stroke="#fde047" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M58 22 Q70 10 76 14" stroke="#fde047" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Bottom BEE3SKA text badge */}
        <rect x="18" y="65" width="64" height="15" rx="3" fill="#eab308" />
        <text x="50" y="76" fill="#000000" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">BEE3SKA</text>
      </svg>
    );
  }

  // 2. KACUNG PRET
  if (norm.includes("kacung")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="kacung_ml_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
        </defs>
        <path d="M50 5 L90 22 V50 C90 75 50 95 50 95 C50 95 10 75 10 50 V22 Z" fill="url(#kacung_ml_grad)" stroke="#ef4444" strokeWidth="4" />
        {/* Red Demon Horns */}
        <path d="M25 25 Q15 8 30 14 Q32 25 35 32 Z" fill="#f87171" />
        <path d="M75 25 Q85 8 70 14 Q68 25 65 32 Z" fill="#f87171" />
        <circle cx="38" cy="48" r="5" fill="#fef08a" />
        <circle cx="62" cy="48" r="5" fill="#fef08a" />
        <path d="M35 62 Q50 78 65 62 Q50 68 35 62 Z" fill="#ffffff" />
      </svg>
    );
  }

  // 3. ZIEZAN
  if (norm.includes("ziezan") || norm.includes("ziezam")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="ziezan_ml_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path d="M50 5 L88 20 V52 C88 75 50 95 50 95 C50 95 12 75 12 52 V20 Z" fill="url(#ziezan_ml_grad)" stroke="#38bdf8" strokeWidth="4" />
        <path d="M50 15 L78 27 V50 C78 68 50 84 50 84 C50 84 22 68 22 50 V27 Z" fill="#0369a1" />
        <path d="M42 30 H58 V48 H52 V64 H48 V48 H42 Z" fill="#ffffff" />
        <path d="M32 38 H68 V45 H32 Z" fill="#38bdf8" />
        <circle cx="50" cy="38" r="4" fill="#facc15" />
        <rect x="26" y="20" width="48" height="9" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        <text x="50" y="27" fill="#ffffff" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">ZIEZAN</text>
      </svg>
    );
  }

  // 4. BKR
  if (norm.includes("bkr")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="bkr_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>
        <path d="M50 5 L88 22 V52 C88 75 50 95 50 95 C50 95 12 75 12 52 V22 Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="4" />
        <path d="M50 16 L76 30 V50 C76 66 50 82 50 82 C50 82 24 66 24 50 V30 Z" fill="url(#bkr_grad)" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="50" y="58" fill="#ffffff" fontSize="19" fontWeight="900" textAnchor="middle" letterSpacing="1" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }}>
          BKR
        </text>
      </svg>
    );
  }

  // 5. HARIMAU GOLD LINE
  if (norm.includes("harimau") || norm.includes("tiger")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <circle cx="50" cy="50" r="44" fill="#0f172a" stroke="#f59e0b" strokeWidth="4" />
        {/* Tiger Head */}
        <path d="M22 30 Q12 12 30 18 Q36 28 40 32 Z" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
        <path d="M78 30 Q88 12 70 18 Q64 28 60 32 Z" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="50" cy="54" r="30" fill="#f59e0b" />
        {/* Tiger Stripes */}
        <polygon points="50,30 46,42 54,42" fill="#0f172a" />
        <polygon points="34,44 42,46 36,52" fill="#0f172a" />
        <polygon points="66,44 58,46 64,52" fill="#0f172a" />
        {/* Eyes & Snout */}
        <ellipse cx="40" cy="52" rx="4" ry="3" fill="#ffffff" />
        <circle cx="40" cy="52" r="2" fill="#000000" />
        <ellipse cx="60" cy="52" rx="4" ry="3" fill="#ffffff" />
        <circle cx="60" cy="52" r="2" fill="#000000" />
        <polygon points="50,62 44,56 56,56" fill="#451a03" />
        <path d="M42 68 Q50 74 58 68" stroke="#ffffff" strokeWidth="2.5" fill="none" />
      </svg>
    );
  }

  // 6. PATAH HATI
  if (norm.includes("patah") || norm.includes("hati") || norm.includes("heart")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="heart_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>
        {/* Left half with crack */}
        <path 
          d="M48 24 C36 10 16 18 16 36 C16 56 36 72 48 84 L46 62 L52 50 L44 38 L48 24 Z" 
          fill="url(#heart_grad)" 
          stroke="#450a0a" 
          strokeWidth="2"
        />
        {/* Right half with matching crack offset */}
        <path 
          d="M52 24 C64 10 84 18 84 36 C84 56 64 72 52 84 L50 62 L56 50 L48 38 L52 24 Z" 
          fill="url(#heart_grad)" 
          stroke="#450a0a" 
          strokeWidth="2"
        />
        {/* White Crack Zigzag Highlight */}
        <path d="M48 22 L44 38 L54 50 L46 62 L50 84" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. DENSUS
  if (norm.includes("densus")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <path d="M50 5 L88 22 V52 C88 75 50 95 50 95 C50 95 12 75 12 52 V22 Z" fill="#0f172a" stroke="#64748b" strokeWidth="4" />
        {/* Tactical SWAT Skull Helmet */}
        <path d="M30 32 H70 V52 C70 64 50 74 50 74 C50 74 30 64 30 52 Z" fill="#1e293b" />
        {/* Visor */}
        <rect x="34" y="38" width="32" height="10" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Gas Mask Filters */}
        <circle cx="40" cy="58" r="5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="60" cy="58" r="5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
        <text x="50" y="86" fill="#94a3b8" fontSize="7.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">DENSUS</text>
      </svg>
    );
  }

  // 8. O2
  if (norm.includes("o2") || norm.includes("02")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id="o2_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="url(#o2_grad)" stroke="#ffffff" strokeWidth="4" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="6 3" />
        <text x="44" y="61" fill="#ffffff" fontSize="32" fontWeight="900" textAnchor="middle">O</text>
        <text x="66" y="66" fill="#ffffff" fontSize="20" fontWeight="900" textAnchor="middle">2</text>
      </svg>
    );
  }

  // Generic Esports Shield
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
      <path d="M50 5 L88 20 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V20 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="4" />
      <text x="50" y="58" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
        {name.substring(0, 3).toUpperCase()}
      </text>
    </svg>
  );
};

export const MlbbVsBadge = () => (
  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-sm leading-none z-10">
    VS
  </div>
);

export function MobileLegendsOfficialBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-4 px-2 sm:px-6">
      
      {/* Top Banner Header with Esports Accents */}
      <div className="relative w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        
        {/* Left Wing Accent */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-90">
          <div className="w-12 h-3.5 bg-[#0047ba] transform -skew-x-12 rounded-xs shadow-xs" />
          <div className="w-6 h-3.5 bg-[#d9980d] transform -skew-x-12 rounded-xs shadow-xs" />
        </div>

        {/* Center Title */}
        <div className="flex-1 text-center">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading uppercase">
            BRACKET TURNAMEN
          </h2>
          <div className="text-2xl sm:text-4xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-sky-400 uppercase mt-0.5">
            MOBILE LEGENDS
          </div>
          <div className="inline-block mt-2 bg-[#003b95] text-white text-[11px] font-black tracking-widest px-5 py-1 rounded-sm uppercase shadow-sm">
            8 TEAM — SINGLE ELIMINATION
          </div>
        </div>

        {/* Right Official MLBB Logo Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width={36} height={36} viewBox="0 0 100 100" className="drop-shadow-sm">
              <path d="M15 20 L50 5 L85 20 L85 55 L50 95 L15 55 Z" fill="#0f172a" stroke="#d9980d" strokeWidth="4" />
              <path d="M30 35 L50 20 L70 35 L62 65 L50 78 L38 65 Z" fill="#0047ba" />
              <text x="50" y="58" fill="#ffffff" fontSize="24" fontWeight="900" textAnchor="middle">M</text>
            </svg>
            <div className="text-left leading-tight">
              <div className="text-xs font-black text-slate-900 tracking-wider">MOBILE</div>
              <div className="text-[10px] font-black text-[#0047ba] tracking-widest">LEGENDS</div>
              <div className="text-[7px] font-bold text-slate-500 tracking-widest">BANG BANG</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 opacity-90 ml-2">
            <div className="w-6 h-3.5 bg-[#d9980d] transform skew-x-12 rounded-xs shadow-xs" />
            <div className="w-12 h-3.5 bg-[#0047ba] transform skew-x-12 rounded-xs shadow-xs" />
          </div>
        </div>
      </div>

      {/* Main Bracket Interactive Grid with SVG Connectors */}
      <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative min-w-[1040px] max-w-6xl mx-auto px-4">
          
          {/* Round Header Labels */}
          <div className="grid grid-cols-4 gap-8 mb-6 text-center">
            
            {/* Round 1 Header */}
            <div>
              <div className="bg-[#003b95] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">PEREMPAT FINAL</div>
                <div className="text-[9.5px] font-bold text-blue-100 uppercase">8 TEAM</div>
              </div>
            </div>

            {/* Round 2 Header */}
            <div>
              <div className="bg-[#003b95] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">SEMI FINAL</div>
                <div className="text-[9.5px] font-bold text-blue-100 uppercase">4 TEAM</div>
              </div>
            </div>

            {/* Round 3 Header */}
            <div>
              <div className="bg-[#003b95] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">GRAND FINAL</div>
                <div className="text-[9.5px] font-bold text-blue-100 uppercase">2 TEAM</div>
              </div>
            </div>

            {/* Champion Header */}
            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-widest uppercase">CHAMPION</div>
              </div>
            </div>

          </div>

          {/* Bracket Canvas Area with Vector Lines */}
          <div className="relative h-[600px]">
            
            {/* SVG Connecting Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* Blue Bracket Lines */}
              <g stroke="#003b95" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                
                {/* 1. QF1 (Y=52) & QF2 (Y=182) -> SF1 (Y=117) */}
                <path d="M 235 52 H 255 V 182 H 235" />
                <path d="M 255 117 H 290" />

                {/* 2. QF3 (Y=332) & QF4 (Y=462) -> SF2 (Y=397) */}
                <path d="M 235 332 H 255 V 462 H 235" />
                <path d="M 255 397 H 290" />

                {/* 3. SF1 (Y=117) & SF2 (Y=397) -> GF (Y=257) */}
                <path d="M 495 117 H 530 V 397 H 495" />
                <path d="M 530 257 H 565" />

                {/* 4. GF (Y=257) -> Champion Trophy (Y=257) */}
                <path d="M 770 257 H 810" />

              </g>

            </svg>

            {/* ========================================================================= */}
            {/* COLUMN 1: PEREMPAT FINAL (8 TEAM) - Left: 0px to 235px */}
            {/* ========================================================================= */}
            <div className="absolute left-0 top-0 w-[235px] space-y-[42px] z-10">
              
              {/* QF1: BEE3SKA vs KACUNG PRET (Y=52) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  QF1
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[84px]">
                  {/* Team 1 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <MlbbTeamLogo name="BEE3SKA" size={26} />
                    <span>BEE3SKA</span>
                  </div>
                  
                  {/* VS Badge with line */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <MlbbTeamLogo name="KACUNG PRET" size={26} />
                    <span>KACUNG PRET</span>
                  </div>
                </div>
              </div>

              {/* QF2: ZIEZAN vs BKR (Y=182) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  QF2
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[84px]">
                  {/* Team 1 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <MlbbTeamLogo name="ZIEZAN" size={26} />
                    <span>ZIEZAN</span>
                  </div>
                  
                  {/* VS Badge with line */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <MlbbTeamLogo name="BKR" size={26} />
                    <span>BKR</span>
                  </div>
                </div>
              </div>

              {/* QF3: HARIMAU GOLD LINE vs PATAH HATI (Y=332) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  QF3
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[84px]">
                  {/* Team 1 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-[11px] tracking-tight">
                    <MlbbTeamLogo name="HARIMAU GOLD LINE" size={26} />
                    <span className="truncate">HARIMAU GOLD LINE</span>
                  </div>
                  
                  {/* VS Badge with line */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <MlbbTeamLogo name="PATAH HATI" size={26} />
                    <span>PATAH HATI</span>
                  </div>
                </div>
              </div>

              {/* QF4: DENSUS vs O2 (Y=462) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  QF4
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[84px]">
                  {/* Team 1 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <MlbbTeamLogo name="DENSUS" size={26} />
                    <span>DENSUS</span>
                  </div>
                  
                  {/* VS Badge with line */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-tight">
                    <MlbbTeamLogo name="O2" size={26} />
                    <span>O2</span>
                  </div>
                </div>
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 2: SEMI FINAL (4 TEAM) - Left: 290px to 495px */}
            {/* ========================================================================= */}
            <div className="absolute left-[290px] top-0 w-[205px] z-10">
              
              {/* SF1 Box (Y=117) */}
              <div className="absolute top-[68px] w-full">
                <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                  SF1
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 relative flex flex-col justify-between h-[96px]">
                  {/* Team 1 Placeholder */}
                  <div className="flex items-center gap-3">
                    <MlbbTeamLogo name="" size={28} />
                    <span className="font-mono font-bold text-slate-400 text-sm tracking-widest">.....</span>
                  </div>

                  {/* VS Badge */}
                  <div className="relative flex items-center justify-center my-1">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>

                  {/* Team 2 Placeholder */}
                  <div className="flex items-center gap-3">
                    <MlbbTeamLogo name="" size={28} />
                    <span className="font-mono font-bold text-slate-400 text-sm tracking-widest">.....</span>
                  </div>
                </div>
              </div>

              {/* SF2 Box (Y=397) */}
              <div className="absolute top-[348px] w-full">
                <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                  SF2
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 relative flex flex-col justify-between h-[96px]">
                  {/* Team 1 Placeholder */}
                  <div className="flex items-center gap-3">
                    <MlbbTeamLogo name="" size={28} />
                    <span className="font-mono font-bold text-slate-400 text-sm tracking-widest">.....</span>
                  </div>

                  {/* VS Badge */}
                  <div className="relative flex items-center justify-center my-1">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <MlbbVsBadge />
                  </div>

                  {/* Team 2 Placeholder */}
                  <div className="flex items-center gap-3">
                    <MlbbTeamLogo name="" size={28} />
                    <span className="font-mono font-bold text-slate-400 text-sm tracking-widest">.....</span>
                  </div>
                </div>
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 3: GRAND FINAL (2 TEAM) - Left: 565px to 770px */}
            {/* ========================================================================= */}
            <div className="absolute left-[565px] top-[208px] w-[205px] z-10">
              
              {/* GF Badge */}
              <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                GF
              </div>

              {/* Grand Final Card */}
              <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 relative flex flex-col justify-between h-[96px]">
                {/* Team 1 Placeholder */}
                <div className="flex items-center gap-3">
                  <MlbbTeamLogo name="" size={28} />
                  <span className="font-mono font-bold text-slate-400 text-sm tracking-widest">.....</span>
                </div>

                {/* VS Badge */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="absolute left-0 right-0 h-px bg-slate-100" />
                  <MlbbVsBadge />
                </div>

                {/* Team 2 Placeholder */}
                <div className="flex items-center gap-3">
                  <MlbbTeamLogo name="" size={28} />
                  <span className="font-mono font-bold text-slate-400 text-sm tracking-widest">.....</span>
                </div>
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 4: CHAMPION TROPHY CARD - Left: 810px */}
            {/* ========================================================================= */}
            <div className="absolute left-[810px] top-[75px] w-[220px] z-10">
              
              {/* Golden Trophy Presentation Card */}
              <div className="w-full bg-amber-50/40 rounded-3xl border border-amber-300/80 shadow-md p-5 flex flex-col items-center justify-center relative overflow-hidden">
                
                {/* Background Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

                {/* Golden Trophy with Laurel Wreath */}
                <div className="relative flex items-center justify-center w-36 h-36 my-2">
                  {/* Laurels Graphic */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 drop-shadow-xs">
                    {/* Left Laurel Leaves */}
                    <path d="M22 72 C12 50 16 28 35 12 C26 28 24 48 32 64" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="18" cy="58" r="4" fill="#f59e0b" />
                    <circle cx="16" cy="42" r="4" fill="#f59e0b" />
                    <circle cx="20" cy="28" r="4" fill="#f59e0b" />
                    <circle cx="30" cy="16" r="4" fill="#f59e0b" />
                    {/* Right Laurel Leaves */}
                    <path d="M78 72 C88 50 84 28 65 12 C74 28 76 48 68 64" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="82" cy="58" r="4" fill="#f59e0b" />
                    <circle cx="84" cy="42" r="4" fill="#f59e0b" />
                    <circle cx="80" cy="28" r="4" fill="#f59e0b" />
                    <circle cx="70" cy="16" r="4" fill="#f59e0b" />
                  </svg>

                  {/* 3D ML Golden Trophy SVG */}
                  <svg viewBox="0 0 120 120" className="w-28 h-28 relative z-10 drop-shadow-lg">
                    <defs>
                      <linearGradient id="trophy_gold_cup" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="35%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                      <linearGradient id="trophy_base" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>
                    {/* Cup Handles */}
                    <path d="M30 35 C15 35 15 65 35 70" fill="none" stroke="url(#trophy_gold_cup)" strokeWidth="6" strokeLinecap="round" />
                    <path d="M90 35 C105 35 105 65 85 70" fill="none" stroke="url(#trophy_gold_cup)" strokeWidth="6" strokeLinecap="round" />
                    {/* Main Cup Body */}
                    <path d="M32 25 H88 V55 C88 75 60 85 60 85 C60 85 32 75 32 55 Z" fill="url(#trophy_gold_cup)" stroke="#fbbf24" strokeWidth="2" />
                    {/* ML Engraved Emblem in Center */}
                    <polygon points="60,40 74,48 74,64 60,72 46,64 46,48" fill="#78350f" stroke="#fef08a" strokeWidth="1.5" />
                    <text x="60" y="60" fill="#fef08a" fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="0.5">ML</text>
                    {/* Stem */}
                    <rect x="54" y="84" width="12" height="14" fill="url(#trophy_gold_cup)" />
                    {/* Pedestal Stand */}
                    <path d="M40 98 H80 L86 112 H34 Z" fill="url(#trophy_base)" stroke="#f59e0b" strokeWidth="1.5" />
                    <rect x="42" y="102" width="36" height="6" rx="1" fill="#fef08a" />
                  </svg>
                </div>

                {/* Champion Banner Placeholder Bar */}
                <div className="w-full mt-4 bg-white border border-amber-300/80 rounded-xl py-2 px-3 shadow-inner flex items-center justify-center">
                  <span className="text-xs font-mono font-black tracking-widest text-slate-400 uppercase">.....</span>
                </div>

              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* FOOTER SECTION: KETERANGAN, LEGENDA, CATATAN & BOTTOM BAR */}
          {/* ========================================================================= */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. KETERANGAN Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#003b95] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-black text-[#003b95] tracking-wider uppercase text-[11px]">KETERANGAN</div>
                <div className="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#003b95] font-bold">•</span>
                    <span>Sistem : <b>Single Elimination</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#003b95] font-bold">•</span>
                    <span>Semua pertandingan : <b>Best Of 3 (BO3)</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#003b95] font-bold">•</span>
                    <span>Semi Final & Final : <b>Best Of 5 (BO5)</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#003b95] font-bold">•</span>
                    <span>Jika seri 1-1, pertandingan ke-3 menentukan pemenang</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LEGENDA Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2 text-xs">
              <div className="font-black text-[#003b95] tracking-wider uppercase text-[11px]">LEGENDA</div>
              <div className="space-y-2 pt-1 text-[11.5px] font-semibold text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 rounded bg-[#003b95] text-white text-[9px] font-black flex items-center justify-center">QF</span>
                  <span className="font-bold text-slate-900 w-6">QF</span>
                  <span>= Perempat Final</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 rounded bg-[#003b95] text-white text-[9px] font-black flex items-center justify-center">SF</span>
                  <span className="font-bold text-slate-900 w-6">SF</span>
                  <span>= Semi Final</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-7 h-5 rounded bg-[#003b95] text-white text-[9px] font-black flex items-center justify-center">GF</span>
                  <span className="font-bold text-slate-900 w-6">GF</span>
                  <span>= Grand Final</span>
                </div>
              </div>
            </div>

            {/* 3. CATATAN Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#003b95] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Star className="w-4 h-4 fill-white" />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="font-black text-[#003b95] tracking-wider uppercase text-[11px]">CATATAN</div>
                <div className="text-slate-700 text-[11.5px] leading-relaxed font-medium">
                  <div>Junjung sportivitas,</div>
                  <div>bermain adil, menang terhormat!</div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Blue Angled Banner Bar */}
          <div className="mt-5 relative w-full flex items-center justify-center bg-[#003b95] text-white py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase shadow-md overflow-hidden">
            <div className="flex items-center justify-center gap-3 text-center z-10">
              <Shield className="w-4 h-4 text-amber-300" />
              <span>PLAY TO WIN, RESPECT TOGETHER!</span>
              <Shield className="w-4 h-4 text-amber-300" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
