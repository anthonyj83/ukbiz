import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UK Business Statistics 2026: Key Numbers Every Business Owner Should Know",
  description: "From the total number of active companies to overdue accounts and insolvency rates — the headline figures from our analysis of 2.6 million UK businesses.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">UK Business Statistics 2026</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">UK Business Statistics 2026: Key Numbers Every Business Owner Should Know</h1>
        <p className="text-sm text-gray-500 mb-8">6 April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            The UK remains one of the easiest places in the world to start a business, and the numbers reflect that. Using the latest bulk data from Companies House, we've compiled the key statistics on the state of UK business in 2026.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Headline Numbers</h2>

          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-3 text-sm">
              {[
                ["Total active companies", "2,637,386"],
                ["Industries tracked", "48"],
                ["Regions covered", "12"],
                ["Companies with PSC data", "2,581,610 (97.9%)"],
                ["Companies with registered charges", "266,752"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Largest Sectors by Company Count</h2>
          <p className="text-gray-700">
            The largest sectors by number of active companies may surprise you. Management consultancy and IT consulting dwarf traditional industries like construction and retail:
          </p>

          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["Management Consultancy", "236,831"],
                ["Construction", "224,969"],
                ["E-commerce & Online Retail", "192,486"],
                ["IT Consulting", "137,266"],
                ["Property & Real Estate", "254,917"],
                ["Healthcare", "125,886"],
                ["Restaurants & Food Service", "97,393"],
                ["Building Services", "109,630"],
                ["Beauty & Personal Care", "70,765"],
                ["Transport & Logistics", "69,865"],
              ].map(([sector, count]) => (
                <div key={sector} className="flex justify-between">
                  <span className="text-gray-700">{sector}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Regional Distribution</h2>
          <p className="text-gray-700">
            London accounts for a disproportionate share of UK company registrations — roughly one in five active companies is registered in the capital. The South East, North West, and East Midlands follow as the next largest centres of business activity.
          </p>
          <p className="text-gray-700">
            You can explore every region on our <Link href="/regions" className="text-blue-600 hover:underline">regions page</Link>, with full company listings and filters.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Compliance Health</h2>
          <p className="text-gray-700">
            Companies House tracks whether companies have filed their accounts and confirmation statements on time. Across the 2.6 million active companies in our database:
          </p>
          <p className="text-gray-700">
            A significant number have overdue accounts or confirmation statements. These compliance flags are visible on every company listing on UK Business Finder and can be used as early warning indicators for credit risk or due diligence.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Charges and Lending</h2>
          <p className="text-gray-700">
            Over 266,000 active UK companies have outstanding charges registered at Companies House — meaning they have loans secured against company assets. The most common charge holders are the major UK clearing banks, followed by specialist lenders and private credit funds.
          </p>
          <p className="text-gray-700">
            You can filter for companies with charges on any of our browse pages using the "Has charges" quick filter.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Explore the Data</h2>
          <p className="text-gray-700">
            All of these statistics are derived from our free company intelligence platform. No registration required — just pick an industry and region to start browsing:
          </p>

          <div className="flex flex-wrap gap-2 my-4">
            <Link href="/industries" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">
              Browse Industries
            </Link>
            <Link href="/regions" className="bg-white border border-gray-200 text-sm px-5 py-2.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">
              Browse Regions
            </Link>
            <Link href="/" className="bg-white border border-gray-200 text-sm px-5 py-2.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">
              Search Companies
            </Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700">
              <strong>About this data:</strong> All figures are sourced from Companies House bulk data products, published under the Open Government Licence v3.0. Data reflects the latest available snapshot as of March 2026.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
