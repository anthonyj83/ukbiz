import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import IndustriesSearch from "./IndustriesSearch";

export const metadata: Metadata = {
  title: "Browse UK Companies by Industry",
  description: "Browse all UK business industries with company counts and regional breakdowns. Sourced from Companies House.",
};

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface Industry { slug: string; name: string; totalCompanies: number; topRegions: string[]; }

export default function IndustriesPage() {
  let industries: Industry[] = [];
  try { industries = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "industries.json"), "utf-8")); } catch {}
  const totalCompanies = industries.reduce((s, i) => s + i.totalCompanies, 0);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <span className="text-gray-900">Industries</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">All UK Industries</h1>
      <p className="text-gray-600 mb-6">
        {industries.length} industries · {totalCompanies.toLocaleString()} active companies · sourced from Companies House
      </p>
      <IndustriesSearch industries={industries} />
    </div>
  );
}
