/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  staticPageGenerationTimeout: 600,
  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
};
module.exports = nextConfig;
