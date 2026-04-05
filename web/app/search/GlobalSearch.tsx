"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

interface ManifestEntry {
  industry: string; industryName: string;
  region: string; regionName: string; count: number;
}
interface Industry { slug: string; name: string; totalCompanies: number; }
interface Region { slug: string; name: string; }

interface Company {
  name: string; number: string; postcode: string; postTown: string;
  county: string; incorporated: string; ageYears: number | null;
  ageBracket: string; sizeClassification: string; companyType: string;
  accountsOverdue: boolean; confStmtOverdue: boolean; isDormant: boolean;
  numMortgages: number; numMortSatisfied: number; hasPreviousName: boolean;
  previousName: string; isOverseas: boolean; isLP: boolean;
  _industry: string; _industryName: string; _region: string; _regionName: string;
}

function Tag({label,colour}:{label:string;colour:"green"|"amber"|"red"|"gray"|"blue"|"purple"}) {
  const cls:Record<string,string>={green:"bg-green-100 text-green-800",amber:"bg-amber-100 text-amber-800",red:"bg-red-100 text-red-800",gray:"bg-gray-100 text-gray-600",blue:"bg-blue-100 text-blue-800",purple:"bg-purple-100 text-purple-800"};
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cls[colour]}`}>{label}</span>;
}

function Sel({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[]}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function formatDate(s: string): string {
  if (!s) return "—";
  try { const p = s.split("/"); if (p.length===3) return new Date(`${p[2]}-${p[1]}-${p[0]}`).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); } catch {}
  return s;
}

const AGE_ORDER=["Startup (0-2 yrs)","Early Stage (2-5 yrs)","Growing (5-10 yrs)","Established (10-20 yrs)","Veteran (20+ yrs)"];
const DISPLAY_LIMIT = 500;

export default function GlobalSearch({manifest, industries, regions}:{
  manifest: ManifestEntry[];
  industries: Industry[];
  regions: Region[];
}) {
  const [nameSearch,  setNameSearch]  = useState("");
  const [industry,    setIndustry]    = useState("All");
  const [region,      setRegion]      = useState("All");
  const [ageBracket,  setAgeBracket]  = useState("All");
  const [sizeClass,   setSizeClass]   = useState("All");
  const [companyType, setCompanyType] = useState("All");
  const [sortBy,      setSortBy]      = useState("newest");
  const [accountsOverdue, setAccountsOverdue] = useState(false);
  const [confStmtOverdue, setConfStmtOverdue] = useState(false);
  const [hasMortgages,    setHasMortgages]    = useState(false);
  const [excludeDormant,  setExcludeDormant]  = useState(false);

  const [allCompanies,  setAllCompanies]  = useState<Company[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [hasSearched,   setHasSearched]   = useState(false);
  const [loadProgress,  setLoadProgress]  = useState("");
  const [displayLimit,  setDisplayLimit]  = useState(DISPLAY_LIMIT);

  // Which pages to load based on industry/region selection
  const pagesToLoad = useMemo(() => {
    return manifest.filter(m => {
      if (industry !== "All" && m.industry !== industry) return false;
      if (region   !== "All" && m.region   !== region)   return false;
      return true;
    });
  }, [manifest, industry, region]);

  const totalCompaniesInScope = useMemo(() =>
    pagesToLoad.reduce((s, m) => s + m.count, 0),
  [pagesToLoad]);

  const tooLarge = industry === "All" && region === "All";

  // Load company data from paginated JSON files
  const loadData = useCallback(async () => {
    if (tooLarge) return;
    setLoading(true);
    setHasSearched(true);
    setDisplayLimit(DISPLAY_LIMIT);
    const companies: Company[] = [];
    let loaded = 0;

    for (const page of pagesToLoad) {
      const key = `${page.industry}__${page.region}`;
      loaded++;
      setLoadProgress(`Loading ${loaded} of ${pagesToLoad.length}: ${page.industryName} in ${page.regionName}...`);

      // First get the meta to know how many pages exist
      try {
        const metaRes = await fetch(`/data/ir-meta/${key}.json`);
        if (!metaRes.ok) continue;
        const meta = await metaRes.json();
        const totalPages = meta.totalPages || 1;

        // Load all company pages for this industry/region
        for (let p = 0; p < totalPages; p++) {
          try {
            const res = await fetch(`/data/ir-pages/${key}__${p}.json`);
            if (!res.ok) continue;
            const chunk: any[] = await res.json();
            for (const c of chunk) {
              companies.push({
                ...c,
                _industry:     page.industry,
                _industryName: page.industryName,
                _region:       page.region,
                _regionName:   page.regionName,
              });
            }
          } catch {}
        }
      } catch {}
    }

    setAllCompanies(companies);
    setLoadProgress("");
    setLoading(false);
  }, [pagesToLoad, tooLarge]);

  // Filter and sort
  const filtered = useMemo(() => {
    if (!hasSearched) return [];
    let list = [...allCompanies];

    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.number?.includes(q) ||
        c.postcode?.toLowerCase().includes(q) ||
        c.postTown?.toLowerCase().includes(q)
      );
    }
    if (ageBracket   !== "All") list = list.filter(c => c.ageBracket === ageBracket);
    if (sizeClass    !== "All") list = list.filter(c => c.sizeClassification === sizeClass);
    if (companyType  !== "All") list = list.filter(c => c.companyType === companyType);
    if (accountsOverdue) list = list.filter(c => c.accountsOverdue);
    if (confStmtOverdue) list = list.filter(c => c.confStmtOverdue);
    if (hasMortgages)    list = list.filter(c => c.numMortgages > 0);
    if (excludeDormant)  list = list.filter(c => !c.isDormant);

    if (sortBy === "newest")    list.sort((a,b) => (b.incorporated||"").localeCompare(a.incorporated||""));
    if (sortBy === "oldest")    list.sort((a,b) => (a.incorporated||"").localeCompare(b.incorporated||""));
    if (sortBy === "name")      list.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === "age-desc")  list.sort((a,b) => (b.ageYears??0)-(a.ageYears??0));
    if (sortBy === "age-asc")   list.sort((a,b) => (a.ageYears??0)-(b.ageYears??0));
    if (sortBy === "mortgages") list.sort((a,b) => b.numMortgages-a.numMortgages);

    return list;
  }, [allCompanies, hasSearched, nameSearch, ageBracket, sizeClass, companyType, accountsOverdue, confStmtOverdue, hasMortgages, excludeDormant, sortBy]);

  const display = filtered.slice(0, displayLimit);

  // Unique size classes and company types from loaded data
  const sizeClasses  = useMemo(() => [...new Set(allCompanies.map(c=>c.sizeClassification).filter(Boolean))].sort(), [allCompanies]);
  const companyTypes = useMemo(() => [...new Set(allCompanies.map(c=>c.companyType).filter(Boolean))].sort(), [allCompanies]);

  const industryOpts = [{value:"All",label:"All industries"},...industries.map(i=>({value:i.slug,label:`${i.name} (${i.totalCompanies.toLocaleString()})`}))];
  const regionOpts   = [{value:"All",label:"All regions"},...regions.map(r=>({value:r.slug,label:r.name}))];
  const ageOpts      = [{value:"All",label:"All ages"},...AGE_ORDER.map(b=>({value:b,label:b}))];
  const sizeOpts     = [{value:"All",label:"All sizes"},...sizeClasses.map(s=>({value:s,label:s}))];
  const typeOpts     = [{value:"All",label:"All types"},...companyTypes.map(t=>({value:t,label:t}))];
  const sortOpts     = [
    {value:"newest",   label:"Newest first"},
    {value:"oldest",   label:"Oldest first"},
    {value:"name",     label:"Name A–Z"},
    {value:"age-desc", label:"Oldest companies"},
    {value:"age-asc",  label:"Youngest companies"},
    {value:"mortgages",label:"Most charges"},
  ];

  function reset() {
    setNameSearch(""); setAgeBracket("All"); setSizeClass("All");
    setCompanyType("All"); setAccountsOverdue(false);
    setConfStmtOverdue(false); setHasMortgages(false); setExcludeDormant(false);
    setSortBy("newest");
  }

  const showTable = hasSearched && !loading;

  return (
    <div className="space-y-6">
      {/* Scope selectors */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Step 1 — Select scope</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Sel label="Industry" value={industry} onChange={v=>{setIndustry(v);setHasSearched(false);setAllCompanies([]);}} options={industryOpts}/>
          <Sel label="Region"   value={region}   onChange={v=>{setRegion(v);setHasSearched(false);setAllCompanies([]);}} options={regionOpts}/>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {tooLarge
              ? "Please select at least one industry or region to search"
              : `${pagesToLoad.length} page${pagesToLoad.length!==1?"s":""} · ~${totalCompaniesInScope.toLocaleString()} companies in scope`
            }
          </p>
          <button onClick={loadData} disabled={loading || tooLarge}
            className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            {loading ? "Loading..." : "Load Companies →"}
          </button>
        </div>
      </div>

      {/* Filters — only show after data loaded */}
      {hasSearched && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Step 2 — Filter results</h2>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Search by name, postcode, town or company number</label>
            <input type="text" value={nameSearch} onChange={e=>setNameSearch(e.target.value)}
              placeholder="e.g. Acme Ltd, BT1, Belfast, NI123456..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <Sel label="Company Age"             value={ageBracket}  onChange={setAgeBracket}  options={ageOpts}/>
            <Sel label="Company Size (Official)" value={sizeClass}   onChange={setSizeClass}   options={sizeOpts}/>
            <Sel label="Company Type"            value={companyType} onChange={setCompanyType} options={typeOpts}/>
            <Sel label="Sort by"                 value={sortBy}      onChange={setSortBy}       options={sortOpts}/>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {[
              {label:"Accounts overdue",      state:accountsOverdue, set:setAccountsOverdue},
              {label:"Conf. stmt overdue",    state:confStmtOverdue, set:setConfStmtOverdue},
              {label:"Has charges",           state:hasMortgages,    set:setHasMortgages},
              {label:"Exclude dormant",       state:excludeDormant,  set:setExcludeDormant},
            ].map(({label,state,set})=>(
              <button key={label} onClick={()=>set(!state)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${state?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                {state?"✓ ":""}{label}
              </button>
            ))}
            <button onClick={reset} className="text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors ml-auto">
              Reset filters
            </button>
          </div>

          <p className="text-xs text-gray-400">
            ⚠️ Compliance flags are based on the Companies House data snapshot dated <strong>2 March 2026</strong>. Always verify on{" "}
            <a href="https://find-and-update.company-information.service.gov.uk" target="_blank" rel="noopener noreferrer" className="underline">Companies House</a>.
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-medium">Loading {totalCompaniesInScope.toLocaleString()} companies...</p>
          <p className="text-sm text-gray-400 mt-1">{loadProgress || "This may take a few seconds for large datasets"}</p>
        </div>
      )}

      {/* Results */}
      {showTable && (
        <div>
          <div className="text-sm text-gray-600 mb-3">
            Showing <strong>{display.length.toLocaleString()}</strong>{filtered.length > displayLimit ? ` of ${filtered.length.toLocaleString()} matching` : ""} companies
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
              No companies match your filters. <button onClick={reset} className="text-blue-600 underline">Reset</button>
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-5 py-3 font-medium text-gray-600">Company</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Industry</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Town</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Incorporated</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Size</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Flags</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {display.map((c, i) => (
                        <tr key={`${c.number||i}-${c._industry}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <a href={c.number
                                ? `https://find-and-update.company-information.service.gov.uk/company/${c.number}`
                                : `https://find-and-update.company-information.service.gov.uk/search?q=${encodeURIComponent(c.name)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="font-medium text-gray-900 hover:text-blue-600 block">{c.name}</a>
                            {c.hasPreviousName && <div className="text-xs text-gray-400">Prev: {c.previousName}</div>}
                            <div className="text-xs text-gray-400 font-mono">{c.number}</div>
                          </td>
                          <td className="px-4 py-3.5 hidden sm:table-cell">
                            <Link href={`/${c._industry}/${c._region}`} className="text-xs text-blue-600 hover:underline">{c._industryName}</Link>
                            <div className="text-xs text-gray-400">{c._regionName}</div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                            <div>{c.postTown||"—"}</div>
                            <div className="text-xs text-gray-400">{c.postcode}</div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{formatDate(c.incorporated)}</td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            {c.sizeClassification && !["Unknown","Not Yet Filed"].includes(c.sizeClassification) ? (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{c.sizeClassification}</span>
                            ) : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {c.accountsOverdue && <Tag label="Accts ⚠️"    colour="red"/>}
                              {c.confStmtOverdue && <Tag label="ConfStmt ⚠️" colour="amber"/>}
                              {c.isDormant       && <Tag label="Dormant"      colour="gray"/>}
                              {c.isOverseas      && <Tag label="Overseas"     colour="purple"/>}
                              {c.isLP            && <Tag label="LP/LLP"       colour="blue"/>}
                              {c.numMortgages>0  && <Tag label={`${c.numMortgages} charge${c.numMortgages>1?"s":""}`} colour="blue"/>}
                              {c.numMortSatisfied>0 && <Tag label={`${c.numMortSatisfied} satisfied`} colour="green"/>}
                              {!c.accountsOverdue&&!c.confStmtOverdue&&!c.isDormant&&c.numMortgages===0 && <Tag label="Clean ✓" colour="green"/>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {filtered.length > displayLimit && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + DISPLAY_LIMIT)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                    Show {Math.min(DISPLAY_LIMIT, filtered.length - displayLimit).toLocaleString()} more ({filtered.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Not yet searched state */}
      {!hasSearched && !tooLarge && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-gray-600">Select an industry and/or region above, then click Load Companies</p>
          <p className="text-sm mt-1">Or browse directly from the <Link href="/industries" className="text-blue-600 underline">industries</Link> or <Link href="/regions" className="text-blue-600 underline">regions</Link> pages</p>
        </div>
      )}

      {!hasSearched && tooLarge && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-gray-600">Please select at least one industry or region to search</p>
          <p className="text-sm mt-1">The full dataset has {totalCompaniesInScope.toLocaleString()} companies — pick a scope to narrow it down</p>
          <p className="text-sm mt-3">Or browse directly from the <Link href="/industries" className="text-blue-600 underline">industries</Link> or <Link href="/regions" className="text-blue-600 underline">regions</Link> pages</p>
        </div>
      )}
    </div>
  );
}
