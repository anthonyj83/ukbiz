const fs = require("fs");
const path = require("path");

// 1. robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://ukbizfinder.co.uk/sitemap.xml

# Block search index files from crawlers (not useful for SEO)
Disallow: /data/search/
Disallow: /data/ir-pages/
Disallow: /data/ir-meta/
`;

fs.writeFileSync(path.join("public", "robots.txt"), robotsTxt);
console.log("Created public/robots.txt");

// 2. ads.txt (required by AdSense)
const adsTxt = `google.com, pub-2730052069594489, DIRECT, f08c47fec0942fa0
`;

fs.writeFileSync(path.join("public", "ads.txt"), adsTxt);
console.log("Created public/ads.txt");

console.log("\nDone! Both files created in public/");
