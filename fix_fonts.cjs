const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace --font-heading
css = css.replace(
  /--font-heading: "Inter", ui-sans-serif, system-ui, sans-serif;/g,
  `--font-heading: "Bebas Neue", ui-sans-serif, system-ui, sans-serif;`
);

// Define Base scale
const baseStyles = `
@layer base {
  body {
    font-family: var(--font-body);
    background-color: var(--color-soft);
    color: var(--color-dark);
    margin: 0;
    font-size: 15px;
    font-weight: 400;
  }
  @media (min-width: 768px) {
    body { font-size: 16px; }
  }
  @media (min-width: 1024px) {
    body { font-size: 17px; }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 400;
  }

  h1 { font-size: 42px; line-height: 1.1; }
  h2 { font-size: 34px; line-height: 1.1; }
  h3 { font-size: 28px; line-height: 1.2; }
  h4 { font-size: 24px; line-height: 1.2; }

  @media (min-width: 768px) {
    h1 { font-size: 52px; }
    h2 { font-size: 40px; }
    h3 { font-size: 32px; }
    h4 { font-size: 26px; }
  }

  @media (min-width: 1024px) {
    h1 { font-size: 64px; }
    h2 { font-size: 48px; }
    h3 { font-size: 36px; }
    h4 { font-size: 28px; }
  }

  strong, b { font-weight: 600; }
  button { font-weight: 600; }
}
`;

// Replace existing @layer base
css = css.replace(/@layer base \{[\s\S]*?\n\}/, baseStyles);

fs.writeFileSync('src/index.css', css);
console.log('CSS updated');
