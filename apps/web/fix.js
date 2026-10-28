const fs = require('fs');
const path = require('path');

const pages = [
  'app/(admin)/admin-login/page.tsx',
  'app/(main)/login/page.tsx',
  'app/(main)/reset-password/page.tsx',
  'app/(main)/partner-login/page.tsx',
  'app/(main)/partner-login/register/page.tsx',
  'app/(main)/partner-login/register-collector/page.tsx',
  'app/(main)/register/page.tsx'
];

for (const p of pages) {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    if (!content.includes('export const dynamic')) {
      fs.writeFileSync(p, "export const dynamic = 'force-dynamic';\n" + content);
    }
  }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('route.ts')) results.push(file);
    }
  });
  return results;
}

const routes = walk('app/api');
for (const r of routes) {
  let content = fs.readFileSync(r, 'utf8');
  if (content.includes('export async function GET') && !content.includes('export const dynamic')) {
    fs.writeFileSync(r, "export const dynamic = 'force-dynamic';\n" + content);
  }
}
console.log('done');
