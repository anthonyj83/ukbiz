const fs = require("fs");
const pagePath = "web/app/page.tsx";
let code = fs.readFileSync(pagePath, "utf-8");

// Replace the non-clickable div with a Link
const oldCard = `<div
              key={city.slug}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-2"
            >`;

const newCard = `<a
              key={city.slug}
              href={\`/city/\${city.slug}\`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-2"
            >`;

// Also need to close with </a> instead of </div>
const oldClose = `            </div>
          ))}
        </div>
      </section>

`;

// Find the cities section closing
if (code.includes(oldCard)) {
  code = code.replace(oldCard, newCard);
  // Replace the closing div for each city card
  // Find the specific closing pattern in the cities section
  const cityIdx = code.indexOf("Browse by City");
  const trustIdx = code.indexOf("{/* Trust section */}");
  const citiesBlock = code.slice(cityIdx, trustIdx);
  
  // Replace </div> closing tags for city cards with </a>
  // The pattern is: </div>\n          ))}\n        </div>\n      </section>
  const oldCityClose = `</div>
          ))}`;
  const newCityClose = `</a>
          ))}`;
  
  // Only replace the one in the cities section
  const beforeCities = code.slice(0, cityIdx);
  let citiesSection = code.slice(cityIdx, trustIdx);
  const afterCities = code.slice(trustIdx);
  
  // Find the last </div>\n          ))} in the cities section (the card close)
  const lastCloseIdx = citiesSection.lastIndexOf(oldCityClose);
  if (lastCloseIdx > -1) {
    citiesSection = citiesSection.slice(0, lastCloseIdx) + newCityClose + citiesSection.slice(lastCloseIdx + oldCityClose.length);
  }
  
  code = beforeCities + citiesSection + afterCities;
  console.log("Made city cards clickable");
} else {
  console.log("Could not find city card div to replace - may already be a link");
}

fs.writeFileSync(pagePath, code, "utf-8");
console.log("Done!");
