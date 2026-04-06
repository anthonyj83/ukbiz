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
    slug: "how-many-construction-companies-uk-2026",
    title: "How Many Construction Companies Are There in the UK in 2026?",
    excerpt: "A data-driven breakdown of the UK's 224,969 active construction companies by region, company age, and compliance status — sourced directly from Companies House.",
    date: "6 April 2026",
  },
  {
    slug: "uk-company-ownership-foreign-controlled",
    title: "Who Really Owns UK Companies? A Look at Foreign and Corporate Ownership",
    excerpt: "We analysed Persons with Significant Control data across 2.6 million UK companies to reveal patterns in foreign ownership, corporate control, and nationality breakdown.",
    date: "6 April 2026",
  },
  {
    slug: "uk-business-statistics-2026",
    title: "UK Business Statistics 2026: Key Numbers Every Business Owner Should Know",
    excerpt: "From the total number of active companies to overdue accounts and insolvency rates — the headline figures from our analysis of 2.6 million UK businesses.",
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
