"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Industry {
  slug: string;
  name: string;
  totalCompanies: number;
}

const ICON_MAP: Record<string, string> = {
  "cleaning":"🧹","pest-control":"🐛","landscaping":"🌿","construction":"🏗️",
  "electrical":"⚡","plumbing":"🔧","accounting":"📊","legal":"⚖️",
  "software":"💻","it-consulting":"🖥️","it-services":"🖥️","restaurants":"🍽️",
  "catering":"🥗","hotels":"🏨","accommodation":"🛏️","healthcare":"🏥",
  "recruitment":"👥","transport":"🚛","security":"🔒","beauty":"💄",
  "automotive":"🚗","financial-services":"💰","marketing":"📣",
  "property-management":"🏠","property":"🏠","waste-management":"♻️",
  "childcare":"👶","veterinary":"🐾","training":"🎓","events":"🎤",
  "photography":"📷","architecture":"📐","engineering":"⚙️","printing":"🖨️",
  "taxis":"🚕","arts":"🎨","retail":"🛍️","ecommerce":"📦","wholesale":"🏭",
  "sports":"⚽","funeral":"🕊️","pharmacy":"💊","manufacturing":"🔩",
  "management-consulting":"🤝","pr":"📰","research":"🔬","consultancy":"💼",
  "building-services":"🔨","roofing":"🏚️","insurance":"🛡️","schools":"🎓",
  "data-services":"💾","vehicle-hire":"🚐",
};

export default function IndustriesSearch({ industries }: { industries: Industry[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return industries;
    const q = search.toLowerCase();
    return industries.filter(i => i.name.toLowerCase().includes(q));
  }, [industries, search]);

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search industries e.g. cleaning, legal, retail..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <p className="text-sm text-gray-500 mt-2">
            {filtered.length} {filtered.length === 1 ? "industry" : "industries"} found
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            No industries found for &quot;{search}&quot;
          </div>
        ) : (
          filtered.map(ind => (
            <Link
              key={ind.slug}
              href={`/${ind.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition-all group text-center"
            >
              <div className="text-3xl mb-2">{ICON_MAP[ind.slug] ?? "🏢"}</div>
              <div className="font-medium text-gray-800 group-hover:text-blue-600 text-sm leading-tight mb-1">
                {ind.name}
              </div>
              <div className="text-xs text-gray-400">
                {ind.totalCompanies.toLocaleString()} companies
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
