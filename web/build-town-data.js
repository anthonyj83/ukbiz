const fs = require("fs");
const path = require("path");

const IR_DIR = path.join("web", "public", "data", "ir");
const DATA_DIR = path.join("web", "public", "data");
const MIN_COMPANIES = 10;

// Whitelist - real towns that contain blacklist patterns but ARE valid
const WHITELIST = new Set([
  "brierley hill", "worcester park", "burgess hill", "buckhurst hill",
  "chester le street", "forest row", "street", "harrow on the hill",
  "mill hill", "hampton hill", "winchmore hill", "biggin hill",
  "gants hill", "park royal", "trafford park", "tower hill",
  "chapel hill", "primrose hill", "notting hill", "muswell hill",
  "stamford hill", "tulse hill", "herne hill", "denmark hill",
  "gipsy hill", "brixton hill", "streatham hill", "shooters hill",
  "maze hill", "forest hill", "hither green lane", "abbey road",
  "box hill", "redhill", "reigate hill", "richmond hill",
  "sunbury on thames", "staines upon thames", "walton on thames",
  "kingston upon thames", "kingston upon hull", "newcastle upon tyne",
  "burton upon trent", "stratford upon avon", "berwick upon tweed",
  "ross on wye", "hay on wye", "stow on the wold",
  "southend on sea", "westcliff on sea", "leigh on sea",
  "lytham st. annes", "st. albans", "st. helens", "st. ives",
  "st. neots", "st. leonards on sea", "st. austell",
  "chapel en le frith", "ashby de la zouch",
  "bognor regis", "sutton coldfield", "royal tunbridge wells",
  "leamington spa", "welwyn garden city",
  "canary wharf", "isle of wight", "isle of man",
]);

// Blacklist patterns
const BLACKLIST_PATTERNS = [
  /^\d/,
  /\b(street|road|avenue|lane|drive|close|court|place|way|crescent|terrace|row|square|grove|gardens|mews|rise|walk|yard|passage)\b/i,
  /^co\s/i,
  /^co\./i,
  /^county\s/i,
  /\bunit\b/i,
  /\bfloor\b/i,
  /\bsuite\b/i,
  /\bhouse\b/i,
  /\boffice\b/i,
  /\bestate\b/i,
  /\bcentre\b/i,
  /\bcenter\b/i,
  /\bbuilding\b/i,
  /\bflat\b/i,
  /\bblock\b/i,
  /\bpo box\b/i,
  /\bp\.?o\.?\s*box\b/i,
  /\bbusiness park\b/i,
];

const REGION_NAMES = new Set([
  "england", "scotland", "wales", "northern ireland", "united kingdom",
  "uk", "great britain", "east midlands", "west midlands", "east of england",
  "south east", "south west", "north east", "north west", "yorkshire",
  "yorkshire and humber", "east anglia",
]);

function normaliseTown(town) {
  if (!town) return "";
  let t = town.trim();
  t = t.replace(/\s*\/\s*/g, "/");
  t = t.replace(/\s+/g, " ");
  t = t.replace(/\b\w/g, c => c.toUpperCase())
       .replace(/\b(And|Of|The|In|On|At|De|Le|La)\b/g, w => w.toLowerCase());
  t = t.replace(/^(.)/, c => c.toUpperCase());
  return t;
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isBlacklisted(town) {
  const lower = town.toLowerCase().trim();
  if (WHITELIST.has(lower)) return false;
  if (REGION_NAMES.has(lower)) return true;
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(town)) return true;
  }
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

  // Track: industry+region+town combos
  // townKey = normalised town name
  // combo key = industry|region|townSlug
  const townMeta = {}; // townSlug -> { name, regions: Set }
  const combos = {};   // "industry|region|townSlug" -> { count, industryName, regionName, townName }
  let total = 0;

  for (let i = 0; i < files.length; i++) {
    const fp = path.join(IR_DIR, files[i]);
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    const industry = data.industry;
    const industryName = data.industryName;
    const region = data.region;
    const regionName = data.regionName;

    for (const c of data.companies || []) {
      total++;
      const rawTown = c.postTown || "";
      if (!rawTown.trim()) continue;

      const normalised = normaliseTown(rawTown);
      if (!normalised || isBlacklisted(normalised)) continue;

      const townSlug = slugify(normalised);
      if (!townSlug) continue;

      if (!townMeta[townSlug]) {
        townMeta[townSlug] = { name: normalised, regions: new Set(), totalCount: 0 };
      }
      townMeta[townSlug].regions.add(region);
      townMeta[townSlug].totalCount++;

      const key = `${industry}|${region}|${townSlug}`;
      if (!combos[key]) {
        combos[key] = {
          industry, industryName, region, regionName,
          town: townSlug, townName: normalised, count: 0
        };
      }
      combos[key].count++;
    }

    if ((i + 1) % 50 === 0) {
      process.stdout.write(`  Processed ${i + 1}/${files.length} files...\r`);
    }
  }

  console.log(`\nScanned ${total.toLocaleString()} companies`);

  // Filter combos: only where town has MIN_COMPANIES total across all industries
  const validTownSlugs = new Set();
  for (const [slug, meta] of Object.entries(townMeta)) {
    if (meta.totalCount >= MIN_COMPANIES) {
      validTownSlugs.add(slug);
    }
  }

  const validCombos = Object.values(combos).filter(c => validTownSlugs.has(c.town));
  
  // Build town manifest: array of { industry, industryName, region, regionName, town, townName, count }
  const townManifest = validCombos
    .filter(c => c.count >= 1) // at least 1 company in this specific combo
    .sort((a, b) => b.count - a.count);

  // Build towns-per-region list for the town index pages
  const townsPerRegion = {};
  for (const c of townManifest) {
    const rKey = c.region;
    if (!townsPerRegion[rKey]) townsPerRegion[rKey] = {};
    if (!townsPerRegion[rKey][c.town]) {
      townsPerRegion[rKey][c.town] = {
        slug: c.town, name: c.townName, companies: 0, industries: 0
      };
    }
    townsPerRegion[rKey][c.town].companies += c.count;
    townsPerRegion[rKey][c.town].industries++;
  }

  // Stats
  console.log(`\n--- RESULTS ---`);
  console.log(`Valid towns: ${validTownSlugs.size.toLocaleString()}`);
  console.log(`Town/industry/region combos: ${townManifest.length.toLocaleString()}`);

  // Write town manifest
  fs.writeFileSync(
    path.join(DATA_DIR, "town-manifest.json"),
    JSON.stringify(townManifest)
  );
  console.log(`\nWrote town-manifest.json (${townManifest.length.toLocaleString()} entries)`);

  // Write towns list (for generating static params)
  const townsList = [...validTownSlugs].map(slug => ({
    slug,
    name: townMeta[slug].name,
    companies: townMeta[slug].totalCount,
    regions: [...townMeta[slug].regions],
  })).sort((a, b) => b.companies - a.companies);

  fs.writeFileSync(
    path.join(DATA_DIR, "towns.json"),
    JSON.stringify(townsList)
  );
  console.log(`Wrote towns.json (${townsList.length.toLocaleString()} towns)`);

  // Top 30
  console.log(`\n--- TOP 30 TOWNS ---`);
  for (const t of townsList.slice(0, 30)) {
    console.log(`  ${t.name.padEnd(30)} ${String(t.companies).padStart(8)} companies  regions: ${t.regions.join(", ")}`);
  }

  console.log(`\n--- PAGE ESTIMATE ---`);
  console.log(`Current pages: ~576`);
  console.log(`New town pages: ${townManifest.length.toLocaleString()}`);
  console.log(`Total after: ~${(576 + townManifest.length).toLocaleString()}`);
  console.log(`\nDone! Now run the town page builder.`);
}

main();
