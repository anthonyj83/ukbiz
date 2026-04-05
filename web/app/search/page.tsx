import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import GlobalSearch from "./GlobalSearch";

export const metadata: Metadata = {
  title: "Search All UK Companies | UK Business Finder",
  description: "Search all 2.6 million active UK companies by name, industry, region, town, company type and more. Free company intelligence from Companies House.",
};

const DATA_DIR = path.join(process.cwd(), "public", "data");
const IR_DIR   = path.join(DATA_DIR, "ir");

interface ManifestEntry {
  industry: string; industryName: string;
  region: string; regionName: string; count: number;
}

interface Industry { slug: string; name: string; totalCompanies: number; }
interface Region { slug: string; name: string; }

export default function SearchPage() {
  let manifest: ManifestEntry[] = [];
  let industries: Industry[] = [];
  let regions: Region[] = [];

  try { manifest   = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"),   "utf-8")); } catch {}
  try { industries = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "industries.json"), "utf-8")); } catch {}
  try { regions    = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "regions.json"),    "utf-8")); } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <span className="text-gray-900">Search</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Search All UK Companies</h1>
      <p className="text-gray-600 mb-8">
        Filter across all 2.6 million active UK companies by industry, region, company age, size, and more.
      </p>
      <GlobalSearch manifest={manifest} industries={industries} regions={regions} />
    </div>
  );
}
