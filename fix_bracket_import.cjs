const fs = require('fs');
let code = fs.readFileSync('src/components/TournamentBracket.tsx', 'utf8');
code = code.replace(/import { motion, AnimatePresence } from "motion\/react";\n/g, "");
fs.writeFileSync('src/components/TournamentBracket.tsx', code);
