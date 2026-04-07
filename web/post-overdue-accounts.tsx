import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UK Companies with Overdue Accounts — What Does It Mean?",
  description: "What happens when a UK company has overdue accounts at Companies House? We explain the flags, the consequences, and how to use this data for due diligence.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Overdue Accounts Explained</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">UK Companies with Overdue Accounts — What Does It Mean?</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026 · Data sourced from Companies House</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            Every UK limited company must file annual accounts with Companies House. When a company misses its filing deadline, it is flagged as having <strong>overdue accounts</strong>. This flag is public information and is visible on the Companies House register — and on UK Business Finder.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Are the Deadlines?</h2>
          <p className="text-gray-700">
            Private limited companies must file accounts within 9 months of their accounting reference date. Public companies have 6 months. If a company misses the deadline, Companies House records the accounts as overdue immediately.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Are the Consequences?</h2>
          <p className="text-gray-700">
            Late filing carries automatic penalties starting at £150 and rising to £1,500 for private companies (more for public companies). Persistent failure to file can lead to the company being struck off the register entirely. Directors can also be personally fined or disqualified.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Does It Tell You?</h2>
          <p className="text-gray-700">
            An overdue accounts flag doesn't necessarily mean a company is in trouble — some small companies simply file late through oversight. However, it can be a useful early warning signal for:
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Credit risk assessment</strong> — lenders and suppliers routinely check filing status before extending credit. A company that can't file on time may have cash flow or management issues.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Due diligence</strong> — when researching a potential acquisition target, supplier, or partner, overdue accounts are a red flag worth investigating further.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Compliance monitoring</strong> — if you manage a portfolio of companies or a supply chain, monitoring filing status helps identify problems early.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What About Overdue Confirmation Statements?</h2>
          <p className="text-gray-700">
            Companies must also file an annual confirmation statement (formerly the annual return) confirming their registered details are up to date. An overdue confirmation statement carries similar penalties and can also indicate a company that's not being actively managed.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How to Use This on UK Business Finder</h2>
          <p className="text-gray-700">
            Every company listing on UK Business Finder shows compliance flags including overdue accounts and overdue confirmation statements. You can filter any industry/region page to show only companies with overdue filings using the quick filter buttons. This makes it easy to screen for compliance issues across thousands of companies at once.
          </p>
          <p className="text-gray-700 mt-2">
            Note: our data is based on the Companies House snapshot dated 2 March 2026. Some companies flagged as overdue may have filed since this date. Always verify current status directly on Companies House before making decisions.
          </p>

          <div className="flex flex-wrap gap-2 my-6">
            <Link href="/industries" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Browse Industries</Link>
            <Link href="/regions" className="bg-white border border-gray-200 text-sm px-5 py-2.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors">Browse Regions</Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>About this data:</strong> All figures are sourced from Companies House bulk data, published under the Open Government Licence v3.0.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
