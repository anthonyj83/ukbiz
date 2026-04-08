const fs = require("fs");

const pagePath = "web/app/page.tsx";
let code = fs.readFileSync(pagePath, "utf-8");

// Load towns data for company counts
const towns = JSON.parse(fs.readFileSync("web/public/data/towns.json", "utf-8"));
const townMap = {};
for (const t of towns) { townMap[t.slug] = t; }

// Top 24 UK cities
const CITIES = [
  { slug: "london", name: "London", emoji: "\u{1F3D9}\uFE0F" },
  { slug: "manchester", name: "Manchester", emoji: "\u{1F3D7}\uFE0F" },
  { slug: "birmingham", name: "Birmingham", emoji: "\u{1F527}" },
  { slug: "glasgow", name: "Glasgow", emoji: "\u{1F3D4}\uFE0F" },
  { slug: "cardiff", name: "Cardiff", emoji: "\u{1F3F4}" },
  { slug: "bristol", name: "Bristol", emoji: "\u{26F5}" },
  { slug: "leeds", name: "Leeds", emoji: "\u{2692}\uFE0F" },
  { slug: "leicester", name: "Leicester", emoji: "\u{1F3ED}" },
  { slug: "liverpool", name: "Liverpool", emoji: "\u{2693}" },
  { slug: "nottingham", name: "Nottingham", emoji: "\u{1F3F9}" },
  { slug: "edinburgh", name: "Edinburgh", emoji: "\u{1F3F0}" },
  { slug: "sheffield", name: "Sheffield", emoji: "\u{2694}\uFE0F" },
  { slug: "coventry", name: "Coventry", emoji: "\u{1F3DB}\uFE0F" },
  { slug: "milton-keynes", name: "Milton Keynes", emoji: "\u{1F504}" },
  { slug: "bolton", name: "Bolton", emoji: "\u{1F3D7}\uFE0F" },
  { slug: "reading", name: "Reading", emoji: "\u{1F4DA}" },
  { slug: "southampton", name: "Southampton", emoji: "\u{1F6A2}" },
  { slug: "belfast", name: "Belfast", emoji: "\u{2618}\uFE0F" },
  { slug: "derby", name: "Derby", emoji: "\u{1F3CE}\uFE0F" },
  { slug: "newcastle-upon-tyne", name: "Newcastle", emoji: "\u{1F309}" },
  { slug: "norwich", name: "Norwich", emoji: "\u{1F33E}" },
  { slug: "cambridge", name: "Cambridge", emoji: "\u{1F393}" },
  { slug: "bradford", name: "Bradford", emoji: "\u{1F3ED}" },
  { slug: "brighton", name: "Brighton", emoji: "\u{1F3D6}\uFE0F" },
];

// Build static array with counts
const cityItems = CITIES.map(c => {
  const t = townMap[c.slug];
  return { ...c, companies: t ? t.companies : 0 };
});

// Add CITY_DATA const if not present
if (!code.includes("CITY_DATA")) {
  const entries = cityItems.map(c => 
    `  { slug: "${c.slug}", name: "${c.name}", emoji: "${c.emoji}", companies: ${c.companies} }`
  ).join(",\n");
  
  const cityConst = `\nconst CITY_DATA = [\n${entries}\n];\n`;
  
  // Insert after REGION_ICON_MAP
  const riEnd = code.indexOf("REGION_ICON_MAP");
  const insertAt = code.indexOf("};", riEnd) + 2;
  code = code.slice(0, insertAt) + cityConst + code.slice(insertAt);
  console.log("Added CITY_DATA");
}

// Build the Cities section - identical style to Regions
const citiesJSX = `
      {/* Cities grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse by City</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CITY_DATA.map((city) => (
            <div
              key={city.slug}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-2"
            >
              <span className="text-xl">{city.emoji}</span>
              <div>
                <div className="font-medium text-gray-800 text-sm">{city.name}</div>
                <div className="text-xs text-gray-400">{city.companies.toLocaleString()} companies</div>
              </div>
            </div>
          ))}
        </div>
      </section>
`;

// Insert before Trust section
const trustMarker = "{/* Trust section */}";
if (code.includes(trustMarker)) {
  code = code.replace(trustMarker, citiesJSX + "\n      " + trustMarker);
  console.log("Added Cities section");
} else {
  console.error("Could not find Trust section marker");
  process.exit(1);
}

fs.writeFileSync(pagePath, code, "utf-8");
console.log("Done!");
