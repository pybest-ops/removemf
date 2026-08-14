import './globals.css';
import { AuthButton } from '@/components/AuthButton';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';
import favicon from './assets/favicon.ico';
import logo from './assets/logo.png';

export const metadata: Metadata = {
  title: 'Remove Matcha Filter from Photos Online',
  description: 'Remove matcha filter, green tint, yellow cast, or color cast from a photo online with free browser preview and AI Restore.',
  icons: {
    icon: favicon.src
  }
};

// navItems 定义全站顶部导航的核心入口。
const navItems = [
  { href: '/upload', label: 'Upload' },
  { href: '/pricing', label: 'Credits' },
  { href: '/faq', label: 'FAQ' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script async src="https://plausible.shipsolo.io/js/pa-c21ox6m4U_fyLAfTELQbE.js" />
        <Script id="plausible-init" strategy="afterInteractive">{`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};\n  plausible.init()`}</Script>
        <Script id="clarity" strategy="afterInteractive" type="text/javascript">{`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "y1rc6msx2v");`}</Script>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

// SiteHeader 提供全站品牌识别、主要页面导航和上传转化入口。
function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-matcha-100/80 bg-[#f7faf7]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-4">
        <Link className="flex items-center gap-3" href="/">
          <Image alt="Remove Matcha Filter logo" className="h-10 w-10 rounded-2xl object-cover" height={40} src={logo} width={40} />
          <span>
            <span className="block text-sm font-semibold leading-5 text-slate-950">Remove Matcha Filter</span>
            <span className="hidden text-xs text-slate-500 sm:block">AI natural photo recovery</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link className="transition hover:text-matcha-700" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
