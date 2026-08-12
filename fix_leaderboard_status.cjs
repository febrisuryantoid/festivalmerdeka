const fs = require('fs');
let code = fs.readFileSync('src/components/LiveLeaderboard.tsx', 'utf8');

const dynamicStatus = `
                          {(!item.status || item.status.toLowerCase().trim() === "pending") ? (
                            <span className="inline-flex items-center justify-end gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> PENDING
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> TERVERIFIKASI
                            </span>
                          )}
`;

code = code.replace(
  /<span className="inline-flex items-center justify-end gap-1 text-\[11px\] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">\s*<ShieldCheck className="w-3\.5 h-3\.5 text-emerald-600" \/> TERVERIFIKASI\s*<\/span>/,
  dynamicStatus.trim()
);

fs.writeFileSync('src/components/LiveLeaderboard.tsx', code);
console.log('Fixed Leaderboard Status UI');
