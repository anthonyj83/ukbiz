const fs = require("fs");
const path = require("path");

// Add CompanySearch import and component to the front page
const pagePath = path.join("app", "page.tsx");

if (!fs.existsSync(pagePath)) {
  console.log("ERROR: app/page.tsx not found. Run from the web folder.");
  process.exit(1);
}

let page = fs.readFileSync(pagePath, "utf-8");

// Check if already added
if (page.includes("CompanySearch")) {
  console.log("CompanySearch already in page.tsx - skipping.");
  process.exit(0);
}

// Add import
if (page.includes('import Link from')) {
  page = page.replace('import Link from', 'import CompanySearch from "./CompanySearch";\nimport Link from');
} else {
  // Add at top after first import
  page = page.replace(/(import .+\n)/, '$1import CompanySearch from "./CompanySearch";\n');
}

// Add <CompanySearch /> after the <p> tag that follows the <h1>
// Look for the closing </p> + whitespace + <div pattern after the hero text
const insertPatterns = [
  // Try after the subtitle paragraph
  /(<p className="text-gray-600[^"]*">[^<]+<\/p>\s*\n)/,
  // Try after any early </p> followed by content
  /(<\/p>\s*\n)(\s*<div)/,
];

let inserted = false;
for (const pattern of insertPatterns) {
  if (pattern.test(page)) {
    page = page.replace(pattern, (match, p1, p2) => {
      if (p2) return p1 + '\n      <CompanySearch />\n\n' + p2;
      return p1 + '\n      <CompanySearch />\n';
    });
    inserted = true;
    break;
  }
}

if (!inserted) {
  // Fallback: insert after first <div className="max-w...">
  page = page.replace(
    /(<div className="max-w[^"]*"[^>]*>\s*\n)/,
    '$1      <CompanySearch />\n\n'
  );
  inserted = true;
}

fs.writeFileSync(pagePath, page, "utf-8");
console.log("Done! Added CompanySearch to app/page.tsx");

// Update package.json build script
const pkgPath = "package.json";
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  if (pkg.scripts && pkg.scripts.build) {
    if (!pkg.scripts.build.includes("build-search-index")) {
      pkg.scripts.build = pkg.scripts.build.replace(
        "node split-data.js",
        "node split-data.js && node build-search-index.js"
      );
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      console.log("Updated package.json build script to include search index.");
    }
  }
}
