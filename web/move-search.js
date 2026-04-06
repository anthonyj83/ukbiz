const fs = require("fs");
const pagePath = "app/page.tsx";
let page = fs.readFileSync(pagePath, "utf-8");

// Remove CompanySearch from where it currently is (in the trust section)
page = page.replace(/\s*<CompanySearch\s*\/>\s*\n/g, "\n");

// Add it right after the hero section closing tag, before the AdSense slot
page = page.replace(
  '</section>\n\n      {/* AdSense slot */}',
  '</section>\n\n      {/* Company Search */}\n      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-4">\n        <CompanySearch />\n      </section>\n\n      {/* AdSense slot */}'
);

fs.writeFileSync(pagePath, page, "utf-8");
console.log("Done! Moved CompanySearch to top of page.");
