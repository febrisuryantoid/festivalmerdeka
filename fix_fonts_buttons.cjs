const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const updatedStyles = `
  strong, b { font-weight: 600; }
  
  button { 
    font-family: var(--font-body);
    font-weight: 600; 
    font-size: 14px;
  }
  
  .caption {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 400;
  }

  @media (min-width: 768px) {
    button { font-size: 15px; }
    .caption { font-size: 13px; }
  }

  @media (min-width: 1024px) {
    button { font-size: 15px; font-weight: 700; }
    .caption { font-size: 13px; }
  }
}
`;

css = css.replace(/strong, b \{ font-weight: 600; \}\s*button \{ font-weight: 600; \}\s*\}/, updatedStyles);

fs.writeFileSync('src/index.css', css);
console.log('Button and caption styles updated');
