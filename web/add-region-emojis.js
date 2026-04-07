const fs = require("fs");
const filePath = "web/app/page.tsx";
let code = fs.readFileSync(filePath, "utf-8");

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

// Insert after the ICON_MAP closing };
const pharmacyIdx = code.indexOf('"pharmacy"');
if (pharmacyIdx === -1) {
  console.error("Could not find pharmacy in ICON_MAP");
  process.exit(1);
}
const insertPoint = code.indexOf("};", pharmacyIdx) + 2;
code = code.slice(0, insertPoint) + "\n" + regionMap + code.slice(insertPoint);

// Update the regions grid to include emojis
const oldRegionLink = `<span className="font-medium text-gray-800 text-sm">{region.name}</span>`;
const newRegionLink = `<span className="text-xl mr-2">{REGION_ICON_MAP[region.slug] ?? "\u{1F4CD}"}</span><span className="font-medium text-gray-800 text-sm">{region.name}</span>`;

if (code.includes(oldRegionLink)) {
  code = code.replace(oldRegionLink, newRegionLink);
} else {
  console.error("Could not find region link text to replace");
  process.exit(1);
}

// Make the region link a flex row so emoji + text align nicely
const oldRegionClass = `className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all"`;
const newRegionClass = `className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all flex items-center"`;

if (code.includes(oldRegionClass)) {
  code = code.replace(oldRegionClass, newRegionClass);
} else {
  console.log("Note: region class already updated or not found, skipping layout change");
}

fs.writeFileSync(filePath, code, "utf-8");
console.log("Done! Region emojis added to page.tsx");
