const fs = require('fs');
const path = require('path');

const targetStr = 'Zen-G Wear';
const replaceStr = 'Zen-G Wear';
const targetStrLower = 'zen-g-wear';
const replaceStrLower = 'zen-g-wear';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  content = content.replace(new RegExp(targetStr, 'g'), replaceStr);
  content = content.replace(new RegExp(targetStrLower, 'g'), replaceStrLower);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'postman') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      // only replace in text files (js, jsx, json, md, html, env, js)
      const ext = path.extname(fullPath);
      if (['.js', '.jsx', '.json', '.md', '.html', '.example'].includes(ext) || file === '.env') {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir(__dirname);
