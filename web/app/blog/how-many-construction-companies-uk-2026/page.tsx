import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Many Construction Companies Are There in the UK in 2026?",
  description: "A data-driven breakdown of the UK's 224,969 active construction companies by region, company age, and compliance status — sourced directly from Companies House.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Construction Companies UK</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How Many Construction Companies Are There in the UK in 2026?</h1>
        <p className="text-sm text-gray-500 mb-8">6 April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            According to our analysis of the latest Companies House bulk data, there are <strong>224,969 active construction companies</strong> registered in the United Kingdom as of March 2026. This makes construction one of the largest sectors by company count in the UK.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Construction Companies by Region</h2>
          <p className="text-gray-700">
            London dominates with over 72,800 active construction companies, followed by the South East with nearly 28,000. Here is the full regional breakdown:
          </p>

          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "72,830"],
                ["South East England", "27,861"],
                ["North West England", "19,689"],
                ["East Midlands", "18,561"],
                ["South West England", "16,228"],
                ["East England", "16,737"],
                ["Yorkshire", "15,021"],
                ["West Midlands", "12,405"],
                ["Scotland", "8,772"],
                ["Wales", "7,187"],
                ["Northern Ireland", "5,071"],
                ["North East England", "4,608"],
              ].map(([region, count]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-700">
            You can browse the full company lists for each region on our <Link href="/construction" className="text-blue-600 hover:underline">construction industry page</Link>, with filters for company age, size, overdue accounts, and more.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Company Age Profile</h2>
          <p className="text-gray-700">
            The construction sector has a high proportion of young companies. A significant number are startups (0–2 years old), reflecting the low barriers to entry in the trades. However, there are also thousands of established firms with 20+ years of trading history — particularly in specialist areas like civil engineering and building services.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Compliance and Risk Indicators</h2>
          <p className="text-gray-700">
            Our data includes compliance flags sourced directly from Companies House. Across the construction sector, a notable percentage of companies have overdue accounts or overdue confirmation statements. These flags can be useful indicators for credit risk assessment, due diligence, and supply chain vetting.
          </p>
          <p className="text-gray-700">
            You can filter for companies with overdue accounts, outstanding charges, or dormant status on any of our <Link href="/construction" className="text-blue-600 hover:underline">construction browse pages</Link>.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Ownership and Control</h2>
          <p className="text-gray-700">
            Using Persons with Significant Control (PSC) data from Companies House, we can identify who owns and controls construction companies across the UK. The vast majority are owned by British nationals, but there is meaningful foreign ownership — particularly in London, where companies with PSCs resident overseas are more common.
          </p>
          <p className="text-gray-700">
            Our browse pages include filters for foreign-controlled companies and corporate-owned entities, making it easy to identify ownership structures at a glance.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse Construction Companies</h2>
          <p className="text-gray-700">
            All data is free to browse and requires no registration. Click any region below to explore construction companies with full filtering:
          </p>

          <div className="flex flex-wrap gap-2 my-4">
            {[
              ["London", "london"],
              ["South East", "south-east"],
              ["North West", "north-west"],
              ["East Midlands", "east-midlands"],
              ["Yorkshire", "yorkshire"],
              ["Scotland", "scotland"],
              ["Wales", "wales"],
              ["Northern Ireland", "northern-ireland"],
            ].map(([name, slug]) => (
              <Link key={slug} href={`/construction/${slug}`}
                className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">
                {name}
              </Link>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700">
              <strong>About this data:</strong> All figures are sourced from the Companies House bulk data product, published under the Open Government Licence v3.0. Data reflects the latest available snapshot as of March 2026. Only companies with an "Active" status are included.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
