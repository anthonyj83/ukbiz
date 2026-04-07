import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Starting a Business Checklist: Everything You Need in 2026 (UK)",
  description: "The complete checklist for starting a UK business in 2026. Company registration, banking, insurance, accounting, HMRC, and ongoing compliance obligations.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Starting a Business Checklist</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Starting a Business Checklist: Everything You Need in 2026</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            Starting a UK business involves more steps than just having a good idea. This checklist covers everything from choosing your structure to getting your first customers, in the right order.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Choose Your Business Structure</h2>
          <p className="text-gray-700">
            Most UK businesses operate as either a sole trader or a limited company. A limited company offers liability protection and can be more tax-efficient once you earn over £30,000–£40,000 in profit. Sole trader status is simpler for getting started but exposes your personal assets to business debts. If in doubt, start as a limited company — it's easy to set up and gives you more credibility with clients.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Register Your Company</h2>
          <p className="text-gray-700">
            If you've chosen a limited company, register at Companies House. You can do this yourself for £50 or use a formation agent like <a href="https://www.1stformations.co.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">1st Formations</a> for same-day registration with a professional registered office address included. Check your company name is available by searching <Link href="/" className="text-blue-600 hover:underline">2.6 million UK companies on UK Business Finder</Link>.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Register with HMRC</h2>
          <p className="text-gray-700">
            Register for Corporation Tax within three months of starting to trade. If you expect turnover above £90,000, register for VAT. You may also need to register as an employer if you're taking on staff or paying yourself via PAYE.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Open a Business Bank Account</h2>
          <p className="text-gray-700">
            A limited company must have a separate business bank account. Even sole traders should keep business and personal finances separate. Most major banks and fintech providers offer free business accounts for the first 12–18 months. Choose one that integrates with your accounting software.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Set Up Accounting</h2>
          <p className="text-gray-700">
            Get your accounting software set up from day one — not at year end when it's too late to claim expenses you've forgotten about. <a href="https://www.xero.com/uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Xero</a> is a popular choice for UK small businesses, with automatic bank feeds, MTD-compliant VAT returns, and easy accountant access. Read our <Link href="/blog/best-accounting-software-uk-small-business-2026" className="text-blue-600 hover:underline">full comparison of UK accounting software</Link>.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Get Business Insurance</h2>
          <p className="text-gray-700">
            At minimum, you need employers' liability insurance if you hire anyone. Most businesses should also have public liability and professional indemnity cover. <a href="https://www.simplybusiness.co.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Simply Business</a> lets you compare tailored quotes in minutes. Read our <Link href="/blog/do-i-need-business-insurance-uk" className="text-blue-600 hover:underline">complete guide to business insurance</Link>.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Set Up Your Online Presence</h2>
          <p className="text-gray-700">
            Register a domain name, set up a basic website, and create a Google Business Profile. Even a simple one-page website establishes credibility. Make sure your company name, address, and contact details are consistent everywhere.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">8. Understand Your Ongoing Obligations</h2>
          <p className="text-gray-700">
            As a UK limited company, you must file annual accounts with Companies House (deadline: 9 months after your accounting year end), file a confirmation statement at least once a year, file a Corporation Tax return with HMRC (deadline: 12 months after your accounting period), keep your PSC register up to date, and maintain a registered office address.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9. Research Your Market</h2>
          <p className="text-gray-700">
            Before launching, research your competition. On <Link href="/" className="text-blue-600 hover:underline">UK Business Finder</Link> you can browse any industry in any region to see exactly how many active companies operate in your space, how old they are, their compliance status, and who controls them. This gives you a realistic picture of the competitive landscape.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Quick Checklist</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Choose business structure (limited company vs sole trader)</li>
            <li>Register company at Companies House</li>
            <li>Register for Corporation Tax / Self Assessment with HMRC</li>
            <li>Register for VAT if applicable</li>
            <li>Open business bank account</li>
            <li>Set up accounting software</li>
            <li>Get business insurance</li>
            <li>Register a domain and build a website</li>
            <li>Create a Google Business Profile</li>
            <li>Research competitors in your industry</li>
          </ul>

          <div className="flex flex-wrap gap-2 my-6">
            <a href="https://www.1stformations.co.uk" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Register Your Company →</a>
            <Link href="/" className="bg-white text-blue-600 border border-blue-600 text-sm px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors">Research Your Market</Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>Disclaimer:</strong> This guide is for general information only and does not constitute legal, tax, or financial advice. Some links in this article are affiliate links — we may earn a commission at no extra cost to you.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
