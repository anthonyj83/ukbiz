import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Do I Need Business Insurance? A Guide for UK Businesses in 2026",
  description: "Understand which types of business insurance are required and recommended for UK companies. Public liability, professional indemnity, employers' liability explained.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Do I Need Business Insurance?</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Do I Need Business Insurance? A Guide for UK Businesses</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            If you're running a UK business, the question isn't really whether you need insurance — it's which types you need. Some are legally required. Others are practically essential. Here's a clear breakdown.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Employers' Liability Insurance — Legally Required</h2>
          <p className="text-gray-700">
            If you employ anyone — even one person — you are legally required to have employers' liability insurance with a minimum cover of £5 million. This covers claims from employees who are injured or become ill because of their work. Failing to have this insurance can result in fines of up to £2,500 per day. The only exemptions are for companies where the sole employee is also the owner and holds at least 50% of shares.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Public Liability Insurance — Highly Recommended</h2>
          <p className="text-gray-700">
            Public liability insurance covers claims from members of the public or other businesses who are injured or suffer property damage because of your business activities. While not legally required for most businesses, many clients and contracts will insist you have it. If you work on client premises, attend events, or interact with the public in any way, public liability insurance is essential.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Professional Indemnity Insurance — Essential for Service Businesses</h2>
          <p className="text-gray-700">
            If you provide advice, designs, or professional services, professional indemnity insurance protects you against claims of negligence or errors. This is legally required for some regulated professions (solicitors, accountants, financial advisers) and practically essential for consultants, IT professionals, architects, and anyone whose work could cause a client financial loss.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Other Types Worth Considering</h2>
          <p className="text-gray-700">
            Depending on your business, you might also need: commercial property insurance (if you own or lease business premises), tool and equipment insurance (for tradespeople), cyber liability insurance (increasingly important for any business handling customer data), product liability insurance (if you manufacture or sell physical products), and business interruption insurance (covers lost income if you can't trade due to an insured event).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How Much Does It Cost?</h2>
          <p className="text-gray-700">
            Business insurance costs vary enormously depending on your industry, turnover, number of employees, and the level of cover you need. A sole trader consultant might pay £100–£300/year for professional indemnity. A construction company could pay several thousand. The only way to know is to get quotes specific to your business.
          </p>
          <p className="text-gray-700">
            <a href="https://www.simplybusiness.co.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Simply Business</a> is one of the UK's largest business insurance brokers, covering over 500,000 businesses. You can compare quotes from multiple insurers in minutes by entering your business type, location, and required cover levels. They tailor quotes to your specific industry — whether you're in <Link href="/construction" className="text-blue-600 hover:underline">construction</Link>, <Link href="/cleaning" className="text-blue-600 hover:underline">cleaning</Link>, <Link href="/it-consulting" className="text-blue-600 hover:underline">IT consulting</Link>, or any other sector.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Quick Checklist</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Do you employ anyone? → You need employers' liability insurance (it's the law)</li>
            <li>Do you interact with the public or visit client sites? → Get public liability</li>
            <li>Do you provide advice or professional services? → Get professional indemnity</li>
            <li>Do you sell physical products? → Consider product liability</li>
            <li>Do you handle customer data? → Consider cyber liability</li>
          </ul>

          <div className="flex flex-wrap gap-2 my-6">
            <a href="https://www.simplybusiness.co.uk" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Get a Free Insurance Quote →</a>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>Disclaimer:</strong> This guide is for general information only and does not constitute legal or insurance advice. Requirements vary by industry and circumstance. Some links in this article are affiliate links — we may earn a commission at no extra cost to you.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
