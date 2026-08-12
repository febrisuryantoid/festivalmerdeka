const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// revert top level to div
code = code.replace(
  /<main className="min-h-screen bg-white font-inter text-slate-800" role="main">/,
  '<div className="min-h-screen bg-white font-inter text-slate-800" role="main">'
);

// revert closing
code = code.replace(/<\/main>\n  \);\n}/, '</div>\n  );\n}');

fs.writeFileSync('src/App.tsx', code);
console.log('Reverted main to div');
