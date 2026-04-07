const fs = require("fs");
const filePath = "web/app/[industry]/[region]/[town]/page.tsx";
let code = fs.readFileSync(filePath, "utf-8");

// Replace generateStaticParams to return empty array (pages generated on-demand)
const oldParams = `export async function generateStaticParams() {
  const manifest = readJson<ManifestEntry[]>("town-manifest.json") ?? [];
  const seen = new Set<string>();
  const params: { industry: string; region: string; town: string }[] = [];

  for (const m of manifest) {
    const key = \`\${m.industry}|\${m.region}|\${m.town}\`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ industry: m.industry, region: m.region, town: m.town });
  }
  return params;
}`;

const newParams = `// Pages generated on-demand and cached (too many for build-time generation)
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}`;

if (code.includes("const seen = new Set<string>()")) {
  code = code.replace(oldParams, newParams);
  console.log("Patched generateStaticParams for on-demand rendering");
} else {
  console.error("Could not find generateStaticParams to patch");
  process.exit(1);
}

fs.writeFileSync(filePath, code, "utf-8");
console.log("Done!");
