import React from "react";
import { Award, Shield, Banknote, Crown, Trophy, CheckCircle2, AlertCircle } from "lucide-react";

// Soccer Ball & Gamepad Shield Logos for FC26 Players
export const Fc26PlayerLogo = ({ type, color, size = 32 }: { type: "ball" | "pad" | "placeholder"; color?: "green" | "red" | "blue" | "purple"; size?: number }) => {
  if (type === "placeholder") {
    return (
      <div 
        style={{ width: size, height: size * 1.15 }} 
        className="rounded-md bg-slate-300/90 flex items-center justify-center shrink-0 shadow-xs"
      >
        <Shield className="w-4 h-4 text-slate-400 fill-slate-400" />
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
        <path 
          d="M50 5 L88 20 V60 C88 85 50 110 50 110 C50 110 12 85 12 60 V20 Z" 
          fill="#090d16" 
          stroke={strokeColor} 
          strokeWidth="6" 
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
        <circle cx="50" cy="52" r="26" fill="#ffffff" stroke="#000000" strokeWidth="2" />
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
      <path 
        d="M50 5 L88 20 V60 C88 85 50 110 50 110 C50 110 12 85 12 60 V20 Z" 
        fill="#090d16" 
        stroke={strokeColor} 
        strokeWidth="6" 
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      />
      <path 
        d="M32 40 C24 40 20 48 24 64 C26 72 32 72 38 66 L44 60 H56 L62 66 C68 72 74 72 76 64 C80 48 76 40 68 40 Z" 
        fill="#ffffff" 
        stroke="#0f172a" 
        strokeWidth="2" 
      />
      <path d="M32 46 V56 M27 51 H37" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="64" cy="48" r="2" fill="#ef4444" />
      <circle cx="68" cy="52" r="2" fill="#22c55e" />
      <circle cx="60" cy="52" r="2" fill="#3b82f6" />
      <circle cx="64" cy="56" r="2" fill="#facc15" />
      <rect x="46" y="49" width="8" height="4" rx="2" fill="#0f172a" />
    </svg>
  );
};

export const Fc26VsBadge = ({ variant = "navy" }: { variant?: "navy" | "green" }) => (
  <div className={`w-4 h-4 rounded-full ${variant === "green" ? "bg-[#15803d]" : "bg-[#0b2447]"} flex items-center justify-center text-[7px] font-black text-white shrink-0 shadow-xs leading-none z-10`}>
    VS
  </div>
);

interface MatchPlayerProps {
  name: string;
  isWinner?: boolean;
  isWithdrawn?: boolean;
  isBye?: boolean;
  score?: string;
  logoType?: "ball" | "pad" | "placeholder";
  logoColor?: "green" | "red" | "blue" | "purple";
  isChampion?: boolean;
}

const PlayerRow: React.FC<MatchPlayerProps> = ({
  name,
  isWinner,
  isWithdrawn,
  isBye,
  score,
  logoType = "pad",
  logoColor = "blue",
  isChampion
}) => {
  return (
    <div className={`flex items-center justify-between px-2 py-1 rounded-lg transition-colors ${
      isChampion 
        ? "bg-amber-50 text-amber-950 font-black" 
        : isWinner 
          ? "bg-emerald-50/80 text-slate-900 font-bold" 
          : isWithdrawn
            ? "bg-rose-50/50 text-rose-700/80 line-through"
            : isBye
              ? "bg-slate-50 text-slate-400 italic"
              : "text-slate-600"
    }`}>
      <div className="flex items-center gap-1.5 min-w-0 pr-1">
        {isBye ? (
          <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500 shrink-0">
            BYE
          </div>
        ) : (
          <Fc26PlayerLogo type={logoType as "ball" | "pad" | "placeholder"} color={logoColor as "green" | "red" | "blue" | "purple"} size={20} />
        )}
        <span className={`text-[11px] truncate ${isWinner ? "font-extrabold text-slate-900" : isWithdrawn ? "text-rose-600 font-semibold" : ""}`}>
          {name}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {isChampion && <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />}
        {isWinner && !isChampion && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
        {isWithdrawn && <span className="text-[8.5px] px-1 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">WO</span>}
        {score && <span className="text-[10px] font-mono font-bold px-1 rounded bg-slate-100 text-slate-700">{score}</span>}
      </div>
    </div>
  );
};

export function FC26OfficialBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-4 px-2 sm:px-6">
      
      {/* TOP HEADER */}
      <div className="relative w-full max-w-6xl flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        {/* Left PS4 Branding */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-7 h-7 sm:w-9 sm:h-9 text-slate-900 fill-current">
            <path d="M42 12 C44 10 47 10 48 12 L70 54 C72 58 68 62 63 62 H54 V88 C54 92 50 95 46 95 C42 95 38 92 38 88 V20 C38 15 39 13 42 12 Z" />
            <path d="M22 68 C16 70 12 75 14 80 C16 85 24 88 34 88 C44 88 54 85 54 80 C54 75 48 71 42 69 L54 62 C62 60 76 60 84 66 C92 72 90 82 78 88 C66 94 48 96 32 94 C14 92 2 84 2 74 C2 65 12 60 22 58 Z" />
          </svg>
          <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-slate-900 font-sans">
            PS4<span className="text-xs font-normal not-italic align-top ml-0.5">®</span>
          </span>
        </div>

        {/* Center Main Title */}
        <div className="flex-1 text-center px-2">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading uppercase">
            BAGAN RESMI TURNAMEN EA SPORTS FC 26
          </h2>
          
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <div className="flex items-center gap-1 opacity-90">
              <div className="w-2 h-5 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
              <div className="w-2 h-5 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
            </div>

            <div className="text-lg sm:text-2xl font-black italic tracking-wide uppercase">
              <span className="text-[#0b2447]">PLAYSTATION 4 PRO </span>
              <span className="text-[#16a34a]">FC 26</span>
            </div>

            <div className="flex items-center gap-1 opacity-90">
              <div className="w-2 h-5 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
              <div className="w-2 h-5 bg-[#16a34a] transform -skew-x-20 rounded-xs" />
            </div>
          </div>

          <div className="inline-block mt-1.5 bg-[#0b2447] text-white text-[10.5px] font-black tracking-widest px-4 py-0.5 rounded-full uppercase shadow-xs">
            10 GLADIATOR — SISTEM GUGUR KNOCKOUT (BO3)
          </div>
        </div>

        {/* Right EA Sports FC26 Badge */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-black flex flex-col items-center justify-center text-white text-[6.5px] font-black leading-tight">
            <span>EA</span>
            <span className="text-[5px] text-slate-300">SPORTS</span>
          </div>
          <div className="text-lg sm:text-2xl font-black italic tracking-tighter text-black font-sans">
            FC<span className="text-slate-900">26</span>
          </div>
        </div>
      </div>

      {/* 5-COLUMN BRACKET CONTAINER */}
      <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative min-w-[1100px] max-w-6xl mx-auto px-2">
          
          {/* Column Header Titles */}
          <div className="grid grid-cols-5 gap-3.5 mb-4 text-center">
            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-2 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">BABAK 1 (PENYISIHAN)</div>
                <div className="text-[8.5px] font-bold text-blue-200 uppercase">7 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-2 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">BABAK 2 (7 BESAR)</div>
                <div className="text-[8.5px] font-bold text-blue-200 uppercase">5 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-2 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">BABAK 3 (5 BESAR)</div>
                <div className="text-[8.5px] font-bold text-blue-200 uppercase">3 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-2 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-wider uppercase">SEMI FINAL (3 BESAR)</div>
                <div className="text-[8.5px] font-bold text-blue-200 uppercase">2 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 rounded-xl py-2 px-2 shadow-xs">
                <div className="text-[11px] font-black tracking-widest uppercase">GRAND FINAL & JUARA</div>
                <div className="text-[8.5px] font-extrabold text-slate-900 uppercase">PODIUM RESMI</div>
              </div>
            </div>
          </div>

          {/* Bracket Body */}
          <div className="grid grid-cols-5 gap-3.5 items-start">
            
            {/* ========================================================================= */}
            {/* COLUMN 1: BABAK 1 (PENYISIHAN - 7 MATCH) */}
            {/* ========================================================================= */}
            <div className="space-y-2">
              {/* M1 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M1</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="IFAL WIBAWA" isWithdrawn logoType="pad" logoColor="red" />
                <PlayerRow name="RIPIANSYAH" isWinner logoType="pad" logoColor="blue" />
              </div>

              {/* M2 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M2</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="NAUFAL ABBAS" logoType="pad" logoColor="green" />
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
              </div>

              {/* M3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M3</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
                <PlayerRow name="WAHAB" logoType="ball" logoColor="red" />
              </div>

              {/* M4 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M4</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="FERY" isWinner logoType="ball" logoColor="blue" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* M5 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M5</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="ERIK" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* M6 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M6</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="AMAR" isWinner logoType="ball" logoColor="green" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* M7 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M7</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="KODEL" isWinner logoType="pad" logoColor="red" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* COLUMN 2: BABAK 2 (7 BESAR - 5 MATCH) */}
            {/* ========================================================================= */}
            <div className="space-y-2.5 pt-2">
              {/* R2 - M1 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M1</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="RIPIANSYAH" logoType="pad" logoColor="blue" />
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
              </div>

              {/* R2 - M2 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M2</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* R2 - M3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M3</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="FERY" logoType="ball" logoColor="blue" />
                <PlayerRow name="ERIK" isWinner logoType="pad" logoColor="purple" />
              </div>

              {/* R2 - M4 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M4</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="AMAR" isWinner logoType="ball" logoColor="green" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* R2 - M5 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M5</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="KODEL" isWinner logoType="pad" logoColor="red" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* COLUMN 3: BABAK 3 (5 BESAR - 3 MATCH) */}
            {/* ========================================================================= */}
            <div className="space-y-4 pt-8">
              {/* R3 - M1 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R3-M1</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">5 BESAR</span>
                </div>
                <PlayerRow name="AMAR" logoType="ball" logoColor="green" />
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
              </div>

              {/* R3 - M2 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R3-M2</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">5 BESAR</span>
                </div>
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="ERIK" logoType="pad" logoColor="purple" />
              </div>

              {/* R3 - M3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R3-M3</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase">5 BESAR</span>
                </div>
                <PlayerRow name="KODEL" isWinner logoType="pad" logoColor="red" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* COLUMN 4: SEMI FINAL (3 BESAR - 2 MATCH) */}
            {/* ========================================================================= */}
            <div className="space-y-6 pt-16">
              {/* SF1 */}
              <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-2 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9.5px] font-mono font-black text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">SF 1</span>
                  <span className="text-[8.5px] font-extrabold text-blue-600 uppercase">SEMI FINAL</span>
                </div>
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* SF2 */}
              <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-2 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between px-1.5 mb-1">
                  <span className="text-[9.5px] font-mono font-black text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">SF 2</span>
                  <span className="text-[8.5px] font-extrabold text-blue-600 uppercase">SEMI FINAL</span>
                </div>
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="KODEL" logoType="pad" logoColor="red" />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* COLUMN 5: GRAND FINAL & JUARA */}
            {/* ========================================================================= */}
            <div className="space-y-4 pt-12">
              {/* Grand Final Match Card */}
              <div className="bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 rounded-2xl border-2 border-amber-400 shadow-md p-2.5">
                <div className="flex items-center justify-between px-1.5 mb-1.5">
                  <span className="text-[10px] font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-700" /> GRAND FINAL
                  </span>
                  <span className="text-[8.5px] font-black text-amber-700 uppercase">BO3 SERIES</span>
                </div>

                <div className="space-y-1">
                  <div className="bg-amber-100/80 border border-amber-300 rounded-xl p-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Fc26PlayerLogo type="pad" color="purple" size={24} />
                      <div>
                        <div className="text-xs font-black text-amber-950">RAHMAT</div>
                        <div className="text-[8px] font-bold text-amber-700 uppercase">🏆 JUARA 1 (CHAMPION)</div>
                      </div>
                    </div>
                    <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                  </div>

                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Fc26PlayerLogo type="pad" color="green" size={24} />
                      <div>
                        <div className="text-xs font-black text-slate-800">REPAN</div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase">🥈 JUARA 2 (RUNNER UP)</div>
                      </div>
                    </div>
                    <Award className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Official Champions Podium Box */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-3 border border-amber-400/40 shadow-lg text-center space-y-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                  <Award className="w-3 h-3 text-amber-400" /> HASIL AKHIR FC26
                </div>

                <div className="text-left space-y-1.5 text-xs">
                  <div className="flex items-center justify-between bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                    <span className="font-extrabold text-amber-300">🥇 Juara 1:</span>
                    <span className="font-black text-white">RAHMAT</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-700">
                    <span className="font-bold text-slate-300">🥈 Juara 2:</span>
                    <span className="font-bold text-white">REPAN</span>
                  </div>
                </div>

                <div className="text-[9px] text-emerald-400 font-bold flex items-center justify-center gap-1 pt-1 border-t border-slate-800">
                  <Banknote className="w-3 h-3" /> Sertifikat Penghargaan & Uang Tunai
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
