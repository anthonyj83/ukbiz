/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow very large number of static pages
  staticPageGenerationTimeout: 600,
  // Compress outputs
  compress: true,
  // Clean URLs
  trailingSlash: false,
  // Production optimisations
  poweredByHeader: false,
  // Generate sitemap-friendly structure
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
