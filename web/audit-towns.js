const fs = require("fs");
const path = require("path");

const IR_DIR = path.join("web", "public", "data", "ir");
const MIN_COMPANIES = 10;

// Blacklist patterns - entries matching these are not real towns
const BLACKLIST_PATTERNS = [
  /^\d/,                          // starts with a number (addresses)
  /\b(street|road|avenue|lane|drive|close|court|place|way|crescent|terrace|park|row|square|hill|grove|gardens|mews|rise|walk|yard|passage)\b/i,
  /^co\s/i,                       // "Co Antrim", "Co Derry"
  /^co\./i,                       // "Co. Down"
  /^county\s/i,                   // "County Antrim"
  /\bunit\b/i,                    // "Unit 4"
  /\bfloor\b/i,                   // "3rd Floor"
  /\bsuite\b/i,                   // "Suite 5"
  /\bhouse\b/i,                   // "Victoria House"
  /\boffice\b/i,                  // "Office 2"
  /\bestate\b/i,                  // "Industrial Estate"
  /\bcentre\b/i,                  // "Business Centre"
  /\bcenter\b/i,
  /\bbuilding\b/i,
  /\bflat\b/i,
  /\bblock\b/i,
  /\bpo box\b/i,
  /\bp\.?o\.?\s*box\b/i,
];

// Region names that are not towns
const REGION_NAMES = new Set([
  "england", "scotland", "wales", "northern ireland", "united kingdom",
  "uk", "great britain", "east midlands", "west midlands", "east of england",
  "south east", "south west", "north east", "north west", "yorkshire",
  "yorkshire and humber", "east anglia",
]);

function normaliseTown(town) {
  if (!town) return "";
  // Trim whitespace
  let t = town.trim();
  // Normalise spaces around slashes: "Derry / Londonderry" -> "Derry/Londonderry"
  t = t.replace(/\s*\/\s*/g, "/");
  // Normalise multiple spaces
  t = t.replace(/\s+/g, " ");
  // Title case
  t = t.replace(/\b\w/g, c => c.toUpperCase()).replace(/\b(And|Of|The|In|On|At|De|Le|La)\b/g, w => w.toLowerCase());
  // Fix common patterns
  t = t.replace(/^(.)/g, c => c.toUpperCase());
  return t;
}

function isBlacklisted(town) {
  const lower = town.toLowerCase().trim();
  if (REGION_NAMES.has(lower)) return true;
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(town)) return true;
  }
  // Too short to be a real town
  if (town.length < 3) return true;
  return false;
}

function main() {
  if (!fs.existsSync(IR_DIR)) {
    console.error("IR directory not found:", IR_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(IR_DIR).filter(f => f.endsWith(".json")).sort();
  console.log(`Scanning ${files.length} IR files...\n`);

  // Map: normalised town -> { count, industries: Set, regions: Set, rawVariants: Set }
  const townData = {};
  let totalCompanies = 0;
  let companiesWithTown = 0;
  let companiesNoTown = 0;

  for (let i = 0; i < files.length; i++) {
    const fp = path.join(IR_DIR, files[i]);
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    const industry = data.industry;
    const industryName = data.industryName;
    const region = data.region;
    const regionName = data.regionName;

    for (const c of data.companies || []) {
      totalCompanies++;
      const rawTown = c.postTown || "";
      if (!rawTown.trim()) {
        companiesNoTown++;
        continue;
      }
      companiesWithTown++;

      const normalised = normaliseTown(rawTown);
      if (!normalised) continue;

      if (!townData[normalised]) {
        townData[normalised] = { count: 0, industries: new Set(), regions: new Set(), rawVariants: new Set() };
      }
      townData[normalised].count++;
      townData[normalised].industries.add(industry);
      townData[normalised].regions.add(region);
      townData[normalised].rawVariants.add(rawTown.trim());
    }

    if ((i + 1) % 50 === 0) {
      process.stdout.write(`  Processed ${i + 1}/${files.length} files...\r`);
    }
  }

  console.log(`\n--- RAW STATS ---`);
  console.log(`Total companies: ${totalCompanies.toLocaleString()}`);
  console.log(`With town: ${companiesWithTown.toLocaleString()}`);
  console.log(`Without town: ${companiesNoTown.toLocaleString()}`);
  console.log(`Unique normalised town names: ${Object.keys(townData).length.toLocaleString()}`);

  // Filter: apply blacklist and minimum threshold
  const validTowns = [];
  const blacklisted = [];
  const belowThreshold = [];

  for (const [town, data] of Object.entries(townData)) {
    if (isBlacklisted(town)) {
      blacklisted.push({ town, ...data });
    } else if (data.count < MIN_COMPANIES) {
      belowThreshold.push({ town, ...data });
    } else {
      validTowns.push({ town, ...data });
    }
  }

  validTowns.sort((a, b) => b.count - a.count);
  blacklisted.sort((a, b) => b.count - a.count);

  console.log(`\n--- FILTERED STATS ---`);
  console.log(`Valid towns (${MIN_COMPANIES}+ companies): ${validTowns.length.toLocaleString()}`);
  console.log(`Blacklisted (bad data): ${blacklisted.length.toLocaleString()}`);
  console.log(`Below threshold (<${MIN_COMPANIES}): ${belowThreshold.length.toLocaleString()}`);

  // Estimate pages: each valid town * number of industries it appears in
  let potentialPages = 0;
  for (const t of validTowns) {
    potentialPages += t.industries.size;
  }
  console.log(`\nPotential town/industry pages: ${potentialPages.toLocaleString()}`);

  // Write results
  const outputDir = "web";

  // Valid towns list
  const validOutput = validTowns.map(t => ({
    town: t.town,
    companies: t.count,
    industries: t.industries.size,
    regions: [...t.regions],
    variants: [...t.rawVariants],
  }));
  fs.writeFileSync(path.join(outputDir, "town-audit-valid.json"), JSON.stringify(validOutput, null, 2));
  console.log(`\nWrote ${validTowns.length} valid towns to web/town-audit-valid.json`);

  // Blacklisted entries (for review)
  const blackOutput = blacklisted.slice(0, 200).map(t => ({
    town: t.town,
    companies: t.count,
    reason: "blacklisted",
    variants: [...t.rawVariants],
  }));
  fs.writeFileSync(path.join(outputDir, "town-audit-blacklisted.json"), JSON.stringify(blackOutput, null, 2));
  console.log(`Wrote top ${blackOutput.length} blacklisted to web/town-audit-blacklisted.json`);

  // Top 50 valid towns
  console.log(`\n--- TOP 50 VALID TOWNS ---`);
  for (const t of validTowns.slice(0, 50)) {
    console.log(`  ${t.town.padEnd(30)} ${String(t.count).padStart(8)} companies  ${String(t.industries.size).padStart(3)} industries  [${[...t.regions].join(", ")}]`);
  }

  // Top blacklisted (high count ones to review)
  const highBlacklisted = blacklisted.filter(b => b.count >= 10);
  if (highBlacklisted.length > 0) {
    console.log(`\n--- BLACKLISTED WITH 10+ COMPANIES (review these) ---`);
    for (const t of highBlacklisted.slice(0, 30)) {
      console.log(`  ${t.town.padEnd(30)} ${String(t.count).padStart(8)} companies  variants: ${[...t.rawVariants].join(", ")}`);
    }
  }
}

main();
