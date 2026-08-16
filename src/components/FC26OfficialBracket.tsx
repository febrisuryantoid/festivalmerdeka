import React from "react";
import { FileText, Award, Shield, Banknote } from "lucide-react";

// Soccer Ball & Gamepad Shield Logos for FC26 Players
export const Fc26PlayerLogo = ({ type, color, size = 32 }: { type: "ball" | "pad" | "placeholder"; color?: "green" | "red" | "blue" | "purple"; size?: number }) => {
  if (type === "placeholder") {
    return (
      <div 
        style={{ width: size, height: size * 1.15 }} 
        className="rounded-md bg-slate-300/90 flex items-center justify-center shrink-0 shadow-xs"
      >
        <Shield className="w-5 h-5 text-slate-400 fill-slate-400" />
      </div>
    );
  }

  // Border colors
  const strokeColor = 
    color === "green" ? "#22c55e" : 
    color === "red" ? "#ef4444" : 
    color === "blue" ? "#0ea5e9" : 
    "#a855f7";

  const glowColor = 
    color === "green" ? "rgba(34, 197, 94, 0.4)" : 
    color === "red" ? "rgba(239, 68, 68, 0.4)" : 
    color === "blue" ? "rgba(14, 165, 233, 0.4)" : 
    "rgba(168, 85, 247, 0.4)";

  if (type === "ball") {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 100 115" className="shrink-0 drop-shadow-sm">
        {/* Outer Shield */}
        <path 
          d="M50 5 L88 20 V60 C88 85 50 110 50 110 C50 110 12 85 12 60 V20 Z" 
          fill="#090d16" 
          stroke={strokeColor} 
          strokeWidth="6" 
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
        {/* Inner Football */}
        <circle cx="50" cy="52" r="26" fill="#ffffff" stroke="#000000" strokeWidth="2" />
        {/* Soccer Pentagons & Seams */}
        <polygon points="50,42 60,49 56,61 44,61 40,49" fill="#000000" />
        <path d="M50 42 L50 26" stroke="#000000" strokeWidth="2" />
        <path d="M60 49 L74 44" stroke="#000000" strokeWidth="2" />
        <path d="M56 61 L68 72" stroke="#000000" strokeWidth="2" />
        <path d="M44 61 L32 72" stroke="#000000" strokeWidth="2" />
        <path d="M40 49 L26 44" stroke="#000000" strokeWidth="2" />
        <polygon points="50,26 40,29 36,26" fill="#000000" />
        <polygon points="74,44 76,55 72,58" fill="#000000" />
        <polygon points="26,44 24,55 28,58" fill="#000000" />
        <polygon points="68,72 58,78 52,78" fill="#000000" />
        <polygon points="32,72 42,78 48,78" fill="#000000" />
      </svg>
    );
  }

  // Gamepad / Controller Shield
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" className="shrink-0 drop-shadow-sm">
      {/* Outer Shield */}
      <path 
        d="M50 5 L88 20 V60 C88 85 50 110 50 110 C50 110 12 85 12 60 V20 Z" 
        fill="#090d16" 
        stroke={strokeColor} 
        strokeWidth="6" 
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      />
      {/* Gamepad Controller Vector */}
      <path 
        d="M32 40 C24 40 20 48 24 64 C26 72 32 72 38 66 L44 60 H56 L62 66 C68 72 74 72 76 64 C80 48 76 40 68 40 Z" 
        fill="#ffffff" 
        stroke="#0f172a" 
        strokeWidth="2" 
      />
      {/* D-pad Cross */}
      <path d="M32 46 V56 M27 51 H37" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Action Buttons */}
      <circle cx="64" cy="48" r="2" fill="#ef4444" />
      <circle cx="68" cy="52" r="2" fill="#22c55e" />
      <circle cx="60" cy="52" r="2" fill="#3b82f6" />
      <circle cx="64" cy="56" r="2" fill="#facc15" />
      {/* Center detail */}
      <rect x="46" y="49" width="8" height="4" rx="2" fill="#0f172a" />
    </svg>
  );
};

export const Fc26VsBadge = ({ variant = "navy" }: { variant?: "navy" | "green" }) => (
  <div className={`w-5 h-5 rounded-full ${variant === "green" ? "bg-[#15803d]" : "bg-[#0b2447]"} flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-sm leading-none z-10`}>
    VS
  </div>
);

export function FC26OfficialBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-4 px-2 sm:px-6">
      
      {/* ========================================================================= */}
      {/* TOP HEADER: PS4 LOGO, TITLE, FC26 LOGO & ACCENTS */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        
        {/* Left Official PS4 Branding */}
        <div className="flex items-center gap-2">
          {/* PS Family Logo */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900 fill-current">
            <path d="M42 12 C44 10 47 10 48 12 L70 54 C72 58 68 62 63 62 H54 V88 C54 92 50 95 46 95 C42 95 38 92 38 88 V20 C38 15 39 13 42 12 Z" />
            <path d="M22 68 C16 70 12 75 14 80 C16 85 24 88 34 88 C44 88 54 85 54 80 C54 75 48 71 42 69 L54 62 C62 60 76 60 84 66 C92 72 90 82 78 88 C66 94 48 96 32 94 C14 92 2 84 2 74 C2 65 12 60 22 58 Z" />
          </svg>
          <span className="text-xl sm:text-3xl font-black italic tracking-tighter text-slate-900 font-sans">
            PS4<span className="text-xs font-normal not-italic align-top ml-0.5">®</span>
          </span>
        </div>

        {/* Center Main Title with Green Geometric Slash Accents */}
        <div className="flex-1 text-center px-2">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading uppercase">
            BRACKET TURNAMEN
          </h2>
          
          {/* PS4 FC26 Title with Slashes */}
          <div className="flex items-center justify-center gap-2 mt-0.5">
            {/* Green Slashes Left */}
            <div className="flex items-center gap-1 opacity-90">
              <div className="w-2.5 h-6 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
              <div className="w-2.5 h-6 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
            </div>

            <div className="text-2xl sm:text-4xl font-black italic tracking-wide uppercase">
              <span className="text-[#0b2447]">PS4 </span>
              <span className="text-[#16a34a]">FC26</span>
            </div>

            {/* Green Slashes Right */}
            <div className="flex items-center gap-1 opacity-90">
              <div className="w-2.5 h-6 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
              <div className="w-2.5 h-6 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
            </div>
          </div>

          {/* Sub-banner Pill */}
          <div className="inline-block mt-2 bg-[#0b2447] text-white text-[10.5px] sm:text-[11.5px] font-black tracking-widest px-6 py-1 rounded-sm uppercase shadow-sm">
            6 PLAYER — SINGLE ELIMINATION (BO3)
          </div>
        </div>

        {/* Right Official EA SPORTS FC26 Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black flex flex-col items-center justify-center text-white text-[7px] font-black leading-tight">
            <span>EA</span>
            <span className="text-[5.5px] text-slate-300">SPORTS</span>
          </div>
          <div className="text-xl sm:text-3xl font-black italic tracking-tighter text-black font-sans">
            FC<span className="text-slate-900">26</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MAIN BRACKET GRID WITH VECTOR CONNECTORS */}
      {/* ========================================================================= */}
      <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative min-w-[1040px] max-w-6xl mx-auto px-2">
          
          {/* Round Headers: 4 Columns */}
          <div className="grid grid-cols-4 gap-6 mb-6 text-center">
            
            {/* Header 1: Babak 1 / Penyisihan */}
            <div>
              <div className="bg-[#0b2447] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">BABAK 1 (PENYISIHAN)</div>
                <div className="text-[9.5px] font-bold text-blue-200 uppercase">3 MATCH (BO3)</div>
              </div>
            </div>

            {/* Header 2: Semi Final */}
            <div>
              <div className="bg-[#0b2447] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">SEMI FINAL</div>
                <div className="text-[9.5px] font-bold text-blue-200 uppercase">SF1 (BYE) • SF2 (M2 vs M3)</div>
              </div>
            </div>

            {/* Header 3: Grand Final */}
            <div>
              <div className="bg-[#15803d] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">GRAND FINAL</div>
                <div className="text-[9.5px] font-bold text-green-200 uppercase">1 MATCH (BO3)</div>
              </div>
            </div>

            {/* Header 4: Champion */}
            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-widest uppercase">CHAMPION</div>
                <div className="text-[9.5px] font-bold text-amber-100 uppercase">JUARA RESMI</div>
              </div>
            </div>

          </div>

          {/* Bracket Canvas Area */}
          <div className="relative h-[480px]">
            
            {/* SVG Connector Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* 1. Line: M1 (Y=52) -> SF1 (Y=52) */}
              <g stroke="#0b2447" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 240 52 H 275" />
              </g>

              {/* 2. Line: M2 (Y=217) & M3 (Y=382) -> SF2 (Y=300) */}
              <g stroke="#0b2447" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 240 217 H 258 V 382 H 240" />
                <path d="M 258 300 H 275" />
              </g>

              {/* 3. Line: SF1 (Y=52) & SF2 (Y=300) -> Grand Final (Y=176) */}
              <g stroke="#0b2447" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 515 52 H 540 V 300 H 515" />
                <path d="M 540 176 H 565" />
              </g>

              {/* 4. Green Line: Grand Final (Y=176) -> Champion Trophy (Y=176) */}
              <g stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 800 176 H 840" />
              </g>

            </svg>

            {/* ========================================================================= */}
            {/* COLUMN 1: BABAK 1 / PENYISIHAN (M1, M2, M3) - Left: 0px to 240px */}
            {/* ========================================================================= */}
            <div className="absolute left-0 top-0 w-[240px] z-10 space-y-[26px]">
              
              {/* M1 Match: WAHAB vs REPAN (Center Y = 52px) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0b2447] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    M1
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">PENYISIHAN 1</span>
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[104px] hover:border-blue-400 transition-colors">
                  
                  {/* Player: WAHAB */}
                  <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="ball" color="blue" size={26} />
                    <span className="truncate uppercase">WAHAB</span>
                  </div>

                  {/* VS Divider Badge */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>

                  {/* Player: REPAN */}
                  <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="pad" color="green" size={26} />
                    <span className="truncate uppercase">REPAN</span>
                  </div>

                </div>
              </div>

              {/* M2 Match: RAHMAT vs NAUFAL ABBAS (Center Y = 217px) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0b2447] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    M2
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">PENYISIHAN 2</span>
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[104px] hover:border-blue-400 transition-colors">
                  
                  {/* Player: RAHMAT */}
                  <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="pad" color="purple" size={26} />
                    <span className="truncate uppercase">RAHMAT</span>
                  </div>

                  {/* VS Divider Badge */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>

                  {/* Player: NAUFAL ABBAS */}
                  <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="ball" color="red" size={26} />
                    <span className="truncate uppercase">NAUFAL ABBAS</span>
                  </div>

                </div>
              </div>

              {/* M3 Match: IFAL WIBAWA vs RIPIANSYAH (Center Y = 382px) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0b2447] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    M3
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">PENYISIHAN 3</span>
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[104px] hover:border-blue-400 transition-colors">
                  
                  {/* Player: IFAL WIBAWA */}
                  <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="ball" color="green" size={26} />
                    <span className="truncate uppercase">IFAL WIBAWA</span>
                  </div>

                  {/* VS Divider Badge */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>

                  {/* Player: RIPIANSYAH */}
                  <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                    <Fc26PlayerLogo type="pad" color="red" size={26} />
                    <span className="truncate uppercase">RIPIANSYAH</span>
                  </div>

                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMN 2: SEMI FINAL (SF1 & SF2) - Left: 275px to 515px */}
            {/* ========================================================================= */}
            <div className="absolute left-[275px] top-0 w-[240px] z-10">
              
              {/* SF1 Match: PEMENANG M1 vs BYE (Center Y = 52px -> Top: 0px) */}
              <div className="absolute top-0 left-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0b2447] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    SF1
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 font-mono uppercase">BYE ADVANCEMENT</span>
                </div>
                <div className="w-full bg-white rounded-2xl border-2 border-emerald-500/80 shadow-sm p-2.5 relative flex flex-col justify-between h-[104px] hover:border-emerald-500 transition-colors">
                  
                  {/* Top Player: PEMENANG M1 */}
                  <div className="flex items-center gap-2.5 font-bold text-slate-800 text-xs tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={26} />
                    <span className="truncate uppercase font-black text-slate-900">PEMENANG M1</span>
                  </div>

                  {/* VS Divider Badge */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="green" />
                  </div>

                  {/* Bottom: BYE */}
                  <div className="flex items-center justify-between gap-2 text-xs tracking-tight">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[10px]">
                        ✓
                      </div>
                      <span className="truncate uppercase font-black text-emerald-700 text-[11px]">BYE (LOLOS FINAL)</span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">AUTO GF</span>
                  </div>

                </div>
              </div>

              {/* SF2 Match: PEMENANG M2 vs PEMENANG M3 (Center Y = 300px -> Top: 248px) */}
              <div className="absolute top-[248px] left-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0b2447] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    SF2
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 font-mono uppercase">KNOCKOUT (M2 vs M3)</span>
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2.5 relative flex flex-col justify-between h-[104px] hover:border-blue-400 transition-colors">
                  
                  {/* Top Player: PEMENANG M2 */}
                  <div className="flex items-center gap-2.5 font-bold text-slate-700 text-xs tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={26} />
                    <span className="truncate uppercase text-[11px] text-slate-800 font-extrabold">PEMENANG M2</span>
                  </div>

                  {/* VS Divider Badge */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>

                  {/* Bottom: PEMENANG M3 */}
                  <div className="flex items-center gap-2.5 font-bold text-slate-700 text-xs tracking-tight">
                    <Fc26PlayerLogo type="placeholder" size={26} />
                    <span className="truncate uppercase text-[11px] text-slate-800 font-extrabold">PEMENANG M3</span>
                  </div>

                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMN 3: GRAND FINAL (1 MATCH) - Left: 565px to 800px */}
            {/* ========================================================================= */}
            <div className="absolute left-[565px] top-[105px] w-[235px] z-10">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#15803d] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  GF
                </div>
                <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">CHAMPIONSHIP MATCH</span>
              </div>
              
              {/* Grand Final Card with Green Border */}
              <div className="w-full bg-white rounded-3xl border-2 border-[#16a34a] shadow-md p-4 relative flex flex-col justify-between h-[142px]">
                
                {/* Winner SF1 Slot */}
                <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={28} />
                  <span className="uppercase text-[11px]">PEMENANG SF1 (M1)</span>
                </div>

                {/* VS Divider Badge with Green Accent */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="absolute left-0 right-0 h-px bg-green-200" />
                  <Fc26VsBadge variant="green" />
                </div>

                {/* Winner SF2 Slot */}
                <div className="flex items-center gap-2.5 font-black text-slate-900 text-xs tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={28} />
                  <span className="uppercase text-[11px]">PEMENANG SF2</span>
                </div>

              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMN 4: CHAMPION PRESENTATION CARD - Left: 840px */}
            {/* ========================================================================= */}
            <div className="absolute left-[840px] top-[30px] w-[200px] z-10">
              
              {/* Certificate & Cash Prize Presentation Card */}
              <div className="w-full bg-emerald-50/60 rounded-3xl border border-emerald-300/80 shadow-md p-4 flex flex-col items-center justify-center relative overflow-hidden">
                
                {/* Background Emerald Glow */}
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-300/25 rounded-full blur-2xl pointer-events-none" />

                {/* Stars Header */}
                <div className="flex items-center justify-center gap-1 mb-1 text-emerald-500 drop-shadow-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#10b981"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#10b981"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                </div>

                {/* Laurel Wreath with Award Icon */}
                <div className="relative flex items-center justify-center w-32 h-32 my-1">
                  {/* Laurels Graphic */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-emerald-500 drop-shadow-xs">
                    <path d="M22 74 C10 50 16 28 35 12 C26 28 24 48 32 64" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="18" cy="60" r="3.5" fill="#10b981" />
                    <circle cx="16" cy="44" r="3.5" fill="#10b981" />
                    <circle cx="20" cy="30" r="3.5" fill="#10b981" />
                    <circle cx="30" cy="18" r="3.5" fill="#10b981" />
                    <path d="M78 74 C90 50 84 28 65 12 C74 28 76 48 68 64" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="82" cy="60" r="3.5" fill="#10b981" />
                    <circle cx="84" cy="44" r="3.5" fill="#10b981" />
                    <circle cx="80" cy="30" r="3.5" fill="#10b981" />
                    <circle cx="70" cy="18" r="3.5" fill="#10b981" />
                  </svg>

                  {/* Award Icon */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <Award className="w-16 h-16 text-emerald-600 drop-shadow-md" />
                  </div>
                </div>

                {/* Champion Plaque */}
                <div className="w-full mt-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 border border-emerald-400 rounded-xl py-1.5 px-2 shadow-md flex items-center justify-center text-center">
                  <span className="text-[9.5px] font-black tracking-wider text-white uppercase">SERTIFIKAT & UANG TUNAI</span>
                </div>

              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* FOOTER SECTION: KETERANGAN, LEGENDA, CATATAN & BOTTOM BAR */}
          {/* ========================================================================= */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. KETERANGAN Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0b2447] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-black text-[#0b2447] tracking-wider uppercase text-[11px]">KETERANGAN</div>
                <div className="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#0b2447] font-bold">•</span>
                    <span>Sistem : <b>Single Elimination</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#0b2447] font-bold">•</span>
                    <span>Semi Final & Final : <b>Best Of 3 (BO3)</b></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#0b2447] font-bold">•</span>
                    <span>Hadiah Resmi : <b>Sertifikat & Uang Tunai</b></span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LEGENDA Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2 text-xs">
              <div className="font-black text-[#0b2447] tracking-wider uppercase text-[11px]">LEGENDA</div>
              <div className="space-y-2 pt-1 text-[11.5px] font-semibold text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-[#0b2447] rounded-full" />
                  <span>Semi Final</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-[#15803d] rounded-full" />
                  <span>Grand Final</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                  <span>Hadiah Resmi</span>
                </div>
              </div>
            </div>

            {/* 3. CATATAN Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#0b2447] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Award className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="font-black text-[#0b2447] tracking-wider uppercase text-[11px]">CATATAN</div>
                <div className="text-slate-700 text-[11.5px] leading-relaxed font-medium">
                  <div>Junjung sportivitas,</div>
                  <div>bermain fair play dan raih penghargaan terbaik!</div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Angled Navy Ribbon with Green Accents */}
          <div className="mt-5 relative w-full flex items-center justify-center bg-[#0b2447] text-white py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase shadow-md overflow-hidden">
            <div className="flex items-center justify-center gap-2 text-center z-10">
              <span>PLAY <span className="text-[#22c55e]">FAIR</span>, RESPECT <span className="text-[#22c55e]">EVERYONE!</span></span>
            </div>
            {/* Green corner geometric stripes */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-3 opacity-90">
              <div className="w-2 h-full bg-[#22c55e] transform -skew-x-20" />
              <div className="w-3.5 h-full bg-[#15803d] transform -skew-x-20" />
            </div>
            <div className="absolute left-0 top-0 bottom-0 flex items-center gap-1 pl-3 opacity-90">
              <div className="w-3.5 h-full bg-[#15803d] transform skew-x-20" />
              <div className="w-2 h-full bg-[#22c55e] transform skew-x-20" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
