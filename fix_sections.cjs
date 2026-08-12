const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace <section ... id="tentang" ...>
code = code.replace(
  /<section\s+id="tentang"\s+className="[^"]*"/,
  `<section id="tentang" className="min-h-[100dvh] snap-start w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center py-12"`
);

// replace jadwal
code = code.replace(
  /<section\s+id="jadwal"\s+className="[^"]*"/,
  `<section id="jadwal" className="min-h-[100dvh] snap-start py-12 sm:py-16 bg-white/60 backdrop-blur-2xl border-y border-white/50 relative overflow-hidden flex flex-col justify-center"`
);

// esport
code = code.replace(
  /<section\s+id="esport"\s+className="[^"]*"/,
  `<section id="esport" className="min-h-[100dvh] snap-start py-12 sm:py-16 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden flex flex-col justify-center"`
);

// daftar
code = code.replace(
  /<section\s+id="daftar"\s+className="[^"]*"/,
  `<section id="daftar" className="min-h-[100dvh] snap-start py-12 sm:py-16 relative overflow-hidden bg-white/60 backdrop-blur-2xl border-t border-white/50 flex flex-col justify-center"`
);

// faq
code = code.replace(
  /<section\s+id="faq"\s+className="[^"]*"/,
  `<section id="faq" className="min-h-[100dvh] snap-start py-12 sm:py-16 flex flex-col justify-center w-full max-w-7xl mx-auto px-4"`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed multiline sections');
