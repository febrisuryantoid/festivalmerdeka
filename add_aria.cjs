const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<section id="tentang"/g, '<section aria-label="Tentang Festival" id="tentang"');
code = code.replace(/<section id="jadwal"/g, '<section aria-label="Jadwal Acara" id="jadwal"');
code = code.replace(/<section id="esport"/g, '<section aria-label="Cabang Perlombaan" id="esport"');
code = code.replace(/<section id="daftar"/g, '<section aria-label="Formulir Pendaftaran" id="daftar"');
code = code.replace(/<section id="bagan"/g, '<section aria-label="Bagan dan Papan Peringkat" id="bagan"');
code = code.replace(/<section id="lokasi"/g, '<section aria-label="Lokasi Acara" id="lokasi"');
code = code.replace(/<section id="faq"/g, '<section aria-label="Tanya Jawab" id="faq"');

// also add aria-label to main nav
code = code.replace(/<nav className=\{/g, '<nav aria-label="Navigasi Utama" className={');

fs.writeFileSync('src/App.tsx', code);
console.log('Added aria-labels to sections');
