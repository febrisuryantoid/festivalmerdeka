const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes('TournamentBracket')) {
  code = code.replace(
    /import { LiveLeaderboard } from "\.\/components\/LiveLeaderboard";/,
    `import { LiveLeaderboard } from "./components/LiveLeaderboard";\nimport { TournamentBracket } from "./components/TournamentBracket";`
  );
}

// Add section
const sectionToInsert = `
      {/* Bagan Turnamen */}
      <section id="bagan" className="py-20 sm:py-28 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}>
            <TournamentBracket />
          </motion.div>
        </div>
      </section>
`;

code = code.replace(
  /<\/section>\s*\{\/\* Paket Sponsor Festival \*\/\}/,
  `</section>\n${sectionToInsert}\n      {/* Paket Sponsor Festival */}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Added TournamentBracket section');
