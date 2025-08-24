/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Ensure TypeScript compilation works during build
  typescript: {
    // During build, we might have some type errors that we can ignore
    ignoreBuildErrors: false,
  },
  // Ensure ESLint doesn't block the build
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Experimental features
  experimental: {
    // Enable server components
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig
