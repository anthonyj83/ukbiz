const fs = require("fs");
const path = require("path");

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Blog index
mkdirp(path.join("app", "blog"));
fs.copyFileSync("blog-index.tsx", path.join("app", "blog", "page.tsx"));
console.log("Created app/blog/page.tsx");

// Post 1
mkdirp(path.join("app", "blog", "how-many-construction-companies-uk-2026"));
fs.copyFileSync("post-construction.tsx", path.join("app", "blog", "how-many-construction-companies-uk-2026", "page.tsx"));
console.log("Created construction post");

// Post 2
mkdirp(path.join("app", "blog", "uk-company-ownership-foreign-controlled"));
fs.copyFileSync("post-ownership.tsx", path.join("app", "blog", "uk-company-ownership-foreign-controlled", "page.tsx"));
console.log("Created ownership post");

// Post 3
mkdirp(path.join("app", "blog", "uk-business-statistics-2026"));
fs.copyFileSync("post-statistics.tsx", path.join("app", "blog", "uk-business-statistics-2026", "page.tsx"));
console.log("Created statistics post");

// Add blog link to footer if not already there
const layoutPath = path.join("app", "layout.tsx");
let layout = fs.readFileSync(layoutPath, "utf-8");
if (!layout.includes('"/blog"')) {
  layout = layout.replace(
    '<li><a href="/regions" className="hover:text-white transition-colors">All Regions</a></li>',
    '<li><a href="/regions" className="hover:text-white transition-colors">All Regions</a></li>\n              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>'
  );
  fs.writeFileSync(layoutPath, layout, "utf-8");
  console.log("Added Blog link to footer");
}

console.log("\nDone! Blog is ready at /blog");
