const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Hero section
code = code.replace(
  /<section className="relative min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden flex flex-col justify-center items-center bg-white">/,
  `<section className="relative h-[100dvh] w-full snap-start overflow-hidden flex flex-col justify-center items-center bg-white">`
);

// Outline for "KARANG TARUNA"
code = code.replace(
  /<span className="block text-primary drop-shadow-sm">\s*KARANG TARUNA\s*<\/span>/,
  `<span className="block text-transparent [-webkit-text-stroke:1.5px_var(--color-primary)] sm:[-webkit-text-stroke:2px_var(--color-primary)] drop-shadow-sm">\n              KARANG TARUNA\n            </span>`
);

// Replace Tentang section
code = code.replace(
  /<section\s*id="tentang"\s*className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">/,
  `<section id="tentang" className="h-[100dvh] snap-start w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center">`
);

// Replace Jadwal section
code = code.replace(
  /<section\s*id="jadwal"\s*className="py-16 sm:py-24 bg-white\/60 backdrop-blur-2xl border-y border-white\/50 relative overflow-hidden">/,
  `<section id="jadwal" className="min-h-[100dvh] snap-start py-12 sm:py-16 bg-white/60 backdrop-blur-2xl border-y border-white/50 relative overflow-hidden flex flex-col justify-center">`
);

// Replace eSport section
code = code.replace(
  /<section\s*id="esport"\s*className="py-16 sm:py-24 bg-white\/60 backdrop-blur-2xl border-t border-white\/50 relative overflow-hidden">/,
  `<section id="esport" className="min-h-[100dvh] snap-start py-12 sm:py-16 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden flex flex-col justify-center">`
);

// Replace Daftar section
code = code.replace(
  /<section\s*id="daftar"\s*className="py-16 sm:py-24 relative overflow-hidden bg-white\/60 backdrop-blur-2xl border-t border-white\/50 pb-20 sm:pb-32">/,
  `<section id="daftar" className="min-h-[100dvh] snap-start py-12 sm:py-16 relative overflow-hidden bg-white/60 backdrop-blur-2xl border-t border-white/50 flex flex-col justify-center">`
);

// Replace Sponsor Festival section
code = code.replace(
  /<section className="py-16 sm:py-24 bg-white\/60 backdrop-blur-2xl border-t border-white\/50 relative overflow-hidden">/g,
  `<section className="min-h-[100dvh] snap-start py-12 sm:py-16 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden flex flex-col justify-center">`
);

// Replace specific other sections
code = code.replace(
  /<section className="py-12 sm:py-16 bg-white relative overflow-hidden my-8 sm:my-16 max-w-7xl mx-auto rounded-\[24px\] sm:rounded-\[32px\] shadow-\[0_8px_40px_-12px_rgba\(0,0,0,0\.08\)\] border border-gray-100">/,
  `<section className="min-h-[100dvh] snap-start py-12 sm:py-16 bg-white relative overflow-hidden my-8 sm:my-16 max-w-7xl mx-auto rounded-[24px] sm:rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col justify-center w-full">`
);

code = code.replace(
  /<section id="lokasi" className="py-16 sm:py-24 bg-white\/60 backdrop-blur-2xl border-t border-white\/50 relative overflow-hidden">/,
  `<section id="lokasi" className="min-h-[100dvh] snap-start py-12 sm:py-16 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden flex flex-col justify-center">`
);

code = code.replace(
  /<section className="py-16 sm:py-20 px-4 sm:px-6 w-full max-w-7xl mx-auto">/,
  `<section className="min-h-[100dvh] snap-start py-12 sm:py-16 px-4 sm:px-6 w-full max-w-7xl mx-auto flex flex-col justify-center">`
);

code = code.replace(
  /<section\s*id="faq"\s*className="py-16 sm:py-24">/,
  `<section id="faq" className="min-h-[100dvh] snap-start py-12 sm:py-16 flex flex-col justify-center">`
);

fs.writeFileSync('src/App.tsx', code);
console.log('updated sections');
