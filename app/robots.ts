import type { MetadataRoute } from 'next';

// siteUrl 是生产环境公开域名，用于声明 sitemap 的绝对地址。
const siteUrl = 'https://removematchafilter.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/result/']
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
