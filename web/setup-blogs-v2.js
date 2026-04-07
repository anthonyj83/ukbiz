const fs = require("fs");
const path = require("path");

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const posts = [
  { file: "post-restaurants.tsx", slug: "how-many-restaurants-uk-2026" },
  { file: "post-it-companies.tsx", slug: "how-many-it-companies-uk-2026" },
  { file: "post-property-london.tsx", slug: "how-many-property-companies-london-2026" },
  { file: "post-overdue-accounts.tsx", slug: "uk-companies-overdue-accounts-explained" },
  { file: "post-check-legitimate.tsx", slug: "how-to-check-uk-company-legitimate" },
  { file: "post-common-types.tsx", slug: "most-common-business-types-uk-2026" },
  { file: "post-hotspots.tsx", slug: "uk-business-hotspots-regions-2026" },
  { file: "post-healthcare.tsx", slug: "how-many-healthcare-companies-uk-2026" },
  { file: "post-beauty.tsx", slug: "how-many-beauty-businesses-uk-2026" },
  { file: "post-ecommerce.tsx", slug: "uk-ecommerce-companies-2026" },
];

for (const post of posts) {
  const dir = path.join("app", "blog", post.slug);
  mkdirp(dir);
  fs.copyFileSync(post.file, path.join(dir, "page.tsx"));
  console.log(`Created blog/${post.slug}/page.tsx`);
}

// Update blog index
fs.copyFileSync("blog-index-v2.tsx", path.join("app", "blog", "page.tsx"));
console.log("Updated blog index with all 13 posts");

console.log("\nDone! 10 new blog posts created.");
