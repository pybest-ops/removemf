import Link from 'next/link';

// Footer 提供全站必须保留的合规入口和联系邮箱。
export function Footer() {
  return (
    <footer className="flex flex-col gap-4 border-t border-matcha-200/70 py-8 text-sm text-slate-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>Remove Matcha Filter · AI natural photo recovery</p>
        <nav className="flex items-center gap-5">
          <Link className="transition hover:text-matcha-800" href="/privacy">Privacy</Link>
          <Link className="transition hover:text-matcha-800" href="/terms">Terms</Link>
          <Link className="transition hover:text-matcha-800" href="/refund">Refund</Link>
          <a className="border-l border-matcha-200 pl-5 transition hover:text-matcha-800" href="mailto:support@removematchafilter.org">Contact: support@removematchafilter.org</a>
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
