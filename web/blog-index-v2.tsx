import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | UK Business Finder",
  description: "Insights, statistics, and analysis on UK businesses across all industries and regions. Data-driven articles from Companies House data.",
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

const posts: BlogPost[] = [
  {
    slug: "uk-ecommerce-companies-2026",
    title: "UK E-commerce Companies — How Many Are There in 2026?",
    excerpt: "The UK has over 192,000 active e-commerce and online retail companies. We analyse the sector by region, growth trends, and ownership patterns.",
    date: "7 April 2026",
  },
  {
    slug: "how-many-beauty-businesses-uk-2026",
    title: "How Many Beauty Businesses Are in the UK in 2026?",
    excerpt: "The UK has over 70,000 active beauty and personal care companies. We explore the boom in beauty entrepreneurship and break down the numbers by region.",
    date: "7 April 2026",
  },
  {
    slug: "how-many-healthcare-companies-uk-2026",
    title: "How Many Healthcare Companies Are in the UK in 2026?",
    excerpt: "The UK's private healthcare sector has over 125,000 active companies. A regional breakdown with compliance data and growth trends.",
    date: "7 April 2026",
  },
  {
    slug: "uk-business-hotspots-regions-2026",
    title: "UK Business Hotspots — Which Regions Have the Most Companies?",
    excerpt: "A regional breakdown of the UK's 2.6 million active companies. Where are businesses concentrated and what industries dominate each region?",
    date: "7 April 2026",
  },
  {
    slug: "most-common-business-types-uk-2026",
    title: "Most Common Business Types in the UK 2026",
    excerpt: "What are the most popular industries for UK companies? We rank the top 20 sectors by active company count using official data.",
    date: "7 April 2026",
  },
  {
    slug: "how-to-check-uk-company-legitimate",
    title: "How to Check If a UK Company Is Legitimate in 2026",
    excerpt: "A step-by-step guide to verifying UK companies using free tools and public data. Check registration, accounts, directors, charges and more.",
    date: "7 April 2026",
  },
  {
    slug: "uk-companies-overdue-accounts-explained",
    title: "UK Companies with Overdue Accounts — What Does It Mean?",
    excerpt: "What happens when a company has overdue accounts at Companies House? We explain the flags, the consequences, and how to use this data.",
    date: "7 April 2026",
  },
  {
    slug: "how-many-property-companies-london-2026",
    title: "How Many Property Companies Are in London in 2026?",
    excerpt: "London has over 99,000 active property companies — more than any other industry/region combination in the UK. We explore why.",
    date: "7 April 2026",
  },
  {
    slug: "how-many-it-companies-uk-2026",
    title: "How Many IT Companies Are in the UK in 2026?",
    excerpt: "Over 275,000 active IT companies across consulting, software, and services. A breakdown by sub-sector, region, and ownership.",
    date: "7 April 2026",
  },
  {
    slug: "how-many-restaurants-uk-2026",
    title: "How Many Restaurants Are There in the UK in 2026?",
    excerpt: "A data-driven breakdown of the UK's 97,000+ active restaurant and food service companies by region, with ownership and compliance data.",
    date: "7 April 2026",
  },
  {
    slug: "how-many-construction-companies-uk-2026",
    title: "How Many Construction Companies Are There in the UK in 2026?",
    excerpt: "A data-driven breakdown of the UK's 224,969 active construction companies by region, company age, and compliance status.",
    date: "6 April 2026",
  },
  {
    slug: "uk-company-ownership-foreign-controlled",
    title: "Who Really Owns UK Companies? A Look at Foreign and Corporate Ownership",
    excerpt: "We analysed PSC data across 2.6 million UK companies to reveal patterns in foreign ownership, corporate control, and nationality.",
    date: "6 April 2026",
  },
  {
    slug: "uk-business-statistics-2026",
    title: "UK Business Statistics 2026: Key Numbers Every Business Owner Should Know",
    excerpt: "From the total number of active companies to overdue accounts and insolvency rates — the headline figures from 2.6 million UK businesses.",
    date: "6 April 2026",
  },
];

export default function BlogIndex() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>{" / "}
        <span className="text-gray-900">Blog</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Blog</h1>
      <p className="text-gray-600 mb-10">Data-driven insights on UK businesses, sourced from Companies House.</p>

      <div className="space-y-8">
        {posts.map(post => (
          <article key={post.slug} className="border-b border-gray-100 pb-8">
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{post.date}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
