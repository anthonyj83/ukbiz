import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Understanding Company Charges and Mortgages in the UK",
  description: "What are company charges, how do they work, and why do they matter? A plain-English guide to registered charges, mortgages, and what they reveal about a company.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Company Charges Explained</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Understanding Company Charges and Mortgages in the UK</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            When you see that a UK company has "charges" registered at Companies House, it means a lender has secured a loan against the company's assets. This is public information and tells you a lot about a company's financial structure. Here's what you need to know.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Is a Company Charge?</h2>
          <p className="text-gray-700">
            A charge is a form of security that a lender registers against a company's assets when providing a loan. If the company defaults, the lender has a legal claim on those assets. Common types include: fixed charges (secured against specific assets like property or equipment), floating charges (secured against a class of assets like stock or receivables that change over time), and debentures (which can include both fixed and floating charges).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Why Charges Must Be Registered</h2>
          <p className="text-gray-700">
            Under UK company law, most charges must be registered at Companies House within 21 days of creation. Unregistered charges are void against a liquidator or creditor — meaning the lender loses their priority claim. This requirement makes the charges register a reliable source of information about a company's secured borrowing.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Outstanding vs Satisfied Charges</h2>
          <p className="text-gray-700">
            An outstanding charge means the debt is still active. A satisfied charge means the loan has been repaid and the lender has confirmed this to Companies House. When assessing a company, pay attention to the ratio — a company with 10 charges and 9 satisfied suggests healthy debt management. A company with 10 outstanding charges and none satisfied warrants closer scrutiny.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Charges Reveal About a Company</h2>
          <p className="text-gray-700">
            Charges data can tell you: which banks or lenders the company works with, the approximate scale of their borrowing, whether they've been taking on new debt recently, and whether they're managing their obligations (by satisfying old charges). A sudden increase in charge registrations, particularly with non-mainstream lenders, can be an early warning sign of financial stress.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How to Check a Company's Charges</h2>
          <p className="text-gray-700">
            On <Link href="/" className="text-blue-600 hover:underline">UK Business Finder</Link>, every company listing shows the number of outstanding charges, satisfied charges, and total charges. You can also filter any industry/region page to show only companies with charges, sort by most charges, and use the "Has charges" quick filter to narrow your research. Our data covers over 260,000 companies with registered charges.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Charges and Insolvency</h2>
          <p className="text-gray-700">
            When a company enters insolvency, secured creditors (those with registered charges) are paid before unsecured creditors. This is why charge registrations matter — they establish the priority of claims. If you're a supplier considering extending credit to a company, knowing their charge position helps you understand where you'd sit in the queue if things went wrong.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Industry Patterns</h2>
          <p className="text-gray-700">
            Charges are normal and expected in certain industries. <Link href="/property" className="text-blue-600 hover:underline">Property companies</Link> and <Link href="/construction" className="text-blue-600 hover:underline">construction firms</Link> routinely have multiple charges as part of their financing structure. A cleaning company or IT consultancy with multiple charges would be more unusual. Context matters.
          </p>

          <div className="flex flex-wrap gap-2 my-6">
            <Link href="/" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Search Company Charges</Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>Disclaimer:</strong> This guide is for general information only and does not constitute legal or financial advice. Charges data is sourced from Companies House and may not reflect very recent registrations or satisfactions.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
