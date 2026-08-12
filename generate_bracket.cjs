const fs = require('fs');

let content = fs.readFileSync('src/components/TournamentBracket.tsx', 'utf8');

// The replacement code string
const dynamicBracketCode = `
  const getCategoryWeight = (kategori = "") => {
    const k = kategori.toLowerCase();
    if (k.includes("sd")) return 1;
    if (k.includes("smp")) return 2;
    if (k.includes("sma") || k.includes("smk")) return 3;
    if (k.includes("karang taruna")) return 4;
    if (k.includes("umum")) return 5;
    return 6;
  };

  const filteredParticipants = participants.filter(p => {
    if ((p.status || "").toLowerCase() !== "verified") return false;
    const l = (p.lomba || "").toLowerCase();
    if (activeTab === "Mobile Legends" && (l.includes("mobile") || l.includes("ml") || l.includes("legend"))) return true;
    if (activeTab === "Free Fire" && (l.includes("free") || l.includes("fire") || l.includes("ff"))) return true;
    if (activeTab === "PS 4 Pro FC26" && (l.includes("fc") || l.includes("ps") || l.includes("ea") || l.includes("fifa"))) return true;
    return false;
  }).sort((a, b) => {
    const weightA = getCategoryWeight(a.kategori);
    const weightB = getCategoryWeight(b.kategori);
    if (weightA !== weightB) return weightA - weightB;
    const timeA = parseTimestampMillis(a.createdAt);
    const timeB = parseTimestampMillis(b.createdAt);
    return timeA - timeB; 
  });

  const count = Math.max(8, filteredParticipants.length);
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(count)));
  const totalRounds = Math.log2(bracketSize);

  const initialSlots = Array(bracketSize).fill(null).map((_, i) => {
    return filteredParticipants[i] || null;
  });

  interface Match {
    team1: any | null;
    team2: any | null;
  }
  const roundsData: Match[][] = [];

  const round0: Match[] = [];
  for (let i = 0; i < bracketSize; i += 2) {
    round0.push({
      team1: initialSlots[i],
      team2: initialSlots[i+1]
    });
  }
  roundsData.push(round0);

  for (let r = 1; r < totalRounds; r++) {
    const matchesInRound = bracketSize / Math.pow(2, r + 1);
    const roundMatches: Match[] = [];
    for (let i = 0; i < matchesInRound; i++) {
      roundMatches.push({ team1: null, team2: null });
    }
    roundsData.push(roundMatches);
  }

  const getRoundStyle = (r: number) => {
    const paddingTop = 32 + 38 * (Math.pow(2, r) - 1);
    const gap = 76 * Math.pow(2, r) - 60;
    return {
      paddingTop: \`\${paddingTop}px\`,
      gap: \`\${gap}px\`
    };
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-[24px] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col items-center text-center gap-5 mb-8">
        <div className="flex flex-col items-center w-full">
           <h3 className="font-heading text-dark flex items-center justify-center gap-2">
             <Trophy className="w-6 h-6 text-gold" /> Bagan Turnamen
           </h3>
           <p className="text-secondary text-sm font-medium mt-1">
             Struktur pertandingan disusun otomatis berdasarkan level/kategori pendaftar.
           </p>
        </div>
        {/* Tab Selection */}
        <div className="flex justify-center flex-wrap mx-auto bg-gray-100 p-1.5 rounded-xl w-full sm:w-max gap-2">
          {[
            { name: "Mobile Legends", key: "Mobile Legends", logo: MLBB_LOGO },
            { name: "Free Fire", key: "Free Fire", logo: FF_LOGO },
            { name: "PS 4 Pro FC26", key: "PS 4 Pro FC26", logo: FC26_LOGO }
          ].map(game => {
            const isActive = activeTab === game.key;
            return (
              <button
                key={game.name}
                onClick={() => setActiveTab(game.key)}
                className={\`flex items-center justify-center p-2 rounded-lg transition-all shadow-sm cursor-pointer \${
                  isActive ? "bg-primary text-white shadow-md" : "hover:bg-gray-200/50"
                }\`}
              >
                <div className="w-16 sm:w-24 md:w-28 aspect-[2/1] flex items-center justify-center">
                  <img
                    src={game.logo}
                    alt={game.name}
                    className={\`h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105 \${
                      isActive ? "brightness-0 invert" : ""
                    }\`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto pb-8 pt-4 w-full">
        <div className="flex justify-between px-2 gap-8" style={{ minWidth: \`\${(totalRounds + 1) * 224}px\` }}>
          
          {roundsData.map((roundMatches, r) => {
            const isGrandFinal = r === totalRounds - 1;
            const roundTitle = isGrandFinal ? "Grand Final" : r === totalRounds - 2 ? "Semi Finals" : r === totalRounds - 3 ? "Quarter Finals" : \`Round \${r + 1}\`;
            const { paddingTop, gap } = getRoundStyle(r);

            return (
              <div key={r} className="flex flex-col shrink-0 relative w-48" style={{ paddingTop, gap }}>
                <h4 className={\`text-center uppercase tracking-wider absolute top-0 left-0 right-0 font-bold text-xs flex items-center justify-center gap-1 \${isGrandFinal ? 'text-gold' : 'text-slate-400'}\`}>
                  {isGrandFinal && <Trophy className="w-3 h-3" />} {roundTitle}
                </h4>
                
                {roundMatches.map((match, i) => (
                  <div key={i} className={\`h-[60px] \${isGrandFinal ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'} border rounded-lg p-2 shadow-sm flex flex-col justify-center gap-1 relative z-10\`}>
                    
                    <div className={\`px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold flex justify-between items-center \${match.team1 ? 'text-slate-700' : 'text-slate-400 italic'}\`}>
                      <span className="truncate">{match.team1 ? match.team1.nama : (r === 0 ? "TBD" : "Menunggu Lawan")}</span>
                      <span className="text-[10px] text-slate-400 font-mono">-</span>
                    </div>
                    <div className={\`px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold flex justify-between items-center \${match.team2 ? 'text-slate-700' : 'text-slate-400 italic'}\`}>
                      <span className="truncate">{match.team2 ? match.team2.nama : (r === 0 ? "TBD" : "Menunggu Lawan")}</span>
                      <span className="text-[10px] text-slate-400 font-mono">-</span>
                    </div>
                    
                    {r > 0 && (
                       <>
                         <div className="absolute w-[2px] bg-slate-200" style={{
                            height: \`\${76 * Math.pow(2, r - 1) + 2}px\`,
                            left: '-16px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                         }} />
                         <div className="absolute h-[2px] bg-slate-200" style={{
                            width: '16px',
                            left: '-16px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                         }} />
                       </>
                    )}

                    <div className="absolute h-[2px] bg-slate-200" style={{
                       width: '16px',
                       right: '-16px',
                       top: '50%',
                       transform: 'translateY(-50%)'
                    }} />

                  </div>
                ))}
              </div>
            );
          })}

          {/* Champion */}
          <div className="flex flex-col shrink-0 relative w-48" style={{ paddingTop: getRoundStyle(totalRounds - 1).paddingTop }}>
            <h4 className="text-center text-emerald-500 uppercase tracking-wider absolute top-0 left-0 right-0 font-bold text-xs flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Champion
            </h4>
            <div className="h-[60px] bg-emerald-50 border-2 border-emerald-500 rounded-lg p-2 shadow-sm flex flex-col justify-center gap-1 relative z-10 items-center text-center">
              <span className="text-sm font-black text-emerald-700 w-full truncate uppercase tracking-wide flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" /> ?
              </span>
              <div className="absolute h-[2px] bg-slate-200" style={{
                 width: '16px',
                 left: '-16px',
                 top: '50%',
                 transform: 'translateY(-50%)'
              }} />
            </div>
          </div>
                  
        </div>
      </div>
    </div>
  );
`;

const startIndex = content.indexOf('const filteredParticipants');
const endIndex = content.lastIndexOf(');') + 2;

content = content.substring(0, startIndex) + dynamicBracketCode + content.substring(endIndex);

fs.writeFileSync('src/components/TournamentBracket.tsx', content);
console.log('Done');
