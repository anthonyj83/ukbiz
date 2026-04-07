import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Many Property Companies Are in London in 2026?",
  description: "London has over 99,000 active property and real estate companies. We break down the numbers by company type, age, charges, and ownership.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Property Companies in London</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How Many Property Companies Are in London in 2026?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            London has <strong>99,281 active property and real estate companies</strong> registered at Companies House — more than any other industry/region combination in the UK. This makes London property the single largest company cluster in the country.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Why So Many?</h2>
          <p className="text-gray-700">
            The vast majority are Special Purpose Vehicles (SPVs) — companies set up to hold a single property or small portfolio. Using a limited company to hold property is standard practice for tax efficiency, liability protection, and mortgage structuring. Many of these companies have no employees and exist purely as asset-holding structures.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Property Companies Across the UK</h2>
          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "99,281"], ["North West", "26,354"], ["South East", "24,777"],
                ["East Midlands", "20,516"], ["West Midlands", "16,824"], ["Yorkshire", "16,242"],
                ["East England", "14,948"], ["South West", "10,330"], ["Scotland", "10,451"],
                ["North East", "6,062"], ["Wales", "5,972"], ["Northern Ireland", "3,160"],
              ].map(([region, count]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Charges and Lending</h2>
          <p className="text-gray-700">
            Property companies have the highest concentration of registered charges (mortgages and loans secured against assets) of any sector. This is expected — most property purchases are leveraged. Our data shows charge holders for every company, revealing which banks and lenders are most active in different regions.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Overseas Ownership</h2>
          <p className="text-gray-700">
            London property has significant overseas ownership. PSC data reveals controllers resident in the Middle East, China, India, and various European countries. You can filter for foreign-controlled property companies on our browse pages — useful for researchers, journalists, and compliance teams.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse Property Companies</h2>
          <div className="flex flex-wrap gap-2 my-4">
            {[["London","london"],["North West","north-west"],["South East","south-east"],["East Midlands","east-midlands"],["Scotland","scotland"],["Northern Ireland","northern-ireland"]].map(([name, slug]) => (
              <Link key={slug} href={`/property/${slug}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{name}</Link>
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
