import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface ManifestEntry {
  industry: string;
  industryName: string;
  region: string;
  regionName: string;
  count: number;
}

interface Industry {
  slug: string;
  name: string;
  totalCompanies: number;
  topRegions: string[];
  affiliates: string[];
}

function readJson<T>(filename: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"));
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const industries = readJson<Industry[]>("industries.json") ?? [];
  return industries.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { industry: string };
}): Promise<Metadata> {
  const industries = readJson<Industry[]>("industries.json") ?? [];
  const ind = industries.find((i) => i.slug === params.industry);
  if (!ind) return {};
  return {
    title: `${ind.name} Companies in the UK`,
    description: `Browse ${ind.totalCompanies.toLocaleString()} active ${ind.name.toLowerCase()} companies across all UK regions. Sourced from official Companies House data.`,
    alternates: { canonical: `/${ind.slug}` },
  };
}

export default function IndustryPage({
  params,
}: {
  params: { industry: string };
}) {
  const industries = readJson<Industry[]>("industries.json") ?? [];
  const manifest   = readJson<ManifestEntry[]>("manifest.json") ?? [];

  const ind = industries.find((i) => i.slug === params.industry);
  if (!ind) notFound();

  const regions = manifest
    .filter((m) => m.industry === params.industry)
    .sort((a, b) => b.count - a.count);

  const related = industries
    .filter((i) => i.slug !== params.industry)
    .slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        {" / "}
        <Link href="/industries" className="hover:text-brand-600">Industries</Link>
        {" / "}
        <span className="text-gray-900">{ind.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {ind.name} Companies in the UK
        </h1>
        <p className="text-lg text-gray-600">
          Browse{" "}
          <strong>{ind.totalCompanies.toLocaleString()} active {ind.name.toLowerCase()} companies</strong>{" "}
          registered in England, Wales, Scotland, and Northern Ireland.
          Select a region to view company listings.
        </p>
      </div>

      {/* AdSense slot */}
      <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-400 mb-8">
        Advertisement
      </div>

      {/* Regions grid */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Region</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {regions.map((r) => (
          <Link
            key={r.region}
            href={`/${params.industry}/${r.region}`}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-400 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-brand-600 mb-1">
              {r.regionName}
            </div>
            <div className="text-sm text-gray-500">
              {r.count.toLocaleString()} companies
            </div>
          </Link>
        ))}
      </div>

      {/* SEO text block */}
      <div className="bg-blue-50 rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          About {ind.name} Companies in the UK
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          There are currently{" "}
          <strong>{ind.totalCompanies.toLocaleString()} active {ind.name.toLowerCase()} businesses</strong>{" "}
          registered at Companies House across the United Kingdom.
          {regions.length > 0 && (
            <> The highest concentration is in{" "}
              <strong>{regions[0]?.regionName}</strong>
              {regions[1] ? ` and ${regions[1]?.regionName}` : ""}.
            </>
          )}{" "}
          All data is sourced from the official Companies House bulk data download,
          updated monthly under the Open Government Licence.
        </p>
      </div>

      {/* Related industries */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Industries</h2>
      <div className="flex flex-wrap gap-2">
        {related.map((i) => (
          <Link
            key={i.slug}
            href={`/${i.slug}`}
            className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors"
          >
            {i.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
