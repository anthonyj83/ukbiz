import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Most Common Business Types in the UK 2026",
  description: "What are the most popular industries for UK companies? We rank the top sectors by active company count using official Companies House data.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Most Common Business Types UK</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Most Common Business Types in the UK 2026</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            What kind of business are most people in the UK running? Using Companies House data across <strong>2.6 million active companies</strong>, we ranked the most common business types by company count.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Top 20 Business Types by Company Count</h2>

          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["1", "Property & Real Estate", "254,917"],
                ["2", "Management Consultancy", "236,831"],
                ["3", "Construction", "224,969"],
                ["4", "E-commerce & Online Retail", "192,486"],
                ["5", "IT Consulting", "137,266"],
                ["6", "Healthcare", "125,886"],
                ["7", "Building Services", "109,630"],
                ["8", "Restaurants & Food", "97,393"],
                ["9", "Beauty & Personal Care", "70,765"],
                ["10", "Transport & Logistics", "69,865"],
                ["11", "Accounting", "54,382"],
                ["12", "Software Development", "110,149"],
                ["13", "Retail", "66,586"],
                ["14", "Automotive", "62,934"],
                ["15", "Recruitment", "32,269"],
                ["16", "Marketing", "46,362"],
                ["17", "Training & Education", "41,464"],
                ["18", "Wholesale", "44,238"],
                ["19", "Hotels", "19,493"],
                ["20", "Security", "21,750"],
              ].map(([rank, sector, count]) => (
                <div key={rank} className="flex justify-between">
                  <span className="text-gray-700"><span className="text-gray-400 mr-2">{rank}.</span>{sector}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Key Takeaways</h2>
          <p className="text-gray-700">
            Property tops the list — driven by the hundreds of thousands of SPV (Special Purpose Vehicle) companies used to hold individual properties. Management consultancy is second, reflecting the UK's large freelance and contractor economy where individuals set up limited companies for tax efficiency.
          </p>
          <p className="text-gray-700 mt-3">
            Construction remains one of the UK's biggest sectors by company count, while e-commerce has grown rapidly to become the fourth largest category — a trend accelerated by the shift to online retail.
          </p>
          <p className="text-gray-700 mt-3">
            The IT sector (combining consulting, software, and services) would actually be the largest single category at over 275,000 companies if counted together.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse Any Industry</h2>
          <p className="text-gray-700">Every industry listed above is available to browse for free on UK Business Finder, with full regional breakdowns, filters, and company details.</p>

          <div className="flex flex-wrap gap-2 my-4">
            <Link href="/industries" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Browse All Industries</Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>About this data:</strong> All figures are sourced from Companies House bulk data, published under the Open Government Licence v3.0. Data reflects the latest available snapshot as of March 2026.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
