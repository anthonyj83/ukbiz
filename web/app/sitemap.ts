import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const BASE_URL = "https://ukbizfinder.co.uk";

interface ManifestEntry {
  industry: string;
  region: string;
  count: number;
}

interface Industry {
  slug: string;
  totalCompanies: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/industries`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Industry pages
  try {
    const industries: Industry[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "industries.json"), "utf-8")
    );
    for (const ind of industries) {
      urls.push({
        url: `${BASE_URL}/${ind.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  } catch {}

  // Industry + region pages
  try {
    const manifest: ManifestEntry[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf-8")
    );
    for (const m of manifest) {
      urls.push({
        url: `${BASE_URL}/${m.industry}/${m.region}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        // Higher priority for pages with more companies
        priority: m.count > 500 ? 0.7 : m.count > 100 ? 0.6 : 0.5,
      });
    }
  } catch {}

  return urls;
}
