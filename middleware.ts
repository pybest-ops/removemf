import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, getLocaleFromPathname, isLocale, localeHeaderName, pathnameHeaderName, stripLocaleFromPathname } from '@/lib/i18n/config';

// PUBLIC_FILE_PATTERN 匹配不应参与语言 rewrite 的静态资源请求。
const PUBLIC_FILE_PATTERN = /\.[^/]+$/;

// middleware 为语言前缀路径复用现有页面路由，并把当前语言传给服务端组件。
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipI18n(pathname)) return NextResponse.next();

  const firstSegment = pathname.split('/').filter(Boolean)[0];

  if (firstSegment === 'en') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = stripLocaleFromPathname(pathname);

    return NextResponse.redirect(redirectUrl, 301);
  }

  const requestHeaders = new Headers(request.headers);
  const locale = getLocaleFromPathname(pathname);
  requestHeaders.set(localeHeaderName, locale);
  requestHeaders.set(pathnameHeaderName, pathname);

  if (isLocale(firstSegment) && firstSegment !== defaultLocale) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = stripLocaleFromPathname(pathname);

    return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// shouldSkipI18n 判断当前请求是否属于 API、Next 内部资源或静态文件。
function shouldSkipI18n(pathname: string) {
  return pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/robots.txt' || pathname === '/sitemap.xml' || PUBLIC_FILE_PATTERN.test(pathname);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
