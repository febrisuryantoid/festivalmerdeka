const fs = require('fs');
let code = fs.readFileSync('src/components/LoadingScreen.tsx', 'utf8');

// Ensure minDuration is 2 seconds
code = code.replace(
  /const minDuration = 2000;/,
  `const minDuration = 2000;`
);

fs.writeFileSync('src/components/LoadingScreen.tsx', code);
