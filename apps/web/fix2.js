const fs = require('fs');

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
    
    // Check if use client is on line 2
    if (content.includes("use client")) {
      // Remove all "use client" and 'use client'
      content = content.replace(/'use client';?\n?/g, '');
      content = content.replace(/"use client";?\n?/g, '');
      
      // Put it exactly at the top
      content = '"use client";\n' + content;
      fs.writeFileSync(p, content);
    }
  }
}
console.log('done');
