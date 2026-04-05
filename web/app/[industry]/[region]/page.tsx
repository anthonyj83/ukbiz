import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import IndustryRegionClient from "./client";

const DATA_DIR   = path.join(process.cwd(), "public", "data");
const META_DIR   = path.join(DATA_DIR, "ir-meta");
const PAGES_DIR  = path.join(DATA_DIR, "ir-pages");

function readJson<T>(filename: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"));
  } catch { return null; }
}

function readMeta(industry: string, region: string) {
  try {
    return JSON.parse(fs.readFileSync(path.join(META_DIR, `${industry}__${region}.json`), "utf-8"));
  } catch { return null; }
}

function readCompanyPage(industry: string, region: string, page: number) {
  try {
    return JSON.parse(fs.readFileSync(path.join(PAGES_DIR, `${industry}__${region}__${page}.json`), "utf-8"));
  } catch { return []; }
}

interface ManifestEntry {
  industry: string; industryName: string;
  region: string;   regionName: string;
  count: number;
}

export async function generateStaticParams() {
  const manifest = readJson<ManifestEntry[]>("manifest.json") ?? [];
  return manifest.map(m => ({ industry: m.industry, region: m.region }));
}

export async function generateMetadata({ params }: { params: { industry: string; region: string } }): Promise<Metadata> {
  const data = readMeta(params.industry, params.region);
  if (!data) return {};
  const title = `${data.industryName} Companies in ${data.regionName}`;
  const description = `Browse and filter ${data.count.toLocaleString()} active ${data.industryName.toLowerCase()} companies in ${data.regionName}. Filter by age, company type, overdue accounts, mortgages and more. Official Companies House data.`;
  return {
    title,
    description,
    alternates: { canonical: `/${params.industry}/${params.region}` },
    openGraph: { title, description, type: "website" },
  };
}

export default function IndustryRegionPage({ params }: { params: { industry: string; region: string } }) {
  const meta = readMeta(params.industry, params.region);
  if (!meta) notFound();

  // Only embed the first page of companies (200) — client fetches more on demand
  const firstPageCompanies = readCompanyPage(params.industry, params.region, 0);

  const manifest = readJson<ManifestEntry[]>("manifest.json") ?? [];
  const otherRegions = manifest
    .filter(m => m.industry === params.industry && m.region !== params.region)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const otherIndustries = manifest
    .filter(m => m.region === params.region && m.industry !== params.industry)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <IndustryRegionClient
      meta={meta}
      initialCompanies={firstPageCompanies}
      otherRegions={otherRegions}
      otherIndustries={otherIndustries}
    />
  );
}
