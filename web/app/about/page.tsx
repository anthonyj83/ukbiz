import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About UK Business Finder",
  description:
    "About UK Business Finder — how we source our data, how often it's updated, and how to use the site.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="text-sm text-brand-600 hover:underline mb-6 block">
        ← Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About UK Business Finder</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What Is This?</h2>
          <p>
            UK Business Finder is a free company intelligence directory covering active UK businesses
            by industry and region. It is designed for business researchers, aspiring SME buyers,
            accountants, and anyone needing a quick overview of a sector in a specific area.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Source</h2>
          <p>
            All data is sourced from the{" "}
            <a
              href="https://www.gov.uk/government/organisations/companies-house"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              Companies House
            </a>{" "}
            bulk data download, available under the{" "}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              Open Government Licence v3.0
            </a>
            . We process the official BasicCompanyData file which is updated monthly by Companies
            House.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Frequency</h2>
          <p>
            Data is refreshed monthly, in line with the Companies House bulk data release schedule.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Affiliate Disclosure</h2>
          <p>
            Some links on this site are affiliate links. We may earn a commission if you click
            through and make a purchase. This never affects the company data displayed, which
            comes entirely from Companies House. Affiliate links are clearly marked with
            &quot;sponsored&quot; in the link attributes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accuracy & Limitations</h2>
          <p>
            Company data reflects registrations at Companies House. It does not constitute
            a recommendation or endorsement of any business. Always verify companies via the
            official{" "}
            <a
              href="https://find-and-update.company-information.service.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              Companies House search
            </a>
            {" "}before entering any commercial relationship.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            For data queries or removal requests, email:{" "}
            <a href="mailto:hello@ukbizfinder.co.uk" className="text-brand-600 hover:underline">
              hello@ukbizfinder.co.uk
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
