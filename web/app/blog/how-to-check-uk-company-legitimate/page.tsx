import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Check If a UK Company Is Legitimate in 2026",
  description: "A step-by-step guide to verifying UK companies using free tools and public data. Check registration, accounts, directors, charges and more.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Check If a Company Is Legitimate</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How to Check If a UK Company Is Legitimate in 2026</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            Whether you're vetting a potential supplier, checking out a new client, or researching a company before investing, verifying that a UK company is legitimate is straightforward — and completely free. Here's what to look for.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Check the Company Is Registered</h2>
          <p className="text-gray-700">
            Every legitimate UK limited company must be registered at Companies House and have a unique company number. You can search for any company by name or number on <Link href="/" className="text-blue-600 hover:underline">UK Business Finder</Link> or directly on the Companies House website. If a company claims to be a limited company but doesn't appear on the register, that's a major red flag.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Check the Status</h2>
          <p className="text-gray-700">
            Look for the company status. "Active" means the company is currently registered and in good standing. Watch out for statuses like "Active - Proposal to Strike Off" (the company is being removed from the register), "In Administration", or "In Liquidation". All of these are visible on UK Business Finder listings.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Check the Accounts</h2>
          <p className="text-gray-700">
            Has the company filed its accounts on time? Overdue accounts can indicate financial difficulties or poor management. On UK Business Finder, companies with overdue accounts are flagged with a red "Accts overdue" tag, making them easy to spot.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Check the Age</h2>
          <p className="text-gray-700">
            A company that was incorporated last month carries more risk than one trading for 15 years. Our listings show the exact incorporation date and age of every company. Be cautious with very new companies, especially if they're asking for large upfront payments.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Check Who Controls It</h2>
          <p className="text-gray-700">
            Persons with Significant Control (PSC) data tells you who really owns and controls the company. On UK Business Finder, click "More" on any company to see the PSC details — names, nationalities, and level of control. If a company has no PSC data filed, that may warrant further investigation.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Check for Charges</h2>
          <p className="text-gray-700">
            Registered charges indicate the company has loans secured against its assets. While charges are normal for many businesses, an unusually high number of charges or recent charge registrations can indicate financial stress. Our listings show the number of outstanding and satisfied charges for every company.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Check the Registered Address</h2>
          <p className="text-gray-700">
            A legitimate company should have a real registered address. Be cautious of companies using virtual office addresses or addresses that don't match where they claim to operate from. Our listings show the registered postcode and town for every company.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Start Checking</h2>
          <p className="text-gray-700">
            All of these checks are available for free on UK Business Finder across 2.6 million active UK companies. No registration required.
          </p>

          <div className="flex flex-wrap gap-2 my-6">
            <Link href="/" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Search Companies</Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>Disclaimer:</strong> This guide is for general information only and does not constitute legal or financial advice. Always conduct thorough due diligence and consult professionals when making business decisions.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
