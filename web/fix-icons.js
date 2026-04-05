// fix-icons.js — Run from the web folder: node fix-icons.js
const fs = require("fs");
const filePath = "app/regions/RegionsSearch.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Find the line that starts the REGION_ICONS object and replace the whole block
const lines = content.split("\n");
const newLines = [];
let skipUntilClose = false;

for (const line of lines) {
  if (line.includes("REGION_ICONS") && line.includes("Record<string")) {
    newLines.push(line);
    skipUntilClose = true;
    continue;
  }
  if (skipUntilClose) {
    if (line.includes("};")) {
      // Replace the entire icon map
      newLines.push('  "london":"\u{1F3D9}\uFE0F","south-east":"\u{1F333}","south-west":"\u{1F30A}","east-midlands":"\u{1F3ED}",');
      newLines.push('  "west-midlands":"\u{1F3D7}\uFE0F","east-england":"\u{1F33E}","yorkshire":"\u2692\uFE0F",');
      newLines.push('  "north-west":"\u{1F3D9}\uFE0F","north-east":"\u2693","scotland":"\u{1F3D4}\uFE0F",');
      newLines.push('  "wales":"\u{1F409}","northern-ireland":"\u2618\uFE0F",');
      newLines.push(line); // the closing };
      skipUntilClose = false;
      continue;
    }
    // Skip old icon lines
    continue;
  }
  newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
console.log("Done! Icons updated.");
