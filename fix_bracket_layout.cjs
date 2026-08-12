const fs = require('fs');
let code = fs.readFileSync('src/components/TournamentBracket.tsx', 'utf8');

code = code.replace(
  /<div className="overflow-x-auto pb-8 pt-4 w-full">[\s\S]*<\/div>\s*<\/div>\s*\);\s*}/,
  `<div className="overflow-x-auto pb-8 pt-4 w-full">
        <div className="min-w-[800px] flex justify-between px-2 gap-8">
          
          {/* Quarter Finals */}
          <div className="flex flex-col gap-4 w-48 shrink-0 py-8 relative">
            <h4 className="text-center font-bold text-slate-400 text-xs uppercase tracking-wider absolute top-0 left-0 right-0">Quarter Finals</h4>
            {[0, 1, 2, 3].map(i => (
              <div key={\`qf-\${i}\`} className="h-[60px] bg-slate-50 border border-slate-200 rounded-lg p-2 shadow-sm flex flex-col justify-center gap-1 relative z-10">
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-700 flex justify-between items-center">
                  <span className="truncate">{bracketSlots[i*2] || "TBD"}</span>
                  <span className="text-[10px] text-slate-400 font-mono">0</span>
                </div>
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-700 flex justify-between items-center">
                  <span className="truncate">{bracketSlots[i*2+1] || "TBD"}</span>
                  <span className="text-[10px] text-slate-400 font-mono">0</span>
                </div>
                {/* Connector line Right */}
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Semi Finals */}
          <div className="flex flex-col gap-[76px] w-48 shrink-0 pt-[62px] relative">
            <h4 className="text-center font-bold text-slate-400 text-xs uppercase tracking-wider absolute top-0 left-0 right-0">Semi Finals</h4>
            {[0, 1].map(i => (
              <div key={\`sf-\${i}\`} className="h-[60px] bg-slate-50 border border-slate-200 rounded-lg p-2 shadow-sm flex flex-col justify-center gap-1 relative z-10">
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-400 flex justify-between items-center italic">
                  <span className="truncate">Menunggu Lawan</span>
                  <span className="text-[10px] text-slate-300 font-mono">-</span>
                </div>
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-400 flex justify-between items-center italic">
                  <span className="truncate">Menunggu Lawan</span>
                  <span className="text-[10px] text-slate-300 font-mono">-</span>
                </div>
                
                {/* Connector line Left (Vertical join) */}
                <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-slate-200" />
                <div className="absolute -left-4 w-[2px] bg-slate-200" style={{
                  top: i === 0 ? '50%' : '-15px',
                  bottom: i === 0 ? '-15px' : '50%',
                  height: '53px'
                }} />

                {/* Connector line Right */}
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Grand Final */}
          <div className="flex flex-col justify-center w-56 shrink-0 relative pt-8">
            <h4 className="text-center font-bold text-gold text-xs uppercase tracking-wider absolute top-0 left-0 right-0 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" /> Grand Final
            </h4>
            <div className="bg-gradient-to-br from-gold/20 to-amber-100 border-2 border-gold/40 rounded-xl p-3 shadow-lg flex flex-col gap-2 relative z-10">
              <div className="px-3 py-1.5 bg-white rounded-lg text-sm font-black text-slate-700 flex justify-between items-center shadow-sm">
                <span className="truncate">TBD</span>
                <span className="text-xs text-slate-400 font-mono">-</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Swords className="w-4 h-4 text-gold/70" />
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg text-sm font-black text-slate-700 flex justify-between items-center shadow-sm">
                <span className="truncate">TBD</span>
                <span className="text-xs text-slate-400 font-mono">-</span>
              </div>

              {/* Connector line Left (Vertical join) */}
              <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-slate-200" />
              <div className="absolute -left-4 w-[2px] bg-slate-200 top-[-26px] h-[136px]" />
            </div>
          </div>

          {/* Winner */}
          <div className="flex flex-col justify-center w-48 shrink-0 relative pt-8">
            <h4 className="text-center font-bold text-emerald-500 text-xs uppercase tracking-wider absolute top-0 left-0 right-0 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Champion
            </h4>
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 shadow-lg flex flex-col gap-1 relative z-10 items-center justify-center text-center">
              <Trophy className="w-10 h-10 text-emerald-500 mb-2 drop-shadow-md" />
              <span className="text-lg font-black text-emerald-700 truncate w-full uppercase tracking-wide">
                ?
              </span>
              
              {/* Connector line Left */}
              <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-slate-200" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
`
);

fs.writeFileSync('src/components/TournamentBracket.tsx', code);
console.log('Fixed bracket layout');
