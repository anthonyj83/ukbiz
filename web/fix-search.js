const fs = require("fs");
const pagePath = "app/page.tsx";
let page = fs.readFileSync(pagePath, "utf-8");

// 1. Replace imports
page = page.replace('import CompanySearch from "./CompanySearch";\n', '');
page = page.replace('import HomeSearch from "./HomeSearch";', 'import UnifiedSearch from "./UnifiedSearch";');

// 2. Replace HomeSearch component with UnifiedSearch
page = page.replace(
  '<HomeSearch industries={industries} regions={regions} manifest={manifest} />',
  '<UnifiedSearch industries={industries} regions={regions} manifest={manifest} />'
);

// 3. Remove CompanySearch component (wherever it is)
page = page.replace(/\s*<CompanySearch\s*\/>\s*\n/g, '\n');

// 4. Remove the CompanySearch section wrapper if it exists
page = page.replace(/\s*{\/\* Company Search \*\/}\s*\n\s*<section[^>]*>\s*\n\s*<CompanySearch\s*\/>\s*\n\s*<\/section>\s*\n/g, '\n');

// 5. Fix the random "7064" 
page = page.replace(/\n\s*7064\s*/, '\n');
// Also try with spaces
page = page.replace('7064          <div', '          <div');

// 6. Update placeholder if old one exists anywhere
page = page.replace('Acme Ltd, BT1, Belfast', 'Acme Ltd, SW1, London');

fs.writeFileSync(pagePath, page, "utf-8");
console.log("Done! Unified search installed, old searches removed, 7064 fixed.");
