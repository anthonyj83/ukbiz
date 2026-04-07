import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Many Restaurants Are There in the UK in 2026?",
  description: "A data-driven breakdown of the UK's 97,000+ active restaurant and food service companies by region, with compliance flags and ownership data.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Restaurants in the UK</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How Many Restaurants Are There in the UK in 2026?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            According to our analysis of the latest Companies House data, there are approximately <strong>97,393 active restaurant and food service companies</strong> registered in the UK as of March 2026. This covers everything from independent cafes and takeaways to multi-site restaurant chains.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Restaurants by Region</h2>
          <p className="text-gray-700">London accounts for nearly a third of all restaurant companies in the UK, reflecting the capital's position as the centre of the UK's dining scene.</p>

          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "30,484"], ["North West England", "9,555"], ["South East England", "9,598"],
                ["Yorkshire", "7,348"], ["Scotland", "7,234"], ["East Midlands", "7,132"],
                ["South West England", "6,195"], ["West Midlands", "5,507"], ["East England", "5,441"],
                ["Wales", "3,498"], ["North East England", "2,817"], ["Northern Ireland", "1,783"],
              ].map(([region, count]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Industry Challenges</h2>
          <p className="text-gray-700">
            The restaurant sector has one of the highest rates of overdue accounts and confirmation statements of any UK industry. This reflects the well-documented challenges facing hospitality businesses — thin margins, rising costs, and high failure rates. Our data flags these compliance issues on every listing, making it easy to identify which businesses may be under financial pressure.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Ownership Patterns</h2>
          <p className="text-gray-700">
            The restaurant sector has notably diverse ownership. PSC data shows significant representation of Indian, Chinese, Turkish, Italian, and Bangladeshi nationals among restaurant company controllers — particularly in London and major cities. You can explore ownership nationality breakdowns on any of our restaurant browse pages.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse Restaurant Companies</h2>
          <div className="flex flex-wrap gap-2 my-4">
            {[["London","london"],["North West","north-west"],["Scotland","scotland"],["Yorkshire","yorkshire"],["South East","south-east"],["Wales","wales"],["Northern Ireland","northern-ireland"]].map(([name, slug]) => (
              <Link key={slug} href={`/restaurants/${slug}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{name}</Link>
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
