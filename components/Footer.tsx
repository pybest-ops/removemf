import Link from 'next/link';

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
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a className="flex w-[120px] justify-center" href="https://submito.net" target="_blank" rel="noopener noreferrer" title="Listed on Submito">
          <img className="w-full" src="https://submito.net/badge/listed-light.svg" alt="Listed on Submito" />
        </a>
        <a className="inline-flex w-[120px] justify-center text-center" href="https://aitop10.tools/" target="_blank" rel="noopener noreferrer">
          AiTop10 Tools
        </a>
      </div>
    </footer>
  );
}
