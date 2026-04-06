"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  n: string;   // company name
  no: string;  // company number
  t: string;   // town
  i: string;   // industry slug
  in: string;  // industry name
  r: string;   // region slug
  rn: string;  // region name
}

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

export default function CompanySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const cacheRef = useRef<Record<string, SearchResult[]>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    const qLower = q.toLowerCase().trim();

    // Check if searching by company number (starts with digits or known prefixes)
    const isNumberSearch = /^\d/.test(q) || /^(SC|NI|OC|SO|NC|NF|FC|IP|AC|CE|CS|GE|GS|GN|IC|LP|NA|NP|RC|RS|SE|SF|SG|SI|SL|SP|SR|ZC)\d/i.test(q);

    if (isNumberSearch) {
      // For number search, we need to check multiple prefix files
      // Just search across loaded cache
      const allResults: SearchResult[] = [];
      for (const entries of Object.values(cacheRef.current)) {
        for (const e of entries) {
          if (e.no.toLowerCase().startsWith(qLower)) {
            allResults.push(e);
            if (allResults.length >= 30) break;
          }
        }
        if (allResults.length >= 30) break;
      }
      setResults(allResults);
      setLoading(false);
      return;
    }

    // Name search - fetch the prefix file
    const prefix = cleanPrefix(q);
    if (!prefix) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Fetch prefix file if not cached
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
    
    // Filter by full query
    const matches = entries
      .filter(e => e.n.toLowerCase().includes(qLower) || e.no.toLowerCase().includes(qLower))
      .slice(0, 30);

    setResults(matches);
    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  return (
    <div className="mb-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Search UK Companies</h2>
        <p className="text-sm text-gray-500 mb-4">Search across 2.6 million active UK companies by name or company number</p>
        
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a company name or number (e.g. Tesco, NI123456)..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && !loading && results.length === 0 && query.length >= 3 && (
          <div className="mt-4 text-center text-gray-500 text-sm py-4">
            No companies found matching "{query}". Try a different spelling or search term.
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2">{results.length >= 30 ? "30+" : results.length} results — showing top matches</div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto rounded-lg border border-gray-100">
              {results.map((r, i) => (
                <div key={`${r.no}-${i}`} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <a
                      href={`https://find-and-update.company-information.service.gov.uk/company/${r.no}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm block truncate"
                    >
                      {r.n}
                    </a>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 font-mono">{r.no}</span>
                      {r.t && <span className="text-xs text-gray-400">{r.t}</span>}
                    </div>
                  </div>
                  <Link
                    href={`/${r.i}/${r.r}`}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {r.in} — {r.rn}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {query.length > 0 && query.length < 3 && (
          <div className="mt-3 text-xs text-gray-400">Type at least 3 characters to search</div>
        )}
      </div>
    </div>
  );
}
