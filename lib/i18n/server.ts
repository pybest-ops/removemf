import { headers } from 'next/headers';
import { defaultLocale, isLocale, localeHeaderName, pathnameHeaderName } from './config';
import type { Locale } from './config';

// getRequestLocale 在服务端组件和 metadata 中读取当前页面语言。
export function getRequestLocale(): Locale {
  const locale = headers().get(localeHeaderName);

  return isLocale(locale) ? locale : defaultLocale;
}

// getRequestPathname 在服务端读取用户浏览器实际访问的路径。
export function getRequestPathname() {
  return headers().get(pathnameHeaderName) ?? '/';
}
