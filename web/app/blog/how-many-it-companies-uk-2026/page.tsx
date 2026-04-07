import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Many IT Companies Are in the UK in 2026?",
  description: "A breakdown of the UK's IT sector — over 275,000 active IT consulting, software, and IT services companies analysed by region and company profile.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">IT Companies in the UK</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How Many IT Companies Are in the UK in 2026?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            The UK's technology sector is enormous. Across three sub-categories — IT consulting, software development, and IT services — there are approximately <strong>275,000 active IT companies</strong> registered at Companies House as of March 2026.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Breakdown by Sub-sector</h2>
          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[["IT Consulting", "137,266"], ["Software Development", "110,149"], ["IT Services", "40,023"]].map(([sector, count]) => (
                <div key={sector} className="flex justify-between">
                  <span className="text-gray-700">{sector}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">IT Companies by Region</h2>
          <p className="text-gray-700">London dominates the UK tech landscape, with over 54,000 IT consulting companies alone. The South East is a strong second, driven by the Thames Valley and M4 corridor tech clusters.</p>

          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "54,872 (IT Consulting)"], ["South East", "19,100"], ["North West", "11,497"],
                ["East Midlands", "10,489"], ["Yorkshire", "7,456"], ["East England", "9,059"],
                ["West Midlands", "5,772"], ["Scotland", "4,883"], ["South West", "7,730"],
                ["Wales", "3,226"], ["North East", "2,000"], ["Northern Ireland", "1,182"],
              ].map(([region, count]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">International Ownership</h2>
          <p className="text-gray-700">
            The IT sector has the highest rate of international ownership of any UK industry. PSC data reveals significant numbers of Indian, Chinese, Pakistani, and American nationals controlling UK tech companies — particularly in London and the South East. This reflects the UK's role as a global technology hub and the prevalence of skilled worker visa holders setting up consultancies.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse IT Companies</h2>
          <div className="flex flex-wrap gap-2 my-4">
            {[["IT Consulting","it-consulting"],["Software","software"],["IT Services","it-services"]].map(([name, slug]) => (
              <Link key={slug} href={`/${slug}`} className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">{name}</Link>
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
