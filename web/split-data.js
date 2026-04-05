/**
 * split-data.js
 * 
 * Run this ONCE before deploying:
 *   node split-data.js
 * 
 * It reads each file in public/data/ir/ and splits it into:
 *   - public/data/ir-meta/{industry}__{region}.json  (stats, metadata — NO companies)
 *   - public/data/ir-pages/{industry}__{region}__0.json  (first 200 companies)
 *   - public/data/ir-pages/{industry}__{region}__1.json  (next 200 companies)
 *   - etc.
 */

const fs = require("fs");
const path = require("path");

const IR_DIR = path.join(__dirname, "public", "data", "ir");
const META_DIR = path.join(__dirname, "public", "data", "ir-meta");
const PAGES_DIR = path.join(__dirname, "public", "data", "ir-pages");
const PAGE_SIZE = 200;

// Create output directories
if (!fs.existsSync(META_DIR)) fs.mkdirSync(META_DIR, { recursive: true });
if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });

const files = fs.readdirSync(IR_DIR).filter(f => f.endsWith(".json"));
console.log(`Found ${files.length} IR files to split...\n`);

let totalOriginalMB = 0;
let totalMetaMB = 0;

for (const file of files) {
  const filePath = path.join(IR_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  
  const originalMB = (Buffer.byteLength(raw) / 1024 / 1024).toFixed(1);
  totalOriginalMB += parseFloat(originalMB);
  
  const slug = file.replace(".json", ""); // e.g. "construction__london"
  
  // Extract companies, keep everything else as meta
  const { companies, ...meta } = data;
  meta.totalPages = Math.ceil((companies || []).length / PAGE_SIZE);
  meta.pageSize = PAGE_SIZE;
  
  // Write meta file
  const metaJson = JSON.stringify(meta);
  fs.writeFileSync(path.join(META_DIR, `${slug}.json`), metaJson);
  const metaMB = (Buffer.byteLength(metaJson) / 1024 / 1024).toFixed(2);
  totalMetaMB += parseFloat(metaMB);
  
  // Write paginated company chunks
  const companyList = companies || [];
  const totalPages = Math.ceil(companyList.length / PAGE_SIZE);
  
  for (let i = 0; i < totalPages; i++) {
    const chunk = companyList.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
    fs.writeFileSync(
      path.join(PAGES_DIR, `${slug}__${i}.json`),
      JSON.stringify(chunk)
    );
  }
  
  console.log(`  ${slug}: ${originalMB}MB → meta ${metaMB}MB + ${totalPages} page(s) of ${companyList.length} companies`);
}

console.log(`\nDone! Split ${files.length} files.`);
console.log(`Original total: ${totalOriginalMB.toFixed(0)}MB`);
console.log(`Meta total: ${totalMetaMB.toFixed(1)}MB`);
console.log(`\nCompany pages saved to: public/data/ir-pages/`);
console.log(`Meta files saved to: public/data/ir-meta/`);
