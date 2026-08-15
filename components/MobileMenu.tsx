'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// MobileNavItem 描述移动端菜单中的单个导航入口。
type MobileNavItem = {
  href: string;
  label: string;
};

// MobileMenu 提供小屏下的菜单按钮和侧边栏导航。
export function MobileMenu({ items }: { items: MobileNavItem[] }) {
  // isOpen 控制移动端侧边栏是否展开。
  const [isOpen, setIsOpen] = useState(false);

  // isMounted 确保侧边栏只在浏览器端挂载到 body。
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // menuPanel 是点击菜单按钮后展示的全屏遮罩和右侧抽屉。
  const menuPanel = isOpen ? (
    <div className="fixed inset-0 z-[80] bg-slate-950/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <button className="absolute inset-0 h-full w-full cursor-default" onClick={() => setIsOpen(false)} type="button" aria-label="Close navigation menu" />
      <aside className="absolute right-0 top-0 flex h-full w-80 max-w-[86vw] flex-col bg-[#f7faf7] p-5 shadow-[-24px_0_70px_rgba(15,23,42,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-950">Menu</p>
          <button
            aria-label="Close navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-matcha-200 bg-white/80 text-xl leading-none text-slate-900 transition hover:bg-matcha-50"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            ×
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-2 text-base font-semibold text-slate-700">
          {items.map((item) => (
            <Link className="rounded-2xl border border-matcha-100 bg-white/60 px-4 py-3 transition hover:bg-matcha-50 hover:text-matcha-800" href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  ) : null;

  return (
    <div className="md:hidden">
      <button
        aria-expanded={isOpen}
        aria-label="Open navigation menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-matcha-200 bg-white/70 text-slate-900 shadow-sm transition hover:bg-matcha-50"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span className="sr-only">Open menu</span>
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {isMounted && menuPanel ? createPortal(menuPanel, document.body) : null}
    </div>
  );
}
