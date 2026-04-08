import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import CitySearch from "./CitySearch";

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface ManifestEntry {
  industry: string; industryName: string;
  region: string; regionName: string;
  town: string; townName: string;
  count: number;
}

interface TownEntry {
  slug: string; name: string; companies: number; regions: string[];
}

function readJson<T>(file: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")); }
  catch { return null; }
}

const CITY_NAMES: Record<string, string> = {
  "london": "London",
  "manchester": "Manchester",
  "birmingham": "Birmingham",
  "glasgow": "Glasgow",
  "cardiff": "Cardiff",
  "bristol": "Bristol",
  "leeds": "Leeds",
  "leicester": "Leicester",
  "liverpool": "Liverpool",
  "nottingham": "Nottingham",
  "edinburgh": "Edinburgh",
  "sheffield": "Sheffield",
  "coventry": "Coventry",
  "milton-keynes": "Milton Keynes",
  "bolton": "Bolton",
  "reading": "Reading",
  "southampton": "Southampton",
  "belfast": "Belfast",
  "derby": "Derby",
  "newcastle-upon-tyne": "Newcastle upon Tyne",
  "norwich": "Norwich",
  "cambridge": "Cambridge",
  "bradford": "Bradford",
  "brighton": "Brighton",
};

const CITY_SLUGS = Object.keys(CITY_NAMES);

export async function generateStaticParams() {
  return CITY_SLUGS.map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const name = CITY_NAMES[params.city];
  if (!name) return {};
  return {
    title: `Companies in ${name} | UK Business Finder`,
    description: `Browse active UK companies in ${name} by industry. Search, filter, and research companies with free data from Companies House.`,
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const cityName = CITY_NAMES[params.city];
  if (!cityName) notFound();

  const townManifest = readJson<ManifestEntry[]>("town-manifest.json") ?? [];
  const towns = readJson<TownEntry[]>("towns.json") ?? [];

  // Find this city in towns data
  const townData = towns.find(t => t.slug === params.city);
  const totalCompanies = townData ? townData.companies : 0;

  // Get all industry entries for this town
  const industries = townManifest
    .filter((m) => m.town === params.city)
    .sort((a, b) => b.count - a.count);

  // Deduplicate by industry (sum across regions if needed)
  const industryMap: Record<string, { industry: string; industryName: string; count: number; links: { region: string; regionName: string; town: string; count: number }[] }> = {};
  for (const m of industries) {
    if (!industryMap[m.industry]) {
      industryMap[m.industry] = { industry: m.industry, industryName: m.industryName, count: 0, links: [] };
    }
    industryMap[m.industry].count += m.count;
    industryMap[m.industry].links.push({ region: m.region, regionName: m.regionName, town: m.town, count: m.count });
  }

  const industryList = Object.values(industryMap).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <span className="text-gray-900">{cityName}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Companies in {cityName}
      </h1>
      <p className="text-gray-600 mb-6">
        {totalCompanies.toLocaleString()} active companies across {industryList.length} industries
        in {cityName}. Select an industry to view company listings.
      </p>

      <CitySearch industries={industryList} citySlug={params.city} cityName={cityName} />
    </div>
  );
}
