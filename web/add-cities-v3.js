const fs = require("fs");

const pagePath = "web/app/page.tsx";
let code = fs.readFileSync(pagePath, "utf-8");

// Load towns data for company counts
const towns = JSON.parse(fs.readFileSync("web/public/data/towns.json", "utf-8"));
const townMap = {};
for (const t of towns) { townMap[t.slug] = t; }

// Emojis as hex-encoded UTF-8 to completely avoid encoding corruption
function hexToStr(hex) {
  return Buffer.from(hex, "hex").toString("utf-8");
}

const CITIES = [
  { slug: "london", name: "London", emoji: hexToStr("f09f8f99efb88f") },
  { slug: "manchester", name: "Manchester", emoji: hexToStr("f09f8f97efb88f") },
  { slug: "birmingham", name: "Birmingham", emoji: hexToStr("f09f94a7") },
  { slug: "glasgow", name: "Glasgow", emoji: hexToStr("e29a93") },
  { slug: "cardiff", name: "Cardiff", emoji: hexToStr("f09f8f9fefb88f") },
  { slug: "bristol", name: "Bristol", emoji: hexToStr("e29bb5") },
  { slug: "leeds", name: "Leeds", emoji: hexToStr("e29a92efb88f") },
  { slug: "leicester", name: "Leicester", emoji: hexToStr("f09f8fad") },
  { slug: "liverpool", name: "Liverpool", emoji: hexToStr("e29a93") },
  { slug: "nottingham", name: "Nottingham", emoji: hexToStr("f09f8fb9") },
  { slug: "edinburgh", name: "Edinburgh", emoji: hexToStr("f09f8fb0") },
  { slug: "sheffield", name: "Sheffield", emoji: hexToStr("e29a94efb88f") },
  { slug: "coventry", name: "Coventry", emoji: hexToStr("f09f8f9befb88f") },
  { slug: "milton-keynes", name: "Milton Keynes", emoji: hexToStr("f09f8fa2") },
  { slug: "bolton", name: "Bolton", emoji: hexToStr("f09f8f97efb88f") },
  { slug: "reading", name: "Reading", emoji: hexToStr("f09f8fa2") },
  { slug: "southampton", name: "Southampton", emoji: hexToStr("f09f9aa2") },
  { slug: "belfast", name: "Belfast", emoji: hexToStr("f09f9aa2") },
  { slug: "derby", name: "Derby", emoji: hexToStr("f09f8fad") },
  { slug: "newcastle-upon-tyne", name: "Newcastle", emoji: hexToStr("f09f8c89") },
  { slug: "norwich", name: "Norwich", emoji: hexToStr("f09f8cbe") },
  { slug: "cambridge", name: "Cambridge", emoji: hexToStr("f09f8e93") },
  { slug: "bradford", name: "Bradford", emoji: hexToStr("f09f8fad") },
  { slug: "brighton", name: "Brighton", emoji: hexToStr("f09f8f96efb88f") },
];

// Build entries with counts
var entries = CITIES.map(function(c) {
  var t = townMap[c.slug];
  var companies = t ? t.companies : 0;
  return '  { slug: "' + c.slug + '", name: "' + c.name + '", emoji: "' + c.emoji + '", companies: ' + companies + ' }';
}).join(",\n");

var cityConst = "const CITY_DATA = [\n" + entries + "\n];\n\n";

// Remove existing CITY_DATA if present
if (code.includes("CITY_DATA")) {
  var start = code.indexOf("const CITY_DATA");
  var end = code.indexOf("];\n", start) + 3;
  code = code.slice(0, start) + code.slice(end);
  console.log("Removed old CITY_DATA");
}

// Remove existing cities section if present
if (code.includes("Browse by City")) {
  var cs = code.indexOf("{/* Cities grid */}");
  if (cs > -1) {
    var ce = code.indexOf("</section>", cs) + "</section>".length;
    code = code.slice(0, cs) + code.slice(ce);
    console.log("Removed old cities section");
  }
}

// Insert CITY_DATA before HomePage function
var hpIdx = code.indexOf("export default function HomePage");
if (hpIdx === -1) { console.error("Cannot find HomePage"); process.exit(1); }
code = code.slice(0, hpIdx) + cityConst + code.slice(hpIdx);
console.log("Added CITY_DATA");

// Cities section JSX
var cj = '{/* Cities grid */}\n';
cj += '      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">\n';
cj += '        <div className="flex items-center justify-between mb-6">\n';
cj += '          <h2 className="text-2xl font-bold text-gray-900">Browse by City</h2>\n';
cj += '        </div>\n';
cj += '        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">\n';
cj += '          {CITY_DATA.map((city) => (\n';
cj += '            <a\n';
cj += '              key={city.slug}\n';
cj += '              href={`/city/${city.slug}`}\n';
cj += '              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-2"\n';
cj += '            >\n';
cj += '              <span className="text-xl">{city.emoji}</span>\n';
cj += '              <div>\n';
cj += '                <div className="font-medium text-gray-800 text-sm">{city.name}</div>\n';
cj += '                <div className="text-xs text-gray-400">{city.companies.toLocaleString()} companies</div>\n';
cj += '              </div>\n';
cj += '            </a>\n';
cj += '          ))}\n';
cj += '        </div>\n';
cj += '      </section>\n\n      ';

var trustMarker = "{/* Trust section */}";
if (!code.includes(trustMarker)) { console.error("Cannot find Trust section"); process.exit(1); }
code = code.replace(trustMarker, cj + trustMarker);
console.log("Added cities section");

// Write as UTF-8 buffer
fs.writeFileSync(pagePath, Buffer.from(code, "utf-8"));

var opens = (code.match(/\{/g) || []).length;
var closes = (code.match(/\}/g) || []).length;
console.log("Brace check: " + opens + " open, " + closes + " close " + (opens === closes ? "OK" : "MISMATCH"));
console.log("Done!");
