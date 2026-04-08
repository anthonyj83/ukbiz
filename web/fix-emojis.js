const fs = require("fs");

function hexToStr(hex) {
  return Buffer.from(hex, "hex").toString("utf-8");
}

// New emojis
const CHART = hexToStr("f09f93ca");       // 📊
const BRICK = hexToStr("f09fa7b1");       // 🧱
const LIGHTBULB = hexToStr("f09f92a1");   // 💡
const LAPTOP = hexToStr("f09f92bb");      // 💻
const WAVE = hexToStr("f09f8c8a");        // 🌊

// Fix CitySearch.tsx industry icons
const csPath = "web/app/city/[city]/CitySearch.tsx";
let cs = fs.readFileSync(csPath, "utf-8");

// management-consulting: old 💼 -> 📊
cs = cs.replace(/"management-consulting": "[^"]*"/, '"management-consulting": "' + CHART + '"');
// building-services: old 🏗️ -> 🧱  
cs = cs.replace(/"building-services": "[^"]*"/, '"building-services": "' + BRICK + '"');
// consultancy: old 💼 -> 💡
cs = cs.replace(/"consultancy": "[^"]*"/, '"consultancy": "' + LIGHTBULB + '"');
// it-services: old 🖥️ -> 💻
cs = cs.replace(/"it-services": "[^"]*"/, '"it-services": "' + LAPTOP + '"');

fs.writeFileSync(csPath, Buffer.from(cs, "utf-8"));
console.log("Fixed CitySearch.tsx industry icons");

// Fix page.tsx - Northern Ireland region emoji
const pgPath = "web/app/page.tsx";
let pg = fs.readFileSync(pgPath, "utf-8");

// Find and replace Northern Ireland emoji in REGION_ICON_MAP
// The map has entries like "northern-ireland": "☘️"
pg = pg.replace(/"northern-ireland": "[^"]*"/, '"northern-ireland": "' + WAVE + '"');

fs.writeFileSync(pgPath, Buffer.from(pg, "utf-8"));
console.log("Fixed Northern Ireland emoji on front page");

console.log("Done!");
