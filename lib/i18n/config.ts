// locales 定义站点当前支持的语言代码，英文使用根路径作为默认语言。
export const locales = ['en', 'fil', 'id'] as const;

export type Locale = (typeof locales)[number];

// defaultLocale 表示无语言前缀时使用的站点默认语言。
export const defaultLocale: Locale = 'en';

// localeLabels 定义语言切换器中展示给用户的语种名称。
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fil: 'Filipino',
  id: 'Bahasa Indonesia'
};

// localeHreflangs 定义 SEO alternate links 使用的区域化语言标识。
export const localeHreflangs: Record<Locale, string> = {
  en: 'en',
  fil: 'fil-PH',
  id: 'id-ID'
};

// localeHtmlLangs 定义 html lang 属性使用的语言标识。
export const localeHtmlLangs: Record<Locale, string> = {
  en: 'en',
  fil: 'fil-PH',
  id: 'id-ID'
};

// siteUrl 是生产环境公开域名，用于 canonical、hreflang 和 sitemap。
export const siteUrl = 'https://removematchafilter.org';

// localeHeaderName 是 middleware 传给服务端组件的当前语言标识。
export const localeHeaderName = 'x-matcha-locale';

// pathnameHeaderName 是 middleware 传给服务端组件的原始访问路径。
export const pathnameHeaderName = 'x-matcha-pathname';

// isLocale 判断任意字符串是否为当前支持的语言代码。
export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && (locales as readonly string[]).includes(value));
}

// getLocaleFromPathname 从浏览器路径中读取语言前缀，未命中时返回英文。
export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];

  return isLocale(segment) ? segment : defaultLocale;
}

// stripLocaleFromPathname 移除路径中的语言前缀，得到现有页面路由。
export function stripLocaleFromPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (isLocale(segments[0]) || segments[0] === 'en') segments.shift();

  return segments.length ? `/${segments.join('/')}` : '/';
}

// localizePath 根据目标语言生成对应路径，英文不添加语言前缀。
export function localizePath(pathname: string, locale: Locale) {
  const cleanPath = stripLocaleFromPathname(pathname);

  if (locale === defaultLocale) return cleanPath;

  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
}

// getCanonicalPath 根据当前语言和基础路由生成 canonical 使用的路径。
export function getCanonicalPath(route: string, locale: Locale) {
  return localizePath(route, locale);
}

// getAlternateLanguages 为页面 metadata 生成所有语言版本和 x-default 地址。
export function getAlternateLanguages(route: string) {
  return {
    en: new URL(localizePath(route, 'en'), siteUrl).toString(),
    'fil-PH': new URL(localizePath(route, 'fil'), siteUrl).toString(),
    'id-ID': new URL(localizePath(route, 'id'), siteUrl).toString(),
    'x-default': new URL(localizePath(route, 'en'), siteUrl).toString()
  };
}
