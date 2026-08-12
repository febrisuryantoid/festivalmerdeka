const fs = require('fs');
let code = fs.readFileSync('src/components/LiveLeaderboard.tsx', 'utf8');

// Fix initial state
code = code.replace(
  /const local = getLocalRegistrations\(\);\s*return local\.filter\(p => \(p\.status \|\| ""\)\.toLowerCase\(\)\.trim\(\) === "verified"\);/,
  `const local = getLocalRegistrations();\n      return local.filter(p => (p.status || "").toLowerCase().trim() !== "rejected");`
);

// Fix onSnapshot
code = code.replace(
  /setParticipants\(merged\.filter\(p => \(p\.status \|\| ""\)\.toLowerCase\(\)\.trim\(\) === "verified"\)\);/g,
  `setParticipants(merged.filter(p => (p.status || "").toLowerCase().trim() !== "rejected"));`
);

// Fix fallback in onSnapshot error
code = code.replace(
  /const local = getLocalRegistrations\(\)\.filter\(p => \(p\.status \|\| ""\)\.toLowerCase\(\)\.trim\(\) === "verified"\);/g,
  `const local = getLocalRegistrations().filter(p => (p.status || "").toLowerCase().trim() !== "rejected");`
);

// We need to also show the status label (e.g., Pending, Verified) on the leaderboard if possible, but that might be extra. Let's just fix the filter first.
fs.writeFileSync('src/components/LiveLeaderboard.tsx', code);
console.log('Fixed Live Leaderboard');
