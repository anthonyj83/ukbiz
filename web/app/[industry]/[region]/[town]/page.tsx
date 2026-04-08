import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface ManifestEntry {
  industry: string; industryName: string;
  region: string; regionName: string;
  town: string; townName: string;
  count: number;
}

interface Company {
  name: string; number: string; postTown?: string;
  postcode?: string; type?: string; status?: string;
  incorporated?: string; sicCodes?: string[];
  overdue?: boolean; csOverdue?: boolean;
  dormant?: boolean; foreign?: boolean;
  corpOwned?: boolean; charges?: any[];
  pscs?: any[];
}

interface IRData {
  industry: string; industryName: string;
  region: string; regionName: string;
  companies: Company[];
}

function readJson<T>(file: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")); }
  catch { return null; }
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Pages generated on-demand and cached (too many for build-time generation)
export const dynamicParams = true;

export async function generateStaticParams() {
  const manifest = readJson<ManifestEntry[]>("town-manifest.json") ?? []; const seen = new Set<string>(); const params: {industry:string;region:string;town:string}[] = []; for (const m of manifest.filter(x=>x.count>=5000)) { const k=m.industry+m.region+m.town; if(seen.has(k)) continue; seen.add(k); params.push({industry:m.industry,region:m.region,town:m.town}); } console.log("Town pages to build:",params.length); return params;
}

export async function generateMetadata(
  { params }: { params: { industry: string; region: string; town: string } }
): Promise<Metadata> {
  const manifest = readJson<ManifestEntry[]>("town-manifest.json") ?? [];
  const entry = manifest.find(
    m => m.industry === params.industry && m.region === params.region && m.town === params.town
  );
  if (!entry) return {};

  return {
    title: `${entry.industryName} Companies in ${entry.townName}, ${entry.regionName} | UK Business Finder`,
    description: `Browse ${entry.count} active ${entry.industryName.toLowerCase()} companies in ${entry.townName}, ${entry.regionName}. Free company data from Companies House.`,
  };
}

export default function TownPage(
  { params }: { params: { industry: string; region: string; town: string } }
) {
  const manifest = readJson<ManifestEntry[]>("town-manifest.json") ?? [];
  const entry = manifest.find(
    m => m.industry === params.industry && m.region === params.region && m.town === params.town
  );
  if (!entry) notFound();

  // Load IR data for this industry+region
  const irFile = `${params.industry}__${params.region}.json`;
  const irData = readJson<IRData>(path.join("ir", irFile));
  if (!irData) notFound();

  // Filter companies to this town
  const companies = (irData.companies || []).filter(c => {
    const town = (c.postTown || "").trim();
    return slugify(town) === params.town || town.toLowerCase().replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ") === entry.townName.toLowerCase();
  });

  // Sort: active first, then by name
  companies.sort((a, b) => {
    if (a.overdue && !b.overdue) return 1;
    if (!a.overdue && b.overdue) return -1;
    return (a.name || "").localeCompare(b.name || "");
  });

  // Other towns in same industry+region
  const otherTowns = manifest
    .filter(m => m.industry === params.industry && m.region === params.region && m.town !== params.town)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Other industries in same town+region
  const otherIndustries = manifest
    .filter(m => m.town === params.town && m.region === params.region && m.industry !== params.industry)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href={`/${params.industry}`} className="hover:text-blue-600">{entry.industryName}</Link>
        <span>/</span>
        <Link href={`/${params.industry}/${params.region}`} className="hover:text-blue-600">{entry.regionName}</Link>
        <span>/</span>
        <span className="text-gray-900">{entry.townName}</span>
      </nav>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {entry.industryName} Companies in {entry.townName}
      </h1>
      <p className="text-gray-600 mb-8">
        {companies.length.toLocaleString()} active {entry.industryName.toLowerCase()} companies
        in {entry.townName}, {entry.regionName}. Data sourced from Companies House.
      </p>

      {/* Company listing */}
      <div className="space-y-3 mb-12">
        {companies.map((c, i) => (
          <div key={c.number || i} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <a
                  href={`https://find-and-update.company-information.service.gov.uk/company/${c.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {c.name}
                </a>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 font-mono">{c.number}</span>
                  {c.type && <span className="text-xs text-gray-400">{c.type}</span>}
                  {c.postcode && <span className="text-xs text-gray-400">{c.postcode}</span>}
                  {c.incorporated && (
                    <span className="text-xs text-gray-400">
                      Inc. {new Date(c.incorporated).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 flex-shrink-0">
                {c.overdue && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Overdue</span>
                )}
                {c.dormant && (
                  <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">Dormant</span>
                )}
                {c.foreign && (
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Foreign</span>
                )}
                {c.charges && c.charges.length > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {c.charges.length} charge{c.charges.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            {/* PSCs */}
            {c.pscs && c.pscs.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">PSC: </span>
                {c.pscs.slice(0, 3).map((p: any, pi: number) => (
                  <span key={pi} className="text-xs text-gray-600">
                    {p.n}{pi < Math.min(c.pscs!.length, 3) - 1 ? ", " : ""}
                  </span>
                ))}
                {c.pscs.length > 3 && (
                  <span className="text-xs text-gray-400"> +{c.pscs.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Other industries in this town */}
      {otherIndustries.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Other Industries in {entry.townName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherIndustries.map(m => (
              <Link
                key={m.industry}
                href={`/${m.industry}/${m.region}/${m.town}`}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="font-medium text-gray-800 text-sm">{m.industryName}</div>
                <div className="text-xs text-gray-400">{m.count.toLocaleString()} companies</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other towns in same industry+region */}
      {otherTowns.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {entry.industryName} in Other Towns ({entry.regionName})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherTowns.map(m => (
              <Link
                key={m.town}
                href={`/${m.industry}/${m.region}/${m.town}`}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="font-medium text-gray-800 text-sm">{m.townName}</div>
                <div className="text-xs text-gray-400">{m.count.toLocaleString()} companies</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="text-center">
        <Link
          href={`/${params.industry}/${params.region}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          &larr; All {entry.industryName} in {entry.regionName}
        </Link>
      </div>
    </div>
  );
}
