/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api || !/^https?:\/\//.test(api)) return [];
    return [{ source: '/uploads/:path*', destination: `${new URL(api).origin}/uploads/:path*` }];
  },
  images: {
    // Allowed sources for next/image. CSS background-image URLs aren't
    // affected by this — they're fetched directly by the browser.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'assets.nflxext.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
    ],
  },
};

module.exports = nextConfig;
