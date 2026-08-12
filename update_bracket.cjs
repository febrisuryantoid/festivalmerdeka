const fs = require('fs');
let code = fs.readFileSync('src/components/TournamentBracket.tsx', 'utf8');

if (!code.includes("ChevronsRight")) {
    code = code.replace(
        /import \{ ShieldCheck, Trophy, Swords \} from "lucide-react";/,
        'import { ShieldCheck, Trophy, Swords, ChevronsRight } from "lucide-react";'
    );
}

const swipeIndicator = `
      {/* Mobile Scroll Indicator */}
      <div className="md:hidden flex items-center justify-end text-xs font-semibold text-gray-500 mb-2 px-2 animate-pulse">
        Geser untuk melihat bagan <ChevronsRight className="w-4 h-4 ml-1" />
      </div>

      <div className="overflow-x-auto pb-8 pt-4 w-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
`;

code = code.replace(/<div className="overflow-x-auto pb-8 pt-4 w-full">/, swipeIndicator);

fs.writeFileSync('src/components/TournamentBracket.tsx', code);
console.log('Added swipe indicator');
