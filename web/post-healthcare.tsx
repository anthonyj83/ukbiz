import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Many Healthcare Companies Are in the UK in 2026?",
  description: "The UK has over 125,000 active healthcare companies. We break down the numbers by region, company age, and compliance status.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Healthcare Companies UK</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How Many Healthcare Companies Are in the UK in 2026?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            The UK's private healthcare sector is larger than many people realise. There are approximately <strong>125,886 active healthcare companies</strong> registered at Companies House as of March 2026. This covers everything from GP practices and dental surgeries to care homes, physiotherapy clinics, and mental health services.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Healthcare Companies by Region</h2>
          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-2 text-sm">
              {[
                ["London", "36,913"], ["North West", "15,795"], ["South East", "14,044"],
                ["East Midlands", "12,356"], ["Yorkshire", "10,944"], ["East England", "9,551"],
                ["West Midlands", "9,264"], ["South West", "7,079"], ["Scotland", "4,624"],
                ["Wales", "3,382"], ["North East", "3,196"], ["Northern Ireland", "1,738"],
              ].map(([region, count]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-700">{region}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">A Growing Sector</h2>
          <p className="text-gray-700">
            Healthcare has seen significant growth in company registrations over the past decade, driven by the expansion of private care services, NHS outsourcing, and the growing demand for specialist health services. A large proportion of healthcare companies are relatively young — many in the 0-5 year age bracket.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Compliance in Healthcare</h2>
          <p className="text-gray-700">
            Given the regulated nature of healthcare, compliance flags are particularly relevant in this sector. Companies with overdue accounts or confirmation statements may face additional scrutiny from regulators like the CQC. Our data makes it easy to identify healthcare companies with compliance issues across any region.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Browse Healthcare Companies</h2>
          <div className="flex flex-wrap gap-2 my-4">
            {[["London","london"],["North West","north-west"],["South East","south-east"],["Yorkshire","yorkshire"],["Scotland","scotland"],["Northern Ireland","northern-ireland"]].map(([name, slug]) => (
              <Link key={slug} href={`/healthcare/${slug}`} className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">{name}</Link>
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
