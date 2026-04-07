import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ukbizfinder.co.uk"),
  title: {
    default: "UK Business Finder | Company Intelligence Directory",
    template: "%s | UK Business Finder",
  },
  description:
    "Browse and research active UK companies by industry and region. Built from official Companies House data. Free company intelligence for business buyers, advisors, and researchers.",
  keywords: ["UK companies", "Companies House", "business directory", "UK business finder"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://ukbizfinder.co.uk",
    siteName: "UK Business Finder",
  },
  verification: { google: "_UDuQDdPde2Avy9_WPc4cIjEZoZ4ml71X_1orFaaDgA" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head><meta name='impact-site-verification' value='4219bcce-18ab-4b2f-9b3b-cc99931b2206' />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V0JQS54ND6"></script>
        <script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-V0JQS54ND6");`}} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2730052069594489" crossOrigin="anonymous" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center">
            <img src="/UKBFlogo.png" alt="UK Business Finder" className="h-10 w-auto" />
          </a>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="/search" className="hover:text-brand-600 transition-colors">Search</a>
            <a href="/industries" className="hover:text-brand-600 transition-colors">Industries</a>
            <a href="/regions" className="hover:text-brand-600 transition-colors">Regions</a>
            <a href="/blog" className="hover:text-brand-600 transition-colors">Blog</a>
            <a href="/about" className="hover:text-brand-600 transition-colors">About</a>
          </nav>
          {/* Mobile nav */}
          <nav className="flex md:hidden items-center gap-2 text-xs text-gray-600">
            <a href="/search" className="hover:text-brand-600 transition-colors">Search</a>
            <a href="/industries" className="hover:text-brand-600 transition-colors">Industries</a>
            <a href="/regions" className="hover:text-brand-600 transition-colors">Regions</a>
            <a href="/blog" className="hover:text-brand-600 transition-colors">Blog</a>
            <a href="/about" className="hover:text-brand-600 transition-colors">About</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-3">UK Business Finder</h3>
            <p className="text-sm leading-relaxed">
              Company intelligence built from official Companies House data.
              Updated monthly. Free to browse.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/industries" className="hover:text-white transition-colors">All Industries</a></li>
              <li><a href="/regions" className="hover:text-white transition-colors">All Regions</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About & Data Sources</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-xs text-center">
          <p>
            &copy; {currentYear} UK Business Finder. Data sourced from{" "}
            <a
              href="https://www.gov.uk/government/organisations/companies-house"
              className="underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Companies House
            </a>{" "}
            under the{" "}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              className="underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Government Licence v3.0
            </a>
            . Some links on this site are affiliate links.
          </p>
        </div>
      </div>
    </footer>
  );
}
