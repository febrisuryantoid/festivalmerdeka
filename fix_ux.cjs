const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Hero section
code = code.replace(
  /<section className="relative h-\[100dvh\] w-full snap-start snap-always overflow-hidden flex flex-col justify-center items-center bg-white">/,
  `<section className="relative min-h-[90vh] md:min-h-screen pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden flex flex-col justify-center items-center bg-white">`
);

// Replace Tentang section
code = code.replace(
  /<section id="tentang" className="min-h-\[100dvh\] snap-start snap-always w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center py-12"/,
  `<section id="tentang" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6"`
);

// Replace Jadwal section
code = code.replace(
  /<section id="jadwal" className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 bg-white\/60 backdrop-blur-2xl border-y border-white\/50 relative overflow-hidden flex flex-col justify-center"/,
  `<section id="jadwal" className="py-20 sm:py-28 bg-white/60 backdrop-blur-2xl border-y border-white/50 relative overflow-hidden"`
);

// Replace eSport section
code = code.replace(
  /<section id="esport" className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 bg-white\/60 backdrop-blur-2xl border-t border-white\/50 relative overflow-hidden flex flex-col justify-center"/,
  `<section id="esport" className="py-20 sm:py-28 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden"`
);

// Replace Daftar section
code = code.replace(
  /<section id="daftar" className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 relative overflow-hidden bg-white\/60 backdrop-blur-2xl border-t border-white\/50 flex flex-col justify-center"/,
  `<section id="daftar" className="py-20 sm:py-28 relative overflow-hidden bg-white/60 backdrop-blur-2xl border-t border-white/50"`
);

// Replace generic Sponsor/Payment sections
code = code.replace(
  /<section className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 bg-white\/60 backdrop-blur-2xl border-t border-white\/50 relative overflow-hidden flex flex-col justify-center">/g,
  `<section className="py-20 sm:py-28 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden">`
);

// Replace rounded Sponsor section
code = code.replace(
  /<section className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 bg-white relative overflow-hidden max-w-7xl mx-auto rounded-\[24px\] sm:rounded-\[32px\] shadow-\[0_8px_40px_-12px_rgba\(0,0,0,0\.08\)\] border border-gray-100 flex flex-col justify-center w-full">/,
  `<section className="py-16 sm:py-20 bg-white relative overflow-hidden my-12 sm:my-20 max-w-7xl mx-auto rounded-[24px] sm:rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100 w-full">`
);

// Replace Lokasi
code = code.replace(
  /<section id="lokasi" className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 bg-white\/60 backdrop-blur-2xl border-t border-white\/50 relative overflow-hidden flex flex-col justify-center">/,
  `<section id="lokasi" className="py-20 sm:py-28 bg-white/60 backdrop-blur-2xl border-t border-white/50 relative overflow-hidden">`
);

// Replace Download Proposal
code = code.replace(
  /<section className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 px-4 sm:px-6 w-full max-w-7xl mx-auto flex flex-col justify-center">/,
  `<section className="py-20 sm:py-24 px-4 sm:px-6 w-full max-w-7xl mx-auto">`
);

// Replace FAQ
code = code.replace(
  /<section id="faq" className="min-h-\[100dvh\] snap-start snap-always py-12 sm:py-16 flex flex-col justify-center w-full max-w-7xl mx-auto px-4"/,
  `<section id="faq" className="py-20 sm:py-28 w-full max-w-7xl mx-auto px-4 sm:px-6"`
);

// Replace Footer
code = code.replace(
  /<footer className="bg-primary text-white w-full mt-0 border-t border-red-700 min-h-\[100dvh\] snap-start snap-always flex flex-col justify-center">/,
  `<footer className="bg-primary text-white w-full mt-16 border-t border-red-700">`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed UX paddings');
