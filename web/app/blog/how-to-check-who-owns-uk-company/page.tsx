import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Check Who Owns a UK Company (PSC Register Explained)",
  description: "Learn how to find out who really owns and controls a UK company using the PSC register. Free tools, what to look for, and red flags to watch for.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Check Who Owns a UK Company</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How to Check Who Owns a UK Company</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            Since 2016, every UK company must declare its Persons with Significant Control (PSCs) — the individuals or entities that ultimately own or control the company. This information is public, free to access, and one of the most powerful due diligence tools available.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Is a Person with Significant Control?</h2>
          <p className="text-gray-700">
            A PSC is anyone who meets one or more of these conditions: holds more than 25% of the company's shares, holds more than 25% of the voting rights, has the right to appoint or remove the majority of the board, or has the right to exercise or actually exercises significant influence or control. PSCs can be individuals or corporate entities (known as Relevant Legal Entities or RLEs).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How to Look Up Ownership</h2>
          <p className="text-gray-700">
            On <Link href="/" className="text-blue-600 hover:underline">UK Business Finder</Link>, you can search for any company by name, company number, or even the PSC's name — and see the ownership details instantly. Click "More" on any company listing to see the full PSC breakdown including names, nationalities, country of residence, and the nature of their control. We hold PSC data for over 2.5 million UK companies.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What the Control Levels Mean</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li><strong>25%+</strong> — owns or controls more than 25% but not more than 50%</li>
            <li><strong>50%+</strong> — owns or controls more than 50% but less than 75%</li>
            <li><strong>75%+</strong> — owns or controls 75% or more (near-total control)</li>
            <li><strong>Board control</strong> — has the right to appoint or remove the majority of the board</li>
            <li><strong>Significant influence</strong> — exercises significant influence or control without holding shares directly</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Red Flags to Watch For</h2>
          <p className="text-gray-700">
            When reviewing PSC data, be cautious if: the company has no PSC data filed (this is a legal requirement — missing data may indicate poor compliance), the PSC is a corporate entity registered in a secrecy jurisdiction, all control sits with a single foreign-resident individual with no apparent connection to the business, or the PSC details have been recently changed multiple times in quick succession.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Foreign Ownership</h2>
          <p className="text-gray-700">
            UK Business Finder lets you filter companies by foreign-controlled status. On any <Link href="/industries" className="text-blue-600 hover:underline">industry/region page</Link>, use the "Foreign-controlled" quick filter to see only companies where the PSC is resident outside the UK. This is useful for understanding overseas investment patterns in specific sectors.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Identity Verification Changes in 2026</h2>
          <p className="text-gray-700">
            From November 2025, all new directors and PSCs must verify their identity with Companies House before appointment. Existing directors and PSCs must complete verification by the end of 2026. This is a major upgrade to data quality and means PSC records will become increasingly reliable. Companies that fail to verify their officers will be unable to file confirmation statements.
          </p>

          <div className="flex flex-wrap gap-2 my-6">
            <Link href="/" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Search Company Ownership</Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>Disclaimer:</strong> This guide is for general information only. PSC data is sourced from Companies House and may not reflect very recent changes. Always verify critical information directly with Companies House.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
