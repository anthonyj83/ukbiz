const fs = require("fs");
const path = require("path");

// 1. Create privacy page directory and copy file
const privacyDir = path.join("app", "privacy");
if (!fs.existsSync(privacyDir)) fs.mkdirSync(privacyDir, { recursive: true });
fs.copyFileSync("privacy-page.tsx", path.join(privacyDir, "page.tsx"));
console.log("Created app/privacy/page.tsx");

// 2. Create terms page directory and copy file
const termsDir = path.join("app", "terms");
if (!fs.existsSync(termsDir)) fs.mkdirSync(termsDir, { recursive: true });
fs.copyFileSync("terms-page.tsx", path.join(termsDir, "page.tsx"));
console.log("Created app/terms/page.tsx");

// 3. Fix the stats bar on the homepage - replace "576 Browse Pages" with something useful
const pagePath = path.join("app", "page.tsx");
let page = fs.readFileSync(pagePath, "utf-8");

// Replace the Browse Pages stat with "Free to Use"
page = page.replace(
  /<div className="text-2xl font-bold text-white">\{totalPages\.toLocaleString\(\)\}<\/div>\s*\n\s*<div>Browse Pages<\/div>/,
  '<div className="text-2xl font-bold text-white">100%</div>\n              <div>Free to Use</div>'
);

fs.writeFileSync(pagePath, page, "utf-8");
console.log("Fixed stats bar - replaced 'Browse Pages' with 'Free to Use'");

console.log("\nDone! Now commit and push.");
