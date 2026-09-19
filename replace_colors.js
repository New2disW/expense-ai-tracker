const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client', 'src');

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(dir);

let touchedFiles = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/emerald/g, 'indigo')
    .replace(/teal-shadow/g, 'indigo-shadow')
    .replace(/accent-gradient /g, 'accent-gradient-indigo ')
    .replace(/accent-gradient"/g, 'accent-gradient-indigo"')
    .replace(/#0f172a, #1e293b, #0c4a6e, #065f46/g, '#312e81, #3730a3, #4338ca, #4f46e5') // slideshow-bg
    .replace(/#4ECDC4 0%, #3CB3A6/g, '#818cf8 0%, #4f46e5'); // accent-gradient teal

  // We should also replace the Emerald gradient color stops just in case:
  newContent = newContent.replace(/#34d399 0%, #10b981/g, '#818cf8 0%, #4f46e5');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    touchedFiles.push(file);
  }
});

console.log("Touched files:");
touchedFiles.forEach(f => console.log(f.replace(path.join(__dirname, 'client'), '')));
