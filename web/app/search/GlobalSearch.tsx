"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ManifestEntry {
  industry: string; industryName: string;
  region: string; regionName: string; count: number;
}
interface Industry { slug: string; name: string; totalCompanies: number; }
interface Region { slug: string; name: string; }

export default function GlobalSearch({manifest, industries, regions}:{
  manifest: ManifestEntry[];
  industries: Industry[];
  regions: Region[];
}) {
  const router = useRouter();
  const [industry, setIndustry] = useState("All");
  const [region, setRegion] = useState("All");

  const matches = useMemo(() => {
    return manifest
      .filter(m => {
        if (industry !== "All" && m.industry !== industry) return false;
        if (region !== "All" && m.region !== region) return false;
        return true;
      })
      .sort((a, b) => b.count - a.count);
  }, [manifest, industry, region]);

  const totalCompanies = useMemo(() => matches.reduce((s, m) => s + m.count, 0), [matches]);

  const canGo = industry !== "All" && region !== "All";

  function handleGo() {
    if (canGo) {
      router.push(`/${industry}/${region}`);
    }
  }

  const industryOpts = [{value:"All",label:"All industries"}, ...industries.map(i => ({value: i.slug, label: `${i.name} (${i.totalCompanies.toLocaleString()})`}))];
  const regionOpts = [{value:"All",label:"All regions"}, ...regions.map(r => ({value: r.slug, label: r.name}))];

  return (
    <div className="space-y-6">
      {/* Scope selectors */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Find companies by industry and region</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {industryOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Region</label>
            <select value={region} onChange={e => setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {regionOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {canGo ? (
          <button onClick={handleGo}
            className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            View {matches[0]?.industryName} in {matches[0]?.regionName} ({matches[0]?.count.toLocaleString()} companies) →
          </button>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Select both an industry and a region to browse companies
          </p>
        )}
      </div>

      {/* Results grid */}
      {(industry !== "All" || region !== "All") && (
        <div>
          <div className="text-sm text-gray-600 mb-3">
            {matches.length} {matches.length === 1 ? "result" : "results"} · {totalCompanies.toLocaleString()} total companies
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(m => (
              <Link key={`${m.industry}-${m.region}`} href={`/${m.industry}/${m.region}`}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">{m.industryName}</div>
                <div className="text-sm text-gray-500 mb-2">{m.regionName}</div>
                <div className="text-lg font-bold text-blue-600">{m.count.toLocaleString()}</div>
                <div className="text-xs text-gray-400">active companies</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Default state */}
      {industry === "All" && region === "All" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-gray-600">Select an industry, a region, or both to find companies</p>
          <p className="text-sm mt-2">Each result links to a full browsing page with filters, search, and company details</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/industries" className="text-sm text-blue-600 hover:underline">Browse all industries →</Link>
            <Link href="/regions" className="text-sm text-blue-600 hover:underline">Browse all regions →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
