/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
  env: {
    APP_NAME: 'OptiSuite: Smart Business Process Automation',
    APP_DESCRIPTION: 'A comprehensive platform for automating and optimizing business processes'
  }
}

export default nextConfig
