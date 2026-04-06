import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | UK Business Finder",
  description: "Terms of use for UK Business Finder (ukbizfinder.co.uk).",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <span className="text-gray-900">Terms of Use</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 2026</p>

      <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. About This Site</h2>
          <p className="text-gray-700">
            UK Business Finder (<strong>ukbizfinder.co.uk</strong>) is a free company information directory. By accessing or using this website, you agree to be bound by these terms. If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Data Source and Accuracy</h2>
          <p className="text-gray-700">
            All company information displayed on this site is sourced from Companies House bulk data products, published under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Government Licence v3.0</a>.
          </p>
          <p className="text-gray-700 mt-3">
            While we endeavour to keep the information accurate and up to date, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or suitability of the data. Company information may be outdated as data is updated periodically from Companies House snapshots. You should always verify information directly with <a href="https://find-and-update.company-information.service.gov.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Companies House</a> before making any decisions based on data from this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. No Professional Advice</h2>
          <p className="text-gray-700">
            The information on this site is provided for general informational purposes only. It does not constitute legal, financial, tax, or professional advice. You should consult appropriate professionals before making business decisions based on information found on this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Acceptable Use</h2>
          <p className="text-gray-700">
            You may use this site for lawful purposes only. You agree not to:
          </p>
          <p className="text-gray-700 mt-2">
            Use automated tools, scrapers, or bots to extract data from this site in bulk. Use the site to harass, stalk, or contact individuals listed in company records for unlawful purposes. Attempt to interfere with the operation or security of the site. Reproduce, redistribute, or republish substantial portions of the site's content or design without permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Intellectual Property</h2>
          <p className="text-gray-700">
            The underlying company data is Crown copyright, made available under the Open Government Licence. The website design, code, branding, and presentation of the data are the intellectual property of UK Business Finder. You may not copy, reproduce, or create derivative works of the site's design or presentation without permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Third-Party Links and Services</h2>
          <p className="text-gray-700">
            This site contains links to external websites including Companies House, affiliate partners, and advertisers. We are not responsible for the content, availability, or practices of external sites. Affiliate links may earn us a commission at no additional cost to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the fullest extent permitted by law, UK Business Finder shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or inability to use this site, or from any errors, omissions, or inaccuracies in the data presented.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">8. Availability</h2>
          <p className="text-gray-700">
            We do not guarantee that the site will be available at all times. We may modify, suspend, or discontinue the site at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9. Changes to These Terms</h2>
          <p className="text-gray-700">
            We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">10. Governing Law</h2>
          <p className="text-gray-700">
            These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">11. Contact</h2>
          <p className="text-gray-700">
            If you have any questions about these terms, please contact us at: <strong>info@ukbizfinder.co.uk</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
