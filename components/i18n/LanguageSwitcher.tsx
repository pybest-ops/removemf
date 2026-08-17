'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getLocaleFromPathname, localeLabels, locales, localizePath } from '@/lib/i18n/config';
import { useI18n } from './I18nProvider';

// localeShortLabels 定义语言下拉列表中展示的短标签。
const localeShortLabels = {
  en: 'EN',
  fil: 'FIL',
  id: 'ID'
} as const;

// LanguageSwitcher 在登录按钮左侧提供当前路由内的语言切换入口。
export function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const activeLocale = getLocaleFromPathname(pathname);
  const { dictionary } = useI18n();
  // isOpen 控制点击地球图标后语言菜单的展开状态。
  const [isOpen, setIsOpen] = useState(false);
  // switcherRef 用于判断外部点击，从而关闭语言菜单。
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // handlePointerDown 在点击组件外部时关闭已展开的语言菜单。
    const handlePointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // handleKeyDown 允许用户通过 Escape 关闭语言菜单。
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={switcherRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={dictionary.common.language.button}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-sm font-semibold text-matcha-800 shadow-sm backdrop-blur transition hover:bg-white"
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        type="button"
      >
        <span aria-hidden="true" className="text-xl">🌐</span>
      </button>
      <div className="absolute right-0 top-full z-[90] mt-2 w-24 space-y-1 rounded-2xl border border-matcha-100 bg-white p-2 shadow-[0_22px_65px_rgba(15,23,42,0.16)]" role="menu" aria-label={dictionary.common.language.menu} style={{ opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden' }}>
        {locales.map((locale) => {
          const isActive = locale === activeLocale;
          // 切换语言后整页跳转，确保多语言字典重新加载生效
          const targetHref = localizePath(pathname, locale);

          return (
            <Link
              aria-label={localeLabels[locale]}
              className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-matcha-50 text-matcha-900' : 'text-slate-600 hover:bg-matcha-50 hover:text-matcha-800'}`}
              href={targetHref}
              key={locale}
              onClick={(event) => {
                event.preventDefault();
                setIsOpen(false);
                window.location.href = targetHref;
              }}
              role="menuitem"
            >
              {localeShortLabels[locale]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
