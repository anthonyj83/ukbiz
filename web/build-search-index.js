const fs = require("fs");
const path = require("path");
const glob = require("path");

const IR_DIR = path.join("public", "data", "ir");
const SEARCH_DIR = path.join("public", "data", "search");

function cleanPrefix(name) {
  const chars = [];
  for (const ch of name.toLowerCase()) {
    if (/[a-z]/.test(ch)) {
      chars.push(ch);
      if (chars.length === 2) break;
    }
  }
  return chars.length < 2 ? "zz" : chars.join("");
}

function main() {
  if (!fs.existsSync(SEARCH_DIR)) fs.mkdirSync(SEARCH_DIR, { recursive: true });

  const files = fs.readdirSync(IR_DIR).filter(f => f.endsWith(".json")).sort();
  console.log(`Building search index from ${files.length} IR files...`);

  const index = {};
  let total = 0;

  for (let i = 0; i < files.length; i++) {
    const fp = path.join(IR_DIR, files[i]);
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));

    const industry = data.industry;
    const industryName = data.industryName;
    const region = data.region;
    const regionName = data.regionName;

    for (const c of data.companies || []) {
      const name = c.name || "";
      const number = c.number || "";
      const town = c.postTown || "";

      if (!name) continue;

      const prefix = cleanPrefix(name);
      const entry = { n: name, no: number, t: town, i: industry, in: industryName, r: region, rn: regionName };

      if (!index[prefix]) index[prefix] = [];
      index[prefix].push(entry);
      total++;
    }

    if ((i + 1) % 50 === 0) {
      console.log(`  Processed ${i + 1}/${files.length} files (${total.toLocaleString()} companies)...`);
    }
  }

  console.log(`\n  Total: ${total.toLocaleString()} companies across ${Object.keys(index).length} prefix groups`);
  console.log(`  Writing search index...`);

  for (const [prefix, entries] of Object.entries(index)) {
    const outpath = path.join(SEARCH_DIR, `${prefix}.json`);
    fs.writeFileSync(outpath, JSON.stringify(entries));
  }

  console.log(`  Done! Search index built.`);
}

main();
