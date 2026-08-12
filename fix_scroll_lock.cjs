const fs = require('fs');
let code = fs.readFileSync('src/components/LoadingScreen.tsx', 'utf8');

code = code.replace(
  /const minDuration = 2000;/,
  `// Lock scroll
    document.body.style.overflow = 'hidden';

    const minDuration = 2000;`
);

code = code.replace(
  /cancelAnimationFrame\(animationFrameId\);/,
  `cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = '';`
);

fs.writeFileSync('src/components/LoadingScreen.tsx', code);
console.log('Scroll lock fixed');
