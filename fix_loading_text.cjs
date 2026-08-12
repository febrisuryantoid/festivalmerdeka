const fs = require('fs');
let code = fs.readFileSync('src/components/LoadingScreen.tsx', 'utf8');

code = code.replace(
  /<div className="text-primary font-heading font-black tracking-\[0.3em\] uppercase text-xs sm:text-sm drop-shadow-sm flex items-center justify-center gap-1">[\s\S]*?<\/div>/,
  `<div className="text-primary font-heading font-black tracking-[0.3em] uppercase text-xs sm:text-sm drop-shadow-sm flex items-center justify-center gap-1">
              <span>M</span><span>E</span><span>M</span><span>U</span><span>A</span><span>T</span>
            </div>
            <div className="mt-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Festival eSports Karang Taruna
            </div>`
);

fs.writeFileSync('src/components/LoadingScreen.tsx', code);
console.log('Fixed loading text');
