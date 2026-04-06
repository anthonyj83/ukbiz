import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Who Really Owns UK Companies? A Look at Foreign and Corporate Ownership",
  description: "We analysed Persons with Significant Control data across 2.6 million UK companies to reveal patterns in foreign ownership, corporate control, and nationality breakdown.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">UK Company Ownership</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Who Really Owns UK Companies? A Look at Foreign and Corporate Ownership</h1>
        <p className="text-sm text-gray-500 mb-8">6 April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            Since 2016, UK companies have been required to declare their Persons with Significant Control (PSC) — the individuals or entities that ultimately own or control the company. Using the latest PSC bulk data from Companies House, we analysed ownership patterns across <strong>2.6 million active UK companies</strong>.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Is a Person with Significant Control?</h2>
          <p className="text-gray-700">
            A PSC is anyone who holds more than 25% of a company's shares, more than 25% of voting rights, or has the right to appoint or remove a majority of the board. Companies must also declare PSCs that are corporate entities — meaning another company holds significant control.
          </p>
          <p className="text-gray-700">
            This data is publicly available from Companies House and provides unprecedented transparency into who actually controls UK businesses.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Key Findings</h2>

          <div className="bg-gray-50 rounded-xl p-5 my-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Companies with PSC data on file</span>
                <span className="font-medium text-gray-900">2,581,610 (97.9%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Individual PSCs recorded</span>
                <span className="font-medium text-gray-900">Over 10 million</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Most common PSC nationality</span>
                <span className="font-medium text-gray-900">British</span>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Foreign Ownership</h2>
          <p className="text-gray-700">
            While the majority of UK companies are controlled by British nationals, a significant minority have PSCs resident outside the UK. This is particularly pronounced in London, where industries like property, IT consulting, and e-commerce have notable levels of international ownership.
          </p>
          <p className="text-gray-700">
            The most common non-British PSC nationalities include Indian, Chinese, Pakistani, Irish, Nigerian, and American — reflecting the UK's position as a global business hub.
          </p>
          <p className="text-gray-700">
            On UK Business Finder, you can filter any industry/region page by "Foreign-controlled" to see companies with PSCs resident outside the UK. This is useful for market analysis, compliance research, and understanding the makeup of different business sectors.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Corporate Ownership</h2>
          <p className="text-gray-700">
            Some companies are controlled not by individuals but by other corporate entities. This is common in sectors like property, financial services, and retail — where holding company structures are the norm. Our data flags these as "Corporate-owned" and you can filter for them on any browse page.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Explore Ownership Data</h2>
          <p className="text-gray-700">
            All PSC ownership data is available for free on every company listing page. Use the "Foreign-controlled" and "Corporate-owned" quick filters on any industry/region page to explore ownership patterns in your sector.
          </p>

          <div className="flex flex-wrap gap-2 my-4">
            {[
              ["Property", "property"],
              ["Construction", "construction"],
              ["IT Consulting", "it-consulting"],
              ["E-commerce", "ecommerce"],
              ["Restaurants", "restaurants"],
              ["Healthcare", "healthcare"],
            ].map(([name, slug]) => (
              <Link key={slug} href={`/${slug}`}
                className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">
                {name}
              </Link>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700">
              <strong>About this data:</strong> PSC data is sourced from the Companies House PSC bulk data snapshot, published under the Open Government Licence v3.0. Data reflects the latest available snapshot as of April 2026.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
