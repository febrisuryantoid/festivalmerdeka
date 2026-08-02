import React, { useState } from 'react';
import { SLOT_TARGETS, calculateDynamicPrize } from '../lib/utils';
import { Trophy, Users, Calculator, TrendingUp, Sparkles, AlertCircle, ArrowUpRight, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface DynamicPrizeSimulatorProps {
  realTimeCounts?: { ml: number; ff: number; fc: number };
}

export const DynamicPrizeSimulator: React.FC<DynamicPrizeSimulatorProps> = ({ realTimeCounts = { ml: 0, ff: 0, fc: 0 } }) => {
  const [selectedGame, setSelectedGame] = useState<'mlbb' | 'ff' | 'fc'>('mlbb');
  
  const activeConfig = SLOT_TARGETS[selectedGame];
  
  // Real-time actual count based on game
  const realTimeParticipantCount = selectedGame === 'mlbb' 
    ? realTimeCounts.ml 
    : selectedGame === 'ff' 
      ? realTimeCounts.ff 
      : realTimeCounts.fc;

  // State for simulated participant slider (default to 145 or target)
  const [simulatedCount, setSimulatedCount] = useState<number>(145);

  // Switch game handler
  const handleGameChange = (game: 'mlbb' | 'ff' | 'fc') => {
    setSelectedGame(game);
    // Set initial simulator value to ~70% of target as an interactive demo
    setSimulatedCount(Math.round(SLOT_TARGETS[game].targetParticipants * 0.725));
  };

  const calcResult = calculateDynamicPrize(selectedGame, simulatedCount);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white text-slate-800 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden my-12">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6 sm:space-y-8">
        
        {/* Title Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
            <Calculator className="w-4 h-4 text-primary" /> Algoritma Transparan & Beradaptasi
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight uppercase text-primary">
            SIMULATOR HADIAH BERADAPTASI
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            Festival Kemerdekaan Desa Padasuka menggunakan sistem <strong>Dynamic Prize Pool</strong>, yaitu hadiah yang menyesuaikan secara otomatis berdasarkan jumlah peserta yang terdaftar secara realtime.
          </p>
          <p className="text-slate-500 text-xs sm:text-xs leading-relaxed">
            Semakin banyak peserta yang bergabung, semakin besar total hadiah yang diperebutkan. Sebaliknya, apabila jumlah peserta belum mencapai target, nominal hadiah akan disesuaikan secara proporsional agar pendaftaran tetap berjalan sehat dan transparan.
          </p>
        </div>

        {/* Game Tab Selectors with eSport Logos */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {(Object.keys(SLOT_TARGETS) as Array<'mlbb' | 'ff' | 'fc'>).map((key) => {
            const item = SLOT_TARGETS[key];
            const isActive = selectedGame === key;
            return (
              <button
                key={key}
                onClick={() => handleGameChange(key)}
                className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all flex flex-col items-center justify-center gap-2 border min-w-[130px] sm:min-w-[160px] text-center ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 ring-2 ring-primary/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {/* eSport Logo Container */}
                <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center p-1.5 transition-all ${
                  isActive ? 'bg-transparent' : 'bg-white shadow-sm border border-slate-100'
                }`}>
                  <img 
                    src={item.logo} 
                    alt={item.name} 
                    className={`w-full h-full object-contain filter drop-shadow-sm transition-all duration-300 scale-105 ${
                      isActive ? 'brightness-0 invert' : ''
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Game Title */}
                <span className="font-extrabold text-xs sm:text-sm tracking-tight line-clamp-1">{item.shortName || item.name}</span>

                {/* Target Text Under Logo */}
                <span className={`text-[10px] sm:text-[11px] font-mono font-black px-2.5 py-0.5 rounded-lg ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  Target: {item.targetParticipants} Peserta
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Calculation Box (LIGHT WHITE BOX ONLY) */}
        <div className="bg-slate-50/70 border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm space-y-6 sm:space-y-8">
          
          {/* Top Section: Interactive Slider & Input */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Simulasi Jumlah Peserta Terdaftar:
              </label>
              
              {/* Status Badge Indicator */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[12px] font-black uppercase tracking-wide flex items-center gap-1.5 ${
                  calcResult.badgeType === 'green'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : calcResult.badgeType === 'yellow'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${calcResult.indicatorColor} animate-pulse`} />
                  {calcResult.badgeText}
                </span>
              </div>
            </div>

            {/* Slider Control with Counter */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between font-mono text-xs text-slate-600">
                <span className="font-bold text-slate-700">0 Peserta</span>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-primary font-black text-sm">{simulatedCount}</span>
                  <span className="text-slate-400">/ {activeConfig.targetParticipants} Target Peserta</span>
                  <span className="text-slate-500 text-[11px] font-extrabold">({calcResult.ratioPercent}%)</span>
                </div>
                <span className="font-bold text-slate-700">{Math.round(activeConfig.targetParticipants * 1.5)} Max</span>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max={Math.round(activeConfig.targetParticipants * 1.5)}
                step="1"
                value={simulatedCount}
                onChange={(e) => setSimulatedCount(parseInt(e.target.value) || 0)}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-dark transition-all"
              />

              {/* Dynamic Progress Bar Indicator Color */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 ${calcResult.indicatorColor}`}
                  style={{ width: `${Math.min(calcResult.ratioPercent, 100)}%` }}
                />
              </div>

              {/* Preset Quick Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: "50% Kuota (Awal)", val: Math.round(activeConfig.targetParticipants * 0.5) },
                  { label: "75% Kuota", val: Math.round(activeConfig.targetParticipants * 0.75) },
                  { label: "100% Target Pas", val: activeConfig.targetParticipants },
                  { label: "125% Kuota (+Bonus)", val: Math.round(activeConfig.targetParticipants * 1.25) },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSimulatedCount(preset.val)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      simulatedCount === preset.val
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Total Prize Pool Box */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-gold to-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Total Prize Pool (Estimasi Realtime)
            </span>
            
            <div className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-primary my-2 tracking-tight">
              {formatRupiah(calcResult.adjustedPrizePool)}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 font-medium mt-3">
              <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                Hadiah Awal (100% Target Base): <strong>{formatRupiah(calcResult.basePrizePool)}</strong>
              </span>
              <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
                Status: Hadiah Awal 100% (Tidak Turun)
              </span>
            </div>

            {/* Guaranteed Baseline Alert */}
            {!calcResult.isBonusActive && (
              <div className="mt-4 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 text-xs font-semibold flex items-center justify-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Informasi Hadiah Awal:</strong> Nominal hadiah awal sebesar <strong>{formatRupiah(calcResult.basePrizePool)}</strong> telah ditetapkan & dialokasikan penuh oleh Panitia. Tidak akan dikurangi meskipun target kuota belum penuh!
                </span>
              </div>
            )}

            {/* Bonus Active Alert */}
            {calcResult.isBonusActive && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2 text-left">
                <Flame className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Bonus Prize Pool Aktif (+{formatRupiah(calcResult.diffAmount)}):</strong> Pendaftaran melebihi target peserta! Tambahan pendapatan digunakan untuk menaikkan seluruh hadiah Juara 1 & 2 di setiap kategori secara proporsional!
                </span>
              </div>
            )}
          </div>

          {/* Bottom Section: Realtime Prize Breakdown Table per Kategori (SD, SMP, SMA, UMUM) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm sm:text-base font-extrabold font-heading text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <Trophy className="w-4 h-4 text-gold" /> Breakdown Hadiah Juara Realtime Per Kategori
              </h4>
              <span className="text-[11px] text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
                Otomatis Mengikuti Slider
              </span>
            </div>

            {/* Table of Juara Prizes */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[11px]">
                    <th className="p-3 rounded-l-xl">Kategori / Level</th>
                    <th className="p-3 text-emerald-700">🥇 Juara 1 (Realtime)</th>
                    <th className="p-3 text-slate-700 rounded-r-xl">🥈 Juara 2 (Realtime)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {calcResult.categoryPrizes.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-extrabold text-slate-900">{cat.level}</td>
                      <td className="p-3 font-black text-emerald-600 font-mono text-sm sm:text-base">
                        {cat.juara1Formatted}
                      </td>
                      <td className="p-3 font-black text-slate-700 font-mono text-sm sm:text-base">
                        {cat.juara2Formatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-medium pt-2">
              *Setiap kenaikan pendaftar pada slider secara otomatis memperbarui nilai nominal di atas secara transparan.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
