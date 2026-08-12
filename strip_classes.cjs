const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // A regex to find <h1, <h2, <h3, <h4, <h5, <h6 tags and remove specific classes
  // We'll replace the text-* and font-* classes in className=""
  content = content.replace(/<(h[1-6])([^>]*)className="([^"]*)"/g, (match, tag, beforeClass, className) => {
    // Remove text- size classes
    let newClass = className.replace(/\b(text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)|(sm|md|lg|xl|2xl):text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl))\b/g, '');
    // Remove font weight classes
    newClass = newClass.replace(/\b(font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black))\b/g, '');
    
    // Clean up multiple spaces
    newClass = newClass.replace(/\s+/g, ' ').trim();
    
    if (newClass) {
      return `<${tag}${beforeClass}className="${newClass}"`;
    } else {
      return `<${tag}${beforeClass}`;
    }
  });

  fs.writeFileSync(file, content);
});
console.log('Stripped sizing/weight from headings');
