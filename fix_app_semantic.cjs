const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Revert the opening tags to div and add role="region" and aria-labels instead
code = code.replace(/<section id="beranda" aria-labelledby="beranda-heading" /g, '<div id="beranda" role="region" aria-label="Beranda" ');
code = code.replace(/<section id="informasi" aria-labelledby="informasi-heading"/g, '<div id="informasi" role="region" aria-label="Informasi"');
code = code.replace(/<section id="cabang" aria-labelledby="cabang-heading"/g, '<div id="cabang" role="region" aria-label="Cabang Lomba"');
code = code.replace(/<section id="daftar" aria-labelledby="daftar-heading"/g, '<div id="daftar" role="region" aria-label="Pendaftaran"');
code = code.replace(/<section id="leaderboard" aria-labelledby="leaderboard-heading"/g, '<div id="leaderboard" role="region" aria-label="Papan Peringkat"');
code = code.replace(/<section id="bracket" aria-labelledby="bracket-heading"/g, '<div id="bracket" role="region" aria-label="Bagan Turnamen"');
code = code.replace(/<section id="prizepool" aria-labelledby="prizepool-heading"/g, '<div id="prizepool" role="region" aria-label="Prize Pool"');
code = code.replace(/<section id="proposal" aria-labelledby="proposal-heading"/g, '<div id="proposal" role="region" aria-label="Proposal"');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed unmatched section tags, used roles instead');
