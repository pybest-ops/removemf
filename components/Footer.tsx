'use client';

import Link from 'next/link';
import { localizePath } from '@/lib/i18n/config';
import { useI18n } from './i18n/I18nProvider';

const partnerBadgeClassName = 'flex h-[40px] shrink-0 items-center justify-center';

// partnerBadges 定义页脚合作徽章，供循环滚动轨道重复渲染。
const partnerBadges = [
  {
    href: 'https://submito.net',
    title: 'Listed on Submito',
    img: <img className="h-full w-auto object-contain" src="https://submito.net/badge/listed-light.svg" alt="Listed on Submito" />
  },
  {
    href: 'https://launchpadly.co/startup/remove-matcha-filter?ref=badge',
    title: 'Launchpadly Startup Directory',
    img: <img src="https://launchpadly.co/embed/badges/startup/remove-matcha-filter.svg?variant=light" alt="Launchpadly Startup Directory" width="220" height="48" style={{ display: 'block', border: 0, height: '100%', width: 'auto' }} />,
    badgeProps: {
      'data-launchpadly-badge': 'remove-matcha-filter',
      'data-launchpadly-badge-variant': 'light'
    }
  },
  {
    href: 'https://postyourstartup.co/startup/remove-matcha-filter?ref=badge',
    title: 'Featured on PostYourStartup',
    img: <img className="h-full w-auto object-contain" src="https://postyourstartup.co/api/badge/remove-matcha-filter?theme=light" alt="Featured on PostYourStartup" width="212" height="55" />
  },
  {
    href: 'https://smollist.com/projects/remove-matcha-filter-ai?utm_source=badge',
    title: 'Featured on Smol List',
    img: <img src="https://r2.direasy-multi-tenant.focusapps.app/uploads/616d0b1a-3979-4b8c-94d1-fedd3ead/1783046749147/q1b2bvmvyl/featured-on-light.svg" alt="Featured on Smol List" style={{ height: '100%', width: 'auto' }} />
  },
  {
    href: 'https://findly.tools/remove-matcha-filter?utm_source=remove-matcha-filter',
    title: 'Featured on Findly.tools',
    img: <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on Findly.tools" width="175" height="55" />
  },
  {
    href: 'https://saastool.site/item/remove-matcha-filter',
    title: 'Featured on SaaSTool.site',
    img: <img src="https://saastool.site/badges/saastool-light.svg" alt="Featured on SaaSTool.site" height="54" width="175" />
  },
  {
    href: 'https://aitop10.tools/',
    title: 'AiTop10 Tools',
    img: 'AiTop10 Tools'
  }
] as const;

// Footer 提供全站必须保留的合规入口、Tools 菜单和联系邮箱。
export function Footer() {
  const { dictionary, locale } = useI18n();
  const footerCopy = dictionary.common.footer;

  return (
    <footer className="flex flex-col gap-6 border-t border-matcha-200/70 py-8 text-sm text-slate-500">
      {/* 导航区域：Tools 菜单 + Legal 菜单 + 联系方式 */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-12">
        {/* Tools 菜单分组 */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">{footerCopy.tools}</p>
          <div className="flex flex-col gap-1.5">
            <Link className="transition hover:text-matcha-800" href={localizePath('/tiktok-remove-matcha-filter', locale)}>
              {footerCopy.tiktok}
            </Link>
            <Link className="transition hover:text-matcha-800" href={localizePath('/youtube-remove-matcha-filter', locale)}>
              {footerCopy.youtube}
            </Link>
          </div>
        </div>

        {/* Legal 菜单分组 */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">{footerCopy.legal}</p>
          <div className="flex flex-col gap-1.5">
            <Link className="transition hover:text-matcha-800" href={localizePath('/privacy', locale)}>
              {footerCopy.privacy}
            </Link>
            <Link className="transition hover:text-matcha-800" href={localizePath('/terms', locale)}>
              {footerCopy.terms}
            </Link>
            <Link className="transition hover:text-matcha-800" href={localizePath('/refund', locale)}>
              {footerCopy.refund}
            </Link>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="flex flex-col gap-2 md:ml-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">{footerCopy.contact.replace(':', '')}</p>
          <a className="leading-6 transition hover:text-matcha-800" href="mailto:support@removematchafilter.org">
            support@removematchafilter.org
          </a>
        </div>
      </div>

      {/* 品牌名 */}
      <p>{footerCopy.brand}</p>

      {/* 合作徽章滚动 */}
      <div className="overflow-hidden">
        <div className="flex w-max flex-nowrap items-center justify-start gap-3 whitespace-nowrap animate-partner-marquee">
          <div className="flex flex-nowrap items-center gap-3">
            {partnerBadges.map((badge) => (
              <a
                className={partnerBadgeClassName}
                href={badge.href}
                key={badge.href}
                rel="noopener noreferrer"
                target="_blank"
                title={badge.title}
                {...('badgeProps' in badge ? badge.badgeProps : {})}
              >
                {typeof badge.img === 'string' ? badge.img : badge.img}
              </a>
            ))}
          </div>
          <div className="pointer-events-none flex flex-nowrap items-center gap-3" aria-hidden="true">
            {partnerBadges.map((badge) => (
              <a
                className={partnerBadgeClassName}
                href={badge.href}
                key={`${badge.href}-clone`}
                rel="noopener noreferrer"
                tabIndex={-1}
                target="_blank"
                title={badge.title}
                {...('badgeProps' in badge ? badge.badgeProps : {})}
              >
                {typeof badge.img === 'string' ? badge.img : badge.img}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
