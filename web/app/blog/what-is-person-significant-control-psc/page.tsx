import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Is a Person with Significant Control (PSC)? UK Guide 2026",
  description: "Understand the UK PSC register: who must be declared, what control thresholds apply, your obligations as a company, and how to look up any company's PSCs for free.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">What Is a PSC?</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">What Is a Person with Significant Control (PSC)?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            The PSC register is one of the most important transparency tools in UK corporate governance. Introduced in 2016, it requires every UK company to identify and publicly declare the individuals who ultimately own and control it. Here's everything you need to know.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Who Counts as a PSC?</h2>
          <p className="text-gray-700">
            An individual is a PSC if they meet any of these conditions: they directly or indirectly hold more than 25% of the company's shares, they directly or indirectly hold more than 25% of the voting rights, they have the right to appoint or remove the majority of the board of directors, or they have the right to exercise or actually exercise significant influence or control over the company. A corporate entity can also be a PSC if it meets the same thresholds and is itself subject to its own PSC-like disclosure requirements (known as a Relevant Legal Entity).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Information Is Disclosed?</h2>
          <p className="text-gray-700">
            For individual PSCs, the public register shows: full name, date of birth (month and year only), nationality, country of residence, correspondence address (not home address), the date they became a PSC, and the nature of their control. For corporate PSCs, the register shows: company name, registered office, the legal form of the entity, the law it's governed by, and the register where it's recorded.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Your Obligations as a Company</h2>
          <p className="text-gray-700">
            Every UK company must maintain its own PSC register and file PSC information with Companies House as part of its annual confirmation statement. If a company fails to identify its PSCs or files incorrect information, the company and its officers can face criminal penalties including fines and imprisonment. Since November 2025, all PSCs must also complete identity verification with Companies House.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Why PSC Data Matters</h2>
          <p className="text-gray-700">
            PSC data is essential for: due diligence on potential business partners, clients, or suppliers; anti-money laundering (AML) compliance and Know Your Customer (KYC) checks; understanding the real ownership behind complex corporate structures; identifying connected parties and potential conflicts of interest; and research into foreign ownership of UK businesses.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How to Search PSC Data</h2>
          <p className="text-gray-700">
            <Link href="/" className="text-blue-600 hover:underline">UK Business Finder</Link> makes PSC data searchable across 2.6 million active UK companies. You can search by company name to see its PSCs, or search by a person's name to find every company they control. On industry/region pages, you can filter for foreign-controlled companies, corporate-owned companies, and view top controller nationalities for any sector.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Common Structures</h2>
          <p className="text-gray-700">
            In most small UK businesses, the PSC is simply the founder/owner — one individual with 75%+ control. More complex structures include: joint ownership (two PSCs each with 50%+), corporate chains (a holding company is the PSC, with its own PSCs one level up), family structures (multiple family members each holding 25%+), and nominee arrangements (where the registered PSC holds shares on behalf of the real beneficial owner — though this must now be disclosed).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Changes Coming Under ECCTA</h2>
          <p className="text-gray-700">
            The Economic Crime and Corporate Transparency Act (ECCTA) is tightening PSC requirements. Key changes include: mandatory identity verification for all PSCs, expanded disclosure of trust arrangements, new powers for Companies House to query and remove information it believes is false, and stricter penalties for non-compliance. These changes are being phased in through 2025–2027 and will significantly improve the quality of PSC data.
          </p>

          <div className="flex flex-wrap gap-2 my-6">
            <Link href="/" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Search PSC / Ownership Data</Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>Disclaimer:</strong> This guide is for general information only and does not constitute legal advice. PSC requirements are complex and vary by company type. Consult a solicitor or company secretary for advice specific to your situation.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
