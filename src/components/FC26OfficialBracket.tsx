import React from "react";
import { FileText, Trophy, Shield } from "lucide-react";

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
            4 PLAYER - SINGLE ELIMINATION
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
        <div className="relative min-w-[960px] max-w-5xl mx-auto px-4">
          
          {/* Round Headers */}
          <div className="grid grid-cols-3 gap-10 mb-6 text-center">
            
            {/* Header 1: Semi Final (Dark Navy) */}
            <div>
              <div className="bg-[#0b2447] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">SEMI FINAL</div>
                <div className="text-[9.5px] font-bold text-blue-200 uppercase">2 PERTANDINGAN</div>
              </div>
            </div>

            {/* Header 2: Grand Final (Green) */}
            <div>
              <div className="bg-[#15803d] text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-wider uppercase">GRAND FINAL</div>
                <div className="text-[9.5px] font-bold text-green-200 uppercase">1 PERTANDINGAN</div>
              </div>
            </div>

            {/* Header 3: Champion (Gold) */}
            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-t-xl py-2 px-3 shadow-sm">
                <div className="text-xs font-black tracking-widest uppercase">CHAMPION</div>
              </div>
            </div>

          </div>

          {/* Bracket Canvas Area */}
          <div className="relative h-[480px]">
            
            {/* SVG Connector Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* 1. Dark Navy Line: SF1 (Y=92) & SF2 (Y=322) -> Grand Final (Y=207) */}
              <g stroke="#0b2447" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 280 92 H 310 V 322 H 280" />
                <path d="M 310 207 H 345" />
              </g>

              {/* 2. Green Line: Grand Final (Y=207) -> Champion Trophy (Y=207) */}
              <g stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 605 207 H 660" />
              </g>

            </svg>

            {/* ========================================================================= */}
            {/* COLUMN 1: SEMI FINAL (4 PLAYERS) - Left: 0px to 280px */}
            {/* ========================================================================= */}
            <div className="absolute left-0 top-0 w-[280px] space-y-12 z-10">
              
              {/* SF1 Box (Y=92) */}
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#0b2447] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                  SF1
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 relative flex flex-col justify-between h-[116px]">
                  
                  {/* Top Player: IFAL WIBAWA */}
                  <div className="flex items-center gap-3 font-black text-slate-900 text-sm tracking-tight">
                    <Fc26PlayerLogo type="ball" color="green" size={32} />
                    <span className="truncate uppercase">IFAL WIBAWA</span>
                  </div>

                  {/* VS Divider Badge */}
                  <div className="relative flex items-center justify-center my-1">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>

                  {/* Bottom Player: RIPIANSYAH */}
                  <div className="flex items-center gap-3 font-black text-slate-900 text-sm tracking-tight">
                    <Fc26PlayerLogo type="pad" color="red" size={32} />
                    <span className="truncate uppercase">RIPIANSYAH</span>
                  </div>

                </div>
              </div>

              {/* SF2 Box (Y=322) */}
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#0b2447] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mb-1.5">
                  SF2
                </div>
                <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 relative flex flex-col justify-between h-[116px]">
                  
                  {/* Top Player: WAHAB */}
                  <div className="flex items-center gap-3 font-black text-slate-900 text-sm tracking-tight">
                    <Fc26PlayerLogo type="ball" color="blue" size={32} />
                    <span className="truncate uppercase">WAHAB</span>
                  </div>

                  {/* VS Divider Badge */}
                  <div className="relative flex items-center justify-center my-1">
                    <div className="absolute left-0 right-0 h-px bg-slate-100" />
                    <Fc26VsBadge variant="navy" />
                  </div>

                  {/* Bottom Player: RAHMAT */}
                  <div className="flex items-center gap-3 font-black text-slate-900 text-sm tracking-tight">
                    <Fc26PlayerLogo type="pad" color="purple" size={32} />
                    <span className="truncate uppercase">RAHMAT</span>
                  </div>

                </div>
              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 2: GRAND FINAL (1 PERTANDINGAN) - Left: 345px to 605px */}
            {/* ========================================================================= */}
            <div className="absolute left-[345px] top-[125px] w-[260px] z-10">
              
              {/* Grand Final Card with Green Border */}
              <div className="w-full bg-white rounded-3xl border-2 border-[#16a34a] shadow-md p-4 relative flex flex-col justify-between h-[164px]">
                
                {/* Winner SF1 Slot */}
                <div className="flex items-center gap-3 font-black text-slate-900 text-sm tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={32} />
                  <span className="uppercase">PEMENANG SF1</span>
                </div>

                {/* VS Divider Badge with Green Accent */}
                <div className="relative flex items-center justify-center my-1.5">
                  <div className="absolute left-0 right-0 h-px bg-green-200" />
                  <Fc26VsBadge variant="green" />
                </div>

                {/* Winner SF2 Slot */}
                <div className="flex items-center gap-3 font-black text-slate-900 text-sm tracking-tight">
                  <Fc26PlayerLogo type="placeholder" size={32} />
                  <span className="uppercase">PEMENANG SF2</span>
                </div>

              </div>

            </div>


            {/* ========================================================================= */}
            {/* COLUMN 3: CHAMPION PRESENTATION CARD - Left: 660px */}
            {/* ========================================================================= */}
            <div className="absolute left-[660px] top-[20px] w-[240px] z-10">
              
              {/* Golden Trophy Presentation Card */}
              <div className="w-full bg-amber-50/50 rounded-3xl border border-amber-300/80 shadow-md p-5 flex flex-col items-center justify-center relative overflow-hidden">
                
                {/* Background Golden Glow */}
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

                {/* 5 Golden Stars Arched Header */}
                <div className="flex items-center justify-center gap-1.5 mb-1 text-amber-400 drop-shadow-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" /></svg>
                </div>

                {/* Golden Trophy with Laurel Wreath & FC26 Engraved Logo */}
                <div className="relative flex items-center justify-center w-36 h-36 my-1">
                  {/* Laurels Graphic */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 drop-shadow-xs">
                    {/* Left Laurel Leaves */}
                    <path d="M22 74 C10 50 16 28 35 12 C26 28 24 48 32 64" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="18" cy="60" r="4" fill="#f59e0b" />
                    <circle cx="16" cy="44" r="4" fill="#f59e0b" />
                    <circle cx="20" cy="30" r="4" fill="#f59e0b" />
                    <circle cx="30" cy="18" r="4" fill="#f59e0b" />
                    {/* Right Laurel Leaves */}
                    <path d="M78 74 C90 50 84 28 65 12 C74 28 76 48 68 64" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="82" cy="60" r="4" fill="#f59e0b" />
                    <circle cx="84" cy="44" r="4" fill="#f59e0b" />
                    <circle cx="80" cy="30" r="4" fill="#f59e0b" />
                    <circle cx="70" cy="18" r="4" fill="#f59e0b" />
                  </svg>

                  {/* 3D Golden FC26 Trophy SVG */}
                  <svg viewBox="0 0 120 120" className="w-28 h-28 relative z-10 drop-shadow-lg">
                    <defs>
                      <linearGradient id="fc_gold_cup" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="35%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                      <linearGradient id="fc_trophy_base" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>
                    {/* Cup Handles */}
                    <path d="M28 35 C14 35 14 65 35 70" fill="none" stroke="url(#fc_gold_cup)" strokeWidth="6" strokeLinecap="round" />
                    <path d="M92 35 C106 35 106 65 85 70" fill="none" stroke="url(#fc_gold_cup)" strokeWidth="6" strokeLinecap="round" />
                    {/* Main Cup Body */}
                    <path d="M30 24 H90 V55 C90 76 60 86 60 86 C60 86 30 76 30 55 Z" fill="url(#fc_gold_cup)" stroke="#fbbf24" strokeWidth="2" />
                    {/* FC26 Engraved Logo */}
                    <text x="60" y="58" fill="#78350f" fontSize="13" fontWeight="900" fontStyle="italic" textAnchor="middle" letterSpacing="0.5" style={{ filter: "drop-shadow(0 1px 1px #fef08a)" }}>
                      FC26
                    </text>
                    {/* Stem */}
                    <rect x="54" y="85" width="12" height="13" fill="url(#fc_gold_cup)" />
                    {/* Pedestal Stand */}
                    <path d="M38 98 H82 L88 112 H32 Z" fill="url(#fc_trophy_base)" stroke="#f59e0b" strokeWidth="1.5" />
                    <rect x="40" y="102" width="40" height="6" rx="1" fill="#fef08a" />
                  </svg>
                </div>

                {/* Champion Plaque / Banner Bar */}
                <div className="w-full mt-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 border border-amber-500 rounded-xl py-2 px-3 shadow-md flex items-center justify-center">
                  <div className="h-2 w-24 bg-amber-100/70 rounded-full" />
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
                    <span>Jika seri 1-1, pertandingan ke-3 menentukan pemenang</span>
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
                  <div className="w-8 h-1 bg-amber-500 rounded-full" />
                  <span>Champion</span>
                </div>
              </div>
            </div>

            {/* 3. CATATAN Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#0b2447] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Trophy className="w-4 h-4 text-amber-300" />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="font-black text-[#0b2447] tracking-wider uppercase text-[11px]">CATATAN</div>
                <div className="text-slate-700 text-[11.5px] leading-relaxed font-medium">
                  <div>Junjung sportivitas,</div>
                  <div>bermain fair play dan jadilah juara!</div>
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
