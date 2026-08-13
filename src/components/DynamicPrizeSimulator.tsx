import React, { useState } from 'react';
import { SLOT_TARGETS, calculateDynamicPrize } from '../lib/utils';
import { Users, Sparkles } from 'lucide-react';

interface DynamicPrizeSimulatorProps {
  realTimeCounts?: { ml: number; ff: number; fc: number };
}

export const DynamicPrizeSimulator: React.FC<DynamicPrizeSimulatorProps> = ({ realTimeCounts = { ml: 0, ff: 0, fc: 0 } }) => {
  const [selectedGame, setSelectedGame] = useState<'mlbb' | 'ff' | 'fc'>('mlbb');
  
  const activeConfig = SLOT_TARGETS[selectedGame];

  const getRealTimeCount = (game: 'mlbb' | 'ff' | 'fc') => {
    if (game === 'mlbb') return realTimeCounts?.ml || 0;
    if (game === 'ff') return realTimeCounts?.ff || 0;
    if (game === 'fc') return realTimeCounts?.fc || 0;
    return 0;
  };

  const [simulatedCount, setSimulatedCount] = useState<number>(getRealTimeCount('mlbb'));

  React.useEffect(() => {
    setSimulatedCount(getRealTimeCount(selectedGame));
  }, [realTimeCounts, selectedGame]);

  const handleGameChange = (game: 'mlbb' | 'ff' | 'fc') => {
    setSelectedGame(game);
  };

  const calcResult = calculateDynamicPrize(selectedGame, simulatedCount);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white text-slate-900 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden h-full flex flex-col">
      <div className="relative z-10 space-y-8 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50/80 text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase backdrop-blur-md border border-red-100/50">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Prize Pool Real-time
          </div>
          <h3 className="tracking-tight text-slate-900">
            Hadiah Terkumpul
          </h3>
        </div>

        {/* Game Selectors (Minimalist) */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {(Object.keys(SLOT_TARGETS) as Array<'mlbb' | 'ff' | 'fc'>).map((key) => {
            const item = SLOT_TARGETS[key];
            const isActive = selectedGame === key;
            return (
              <button
                key={key}
                onClick={() => handleGameChange(key)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                    : 'bg-white/60 text-slate-600 hover:bg-slate-100 border border-slate-200/50 backdrop-blur-md'
                }`}
              >
                {item.shortName || item.name}
              </button>
            );
          })}
        </div>

        {/* Simulator & Prize Display Container */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-5 sm:p-8 rounded-[24px] shadow-sm max-w-3xl mx-auto space-y-8 flex-1 flex flex-col w-full">
          
          {/* Main Prize Display */}
          <div className="text-center space-y-2">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-slate-500 uppercase">
              Estimasi Hadiah Terkumpul
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-slate-900 tracking-tighter drop-shadow-sm">
              {formatRupiah(calcResult.adjustedPrizePool)}
            </div>
            {calcResult.isBonusActive && (
              <div className="inline-block px-2.5 py-1 bg-emerald-100/80 text-emerald-700 text-[10px] sm:text-xs font-bold font-mono rounded-full mt-2">
                Bonus Aktif (+{formatRupiah(calcResult.diffAmount)})
              </div>
            )}
          </div>

          {/* Minimalist Slider */}
          <div className="space-y-4 max-w-xl mx-auto w-full">
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              <span>0</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 rounded-full shadow-sm border border-slate-100">
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                <span className="text-primary text-xs sm:text-sm font-mono font-bold">{simulatedCount}</span> 
                <span className="hidden sm:inline font-sans">Peserta</span>
              </div>
              <span className="font-mono font-bold">{Math.round(activeConfig.targetParticipants * 1.5)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.round(activeConfig.targetParticipants * 1.5)}
              step="1"
              value={simulatedCount}
              disabled
              className="w-full h-2 bg-slate-200/60 rounded-full appearance-none cursor-not-allowed accent-primary opacity-80"
            />
          </div>

          {/* Breakdown List (No Scroll) */}
          <div className="pt-2 mt-auto space-y-3">
            {calcResult.categoryPrizes.map((cat, idx) => (
              <div key={idx} className="bg-slate-50/80 border border-slate-100 p-3 sm:p-4 rounded-xl flex flex-col gap-2.5">
                <div className="font-bold text-slate-800 text-[11px] sm:text-xs uppercase tracking-wider border-b border-slate-200/60 pb-2">
                  {cat.level}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="text-sm">🥇</span> Juara <span className="font-mono font-bold">1</span>
                  </span>
                  <span className="font-black font-mono text-slate-900 text-sm sm:text-base">{cat.juara1Formatted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="text-sm">🥈</span> Juara <span className="font-mono font-bold">2</span>
                  </span>
                  <span className="font-bold font-mono text-slate-700 text-sm sm:text-base">{cat.juara2Formatted}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
