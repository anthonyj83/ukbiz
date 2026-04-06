"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";

interface PSC {
  t: "i" | "c";
  n: string;
  nat?: string;
  cor?: string;
  c: string[];
  reg?: string;
}

interface Company {
  name: string; number: string; postcode: string; postTown: string;
  county: string; country: string; countryOfOrigin: string; isOverseas: boolean;
  status: string; incorporated: string; ageYears: number | null; ageBracket: string;
  sizeClassification: string; companyType: string;
  accountsOverdue: boolean; confStmtOverdue: boolean;
  isDormant: boolean; numMortgages: number;
  numMortSatisfied: number; hasPreviousName: boolean; previousName: string;
  isLP: boolean;
  pscs?: PSC[]; pscCount?: number;
  chargeHolders?: string[];
  hasInsolvency?: boolean;
  insolvencyCases?: any[];
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
  companiesWithPscs?: number;
  individualPscCount?: number;
  foreignControlledCount?: number;
  corporateControlledCount?: number;
  topNationalities?: Record<string, number>;
  insolvencyCount?: number;
  topChargeHolders?: Record<string, number>;
}

interface Affiliate { label: string; description: string; url: string; cta: string; }

interface MetaData {
  industry: string; industryName: string; region: string; regionName: string;
  count: number; stats: Stats; affiliates: Affiliate[]; updated: string;
  totalPages: number; pageSize: number;
}

function formatDate(s: string): string {
  if (!s) return "\u2014";
  try { const p = s.split("/"); if (p.length===3) return new Date(`${p[2]}-${p[1]}-${p[0]}`).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); } catch {}
  return s;
}

function Tag({label,colour}:{label:string;colour:"green"|"amber"|"red"|"gray"|"blue"|"purple"|"orange"}) {
  const cls:Record<string,string>={green:"bg-green-100 text-green-800",amber:"bg-amber-100 text-amber-800",red:"bg-red-100 text-red-800",gray:"bg-gray-100 text-gray-600",blue:"bg-blue-100 text-blue-800",purple:"bg-purple-100 text-purple-800",orange:"bg-orange-100 text-orange-800"};
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
  return <button onClick={onClick} className={`text-sm px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${active?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>{active?"\u2713 ":""}{label}</button>;
}

function CompanyDetail({c, expanded, onToggle}:{c:Company; expanded:boolean; onToggle:()=>void}) {
  const hasPscs = (c.pscs?.length || 0) > 0;
  const hasChargeHolders = (c.chargeHolders?.length || 0) > 0;
  const hasDetail = hasPscs || hasChargeHolders || c.hasInsolvency;

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-5 py-3.5">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <a href={c.number?`https://find-and-update.company-information.service.gov.uk/company/${c.number}`:`https://find-and-update.company-information.service.gov.uk/search?q=${encodeURIComponent(c.name)}`}
                target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{c.name}</a>
              {c.hasPreviousName&&<div className="text-xs text-gray-400 mt-0.5">Prev: {c.previousName}</div>}
              <div className="text-xs text-gray-400 font-mono">{c.number}</div>
            </div>
            {hasDetail && (
              <button onClick={onToggle} className="text-xs text-blue-600 hover:text-blue-700 mt-1 whitespace-nowrap">
                {expanded ? "\u25b2 Less" : "\u25bc More"}
              </button>
            )}
          </div>
        </td>
        <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">
          <div>{c.postTown||"\u2014"}</div>
          <div className="text-xs text-gray-400">{c.postcode}</div>
        </td>
        <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">{formatDate(c.incorporated)}</td>
        <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{c.ageYears!=null?`${c.ageYears}y`:"\u2014"}</td>
        <td className="px-4 py-3.5 hidden lg:table-cell">
          {c.sizeClassification&&!["Unknown","Not Yet Filed","NO ACCOUNTS FILED"].includes(c.sizeClassification)?(
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{c.sizeClassification}</span>
          ):<span className="text-gray-300">{"\u2014"}</span>}
        </td>
        <td className="px-4 py-3.5">
          <div className="flex flex-wrap gap-1">
            {c.hasInsolvency&&<Tag label={"\u26a0 Insolvency"} colour="red"/>}
            {c.accountsOverdue&&<Tag label={"Accts \u26a0\ufe0f"} colour="red"/>}
            {c.confStmtOverdue&&<Tag label={"ConfStmt \u26a0\ufe0f"} colour="amber"/>}
            {c.isDormant&&<Tag label="Dormant" colour="gray"/>}
            {c.isOverseas&&<Tag label="Overseas" colour="purple"/>}
            {c.isLP&&<Tag label="LP/LLP" colour="blue"/>}
            {c.numMortgages>0&&<Tag label={`${c.numMortgages} charge${c.numMortgages>1?"s":""}`} colour="blue"/>}
            {c.numMortSatisfied>0&&<Tag label={`${c.numMortSatisfied} satisfied`} colour="green"/>}
            {!c.accountsOverdue&&!c.confStmtOverdue&&!c.isDormant&&c.numMortgages===0&&!c.hasInsolvency&&<Tag label={"Clean \u2713"} colour="green"/>}
          </div>
        </td>
      </tr>
      {expanded && hasDetail && (
        <tr className="bg-blue-50/50">
          <td colSpan={6} className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {hasPscs && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wide">Persons with Significant Control</h4>
                  <div className="space-y-2">
                    {c.pscs!.map((p, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="font-medium text-gray-900 text-sm">
                          {p.t === "i" ? "\ud83d\udc64" : "\ud83c\udfe2"} {p.n}
                        </div>
                        {p.nat && <div className="text-xs text-gray-500 mt-0.5">Nationality: {p.nat}</div>}
                        {p.cor && <div className="text-xs text-gray-500">Residence: {p.cor}</div>}
                        {p.reg && <div className="text-xs text-gray-500">Reg: {p.reg}</div>}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.c.map((ctrl, j) => (
                            <span key={j} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{ctrl}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(hasChargeHolders || c.hasInsolvency) && (
                <div>
                  {hasChargeHolders && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wide">Charge Holders</h4>
                      <div className="space-y-1">
                        {c.chargeHolders!.map((h, i) => (
                          <div key={i} className="bg-white rounded-lg p-2 border border-gray-100 text-sm text-gray-700">
                            {"\ud83c\udfe6"} {h}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {c.hasInsolvency && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2 text-xs uppercase tracking-wide">{"\u26a0"} Insolvency History</h4>
                      {c.insolvencyCases && c.insolvencyCases.length > 0 ? (
                        <div className="space-y-2">
                          {c.insolvencyCases.map((ic: any, i: number) => (
                            <div key={i} className="bg-red-50 rounded-lg p-3 border border-red-100">
                              <div className="text-sm font-medium text-red-800">{ic.type || "Insolvency case"}</div>
                              {ic.practitioners?.map((pr: any, j: number) => (
                                <div key={j} className="text-xs text-red-600 mt-1">
                                  IP: {pr.name}{pr.firm ? ` (${pr.firm})` : ""}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-100 text-sm text-red-700">
                          This company has insolvency history on record
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const AGE_ORDER=["Startup (0-2 yrs)","Early Stage (2-5 yrs)","Growing (5-10 yrs)","Established (10-20 yrs)","Veteran (20+ yrs)","Unknown"];

export default function IndustryRegionClient({meta,initialCompanies,otherRegions,otherIndustries}:{
  meta: MetaData;
  initialCompanies: Company[];
  otherRegions:{industry:string;region:string;regionName:string;count:number}[];
  otherIndustries:{industry:string;industryName:string;region:string;count:number}[];
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageData, setPageData] = useState<Record<number, Company[]>>({0: initialCompanies});
  const [loadingPage, setLoadingPage] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
  const [insolvencyOnly,setInsolvencyOnly]=useState(false);
  const [foreignControlled,setForeignControlled]=useState(false);
  const [corporateOwned,setCorporateOwned]=useState(false);

  const hasFilters = search || ageBracket!=="All" || sizeClass!=="All" || companyType!=="All" || town!=="All" || county!=="All" || accountsOverdue || confStmtOverdue || hasMortgages || hasSatisfied || excludeDormant || overseasOnly || rebranded || lpOnly || insolvencyOnly || foreignControlled || corporateOwned;

  const [allCompanies, setAllCompanies] = useState<Company[]|null>(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const toggleRow = useCallback((id: string) => {
    setExpandedRows(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const fetchPage = useCallback(async (pageNum: number) => {
    if (pageData[pageNum]) return;
    setLoadingPage(true);
    try {
      const res = await fetch(`/data/ir-pages/${meta.industry}__${meta.region}__${pageNum}.json`);
      if (res.ok) { const chunk: Company[] = await res.json(); setPageData(prev => ({...prev, [pageNum]: chunk})); }
    } catch {}
    setLoadingPage(false);
  }, [pageData, meta.industry, meta.region]);

  const goToPage = useCallback((pageNum: number) => {
    setCurrentPage(pageNum);
    fetchPage(pageNum);
    setExpandedRows(new Set());
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [fetchPage]);

  const loadAllForFiltering = useCallback(async () => {
    if (allCompanies || loadingAll) return;
    setLoadingAll(true);
    const all: Company[] = [];
    for (let p = 0; p < meta.totalPages; p++) {
      if (pageData[p]) { all.push(...pageData[p]); } else {
        try { const res = await fetch(`/data/ir-pages/${meta.industry}__${meta.region}__${p}.json`); if (res.ok) { const chunk: Company[] = await res.json(); all.push(...chunk); } } catch {}
      }
    }
    setAllCompanies(all);
    setLoadingAll(false);
  }, [allCompanies, loadingAll, meta.totalPages, meta.industry, meta.region, pageData]);

  useEffect(() => {
    if (hasFilters && !allCompanies && !loadingAll) { loadAllForFiltering(); }
  }, [hasFilters, allCompanies, loadingAll, loadAllForFiltering]);

  const currentCompanies = pageData[currentPage] || [];

  const filtered = useMemo(() => {
    if (!hasFilters) return null;
    if (!allCompanies) return null;
    let list = [...allCompanies];
    if(search) list=list.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.postcode.toLowerCase().includes(search.toLowerCase())||c.postTown?.toLowerCase().includes(search.toLowerCase())||c.number?.includes(search)||(c.pscs||[]).some(p=>p.n.toLowerCase().includes(search.toLowerCase())));
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
    if(insolvencyOnly) list=list.filter(c=>c.hasInsolvency);
    if(foreignControlled) list=list.filter(c=>(c.pscs||[]).some(p=>p.t==="i"&&p.cor&&!["england","wales","scotland","northern ireland","united kingdom","uk","great britain"].includes(p.cor.toLowerCase())));
    if(corporateOwned) list=list.filter(c=>(c.pscs||[]).some(p=>p.t==="c"));
    if(sortBy==="newest") list.sort((a,b)=>(b.incorporated||"").localeCompare(a.incorporated||""));
    if(sortBy==="oldest") list.sort((a,b)=>(a.incorporated||"").localeCompare(b.incorporated||""));
    if(sortBy==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
    if(sortBy==="mortgages") list.sort((a,b)=>b.numMortgages-a.numMortgages);
    if(sortBy==="age-desc") list.sort((a,b)=>(b.ageYears??0)-(a.ageYears??0));
    if(sortBy==="age-asc") list.sort((a,b)=>(a.ageYears??0)-(b.ageYears??0));
    return list;
  },[allCompanies, hasFilters, search,ageBracket,sizeClass,companyType,town,county,accountsOverdue,confStmtOverdue,hasMortgages,hasSatisfied,excludeDormant,overseasOnly,rebranded,lpOnly,insolvencyOnly,foreignControlled,corporateOwned,sortBy]);

  const [filteredDisplayLimit, setFilteredDisplayLimit] = useState(500);
  const isFilterMode = hasFilters;
  const displayList = isFilterMode ? (filtered || []).slice(0, filteredDisplayLimit) : currentCompanies;
  const totalFiltered = filtered?.length ?? 0;

  const activeFilters=[ageBracket!=="All",sizeClass!=="All",companyType!=="All",town!=="All",county!=="All",accountsOverdue,confStmtOverdue,hasMortgages,hasSatisfied,excludeDormant,overseasOnly,rebranded,lpOnly,insolvencyOnly,foreignControlled,corporateOwned].filter(Boolean).length;

  const dc = useMemo(()=>({
    accountsOverdue: meta.stats.accountsOverdueCount || 0,
    confStmtOverdue: meta.stats.confStmtOverdueCount || 0,
    hasMortgages: meta.stats.withMortgagesCount || 0,
    hasSatisfied: meta.stats.withSatisfiedCharges || 0,
    overseas: meta.stats.overseasCount || 0,
    rebranded: meta.stats.rebrandedCount || 0,
    lp: meta.stats.lpCount || 0,
    insolvency: meta.stats.insolvencyCount || 0,
    foreignControlled: meta.stats.foreignControlledCount || 0,
    corporateControlled: meta.stats.corporateControlledCount || 0,
    companiesWithPscs: meta.stats.companiesWithPscs || 0,
  }),[meta.stats]);

  function reset(){setSearch("");setAgeBracket("All");setSizeClass("All");setCompanyType("All");setTown("All");setCounty("All");setAccountsOverdue(false);setConfStmtOverdue(false);setHasMortgages(false);setHasSatisfied(false);setExcludeDormant(false);setOverseasOnly(false);setRebranded(false);setLpOnly(false);setInsolvencyOnly(false);setForeignControlled(false);setCorporateOwned(false);setFilteredDisplayLimit(500);}

  const s=meta.stats;
  const townOpts=[{value:"All",label:"All towns"},...Object.entries(s.topTowns||{}).sort((a,b)=>b[1]-a[1]).map(([t,n])=>({value:t,label:`${t} (${n.toLocaleString()})`}))];
  const countyOpts=[{value:"All",label:"All counties"},...Object.entries(s.counties||{}).sort((a,b)=>b[1]-a[1]).map(([c,n])=>({value:c,label:`${c} (${n.toLocaleString()})`}))];
  const ageOpts=[{value:"All",label:"All ages"},...AGE_ORDER.filter(b=>(s.ageBrackets?.[b]??0)>0).map(b=>({value:b,label:`${b} (${(s.ageBrackets?.[b]||0).toLocaleString()})`}))];
  const sizeOpts=[{value:"All",label:"All sizes"},...Object.entries(s.sizeClassifications||{}).sort((a,b)=>b[1]-a[1]).map(([x,n])=>({value:x,label:`${x} (${n.toLocaleString()})`}))];
  const typeOpts=[{value:"All",label:"All types"},...Object.entries(s.companyTypes||{}).sort((a,b)=>b[1]-a[1]).map(([t,n])=>({value:t,label:`${t} (${n.toLocaleString()})`}))];
  const sortOpts=[{value:"newest",label:"Newest first"},{value:"oldest",label:"Oldest first"},{value:"name",label:"Name A\u2013Z"},{value:"age-desc",label:"Oldest companies first"},{value:"age-asc",label:"Youngest companies first"},{value:"mortgages",label:"Most charges"}];

  const totalPages = meta.totalPages;
  const pageStart = currentPage * meta.pageSize + 1;
  const pageEnd = Math.min((currentPage + 1) * meta.pageSize, meta.count);
  const topNats = Object.entries(s.topNationalities || {}).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${meta.industryName} Companies in ${meta.regionName}`,
        "description": `Browse ${meta.count.toLocaleString()} active ${meta.industryName.toLowerCase()} companies in ${meta.regionName}. Free company data from Companies House.`,
        "url": `https://ukbizfinder.co.uk/${meta.industry}/${meta.region}`,
        "numberOfItems": meta.count,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://ukbizfinder.co.uk"},
            {"@type": "ListItem", "position": 2, "name": meta.industryName, "item": `https://ukbizfinder.co.uk/${meta.industry}`},
            {"@type": "ListItem", "position": 3, "name": meta.regionName}
          ]
        }
      })}} />
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
            {[
              {label:"Total",value:meta.count.toLocaleString()},
              {label:"With Ownership Data",value:(dc.companiesWithPscs).toLocaleString()},
              {label:"Accts Overdue",value:(dc.accountsOverdue).toLocaleString()},
              {label:"With Charges",value:(dc.hasMortgages).toLocaleString()},
            ].map(x=>(
              <div key={x.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-blue-600">{x.value}</div>
                <div className="text-xs text-gray-500 mt-1">{x.label}</div>
              </div>
            ))}
          </div>

          {topNats.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Top Controller Nationalities</h3>
              <div className="flex flex-wrap gap-2">
                {topNats.map(([nat, count]) => (
                  <span key={nat} className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-gray-700">
                    {nat} <strong className="text-gray-900">{(count as number).toLocaleString()}</strong>
                  </span>
                ))}
              </div>
              {dc.foreignControlled > 0 && (
                <div className="text-xs text-gray-500 mt-2">{dc.foreignControlled.toLocaleString()} controllers resident outside the UK</div>
              )}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Filter & Search {activeFilters>0&&<span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{activeFilters} active</span>}</h2>
              {activeFilters>0&&<button onClick={reset} className="text-sm text-blue-600 hover:underline">Reset all</button>}
            </div>
            {isFilterMode && loadingAll && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">Loading all {meta.count.toLocaleString()} companies for filtering...</div>
            )}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Search by name, postcode, town or company number</label>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="e.g. Acme Ltd, BT1, Belfast, NI123456..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Sel label="Company Age" value={ageBracket} onChange={setAgeBracket} options={ageOpts}/>
              <Sel label="Company Size (Official)" value={sizeClass} onChange={setSizeClass} options={sizeOpts}/>
              <Sel label="Company Type" value={companyType} onChange={setCompanyType} options={typeOpts}/>
              <Sel label="Sort by" value={sortBy} onChange={setSortBy} options={sortOpts}/>
              {townOpts.length>2 && <Sel label="Town / City" value={town} onChange={setTown} options={townOpts}/>}
              {countyOpts.length>2 && <Sel label="County" value={county} onChange={setCounty} options={countyOpts}/>}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 mb-2">Quick filters</div>
              <div className="flex flex-wrap gap-2">
                <Tog label={`Accounts overdue (${dc.accountsOverdue.toLocaleString()})`} active={accountsOverdue} onClick={()=>setAccountsOverdue(!accountsOverdue)}/>
                <Tog label={`Conf. stmt overdue (${dc.confStmtOverdue.toLocaleString()})`} active={confStmtOverdue} onClick={()=>setConfStmtOverdue(!confStmtOverdue)}/>
                <Tog label={`Has charges (${dc.hasMortgages.toLocaleString()})`} active={hasMortgages} onClick={()=>setHasMortgages(!hasMortgages)}/>
                <Tog label={`Has satisfied charges (${dc.hasSatisfied.toLocaleString()})`} active={hasSatisfied} onClick={()=>setHasSatisfied(!hasSatisfied)}/>
                <Tog label="Exclude dormant" active={excludeDormant} onClick={()=>setExcludeDormant(!excludeDormant)}/>
                {dc.insolvency>0 && <Tog label={`Insolvency (${dc.insolvency.toLocaleString()})`} active={insolvencyOnly} onClick={()=>setInsolvencyOnly(!insolvencyOnly)}/>}
                {dc.foreignControlled>0 && <Tog label={`Foreign-controlled (${dc.foreignControlled.toLocaleString()})`} active={foreignControlled} onClick={()=>setForeignControlled(!foreignControlled)}/>}
                {dc.corporateControlled>0 && <Tog label={`Corporate-owned (${dc.corporateControlled.toLocaleString()})`} active={corporateOwned} onClick={()=>setCorporateOwned(!corporateOwned)}/>}
                {dc.overseas>0 && <Tog label={`Overseas parent (${dc.overseas})`} active={overseasOnly} onClick={()=>setOverseasOnly(!overseasOnly)}/>}
                {dc.rebranded>0 && <Tog label={`Rebranded (${dc.rebranded})`} active={rebranded} onClick={()=>setRebranded(!rebranded)}/>}
                {dc.lp>0 && <Tog label={`LPs (${dc.lp})`} active={lpOnly} onClick={()=>setLpOnly(!lpOnly)}/>}
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                {"\u26a0\ufe0f"} Compliance flags are based on the Companies House data snapshot dated <strong>2 March 2026</strong>. Always verify on{" "}
                <a href="https://find-and-update.company-information.service.gov.uk" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Companies House</a>.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            {isFilterMode ? (
              loadingAll ? "Loading data for filtering..." :
              <>Showing <strong>{Math.min(filteredDisplayLimit, totalFiltered).toLocaleString()}</strong> of <strong>{totalFiltered.toLocaleString()}</strong> matching companies</>
            ) : (
              <>Page <strong>{currentPage + 1}</strong> of {totalPages.toLocaleString()} {"\u2013"} Companies {pageStart.toLocaleString()}{"\u2013"}{pageEnd.toLocaleString()} of {meta.count.toLocaleString()}</>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
            {displayList.length===0?(
              <div className="p-12 text-center text-gray-500">
                {isFilterMode && loadingAll ? "Loading..." : <>No companies match. <button onClick={reset} className="text-blue-600 underline">Reset</button></>}
              </div>
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
                    {displayList.map((c,i)=>(
                      <CompanyDetail key={c.number||i} c={c} expanded={expandedRows.has(c.number||String(i))} onToggle={()=>toggleRow(c.number||String(i))}/>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {!isFilterMode && totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 mb-6">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0 || loadingPage} className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed">{"\u2190"} Previous</button>
              <div className="flex items-center gap-1">
                {(() => {
                  const pages: number[] = [];
                  const start = Math.max(0, currentPage - 2);
                  const end = Math.min(totalPages - 1, currentPage + 2);
                  if (start > 0) pages.push(0);
                  if (start > 1) pages.push(-1);
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (end < totalPages - 2) pages.push(-2);
                  if (end < totalPages - 1) pages.push(totalPages - 1);
                  return pages.map((p, idx) =>
                    p < 0 ? <span key={`e${idx}`} className="text-gray-400 text-sm px-1">...</span> :
                    <button key={p} onClick={() => goToPage(p)} className={`text-sm px-3 py-1 rounded-lg ${p === currentPage ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{p + 1}</button>
                  );
                })()}
              </div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1 || loadingPage} className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed">Next {"\u2192"}</button>
            </div>
          )}

          {isFilterMode && filtered && totalFiltered > filteredDisplayLimit && (
            <div className="text-center mb-6">
              <button onClick={() => setFilteredDisplayLimit(prev => prev + 500)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">Show more ({(totalFiltered - filteredDisplayLimit).toLocaleString()} remaining)</button>
            </div>
          )}

          {loadingPage && <div className="text-center text-gray-400 text-sm mb-6">Loading page...</div>}

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{meta.industryName} Businesses in {meta.regionName}</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              There are <strong>{meta.count.toLocaleString()} active {meta.industryName.toLowerCase()} businesses</strong> in {meta.regionName}.
              {s.averageAgeYears&&<> Average age is {s.averageAgeYears} years.</>}
              {dc.accountsOverdue>0&&<> {dc.accountsOverdue.toLocaleString()} have overdue accounts.</>}
              {dc.hasMortgages>0&&<> {dc.hasMortgages.toLocaleString()} have registered charges.</>}
              {dc.insolvency>0&&<> {dc.insolvency.toLocaleString()} have insolvency history.</>}
              {dc.companiesWithPscs>0&&<> {dc.companiesWithPscs.toLocaleString()} have Persons with Significant Control data on file.</>}
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
              <div className="text-sm font-medium text-gray-700">{"\ud83d\udd0d"} Search Companies House</div>
              <div className="text-xs text-gray-500 mt-1">Official advanced search</div>
            </a>
            {Object.keys(s.topChargeHolders || {}).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Top Lenders in Sector</h3>
                <div className="space-y-1.5">
                  {Object.entries(s.topChargeHolders || {}).slice(0, 10).map(([name, count]) => (
                    <div key={name} className="flex justify-between text-xs">
                      <span className="text-gray-700 truncate mr-2">{name}</span>
                      <span className="text-gray-400 whitespace-nowrap">{(count as number).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-xs text-gray-400">Advertisement</div>
          </div>
        </div>
      </div>
    </div>
  );
}