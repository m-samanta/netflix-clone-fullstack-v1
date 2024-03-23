/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'rb.gy'],
  },
  transpilePackages: ['@stripe/firestore-stripe-payments'],
};

export default nextConfig;
