import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Many Beauty Businesses Are in the UK in 2026?",
  description: "The UK has over 70,000 active beauty and personal care companies. We break down the numbers by region and explore the boom in beauty entrepreneurship.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Beauty Businesses UK</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How Many Beauty Businesses Are in the UK in 2026?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            The UK beauty industry has boomed in recent years. There are now approximately <strong>70,765 active beauty and personal care companies</strong> registered at Companies House — covering hair salons, nail bars, beauty treatments, cosmetics brands, and personal care services.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Beauty Companies by Region</h2>
          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "20,327"], ["North West", "8,537"], ["South East", "7,299"],
                ["East Midlands", "5,926"], ["Yorkshire", "5,794"], ["Scotland", "4,885"],
                ["East England", "4,605"], ["West Midlands", "4,512"], ["South West", "3,754"],
                ["North East", "2,462"], ["Wales", "2,363"], ["Northern Ireland", "1,008"],
              ].map(([region, count]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">The Beauty Boom</h2>
          <p className="text-gray-700">
            Beauty is one of the fastest-growing sectors for new company registrations. The low startup costs, the influence of social media, and the shift towards self-employment have driven thousands of new beauty businesses in the past five years. Many of these are sole-person companies — a single beautician, hairdresser, or aesthetics practitioner trading through a limited company.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Young Companies Dominate</h2>
          <p className="text-gray-700">
            The beauty sector has one of the youngest age profiles of any industry. A large proportion of beauty companies are in the 0-2 year startup bracket, reflecting the ongoing wave of new entrants. This high rate of new registrations is balanced by a relatively high failure rate — the sector also sees significant numbers of companies being struck off or dissolved each year.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse Beauty Companies</h2>
          <div className="flex flex-wrap gap-2 my-4">
            {[["London","london"],["North West","north-west"],["Scotland","scotland"],["Yorkshire","yorkshire"],["South East","south-east"],["Northern Ireland","northern-ireland"]].map(([name, slug]) => (
              <Link key={slug} href={`/beauty/${slug}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{name}</Link>
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
