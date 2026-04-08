const fs = require("fs");

const pagePath = "web/app/page.tsx";
let code = fs.readFileSync(pagePath, "utf-8");

// Load towns data for company counts
const towns = JSON.parse(fs.readFileSync("web/public/data/towns.json", "utf-8"));
const townMap = {};
for (const t of towns) { townMap[t.slug] = t; }

// Top 24 UK cities with emojis
const CITIES = [
  { slug: "london", name: "London", emoji: "\u{1F3D9}\uFE0F" },
  { slug: "manchester", name: "Manchester", emoji: "\u{1F3D7}\uFE0F" },
  { slug: "birmingham", name: "Birmingham", emoji: "\u{1F527}" },
  { slug: "glasgow", name: "Glasgow", emoji: "\u{2693}" },
  { slug: "cardiff", name: "Cardiff", emoji: "\u{1F3DF}\uFE0F" },
  { slug: "bristol", name: "Bristol", emoji: "\u{26F5}" },
  { slug: "leeds", name: "Leeds", emoji: "\u{2692}\uFE0F" },
  { slug: "leicester", name: "Leicester", emoji: "\u{1F3ED}" },
  { slug: "liverpool", name: "Liverpool", emoji: "\u{2693}" },
  { slug: "nottingham", name: "Nottingham", emoji: "\u{1F3F9}" },
  { slug: "edinburgh", name: "Edinburgh", emoji: "\u{1F3F0}" },
  { slug: "sheffield", name: "Sheffield", emoji: "\u{2694}\uFE0F" },
  { slug: "coventry", name: "Coventry", emoji: "\u{1F3DB}\uFE0F" },
  { slug: "milton-keynes", name: "Milton Keynes", emoji: "\u{1F3E2}" },
  { slug: "bolton", name: "Bolton", emoji: "\u{1F3D7}\uFE0F" },
  { slug: "reading", name: "Reading", emoji: "\u{1F3E2}" },
  { slug: "southampton", name: "Southampton", emoji: "\u{1F6A2}" },
  { slug: "belfast", name: "Belfast", emoji: "\u{1F6A2}" },
  { slug: "derby", name: "Derby", emoji: "\u{1F3ED}" },
  { slug: "newcastle-upon-tyne", name: "Newcastle", emoji: "\u{1F309}" },
  { slug: "norwich", name: "Norwich", emoji: "\u{1F33E}" },
  { slug: "cambridge", name: "Cambridge", emoji: "\u{1F393}" },
  { slug: "bradford", name: "Bradford", emoji: "\u{1F3ED}" },
  { slug: "brighton", name: "Brighton", emoji: "\u{1F3D6}\uFE0F" },
];

// Build static array string with counts
const entries = CITIES.map(c => {
  const t = townMap[c.slug];
  const companies = t ? t.companies : 0;
  return `  { slug: "${c.slug}", name: "${c.name}", emoji: "${c.emoji}", companies: ${companies} }`;
}).join(",\n");

const cityConst = `const CITY_DATA = [\n${entries}\n];\n`;

// Step 1: Add CITY_DATA constant before the HomePage function
if (code.includes("CITY_DATA")) {
  console.log("CITY_DATA already exists, removing it first");
  // Remove existing CITY_DATA block
  const start = code.indexOf("const CITY_DATA");
  const end = code.indexOf("];\n", start) + 3;
  code = code.slice(0, start) + code.slice(end);
}

// Insert before "export default function HomePage"
const homepageIdx = code.indexOf("export default function HomePage");
if (homepageIdx === -1) {
  console.error("Could not find HomePage function");
  process.exit(1);
}
code = code.slice(0, homepageIdx) + cityConst + "\n" + code.slice(homepageIdx);
console.log("Added CITY_DATA constant");

// Step 2: Add Cities section JSX before Trust section
// Remove any existing cities section first
if (code.includes("Browse by City")) {
  const cityStart = code.indexOf("{/* Cities grid */}");
  if (cityStart > -1) {
    const cityEnd = code.indexOf("</section>", cityStart) + "</section>".length;
    code = code.slice(0, cityStart) + code.slice(cityEnd);
    console.log("Removed old cities section");
  }
}

const citiesJSX = `{/* Cities grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse by City</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CITY_DATA.map((city) => (
            <a
              key={city.slug}
              href={\`/city/\${city.slug}\`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-2"
            >
              <span className="text-xl">{city.emoji}</span>
              <div>
                <div className="font-medium text-gray-800 text-sm">{city.name}</div>
                <div className="text-xs text-gray-400">{city.companies.toLocaleString()} companies</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      `;

const trustMarker = "{/* Trust section */}";
if (code.includes(trustMarker)) {
  code = code.replace(trustMarker, citiesJSX + trustMarker);
  console.log("Added clickable Cities section");
} else {
  console.error("Could not find Trust section marker");
  process.exit(1);
}

fs.writeFileSync(pagePath, code, "utf-8");

// Verify no syntax issues - check balanced braces roughly
const opens = (code.match(/\{/g) || []).length;
const closes = (code.match(/\}/g) || []).length;
console.log(`Brace check: ${opens} open, ${closes} close ${opens === closes ? '✓' : '⚠ MISMATCH'}`);

console.log("Done!");
