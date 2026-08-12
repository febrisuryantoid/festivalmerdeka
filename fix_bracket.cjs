const fs = require('fs');

let code = fs.readFileSync('src/components/TournamentBracket.tsx', 'utf8');

// 1. Add mergeRegistrations to imports
code = code.replace(
  /import \{ getLocalRegistrations, RegistrationData, parseTimestampMillis \} from "\.\.\/lib\/registrationsStore";/,
  `import { getLocalRegistrations, mergeRegistrations, RegistrationData, parseTimestampMillis } from "../lib/registrationsStore";`
);

// 2. Fix the initial state
code = code.replace(
  /const local = getLocalRegistrations\(\);\s*return local\.filter\(p => \(p\.status \|\| ""\)\.toLowerCase\(\)\.trim\(\) === "verified"\);/,
  `const local = getLocalRegistrations();\n      return local.filter(p => (p.status || "").toLowerCase().trim() !== "rejected");`
);

// 3. Fix onSnapshot
code = code.replace(
  /const docs = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \} as RegistrationData\)\);\s*const verified = docs\.filter\(d => \(d\.status \|\| ""\)\.toLowerCase\(\)\.trim\(\) === "verified"\);\s*setParticipants\(verified\);/g,
  `const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegistrationData));\n      const local = getLocalRegistrations();\n      const merged = mergeRegistrations(docs, local);\n      const activeParticipants = merged.filter(d => (d.status || "").toLowerCase().trim() !== "rejected");\n      setParticipants(activeParticipants);`
);

// 4. Fix fallback in onSnapshot error
code = code.replace(
  /console\.warn\("Bracket realtime fetch failed:", error\);/g,
  `console.warn("Bracket realtime fetch failed:", error);\n      const local = getLocalRegistrations().filter(p => (p.status || "").toLowerCase().trim() !== "rejected");\n      setParticipants(local);`
);

// 5. Fix kategori null check
code = code.replace(
  /const k = kategori\.toLowerCase\(\);/g,
  `const k = (kategori || "").toLowerCase();`
);

// 6. Fix filteredParticipants verified check
code = code.replace(
  /if \(\(p\.status \|\| ""\)\.toLowerCase\(\) !== "verified"\) return false;/g,
  `if ((p.status || "").toLowerCase().trim() === "rejected") return false;`
);

fs.writeFileSync('src/components/TournamentBracket.tsx', code);
console.log('Fixed Tournament Bracket');
