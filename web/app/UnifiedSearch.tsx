"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  n: string;
  no: string;
  t: string;
  i: string;
  in: string;
  r: string;
  rn: string;
}

interface Industry { slug: string; name: string; totalCompanies: number; }
interface Region { slug: string; name: string; }
interface ManifestEntry { industry: string; industryName: string; region: string; regionName: string; count: number; }

function cleanPrefix(query: string): string {
  const chars: string[] = [];
  for (const ch of query.toLowerCase()) {
    if (/[a-z]/.test(ch)) {
      chars.push(ch);
      if (chars.length === 2) break;
    }
  }
  return chars.length < 2 ? "" : chars.join("");
}

export default function UnifiedSearch({ industries, regions, manifest }: {
  industries: Industry[];
  regions: Region[];
  manifest: ManifestEntry[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [companyResults, setCompanyResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const cacheRef = useRef<Record<string, SearchResult[]>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [selIndustry, setSelIndustry] = useState("All");
  const [selRegion, setSelRegion] = useState("All");

  const canBrowse = selIndustry !== "All" && selRegion !== "All";
  const browseMatch = canBrowse ? manifest.find(m => m.industry === selIndustry && m.region === selRegion) : null;

  const qLower = query.toLowerCase().trim();

  // Filter industries and regions client-side (instant)
  const matchedIndustries = qLower.length >= 2
    ? industries.filter(i => i.name.toLowerCase().includes(qLower)).slice(0, 6)
    : [];

  const matchedRegions = qLower.length >= 2
    ? regions.filter(r => r.name.toLowerCase().includes(qLower)).slice(0, 4)
    : [];

  // Match industry+region combos from manifest
  const matchedPages = qLower.length >= 2
    ? manifest.filter(m =>
        m.industryName.toLowerCase().includes(qLower) ||
        m.regionName.toLowerCase().includes(qLower)
      ).slice(0, 0) // don't show these separately, industries/regions cover it
    : [];

  // Company search (async, fetches from index)
  const searchCompanies = useCallback(async (q: string) => {
    if (q.length < 3) {
      setCompanyResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    const searchLower = q.toLowerCase().trim();
    const isNumberSearch = /^\d/.test(q) || /^(SC|NI|OC|SO|NC|NF|FC|IP|AC|CE|CS|GE|GS|GN|IC|LP|NA|NP|RC|RS|SE|SF|SG|SI|SL|SP|SR|ZC)\d/i.test(q);

    if (isNumberSearch) {
      const allResults: SearchResult[] = [];
      for (const entries of Object.values(cacheRef.current)) {
        for (const e of entries) {
          if (e.no.toLowerCase().startsWith(searchLower)) {
            allResults.push(e);
            if (allResults.length >= 20) break;
          }
        }
        if (allResults.length >= 20) break;
      }
      setCompanyResults(allResults);
      setLoading(false);
      return;
    }

    const prefix = cleanPrefix(q);
    if (!prefix) {
      setCompanyResults([]);
      setLoading(false);
      return;
    }

    if (!cacheRef.current[prefix]) {
      try {
        const res = await fetch(`/data/search/${prefix}.json`);
        if (res.ok) {
          cacheRef.current[prefix] = await res.json();
        } else {
          cacheRef.current[prefix] = [];
        }
      } catch {
        cacheRef.current[prefix] = [];
      }
    }

    const entries = cacheRef.current[prefix] || [];
    const matches = entries
      .filter(e => e.n.toLowerCase().includes(searchLower) || e.no.toLowerCase().includes(searchLower))
      .slice(0, 20);

    setCompanyResults(matches);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCompanies(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchCompanies]);

  const hasAnyResults = matchedIndustries.length > 0 || matchedRegions.length > 0 || companyResults.length > 0;
  const showDropdown = qLower.length >= 2 && (hasAnyResults || (searched && !loading));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "UK Business Finder",
        "url": "https://ukbizfinder.co.uk",
        "description": "Search and browse 2.6 million active UK companies. Free company data from Companies House including ownership, charges, and compliance flags.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://ukbizfinder.co.uk/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })}} />

      <div className="relative w-full max-w-2xl mx-auto">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by company name, number, industry or region (e.g. Acme Ltd, SW1, London)..."
            className="flex-1 rounded-l-xl border-0 px-5 py-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-white border-l border-gray-200 px-6 rounded-r-xl text-brand-600 font-semibold hover:bg-gray-50 transition-colors">
            Search
          </button>
        </div>

        {loading && (
          <div className="absolute right-20 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Results dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[28rem] overflow-y-auto">

            {/* Industries */}
            {matchedIndustries.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">Industries</div>
                {matchedIndustries.map(ind => (
                  <Link key={ind.slug} href={`/${ind.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">{ind.name}</span>
                    <span className="text-xs text-gray-400">{ind.totalCompanies.toLocaleString()} companies</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Regions */}
            {matchedRegions.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">Regions</div>
                {matchedRegions.map(reg => (
                  <Link key={reg.slug} href={`/region/${reg.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">{reg.name}</span>
                    <span className="text-xs text-gray-400">View all industries</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Companies */}
            {companyResults.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">Companies</div>
                {companyResults.map((r, i) => (
                  <div key={`${r.no}-${i}`} className="flex items-start justify-between gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <a href={`https://find-and-update.company-information.service.gov.uk/company/${r.no}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors block truncate">
                        {r.n}
                      </a>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 font-mono">{r.no}</span>
                        {r.t && <span className="text-xs text-gray-400">{r.t}</span>}
                      </div>
                    </div>
                    <Link href={`/${r.i}/${r.r}`}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0">
                      {r.rn}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {!hasAnyResults && searched && !loading && qLower.length >= 3 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No results found for "{query}"
              </div>
            )}

            {/* Typing hint */}
            {qLower.length >= 2 && qLower.length < 3 && companyResults.length === 0 && !matchedIndustries.length && !matchedRegions.length && (
              <div className="px-4 py-4 text-center text-xs text-gray-400">
                Type one more character to search companies
              </div>
            )}
          </div>
        )}
      </div>

      {/* Browse by Industry & Region */}
      <div className="mt-6 w-full max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm text-blue-100 mb-3 text-center">Or browse by industry and region</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
            <select value={selIndustry} onChange={e => setSelIndustry(e.target.value)}
              className="flex-1 rounded-lg border-0 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="All">All industries</option>
              {industries.map(i => (
                <option key={i.slug} value={i.slug}>{i.name} ({i.totalCompanies.toLocaleString()})</option>
              ))}
            </select>
            <select value={selRegion} onChange={e => setSelRegion(e.target.value)}
              className="flex-1 rounded-lg border-0 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="All">All regions</option>
              {regions.map(r => (
                <option key={r.slug} value={r.slug}>{r.name}</option>
              ))}
            </select>
            <button
              onClick={() => { if (canBrowse) router.push(`/${selIndustry}/${selRegion}`); }}
              disabled={!canBrowse}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${canBrowse ? "bg-white text-blue-700 hover:bg-gray-100 cursor-pointer" : "bg-white/20 text-blue-200 cursor-not-allowed"}`}>
              {canBrowse && browseMatch ? `Browse ${browseMatch.count.toLocaleString()} companies` : "Browse"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
