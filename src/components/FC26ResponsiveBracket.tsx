import React from "react";
import { Award, Tv, Banknote, Trophy, Crown, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Fc26PlayerLogo } from "./FC26OfficialBracket";

interface MatchPlayerProps {
  name: string;
  isWinner?: boolean;
  isWithdrawn?: boolean;
  isBye?: boolean;
  logoType?: "ball" | "pad" | "placeholder";
  logoColor?: "green" | "red" | "blue" | "purple";
  isChampion?: boolean;
}

const PlayerRow: React.FC<MatchPlayerProps> = ({
  name,
  isWinner,
  isWithdrawn,
  isBye,
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
          <div className="w-4 h-4 rounded bg-slate-200 flex items-center justify-center text-[7.5px] font-black text-slate-500 shrink-0">
            BYE
          </div>
        ) : (
          <Fc26PlayerLogo type={logoType as "ball" | "pad" | "placeholder"} color={logoColor as "green" | "red" | "blue" | "purple"} size={18} />
        )}
        <span className={`text-[10.5px] truncate ${isWinner ? "font-extrabold text-slate-900" : isWithdrawn ? "text-rose-600 font-semibold" : ""}`}>
          {name}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {isChampion && <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />}
        {isWinner && !isChampion && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
        {isWithdrawn && <span className="text-[8px] px-1 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">WO</span>}
      </div>
    </div>
  );
};

export function FC26ResponsiveBracket() {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white py-2 px-1 sm:px-4">
      {/* Header */}
      <div className="relative w-full max-w-5xl flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-6 h-2 bg-[#0b2447] transform -skew-x-12 rounded-xs shadow-xs" />
          <div className="w-3 h-2 bg-[#22c55e] transform -skew-x-12 rounded-xs shadow-xs" />
        </div>

        <div className="text-center">
          <h2 className="text-base sm:text-xl font-black tracking-tight text-slate-900 font-heading uppercase leading-none">
            BAGAN RESMI PS 4 PRO FC26
          </h2>
          <div className="text-[11px] sm:text-xs font-black italic tracking-wide text-[#0b2447] uppercase mt-1">
            10 GLADIATOR — SINGLE ELIMINATION (BO3)
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
            <div className="w-3 h-2 bg-[#22c55e] transform skew-x-12 rounded-xs shadow-xs" />
            <div className="w-6 h-2 bg-[#0b2447] transform skew-x-12 rounded-xs shadow-xs" />
          </div>
        </div>
      </div>

      {/* Main Bracket Canvas */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="relative w-full min-w-[1020px] max-w-6xl mx-auto px-2">
          
          {/* Round Header Labels */}
          <div className="grid grid-cols-5 gap-3 mb-3 text-center">
            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10px] font-black tracking-wider uppercase">BABAK 1 (PENYISIHAN)</div>
                <div className="text-[7.5px] font-bold text-blue-200 uppercase">7 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10px] font-black tracking-wider uppercase">BABAK 2 (7 BESAR)</div>
                <div className="text-[7.5px] font-bold text-blue-200 uppercase">5 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10px] font-black tracking-wider uppercase">BABAK 3 (5 BESAR)</div>
                <div className="text-[7.5px] font-bold text-blue-200 uppercase">3 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-[#0b2447] text-white rounded-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10px] font-black tracking-wider uppercase">SEMI FINAL (3 BESAR)</div>
                <div className="text-[7.5px] font-bold text-blue-200 uppercase">2 MATCH (BO3)</div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 rounded-xl py-1.5 px-2 shadow-xs">
                <div className="text-[10px] font-black tracking-widest uppercase">GRAND FINAL & JUARA</div>
                <div className="text-[7.5px] font-extrabold text-slate-900 uppercase">HASIL RESMI</div>
              </div>
            </div>
          </div>

          {/* 5 Columns Layout */}
          <div className="grid grid-cols-5 gap-3 items-start">
            
            {/* COLUMN 1: BABAK 1 */}
            <div className="space-y-1.5">
              {/* M1 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M1</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="IFAL WIBAWA" isWithdrawn logoType="pad" logoColor="red" />
                <PlayerRow name="RIPIANSYAH" isWinner logoType="pad" logoColor="blue" />
              </div>

              {/* M2 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M2</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="NAUFAL ABBAS" logoType="pad" logoColor="green" />
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
              </div>

              {/* M3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M3</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
                <PlayerRow name="WAHAB" logoType="ball" logoColor="red" />
              </div>

              {/* M4 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M4</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="FERY" isWinner logoType="ball" logoColor="blue" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* M5 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M5</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="ERIK" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* M6 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M6</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="AMAR" isWinner logoType="ball" logoColor="green" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* M7 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">M7</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">PENYISIHAN</span>
                </div>
                <PlayerRow name="KODEL" isWinner logoType="pad" logoColor="red" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>
            </div>

            {/* COLUMN 2: BABAK 2 */}
            <div className="space-y-2 pt-2">
              {/* R2 - M1 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M1</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="RIPIANSYAH" logoType="pad" logoColor="blue" />
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
              </div>

              {/* R2 - M2 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M2</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* R2 - M3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M3</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="FERY" logoType="ball" logoColor="blue" />
                <PlayerRow name="ERIK" isWinner logoType="pad" logoColor="purple" />
              </div>

              {/* R2 - M4 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M4</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="AMAR" isWinner logoType="ball" logoColor="green" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* R2 - M5 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R2-M5</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">7 BESAR</span>
                </div>
                <PlayerRow name="KODEL" isWinner logoType="pad" logoColor="red" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>
            </div>

            {/* COLUMN 3: BABAK 3 */}
            <div className="space-y-3 pt-6">
              {/* R3 - M1 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R3-M1</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">5 BESAR</span>
                </div>
                <PlayerRow name="AMAR" logoType="ball" logoColor="green" />
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
              </div>

              {/* R3 - M2 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R3-M2</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">5 BESAR</span>
                </div>
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="ERIK" logoType="pad" logoColor="purple" />
              </div>

              {/* R3 - M3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[8.5px] font-mono font-black text-blue-900 bg-blue-50 px-1 rounded">R3-M3</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">5 BESAR</span>
                </div>
                <PlayerRow name="KODEL" isWinner logoType="pad" logoColor="red" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>
            </div>

            {/* COLUMN 4: SEMI FINAL */}
            <div className="space-y-4 pt-12">
              {/* SF1 */}
              <div className="bg-white rounded-xl border-2 border-blue-200 shadow-xs p-1.5 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-100 px-1 rounded">SF 1</span>
                  <span className="text-[8px] font-bold text-blue-600 uppercase">SEMI FINAL</span>
                </div>
                <PlayerRow name="REPAN" isWinner logoType="pad" logoColor="green" />
                <PlayerRow name="BYE (Lolos Otomatis)" isBye />
              </div>

              {/* SF2 */}
              <div className="bg-white rounded-xl border-2 border-blue-200 shadow-xs p-1.5 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[9px] font-mono font-black text-blue-900 bg-blue-100 px-1 rounded">SF 2</span>
                  <span className="text-[8px] font-bold text-blue-600 uppercase">SEMI FINAL</span>
                </div>
                <PlayerRow name="RAHMAT" isWinner logoType="pad" logoColor="purple" />
                <PlayerRow name="KODEL" logoType="pad" logoColor="red" />
              </div>
            </div>

            {/* COLUMN 5: GRAND FINAL & JUARA */}
            <div className="space-y-3 pt-8">
              {/* Grand Final Card */}
              <div className="bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 rounded-2xl border-2 border-amber-400 shadow-sm p-2">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-[9px] font-black text-amber-950 bg-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <Trophy className="w-2.5 h-2.5 text-amber-700" /> GRAND FINAL
                  </span>
                  <span className="text-[8px] font-black text-amber-700 uppercase">BO3</span>
                </div>

                <div className="space-y-1">
                  <div className="bg-amber-100/80 border border-amber-300 rounded-lg p-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Fc26PlayerLogo type="pad" color="purple" size={20} />
                      <div>
                        <div className="text-[11px] font-black text-amber-950">RAHMAT</div>
                        <div className="text-[7.5px] font-bold text-amber-700 uppercase">🏆 JUARA 1</div>
                      </div>
                    </div>
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  </div>

                  <div className="bg-slate-100 border border-slate-200 rounded-lg p-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Fc26PlayerLogo type="pad" color="green" size={20} />
                      <div>
                        <div className="text-[11px] font-black text-slate-800">REPAN</div>
                        <div className="text-[7.5px] font-bold text-slate-500 uppercase">🥈 JUARA 2</div>
                      </div>
                    </div>
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Podium Box */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-2.5 border border-amber-400/40 shadow-sm text-center space-y-1.5">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[8.5px] font-black uppercase">
                  <Award className="w-2.5 h-2.5 text-amber-400" /> HASIL AKHIR
                </div>

                <div className="text-left space-y-1 text-[11px]">
                  <div className="flex items-center justify-between bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                    <span className="font-extrabold text-amber-300">🥇 Juara 1:</span>
                    <span className="font-black text-white">RAHMAT</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700">
                    <span className="font-bold text-slate-300">🥈 Juara 2:</span>
                    <span className="font-bold text-white">REPAN</span>
                  </div>
                </div>

                <div className="text-[8px] text-emerald-400 font-bold flex items-center justify-center gap-1 pt-1 border-t border-slate-800">
                  <Banknote className="w-2.5 h-2.5" /> Hadiah Tunai & Sertifikat
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
