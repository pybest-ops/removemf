import Link from 'next/link';

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
    img: <img src="https://r2.direasy-multi-tenant.focusapps.app/uploads/616d0b1a-3979-4b8c-94d1-b4f1fedd3ead/1783046749147/q1b2bvmvyl/featured-on-light.svg" alt="Featured on Smol List" style={{ height: '100%', width: 'auto' }} />
  },
  {
    href: 'https://findly.tools/remove-matcha-filter?utm_source=remove-matcha-filter',
    title: 'Featured on Findly.tools',
    img: <img className="h-full w-auto object-contain" src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on Findly.tools" width="175" height="55" />
  },
  {
    href: 'https://saastool.site/item/remove-matcha-filter',
    title: 'Featured on SaaSTool.site',
    img: <img className="h-full w-auto object-contain" src="https://saastool.site/badges/saastool-light.svg" alt="Featured on SaaSTool.site" height="54" width="175" />
  },
  {
    href: 'https://aitop10.tools/',
    title: 'AiTop10 Tools',
    img: 'AiTop10 Tools'
  }
] as const;

// Footer 提供全站必须保留的合规入口和联系邮箱。
export function Footer() {
  return (
    <footer className="flex flex-col gap-4 border-t border-matcha-200/70 py-8 text-sm text-slate-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>Remove Matcha Filter · AI natural photo recovery</p>
        <nav className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link className="transition hover:text-matcha-800" href="/privacy">Privacy</Link>
            <Link className="transition hover:text-matcha-800" href="/terms">Terms</Link>
            <Link className="transition hover:text-matcha-800" href="/refund">Refund</Link>
          </div>
          <a className="w-full border-t border-matcha-200 pt-3 leading-6 transition hover:text-matcha-800 md:w-auto md:border-l md:border-t-0 md:pl-5 md:pt-0" href="mailto:support@removematchafilter.org">
            <span className="mr-1">Contact:</span>
            <span className="break-all">support@removematchafilter.org</span>
          </a>
        </nav>
      </div>
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
