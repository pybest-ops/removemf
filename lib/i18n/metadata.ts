import type { Metadata } from 'next';
import { getAlternateLanguages, getCanonicalPath, siteUrl } from './config';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries';

// createI18nMetadata 统一生成各语言页面的 canonical、hreflang 和社交分享标签。
export function createI18nMetadata(locale: Locale, route: string, pageMetadata: Dictionary['metadata'][keyof Dictionary['metadata']]): Metadata {
  const canonicalPath = getCanonicalPath(route, locale);

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    alternates: {
      canonical: canonicalPath,
      languages: getAlternateLanguages(route)
    },
    openGraph: {
      title: pageMetadata.title,
      description: pageMetadata.description,
      url: canonicalPath,
      siteName: 'Remove Matcha Filter',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Remove Matcha Filter before and after preview'
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMetadata.title,
      description: pageMetadata.description,
      images: ['/og-image.png']
    },
    metadataBase: new URL(siteUrl)
  };
}
