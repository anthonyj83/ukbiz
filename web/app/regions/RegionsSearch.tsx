"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Region { slug: string; name: string; }
interface ManifestEntry {
  industry: string; industryName: string;
  region: string; regionName: string; count: number;
}

const REGION_ICONS: Record<string, string> = {
  "london":"🏙️","south-east":"🌳","south-west":"🌊","east-midlands":"🏭",
  "west-midlands":"🏗️","east-england":"🌾","yorkshire":"⚒️",
  "north-west":"🏙️","north-east":"⚓","scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "wales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","northern-ireland":"🟢",
};

export default function RegionsSearch({
  regions, manifest
}: {
  regions: Region[];
  manifest: ManifestEntry[];
}) {
  const [search, setSearch] = useState("");

  const regionTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};
    for (const m of manifest) {
      totals[m.region] = (totals[m.region] || 0) + m.count;
      counts[m.region] = (counts[m.region] || 0) + 1;
    }
    return { totals, counts };
  }, [manifest]);

  const regionTopIndustries = useMemo(() => {
    const top: Record<string, ManifestEntry[]> = {};
    for (const r of regions) {
      top[r.slug] = manifest
        .filter(m => m.region === r.slug)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
    }
    return top;
  }, [regions, manifest]);

  const filtered = useMemo(() => {
    const sorted = [...regions].sort(
      (a, b) => (regionTotals.totals[b.slug] || 0) - (regionTotals.totals[a.slug] || 0)
    );
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(r => r.name.toLowerCase().includes(q));
  }, [regions, regionTotals, search]);

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search regions e.g. London, Scotland, Yorkshire..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <p className="text-sm text-gray-500 mt-2">
            {filtered.length} {filtered.length === 1 ? "region" : "regions"} found
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No regions found for &quot;{search}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(region => (
            <div key={region.slug} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{REGION_ICONS[region.slug] ?? "🗺️"}</span>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{region.name}</h2>
                  <p className="text-sm text-gray-500">
                    {(regionTotals.totals[region.slug] || 0).toLocaleString()} companies ·{" "}
                    {regionTotals.counts[region.slug] || 0} industries
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                {regionTopIndustries[region.slug]?.map(m => (
                  <Link key={m.industry} href={`/${m.industry}/${m.region}`}
                    className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="text-gray-700 group-hover:text-blue-600">{m.industryName}</span>
                    <span className="text-gray-400 text-xs">{m.count.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
              <Link href={`/region/${region.slug}`}
                className="block text-center text-sm text-blue-600 font-medium hover:text-blue-700 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors">
                View all industries in {region.name} →
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
