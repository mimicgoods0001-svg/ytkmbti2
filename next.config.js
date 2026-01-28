/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果部署到 GitHub Pages 子目录，取消下面的注释并设置正确的路径
  // basePath: '/ytkMBTI',
  // assetPrefix: '/ytkMBTI',
}

module.exports = nextConfig
