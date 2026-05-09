// Post-build: copy static export to public_html/
// Hostinger sandbox layout:
//   public_html/                    ← Apache document root (REAL)
//     .builds/source/
//       repository/                 ← repo (npm runs here)
//         scripts/deploy-static.cjs ← this script
const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');
// Go up 3 levels from repo: repository → source → .builds → public_html
const publicDir = path.resolve(repoDir, '..', '..', '..');

console.log(`Repo: ${repoDir}`);
console.log(`Target public_html: ${publicDir}`);

// Auto-detect output directory (out/ for export, .next/ for standard build)
let srcDir = null;
const candidates = [
  { dir: 'out',                  desc: 'output: export' },
  { dir: '.next/server/app',     desc: '.next server output' },
  { dir: '.next/standalone',     desc: '.next standalone' },
  { dir: '.next/static',         desc: '.next static assets (partial)' },
];

for (const c of candidates) {
  const p = path.join(repoDir, c.dir);
  if (fs.existsSync(p) && fs.readdirSync(p).length > 0) {
    srcDir = p;
    console.log(`Detected output: ${c.dir} (${c.desc})`);
    break;
  }
}

if (!srcDir) {
  console.error('No build output found. Tried: ' + candidates.map(c => c.dir).join(', '));
  // List repo contents for debugging
  console.error('Repo contents:');
  fs.readdirSync(repoDir).forEach(f => console.error(' - ' + f));
  process.exit(1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy all files to public_html/
console.log(`Copying ${srcDir} → ${publicDir} ...`);
copyDir(srcDir, publicDir);

// Also copy .next/static/ → public_html/_next/static/ for JS/CSS assets
const staticSrc = path.join(repoDir, '.next', 'static');
const staticDest = path.join(publicDir, '_next', 'static');
if (fs.existsSync(staticSrc)) {
  console.log(`Copying ${staticSrc} → ${staticDest} ...`);
  copyDir(staticSrc, staticDest);
} else {
  // For output: 'export' builds, static assets are in out/_next/static/
  const outStaticSrc = path.join(repoDir, 'out', '_next', 'static');
  if (fs.existsSync(outStaticSrc)) {
    console.log(`Copying ${outStaticSrc} → ${staticDest} ...`);
    copyDir(outStaticSrc, staticDest);
  }
}
console.log('✓ Files deployed');

// Write .htaccess WITHOUT Passenger proxy
const htaccess = `# AOMAN FUTURE — static site (no Passenger)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve .html files without extension
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Missing path → 404
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /404.html [L]
</IfModule>

<IfModule mod_mime.c>
  AddType text/javascript .js
  AddType text/css .css
  AddType image/webp .webp
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
`;

fs.writeFileSync(path.join(publicDir, '.htaccess'), htaccess);
console.log('✓ .htaccess written');
