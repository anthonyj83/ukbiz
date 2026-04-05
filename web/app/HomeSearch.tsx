"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Industry { slug: string; name: string; totalCompanies: number; }
interface Region { slug: string; name: string; }
interface ManifestEntry { industry: string; industryName: string; region: string; regionName: string; count: number; }

export default function HomeSearch({
  industries, regions, manifest
}: {
  industries: Industry[];
  regions: Region[];
  manifest: ManifestEntry[];
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();

    const industryHits = industries
      .filter(i => i.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map(i => ({ type: "industry" as const, label: i.name, sub: `${i.totalCompanies.toLocaleString()} companies`, href: `/${i.slug}` }));

    const regionHits = regions
      .filter(r => r.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(r => ({ type: "region" as const, label: r.name, sub: "Browse all industries", href: `/region/${r.slug}` }));

    const pageHits = manifest
      .filter(m => m.industryName.toLowerCase().includes(q) || m.regionName.toLowerCase().includes(q))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(m => ({ type: "page" as const, label: `${m.industryName} in ${m.regionName}`, sub: `${m.count.toLocaleString()} companies`, href: `/${m.industry}/${m.region}` }));

    return [...industryHits, ...regionHits, ...pageHits].slice(0, 8);
  }, [query, industries, regions, manifest]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) router.push(results[0].href);
  }

  const typeLabel: Record<string, string> = { industry: "Industry", region: "Region", page: "Page" };
  const typeColour: Record<string, string> = {
    industry: "bg-blue-100 text-blue-700",
    region: "bg-green-100 text-green-700",
    page: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search industry or region..."
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button type="submit"
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {results.map((r, i) => (
            <a key={i} href={r.href}
              className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
              <div>
                <div className="font-medium text-gray-900 text-sm">{r.label}</div>
                <div className="text-xs text-gray-500">{r.sub}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColour[r.type]}`}>
                {typeLabel[r.type]}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
