import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | UK Business Finder",
  description: "Privacy policy for UK Business Finder (ukbizfinder.co.uk).",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <span className="text-gray-900">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 2026</p>

      <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Who We Are</h2>
          <p className="text-gray-700">
            UK Business Finder (<strong>ukbizfinder.co.uk</strong>) is a free company information directory that displays publicly available data sourced from Companies House under the Open Government Licence v3.0. We are based in the United Kingdom.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. What Data We Collect</h2>
          <p className="text-gray-700">
            We do not require you to create an account or provide any personal information to use this site. We do not collect names, email addresses, or payment details from visitors.
          </p>
          <p className="text-gray-700 mt-3">
            When you visit our site, the following data may be collected automatically through standard web technologies:
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Server logs:</strong> Your IP address, browser type, device type, referring page, and pages visited. This data is collected by our hosting provider (Vercel) for security and performance purposes and is retained in accordance with their privacy policy.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Analytics:</strong> We may use Google Analytics or similar services to understand how visitors use the site. This collects anonymised data about page views, session duration, and general location (country/region level). No personally identifiable information is collected through analytics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Cookies</h2>
          <p className="text-gray-700">
            We may use cookies or similar technologies for analytics and advertising purposes. Third-party services such as Google AdSense and Google Analytics may set their own cookies. You can manage cookie preferences through your browser settings. For more information on how Google uses data, visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's partner sites policy</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Company Data</h2>
          <p className="text-gray-700">
            The company information displayed on this site (company names, registration numbers, registered addresses, officer details, and filing information) is public record data sourced from Companies House. This data is published under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Government Licence v3.0</a> and is freely available to the public.
          </p>
          <p className="text-gray-700 mt-3">
            If you are a director or person with significant control of a company listed on this site and have concerns about the information displayed, please note that the data originates from Companies House. To update or correct company information, you should contact <a href="https://www.gov.uk/government/organisations/companies-house" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Companies House</a> directly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Advertising</h2>
          <p className="text-gray-700">
            We may display advertisements on this site through Google AdSense or other advertising networks. These services may use cookies and similar technologies to serve ads based on your prior visits to this or other websites. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ad Settings</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Third-Party Links</h2>
          <p className="text-gray-700">
            This site contains links to external websites, including Companies House and affiliate partners. We are not responsible for the privacy practices or content of external sites. We encourage you to review the privacy policies of any external site you visit.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Your Rights</h2>
          <p className="text-gray-700">
            Under UK data protection law (UK GDPR), you have the right to request access to, correction of, or deletion of any personal data we hold about you. As we do not collect personal data from visitors beyond standard server logs, there is typically no personal data to provide. If you have any questions, please contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">8. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9. Contact</h2>
          <p className="text-gray-700">
            If you have any questions about this privacy policy, please contact us at: <strong>info@ukbizfinder.co.uk</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
