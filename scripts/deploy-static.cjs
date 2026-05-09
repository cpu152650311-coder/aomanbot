// Post-build: copy static export to parent (public_html)
// Run after `next build` — Hostinger dir layout:
//   nodejs/       ← repo deployed here
//   public_html/  ← Apache document root (../public_html/)

const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'out');
const publicDir = path.resolve(__dirname, '..', '..', 'public_html');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) { console.error(`✗ ${src} not found`); process.exit(1); }
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

console.log('Copying out/ → ../public_html/ ...');
copyDir(outDir, publicDir);
console.log('✓ Static files deployed to public_html/');

// Write .htaccess that serves static files WITHOUT Passenger
const htaccess = `# AOMAN FUTURE — static site (no Passenger needed)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve .html files without extension
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # If file doesn't exist, show 404
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

const htaccessPath = path.join(publicDir, '.htaccess');
fs.writeFileSync(htaccessPath, htaccess);
console.log('✓ .htaccess written (no Passenger proxy)');
