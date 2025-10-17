/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 禁用React严格模式
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_USE_MOCK_DATA: 'true',
  },
}

export default nextConfig
