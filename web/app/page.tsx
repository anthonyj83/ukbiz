import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import HomeSearch from "./HomeSearch";

export const metadata: Metadata = {
  title: "UK Business Finder | Company Intelligence Directory",
  description:
    "Search and explore active UK companies by industry and region. Built from official Companies House data. Trusted business intelligence — free to browse.",
};

interface Industry {
  slug: string;
  name: string;
  totalCompanies: number;
  topRegions: string[];
}

interface Region {
  slug: string;
  name: string;
}

interface ManifestEntry {
  industry: string;
  industryName: string;
  region: string;
  regionName: string;
  count: number;
}

const DATA_DIR = path.join(process.cwd(), "public", "data");

function readJson<T>(filename: string): T | null {
  try {
    const content = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

const ICON_MAP: Record<string, string> = {
  "cleaning":           "🧹",
  "pest-control":       "🐛",
  "landscaping":        "🌿",
  "construction":       "🏗️",
  "electrical":         "⚡",
  "plumbing":           "🔧",
  "accounting":         "📊",
  "legal":              "⚖️",
  "software":           "💻",
  "it-consulting":      "🖥️",
  "restaurants":        "🍽️",
  "catering":           "🥗",
  "hotels":             "🏨",
  "accommodation":      "🛏️",
  "healthcare":         "🏥",
  "recruitment":        "👥",
  "transport":          "🚛",
  "security":           "🔒",
  "beauty":             "💄",
  "automotive":         "🚗",
  "financial-services": "💰",
  "marketing":          "📣",
  "property-management":"🏠",
  "waste-management":   "♻️",
  "childcare":          "👶",
  "veterinary":         "🐾",
  "training":           "🎓",
  "events":             "🎤",
  "photography":        "📷",
  "architecture":       "📐",
  "engineering":        "⚙️",
  "printing":           "🖨️",
  "taxis":              "🚕",
  "arts":               "🎨",
  "retail":             "🛍️",
  "ecommerce":          "📦",
  "wholesale":          "🏭",
  "sports":             "⚽",
  "funeral":            "🕊️",
  "pharmacy":           "💊",
};

export default function HomePage() {
  const industries = readJson<Industry[]>("industries.json") ?? [];
  const regions    = readJson<Region[]>("regions.json") ?? [];
  const manifest   = readJson<ManifestEntry[]>("manifest.json") ?? [];

  const totalPages     = manifest.length;
  const totalCompanies = industries.reduce((s, i) => s + i.totalCompanies, 0);
  const topIndustries  = industries.slice(0, 24);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            UK Company Intelligence,<br className="hidden sm:block" /> Built from Official Data
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore{" "}
            <strong className="text-white">
              {totalCompanies.toLocaleString()}+ active UK companies
            </strong>{" "}
            across {industries.length} industries and {regions.length} regions.
            Sourced directly from Companies House.
          </p>

          {/* Live search */}
          <HomeSearch industries={industries} regions={regions} manifest={manifest} />

          {/* Stats bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-blue-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{industries.length.toLocaleString()}</div>
              <div>Industries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{regions.length.toLocaleString()}</div>
              <div>Regions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalPages.toLocaleString()}</div>
              <div>Browse Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Monthly</div>
              <div>Data Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-400">
          Advertisement — replace with AdSense code
        </div>
      </div>

      {/* Industries grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Industry</h2>
          <Link href="/industries" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {topIndustries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/${ind.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-brand-300 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-2">{ICON_MAP[ind.slug] ?? "🏢"}</div>
              <div className="text-xs font-medium text-gray-800 group-hover:text-brand-600 leading-tight mb-1">
                {ind.name}
              </div>
              <div className="text-xs text-gray-400">
                {ind.totalCompanies.toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Regions grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Region</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/region/${region.slug}`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-gray-800 text-sm">{region.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-white border-t border-gray-100 mt-12 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Data You Can Trust</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            All data is sourced directly from Companies House under the Open Government Licence.
            Updated monthly. Each company listed includes registration number, registered address,
            and incorporation date.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { title: "Official Source", body: "Data pulled directly from the Companies House bulk download — the same source used by banks and law firms." },
              { title: "Active Companies Only", body: "We filter to active companies only, removing dissolved, struck-off, and dormant entities." },
              { title: "Free to Browse", body: "Full company listings are free. No account required. Link out to Companies House for verified filings." },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
