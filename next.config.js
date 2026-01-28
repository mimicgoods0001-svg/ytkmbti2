/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 部署到 GitHub Pages 子目录配置
  basePath: '/ytkmbti2',
  assetPrefix: '/ytkmbti2',
}

module.exports = nextConfig
