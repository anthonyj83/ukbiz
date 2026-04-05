import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import IndustryRegionClient from "./client";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const IR_DIR   = path.join(DATA_DIR, "ir");

function readJson<T>(filename: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"));
  } catch { return null; }
}

function readPageData(industry: string, region: string) {
  try {
    return JSON.parse(fs.readFileSync(path.join(IR_DIR, `${industry}__${region}.json`), "utf-8"));
  } catch { return null; }
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
  const data = readPageData(params.industry, params.region);
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
  const data = readPageData(params.industry, params.region);
  if (!data) notFound();

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
      data={data}
      otherRegions={otherRegions}
      otherIndustries={otherIndustries}
    />
  );
}
