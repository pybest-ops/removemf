import type { MetadataRoute } from 'next';

// siteUrl 是生产环境公开域名，用于生成 sitemap 中的绝对 URL。
const siteUrl = 'https://removematchafilter.org';

// sitemapRoutes 定义允许搜索引擎收录的公开静态页面。
const sitemapRoutes = ['/', '/pricing', '/faq', '/privacy', '/terms', '/refund', '/matcha-filter-remover', '/blog', '/what-is-matcha-filter', '/how-to-remove-matcha-filter'];

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: new Date()
  }));
}
