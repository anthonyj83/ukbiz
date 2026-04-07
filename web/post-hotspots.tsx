import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UK Business Hotspots — Which Regions Have the Most Companies?",
  description: "A regional breakdown of the UK's 2.6 million active companies. Where are businesses concentrated and what industries dominate each region?",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">UK Business Hotspots</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">UK Business Hotspots — Which Regions Have the Most Companies?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            Where are the UK's 2.6 million active companies concentrated? The answer is unsurprising at the top — London dominates — but the regional picture below reveals some interesting patterns.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Active Companies by Region</h2>
          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "~550,000", "21%"],
                ["South East England", "~280,000", "11%"],
                ["North West England", "~230,000", "9%"],
                ["East Midlands", "~210,000", "8%"],
                ["Yorkshire & The Humber", "~180,000", "7%"],
                ["West Midlands", "~170,000", "6%"],
                ["East England", "~170,000", "6%"],
                ["South West England", "~160,000", "6%"],
                ["Scotland", "~120,000", "5%"],
                ["Wales", "~80,000", "3%"],
                ["North East England", "~55,000", "2%"],
                ["Northern Ireland", "~45,000", "2%"],
              ].map(([region, count, pct]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count} <span className="text-gray-400 text-xs">({pct})</span></span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Drives Regional Differences?</h2>
          <p className="text-gray-700">
            London's dominance reflects its role as the UK's financial, professional services, and technology hub. The city has more property companies alone (99,281) than Northern Ireland has total companies across all industries.
          </p>
          <p className="text-gray-700 mt-3">
            The North West — driven by Manchester and Liverpool — is the largest region outside London and the South East, with particular strength in construction, healthcare, and e-commerce.
          </p>
          <p className="text-gray-700 mt-3">
            The East Midlands punches above its weight in transport and logistics, reflecting its central location and major distribution hubs around Northampton, Leicester, and Nottingham.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Top Industry by Region</h2>
          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "Property & Real Estate"],
                ["South East", "Management Consultancy"],
                ["North West", "Construction"],
                ["East Midlands", "E-commerce"],
                ["Yorkshire", "Construction"],
                ["West Midlands", "E-commerce"],
                ["Scotland", "Management Consultancy"],
                ["Wales", "Construction"],
                ["Northern Ireland", "Construction"],
              ].map(([region, industry]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{industry}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Explore by Region</h2>
          <div className="flex flex-wrap gap-2 my-4">
            {[["London","london"],["South East","south-east"],["North West","north-west"],["Scotland","scotland"],["Wales","wales"],["Northern Ireland","northern-ireland"]].map(([name, slug]) => (
              <Link key={slug} href={`/region/${slug}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{name}</Link>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>About this data:</strong> All figures are sourced from Companies House bulk data, published under the Open Government Licence v3.0. Data reflects the latest available snapshot as of March 2026. Regional totals are approximate as some companies span multiple SIC codes.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
