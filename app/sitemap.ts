import type { MetadataRoute } from 'next';
import { locales, localizePath, siteUrl } from '@/lib/i18n/config';

// sitemapRoutes 定义允许搜索引擎收录的公开静态页面。
const sitemapRoutes = ['/', '/pricing', '/faq', '/privacy', '/terms', '/refund', '/matcha-filter-remover', '/blog', '/what-is-matcha-filter', '/how-to-remove-matcha-filter'];

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.flatMap((route) => locales.map((locale) => ({
    url: new URL(localizePath(route, locale), siteUrl).toString(),
    lastModified: new Date()
  })));
}
