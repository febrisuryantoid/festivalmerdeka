const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove font-weight classes specifically when they are next to font-heading
  content = content.replace(/font-heading\s+(font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black))\b/g, 'font-heading');
  content = content.replace(/\b(font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black))\s+font-heading/g, 'font-heading');
  
  fs.writeFileSync(file, content);
});
console.log('Cleaned up Bebas Neue font weights');
