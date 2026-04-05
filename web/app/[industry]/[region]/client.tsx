"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

interface Company {
  name: string; number: string; postcode: string; postTown: string;
  county: string; country: string; countryOfOrigin: string; isOverseas: boolean;
  status: string; incorporated: string; ageYears: number | null; ageBracket: string;
  sizeClassification: string; companyType: string;
  accountsOverdue: boolean; confStmtOverdue: boolean;
  isDormant: boolean; numMortgages: number;
  numMortSatisfied: number; hasPreviousName: boolean; previousName: string;
  isLP: boolean;
}

interface Stats {
  averageAgeYears: number | null;
  ageBrackets: Record<string, number>;
  sizeClassifications: Record<string, number>;
  companyTypes: Record<string, number>;
  topTowns: Record<string, number>;
  counties: Record<string, number>;
  accountsOverdueCount: number;
  confStmtOverdueCount: number;
  dormantCount: number;
  withMortgagesCount: number;
  withSatisfiedCharges: number;
  overseasCount: number;
  rebrandedCount: number;
  lpCount: number;
}

interface Affiliate { label: string; description: string; url: string; cta: string; }

interface MetaData {
  industry: string; industryName: string; region: string; regionName: string;
  count: number; stats: Stats; affiliates: Affiliate[]; updated: string;
  totalPages: number; pageSize: number;
}

function formatDate(s: string): string {
  if (!s) return "—";
  try { const p = s.split("/"); if (p.length===3) return new Date(`${p[2]}-${p[1]}-${p[0]}`).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); } catch {}
  return s;
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

function Tog({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}) {
  return <button onClick={onClick} className={`text-sm px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${active?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>{active?"✓ ":""}{label}</button>;
}

const AGE_ORDER=["Startup (0-2 yrs)","Early Stage (2-5 yrs)","Growing (5-10 yrs)","Established (10-20 yrs)","Veteran (20+ yrs)","Unknown"];

export default function IndustryRegionClient({meta,initialCompanies,otherRegions,otherIndustries}:{
  meta: MetaData;
  initialCompanies: Company[];
  otherRegions:{industry:string;region:string;regionName:string;count:number}[];
  otherIndustries:{industry:string;industryName:string;region:string;count:number}[];
}) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [loadedPages, setLoadedPages] = useState(1); // page 0 is already loaded
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(meta.totalPages <= 1);

  const [search,setSearch]=useState("");
  const [ageBracket,setAgeBracket]=useState("All");
  const [sizeClass,setSizeClass]=useState("All");
  const [companyType,setCompanyType]=useState("All");
  const [town,setTown]=useState("All");
  const [county,setCounty]=useState("All");
  const [sortBy,setSortBy]=useState("newest");
  const [accountsOverdue,setAccountsOverdue]=useState(false);
  const [confStmtOverdue,setConfStmtOverdue]=useState(false);
  const [hasMortgages,setHasMortgages]=useState(false);
  const [hasSatisfied,setHasSatisfied]=useState(false);
  const [excludeDormant,setExcludeDormant]=useState(false);
  const [overseasOnly,setOverseasOnly]=useState(false);
  const [rebranded,setRebranded]=useState(false);
  const [lpOnly,setLpOnly]=useState(false);

  const loadMore = useCallback(async () => {
    if (loadingMore || allLoaded) return;
    setLoadingMore(true);
    try {
      const nextPage = loadedPages;
      const res = await fetch(`/data/ir-pages/${meta.industry}__${meta.region}__${nextPage}.json`);
      if (!res.ok) { setAllLoaded(true); return; }
      const chunk: Company[] = await res.json();
      if (chunk.length === 0) { setAllLoaded(true); return; }
      setCompanies(prev => [...prev, ...chunk]);
      setLoadedPages(prev => prev + 1);
      if (nextPage + 1 >= meta.totalPages) setAllLoaded(true);
    } catch { setAllLoaded(true); }
    finally { setLoadingMore(false); }
  }, [loadingMore, allLoaded, loadedPages, meta.industry, meta.region, meta.totalPages]);

  const loadAll = useCallback(async () => {
    if (loadingMore || allLoaded) return;
    setLoadingMore(true);
    try {
      const chunks: Company[] = [];
      for (let p = loadedPages; p < meta.totalPages; p++) {
        const res = await fetch(`/data/ir-pages/${meta.industry}__${meta.region}__${p}.json`);
        if (!res.ok) break;
        const chunk: Company[] = await res.json();
        chunks.push(...chunk);
      }
      setCompanies(prev => [...prev, ...chunks]);
      setLoadedPages(meta.totalPages);
      setAllLoaded(true);
    } catch { }
    finally { setLoadingMore(false); }
  }, [loadingMore, allLoaded, loadedPages, meta.industry, meta.region, meta.totalPages]);

  const filtered=useMemo(()=>{
    let list=[...companies];
    if(search) list=list.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.postcode.toLowerCase().includes(search.toLowerCase())||c.postTown?.toLowerCase().includes(search.toLowerCase())||c.number?.includes(search));
    if(ageBracket!=="All") list=list.filter(c=>c.ageBracket===ageBracket);
    if(sizeClass!=="All") list=list.filter(c=>c.sizeClassification===sizeClass);
    if(companyType!=="All") list=list.filter(c=>c.companyType===companyType);
    if(town!=="All") list=list.filter(c=>(c.postTown||"").trim().toLowerCase()===(town||"").trim().toLowerCase());
    if(county!=="All") list=list.filter(c=>(c.county||"").trim().toLowerCase()===(county||"").trim().toLowerCase());
    if(accountsOverdue) list=list.filter(c=>c.accountsOverdue);
    if(confStmtOverdue) list=list.filter(c=>c.confStmtOverdue);
    if(hasMortgages) list=list.filter(c=>c.numMortgages>0);
    if(hasSatisfied) list=list.filter(c=>c.numMortSatisfied>0);
    if(excludeDormant) list=list.filter(c=>!c.isDormant);
    if(overseasOnly) list=list.filter(c=>c.isOverseas);
    if(rebranded) list=list.filter(c=>c.hasPreviousName);
    if(lpOnly) list=list.filter(c=>c.isLP);
    if(sortBy==="newest") list.sort((a,b)=>(b.incorporated||"").localeCompare(a.incorporated||""));
    if(sortBy==="oldest") list.sort((a,b)=>(a.incorporated||"").localeCompare(b.incorporated||""));
    if(sortBy==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
    if(sortBy==="mortgages") list.sort((a,b)=>b.numMortgages-a.numMortgages);
    if(sortBy==="age-desc") list.sort((a,b)=>(b.ageYears??0)-(a.ageYears??0));
    if(sortBy==="age-asc") list.sort((a,b)=>(a.ageYears??0)-(b.ageYears??0));
    return list;
  },[companies,search,ageBracket,sizeClass,companyType,town,county,accountsOverdue,confStmtOverdue,hasMortgages,hasSatisfied,excludeDormant,overseasOnly,rebranded,lpOnly,sortBy]);

  const activeFilters=[ageBracket!=="All",sizeClass!=="All",companyType!=="All",town!=="All",county!=="All",accountsOverdue,confStmtOverdue,hasMortgages,hasSatisfied,excludeDormant,overseasOnly,rebranded,lpOnly].filter(Boolean).length;

  // Use pre-computed stats from meta (accurate for ALL companies, not just loaded ones)
  const dc = useMemo(()=>({
    accountsOverdue: meta.stats.accountsOverdueCount || 0,
    confStmtOverdue: meta.stats.confStmtOverdueCount || 0,
    hasMortgages:    meta.stats.withMortgagesCount || 0,
    hasSatisfied:    meta.stats.withSatisfiedCharges || 0,
    overseas:        meta.stats.overseasCount || 0,
    rebranded:       meta.stats.rebrandedCount || 0,
    lp:              meta.stats.lpCount || 0,
  }),[meta.stats]);

  function reset(){setSearch("");setAgeBracket("All");setSizeClass("All");setCompanyType("All");setTown("All");setCounty("All");setAccountsOverdue(false);setConfStmtOverdue(false);setHasMortgages(false);setHasSatisfied(false);setExcludeDormant(false);setOverseasOnly(false);setRebranded(false);setLpOnly(false);}

  const s=meta.stats;
  const townOpts=[{value:"All",label:"All towns"},...Object.entries(s.topTowns||{}).sort((a,b)=>b[1]-a[1]).map(([t,n])=>({value:t,label:`${t} (${n.toLocaleString()})`}))];
  const countyOpts=[{value:"All",label:"All counties"},...Object.entries(s.counties||{}).sort((a,b)=>b[1]-a[1]).map(([c,n])=>({value:c,label:`${c} (${n.toLocaleString()})`}))];
  const ageOpts=[{value:"All",label:"All ages"},...AGE_ORDER.filter(b=>(s.ageBrackets?.[b]??0)>0).map(b=>({value:b,label:`${b} (${(s.ageBrackets?.[b]||0).toLocaleString()})`}))];
  const sizeOpts=[{value:"All",label:"All sizes"},...Object.entries(s.sizeClassifications||{}).sort((a,b)=>b[1]-a[1]).map(([x,n])=>({value:x,label:`${x} (${n.toLocaleString()})`}))];
  const typeOpts=[{value:"All",label:"All types"},...Object.entries(s.companyTypes||{}).sort((a,b)=>b[1]-a[1]).map(([t,n])=>({value:t,label:`${t} (${n.toLocaleString()})`}))];
  const sortOpts=[{value:"newest",label:"Newest first"},{value:"oldest",label:"Oldest first"},{value:"name",label:"Name A–Z"},{value:"age-desc",label:"Oldest companies first"},{value:"age-asc",label:"Youngest companies first"},{value:"mortgages",label:"Most charges"}];

  const hasAnyFilter = activeFilters > 0 || search.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1 items-center">
        <Link href="/" className="hover:text-blue-600">Home</Link><span>/</span>
        <Link href={`/${meta.industry}`} className="hover:text-blue-600">{meta.industryName}</Link><span>/</span>
        <span className="text-gray-900">{meta.regionName}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{meta.industryName} Companies in {meta.regionName}</h1>
          <p className="text-lg text-gray-600 mb-6">
            {meta.count.toLocaleString()} active {meta.industryName.toLowerCase()} businesses in {meta.regionName}.
            {s.averageAgeYears && <> Average age: <strong>{s.averageAgeYears} years</strong>.</>}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[{label:"Total",value:meta.count.toLocaleString()},{label:"Avg Age (yrs)",value:s.averageAgeYears??"—"},{label:"Accts Overdue",value:(s.accountsOverdueCount||0).toLocaleString()},{label:"With Charges",value:(s.withMortgagesCount||0).toLocaleString()}].map(x=>(
              <div key={x.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-blue-600">{x.value}</div>
                <div className="text-xs text-gray-500 mt-1">{x.label}</div>
              </div>
            ))}
          </div>

          {/* Filter panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Filter & Search {activeFilters>0&&<span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{activeFilters} active</span>}</h2>
              {activeFilters>0&&<button onClick={reset} className="text-sm text-blue-600 hover:underline">Reset all</button>}
            </div>

            {!allLoaded && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                {companies.length.toLocaleString()} of {meta.count.toLocaleString()} companies loaded.
                {" "}<button onClick={loadAll} className="underline font-medium hover:text-amber-900">Load all</button> for complete filtering and search.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Search by name, postcode, town or company number</label>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="e.g. Acme, BT1, Belfast, NI123456..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Sel label="Company Age"             value={ageBracket}  onChange={setAgeBracket}  options={ageOpts}/>
              <Sel label="Company Size (Official)" value={sizeClass}   onChange={setSizeClass}   options={sizeOpts}/>
              <Sel label="Company Type"            value={companyType} onChange={setCompanyType} options={typeOpts}/>
              <Sel label="Sort by"                 value={sortBy}      onChange={setSortBy}      options={sortOpts}/>
              {townOpts.length>2   && <Sel label="Town / City" value={town}   onChange={setTown}   options={townOpts}/>}
              {countyOpts.length>2 && <Sel label="County"      value={county} onChange={setCounty} options={countyOpts}/>}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 mb-2">Quick filters</div>
              <div className="flex flex-wrap gap-2">
                <Tog label={`Accounts overdue (${dc.accountsOverdue.toLocaleString()})`}         active={accountsOverdue} onClick={()=>setAccountsOverdue(!accountsOverdue)}/>
                <Tog label={`Conf. stmt overdue (${dc.confStmtOverdue.toLocaleString()})`}        active={confStmtOverdue} onClick={()=>setConfStmtOverdue(!confStmtOverdue)}/>
                <Tog label={`Has charges (${dc.hasMortgages.toLocaleString()})`}                  active={hasMortgages}    onClick={()=>setHasMortgages(!hasMortgages)}/>
                <Tog label={`Has satisfied charges (${dc.hasSatisfied.toLocaleString()})`}        active={hasSatisfied}    onClick={()=>setHasSatisfied(!hasSatisfied)}/>
                <Tog label="Exclude dormant"                                                       active={excludeDormant}  onClick={()=>setExcludeDormant(!excludeDormant)}/>
                {dc.overseas>0  && <Tog label={`Overseas parent (${dc.overseas})`}   active={overseasOnly} onClick={()=>setOverseasOnly(!overseasOnly)}/>}
                {dc.rebranded>0 && <Tog label={`Rebranded (${dc.rebranded})`}        active={rebranded}    onClick={()=>setRebranded(!rebranded)}/>}
                {dc.lp>0        && <Tog label={`LPs (${dc.lp})`}                     active={lpOnly}       onClick={()=>setLpOnly(!lpOnly)}/>}
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                ⚠️ Compliance flags are based on the Companies House data snapshot dated <strong>2 March 2026</strong>. A company may have since filed. Always verify on{" "}
                <a href="https://find-and-update.company-information.service.gov.uk" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Companies House</a>{" "}
                before relying on these flags.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            Showing <strong>{filtered.length.toLocaleString()}</strong>{!allLoaded ? ` of ${companies.length.toLocaleString()} loaded` : ""} {allLoaded ? `of ${meta.count.toLocaleString()}` : ""} companies
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
            {filtered.length===0?(
              <div className="p-12 text-center text-gray-500">No companies match. <button onClick={reset} className="text-blue-600 underline">Reset</button></div>
            ):(
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Company</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Town</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Incorporated</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Age</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Size</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((c,i)=>(
                      <tr key={c.number||i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <a href={c.number?`https://find-and-update.company-information.service.gov.uk/company/${c.number}`:`https://find-and-update.company-information.service.gov.uk/search?q=${encodeURIComponent(c.name)}`}
                            target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-blue-600 transition-colors block">{c.name}</a>
                          {c.hasPreviousName&&<div className="text-xs text-gray-400 mt-0.5">Prev: {c.previousName}</div>}
                          <div className="text-xs text-gray-400 font-mono">{c.number}</div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">
                          <div>{c.postTown||"—"}</div>
                          <div className="text-xs text-gray-400">{c.postcode}</div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">{formatDate(c.incorporated)}</td>
                        <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{c.ageYears!=null?`${c.ageYears}y`:"—"}</td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          {c.sizeClassification&&!["Unknown","Not Yet Filed"].includes(c.sizeClassification)?(
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{c.sizeClassification}</span>
                          ):<span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {c.accountsOverdue&&<Tag label="Accts ⚠️" colour="red"/>}
                            {c.confStmtOverdue&&<Tag label="ConfStmt ⚠️" colour="amber"/>}
                            {c.isDormant&&<Tag label="Dormant" colour="gray"/>}
                            {c.isOverseas&&<Tag label="Overseas" colour="purple"/>}
                            {c.isLP&&<Tag label="LP/LLP" colour="blue"/>}
                            {c.numMortgages>0&&<Tag label={`${c.numMortgages} charge${c.numMortgages>1?"s":""}`} colour="blue"/>}
                            {c.numMortSatisfied>0&&<Tag label={`${c.numMortSatisfied} satisfied`} colour="green"/>}
                            {!c.accountsOverdue&&!c.confStmtOverdue&&!c.isDormant&&c.numMortgages===0&&<Tag label="Clean ✓" colour="green"/>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Load more button */}
          {!allLoaded && (
            <div className="text-center mb-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                {loadingMore ? "Loading..." : `Load more companies (${companies.length.toLocaleString()} of ${meta.count.toLocaleString()} loaded)`}
              </button>
              <button
                onClick={loadAll}
                disabled={loadingMore}
                className="ml-3 text-sm text-blue-600 hover:underline disabled:opacity-50"
              >
                Load all
              </button>
            </div>
          )}

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{meta.industryName} Businesses in {meta.regionName}</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              There are <strong>{meta.count.toLocaleString()} active {meta.industryName.toLowerCase()} businesses</strong> in {meta.regionName}.
              {s.averageAgeYears&&<> Average age is {s.averageAgeYears} years.</>}
              {(s.accountsOverdueCount||0)>0&&<> {s.accountsOverdueCount} have overdue accounts.</>}
              {(s.withMortgagesCount||0)>0&&<> {s.withMortgagesCount} have registered charges.</>}
              {" "}Sourced from Companies House under the Open Government Licence. Updated {meta.updated}.
            </p>
          </div>

          {otherRegions.length>0&&(
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{meta.industryName} in Other Regions</h2>
              <div className="flex flex-wrap gap-2">
                {otherRegions.map(r=>(<Link key={r.region} href={`/${meta.industry}/${r.region}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{r.regionName} ({r.count.toLocaleString()})</Link>))}
              </div>
            </div>
          )}
          {otherIndustries.length>0&&(
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">More Industries in {meta.regionName}</h2>
              <div className="flex flex-wrap gap-2">
                {otherIndustries.map(i=>(<Link key={i.industry} href={`/${i.industry}/${meta.region}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{i.industryName} ({i.count.toLocaleString()})</Link>))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 lg:mt-0">
          <div className="sticky top-24 space-y-4">
            <h2 className="font-semibold text-gray-900 mb-2">Useful Resources</h2>
            {meta.affiliates.map(aff=>(
              <a key={aff.url} href={aff.url} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm mb-1">{aff.label}</div>
                <div className="text-xs text-gray-500 mb-3 leading-relaxed">{aff.description}</div>
                <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg">{aff.cta}</span>
              </a>
            ))}
            <a href="https://find-and-update.company-information.service.gov.uk/advanced-search" target="_blank" rel="noopener noreferrer" className="block bg-gray-50 border border-gray-200 rounded-xl p-4 text-center hover:border-gray-400 transition-all">
              <div className="text-sm font-medium text-gray-700">🔍 Search Companies House</div>
              <div className="text-xs text-gray-500 mt-1">Official advanced search</div>
            </a>
            <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-xs text-gray-400">Advertisement</div>
          </div>
        </div>
      </div>
    </div>
  );
}
