const fs = require('fs');

const pagesToWrap = [
  'app/(admin)/admin-login/page.tsx',
  'app/(main)/login/page.tsx',
  'app/(main)/reset-password/page.tsx'
];

for (const p of pagesToWrap) {
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');
  
  // Skip if already wrapped
  if (content.includes('fallback=')) continue;
  
  if (!content.includes('Suspense')) {
    content = content.replace(/import { useState } from "react";/, 'import { useState, Suspense } from "react";');
    content = content.replace(/import { useState } from 'react';/, "import { useState, Suspense } from 'react';");
    content = content.replace(/import React, { useState } from 'react';/, "import React, { useState, Suspense } from 'react';");
  }

  const match = content.match(/export default function ([A-Za-z0-9_]+)\(\)/);
  if (match) {
    const fnName = match[1];
    content = content.replace(/export default function [A-Za-z0-9_]+\(\)/, `function ${fnName}Content()`);
    content += `\n\nexport default function ${fnName}() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <${fnName}Content />\n    </Suspense>\n  );\n}\n`;
    fs.writeFileSync(p, content);
  }
}
console.log('done');
