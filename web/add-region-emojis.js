const fs = require("fs");
const filePath = "web/app/page.tsx";
let code = fs.readFileSync(filePath, "utf-8");

// 1) Check if REGION_ICON_MAP already exists, skip if so
if (code.includes("REGION_ICON_MAP")) {
  console.log("REGION_ICON_MAP already exists, skipping map insertion");
} else {
  // Add REGION_ICON_MAP after ICON_MAP closing brace
  const regionMap = `
const REGION_ICON_MAP: Record<string, string> = {
  "london":           "\u{1F3D9}\uFE0F",
  "south-east":       "\u{1F333}",
  "south-west":       "\u{1F30A}",
  "east-midlands":    "\u{1F3ED}",
  "west-midlands":    "\u{1F3D7}\uFE0F",
  "east-england":     "\u{1F33E}",
  "yorkshire":        "\u{2692}\uFE0F",
  "north-west":       "\u{1F3D9}\uFE0F",
  "north-east":       "\u{2693}",
  "scotland":         "\u{1F3D4}\uFE0F",
  "wales":            "\u{1F409}",
  "northern-ireland": "\u{2618}\uFE0F",
};
`;
  const pharmacyIdx = code.indexOf('"pharmacy"');
  if (pharmacyIdx === -1) {
    console.error("Could not find pharmacy in ICON_MAP");
    process.exit(1);
  }
  const insertPoint = code.indexOf("};", pharmacyIdx) + 2;
  code = code.slice(0, insertPoint) + "\n" + regionMap + code.slice(insertPoint);
  console.log("Added REGION_ICON_MAP");
}

// 2) Add regionTotals computation after topIndustries line
if (!code.includes("regionTotals")) {
  const anchor = "const topIndustries  = industries.slice(0, 24);";
  const regionTotalsCode = `

  // Compute per-region company totals
  const regionTotals: Record<string, number> = {};
  for (const m of manifest) {
    regionTotals[m.region] = (regionTotals[m.region] || 0) + m.count;
  }`;
  code = code.replace(anchor, anchor + regionTotalsCode);
  console.log("Added regionTotals computation");
}

// 3) Replace the simple region grid with emoji + count version
const oldRegionGrid = `{regions.map((region) => (
            <Link
              key={region.slug}
              href={\`/region/\${region.slug}\`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-gray-800 text-sm">{region.name}</span>
            </Link>
          ))}`;

const newRegionGrid = `{regions.map((region) => (
            <Link
              key={region.slug}
              href={\`/region/\${region.slug}\`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-2"
            >
              <span className="text-xl">{REGION_ICON_MAP[region.slug] ?? "\u{1F4CD}"}</span>
              <div>
                <div className="font-medium text-gray-800 text-sm">{region.name}</div>
                <div className="text-xs text-gray-400">{(regionTotals[region.slug] || 0).toLocaleString()} companies</div>
              </div>
            </Link>
          ))}`;

if (code.includes('<span className="font-medium text-gray-800 text-sm">{region.name}</span>')) {
  code = code.replace(oldRegionGrid, newRegionGrid);
  console.log("Updated region grid with emojis and company counts");
} else {
  console.error("Could not find region grid to replace. It may have already been modified.");
  process.exit(1);
}

fs.writeFileSync(filePath, code, "utf-8");
console.log("Done! Region emojis and counts added to front page.");
