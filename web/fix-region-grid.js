const fs = require("fs");
const filePath = "web/app/page.tsx";
let code = fs.readFileSync(filePath, "utf-8");

// Replace the region link content
const oldSpan = '<span className="font-medium text-gray-800 text-sm">{region.name}</span>';
const newSpan = '<span className="text-xl">{REGION_ICON_MAP[region.slug] ?? "\\u{1F4CD}"}</span><div><div className="font-medium text-gray-800 text-sm">{region.name}</div><div className="text-xs text-gray-400">{(regionTotals[region.slug] || 0).toLocaleString()} companies</div></div>';

if (!code.includes(oldSpan)) {
  console.error("ERROR: Could not find region span to replace.");
  console.log("Looking for:", oldSpan);
  // Try to find what's actually there
  const idx = code.indexOf("region.name");
  if (idx > -1) {
    console.log("Found region.name at position", idx);
    console.log("Context:", code.slice(idx - 80, idx + 80));
  }
  process.exit(1);
}

code = code.replace(oldSpan, newSpan);
console.log("Replaced region span with emoji + count version");

// Add flex to the region link
const oldClass = 'className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all"';
if (code.includes(oldClass)) {
  code = code.replace(oldClass, oldClass.replace('transition-all"', 'transition-all flex items-center gap-2"'));
  console.log("Added flex layout to region links");
} else {
  console.log("Note: Could not find region link class, may already be updated");
}

fs.writeFileSync(filePath, code, "utf-8");
console.log("Done!");
