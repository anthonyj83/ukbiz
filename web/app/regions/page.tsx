import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import RegionsSearch from "./RegionsSearch";

export const metadata: Metadata = {
  title: "Browse UK Companies by Region",
  description: "Browse active UK companies by region — London, Scotland, Northern Ireland, Wales and more. Sourced from Companies House.",
};

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface Region { slug: string; name: string; }
interface ManifestEntry { industry: string; industryName: string; region: string; regionName: string; count: number; }

export default function RegionsPage() {
  let regions: Region[] = [];
  let manifest: ManifestEntry[] = [];
  try { regions = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "regions.json"), "utf-8")); } catch {}
  try { manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf-8")); } catch {}

  const totalCompanies = manifest.reduce((s: number, m: ManifestEntry) => s + m.count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <span className="text-gray-900">Regions</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse UK Companies by Region</h1>
      <p className="text-gray-600 mb-6">
        {regions.length} regions · {totalCompanies.toLocaleString()} active companies · sourced from Companies House
      </p>
      <RegionsSearch regions={regions} manifest={manifest} />
    </div>
  );
}
