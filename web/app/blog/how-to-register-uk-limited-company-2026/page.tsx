import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Register a UK Limited Company in 2026 — Step by Step",
  description: "Everything you need to know about forming a UK limited company in 2026. Costs, requirements, documents, and the fastest way to get registered at Companies House.",
};

export default function Post() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>{" / "}
        <span className="text-gray-900">Register a UK Limited Company</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How to Register a UK Limited Company in 2026</h1>
        <p className="text-sm text-gray-500 mb-8">April 2026</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
          <p className="text-gray-700 text-base">
            Registering a UK limited company is straightforward and can be done in a single day. Whether you're starting a new business, setting up a property holding company, or formalising a freelance operation, here's exactly what's involved.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What You Need Before You Start</h2>
          <p className="text-gray-700">
            To register a UK limited company you need: a company name that isn't already taken, at least one director (who must be a real person aged 16+), at least one shareholder, a registered office address in the UK, a SIC code describing your business activity, and details of anyone with significant control (PSC) over the company.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Option 1: Register Directly with Companies House</h2>
          <p className="text-gray-700">
            You can register online at Companies House for a fee of £50 (or £30 for paper filing). The online process typically takes about 24 hours for approval. You'll need to prepare your own Memorandum and Articles of Association and complete all the forms yourself. This is the cheapest route but requires more effort.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Option 2: Use a Company Formation Agent</h2>
          <p className="text-gray-700">
            Formation agents handle the entire registration process for you, often with same-day incorporation. They typically provide ready-made Articles of Association, a registered office address service, and help with initial compliance. Prices start from around £13 plus the Companies House fee. This is the faster and easier route, especially if you want a registered office address that isn't your home.
          </p>
          <p className="text-gray-700">
            Agents like <a href="https://www.1stformations.co.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">1st Formations</a> have formed over a million UK companies and offer packages that include a London registered office, digital compliance tools, and mail forwarding. If speed and convenience matter, a formation agent is the practical choice.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Choosing Your Company Name</h2>
          <p className="text-gray-700">
            Your company name must be unique — no other company on the register can have the same or a confusingly similar name. You can check name availability for free on <Link href="/" className="text-blue-600 hover:underline">UK Business Finder</Link> by searching our database of 2.6 million active companies. Avoid names that imply government affiliation or require special permissions (like "Royal" or "British").
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Understanding SIC Codes</h2>
          <p className="text-gray-700">
            Every UK company must choose at least one SIC code — a five-digit number that describes its business activity. You can <Link href="/industries" className="text-blue-600 hover:underline">browse companies by industry</Link> on UK Business Finder to see which SIC codes are used in your sector. Common examples include 68100 (buying and selling own real estate), 62020 (IT consultancy), and 47910 (retail via mail order or internet).
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Happens After Registration</h2>
          <p className="text-gray-700">
            Once your company is incorporated, you'll receive a Certificate of Incorporation with your unique company number. You'll then need to open a business bank account, register for Corporation Tax with HMRC within three months, set up your accounting records, and consider whether you need to register for VAT (mandatory if turnover exceeds £90,000). You'll also need to file annual accounts and a confirmation statement each year.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Costs Summary</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Companies House registration fee: £50 (online)</li>
            <li>Formation agent fee: £13–£150 depending on package</li>
            <li>Registered office address: £30–£100/year (if using a service)</li>
            <li>Accounting software: £0–£50/month</li>
            <li>Business insurance: varies by activity</li>
          </ul>

          <div className="flex flex-wrap gap-2 my-6">
            <Link href="/" className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">Check Company Names</Link>
            <a href="https://www.1stformations.co.uk" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 border border-blue-600 text-sm px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors">Register a Company →</a>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-gray-700"><strong>Disclaimer:</strong> This guide is for general information only and does not constitute legal or financial advice. Costs are approximate and may vary. Some links in this article are affiliate links — we may earn a commission at no extra cost to you.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
