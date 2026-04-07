import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UK E-commerce Companies — How Many Are There in 2026?",
  description: "The UK has over 192,000 active e-commerce and online retail companies. We analyse the sector by region, growth trends, and ownership patterns.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">E-commerce Companies UK</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">UK E-commerce Companies — How Many Are There in 2026?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            E-commerce is now one of the largest business sectors in the UK by company count. There are approximately <strong>192,486 active e-commerce and online retail companies</strong> registered at Companies House as of March 2026 — making it the fourth largest sector after property, management consultancy, and construction.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">E-commerce Companies by Region</h2>
          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "83,544"], ["North West", "20,136"], ["South East", "14,242"],
                ["East Midlands", "13,616"], ["Yorkshire", "11,141"], ["West Midlands", "10,983"],
                ["East England", "10,782"], ["South West", "7,347"], ["Wales", "6,517"],
                ["Scotland", "6,425"], ["Northern Ireland", "4,245"], ["North East", "3,308"],
              ].map(([region, count]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">London's Dominance</h2>
          <p className="text-gray-700">
            London accounts for over 43% of all UK e-commerce companies — a far higher concentration than in most other industries. This reflects the capital's role as a hub for online retail, dropshipping, Amazon FBA sellers, and direct-to-consumer brands. Many of these are micro-companies with one or two people.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">International Ownership</h2>
          <p className="text-gray-700">
            E-commerce has one of the highest rates of international PSC ownership after IT consulting. This makes sense — online retail has no geographical barriers to entry, and the UK's business-friendly company formation process makes it easy for overseas entrepreneurs to set up a UK entity. Our data shows significant numbers of Chinese, Indian, and American nationals controlling UK e-commerce companies.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Northern Ireland's E-commerce Scene</h2>
          <p className="text-gray-700">
            With 4,245 active e-commerce companies, Northern Ireland has a surprisingly strong online retail sector relative to its population. This may reflect the advantages of UK and EU market access, lower operating costs compared to London, and a growing tech-savvy entrepreneurial culture.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse E-commerce Companies</h2>
          <div className="flex flex-wrap gap-2 my-4">
            {[["London","london"],["North West","north-west"],["East Midlands","east-midlands"],["Yorkshire","yorkshire"],["Wales","wales"],["Northern Ireland","northern-ireland"]].map(([name, slug]) => (
              <Link key={slug} href={`/ecommerce/${slug}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{name}</Link>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>About this data:</strong> All figures are sourced from Companies House bulk data, published under the Open Government Licence v3.0. Data reflects the latest available snapshot as of March 2026.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
