import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface Region { slug: string; name: string; }
interface ManifestEntry {
  industry: string; industryName: string;
  region: string; regionName: string; count: number;
}

function readJson<T>(file: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")); }
  catch { return null; }
}

export async function generateStaticParams() {
  const regions = readJson<Region[]>("regions.json") ?? [];
  return regions.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: { params: { region: string } }): Promise<Metadata> {
  const regions = readJson<Region[]>("regions.json") ?? [];
  const region = regions.find((r) => r.slug === params.region);
  if (!region) return {};
  return {
    title: `Companies in ${region.name} | UK Business Finder`,
    description: `Browse active UK companies in ${region.name} by industry. Official Companies House data.`,
  };
}

export default function RegionPage({ params }: { params: { region: string } }) {
  const regions  = readJson<Region[]>("regions.json") ?? [];
  const manifest = readJson<ManifestEntry[]>("manifest.json") ?? [];

  const region = regions.find((r) => r.slug === params.region);
  if (!region) notFound();

  const industries = manifest
    .filter((m) => m.region === params.region)
    .sort((a, b) => b.count - a.count);

  const totalCompanies = industries.reduce((s, m) => s + m.count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>{" / "}
        <Link href="/regions" className="hover:text-brand-600">Regions</Link>{" / "}
        <span className="text-gray-900">{region.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Companies in {region.name}
      </h1>
      <p className="text-gray-600 mb-8">
        {totalCompanies.toLocaleString()} active companies across {industries.length} industries
        in {region.name}. Select an industry to view company listings.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {industries.map((m) => (
          <Link
            key={m.industry}
            href={`/${m.industry}/${m.region}`}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-400 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-brand-600 mb-1">
              {m.industryName}
            </div>
            <div className="text-sm text-gray-500">
              {m.count.toLocaleString()} companies
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
