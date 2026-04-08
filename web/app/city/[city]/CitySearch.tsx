"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface IndustryEntry {
  industry: string;
  industryName: string;
  count: number;
  links: { region: string; regionName: string; town: string; count: number }[];
}

const INDUSTRY_ICONS: Record<string, string> = {
  "cleaning": "\u{1F9F9}", "pest-control": "\u{1F41B}", "landscaping": "\u{1F33F}",
  "construction": "\u{1F3D7}\uFE0F", "electrical": "\u{26A1}", "plumbing": "\u{1F527}",
  "accounting": "\u{1F4CA}", "legal": "\u{2696}\uFE0F", "software": "\u{1F4BB}",
  "it-consulting": "\u{1F5A5}\uFE0F", "restaurants": "\u{1F37D}\uFE0F", "catering": "\u{1F957}",
  "hotels": "\u{1F3E8}", "accommodation": "\u{1F6CF}\uFE0F", "healthcare": "\u{1F3E5}",
  "recruitment": "\u{1F465}", "transport": "\u{1F69B}", "security": "\u{1F512}",
  "beauty": "\u{1F484}", "automotive": "\u{1F697}", "financial-services": "\u{1F4B0}",
  "marketing": "\u{1F4E3}", "property-management": "\u{1F3E0}", "waste-management": "\u{267B}\uFE0F",
  "childcare": "\u{1F476}", "veterinary": "\u{1F43E}", "training": "\u{1F393}",
  "events": "\u{1F3A4}", "photography": "\u{1F4F7}", "architecture": "\u{1F4D0}",
  "engineering": "\u{2699}\uFE0F", "printing": "\u{1F5A8}\uFE0F", "taxis": "\u{1F695}",
  "arts": "\u{1F3A8}", "retail": "\u{1F6CD}\uFE0F", "ecommerce": "\u{1F4E6}",
  "wholesale": "\u{1F3ED}", "sports": "\u{26BD}", "funeral": "\u{1F54A}\uFE0F",
  "pharmacy": "\u{1F48A}", "property": "\u{1F3E0}", "management-consulting": "\u{1F4BC}",
  "building-services": "\u{1F3D7}\uFE0F", "it-services": "\u{1F5A5}\uFE0F",
  "consultancy": "\u{1F4BC}", "research": "\u{1F52C}", "pr": "\u{1F4E2}",
  "data-services": "\u{1F4BE}", "schools": "\u{1F3EB}", "insurance": "\u{1F6E1}\uFE0F",
  "roofing": "\u{1F3E0}", "manufacturing": "\u{1F3ED}", "vehicle-hire": "\u{1F698}",
};

export default function CitySearch({
  industries,
  citySlug,
  cityName,
}: {
  industries: IndustryEntry[];
  citySlug: string;
  cityName: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return industries;
    const q = search.toLowerCase();
    return industries.filter((ind) =>
      ind.industryName.toLowerCase().includes(q)
    );
  }, [industries, search]);

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search industries in ${cityName}...`}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <p className="text-sm text-gray-500 mt-2">
            {filtered.length} {filtered.length === 1 ? "industry" : "industries"} found
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No industries found for &quot;{search}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((ind) => {
            // Use the first (largest) region link for this industry
            const primaryLink = ind.links[0];
            const href = `/${ind.industry}/${primaryLink.region}/${citySlug}`;
            return (
              <Link
                key={ind.industry}
                href={href}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{INDUSTRY_ICONS[ind.industry] ?? "\u{1F3E2}"}</span>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm leading-tight">
                      {ind.industryName}
                    </div>
                    <div className="text-xs text-gray-400">
                      {ind.count.toLocaleString()} companies
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
