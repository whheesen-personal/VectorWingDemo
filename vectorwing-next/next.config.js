/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || ''

const nextConfig = {
  output: 'export', // allows static export for GitHub Pages
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
}

module.exports = nextConfig


