import { BuyCreditsButton } from '@/components/BuyCreditsButton';
import { CaptureCheckout } from '@/components/CaptureCheckout';
import { PricingCreditsHeading } from '@/components/PricingCreditsHeading';
import { creditPacks, formatPackPrice } from '@/lib/pricing';

// PricingPage 展示无订阅积分包，并处理 PayPal 回跳后的订单捕获提示。
export default function PricingPage({ searchParams }: { searchParams?: { token?: string; checkout?: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <CaptureCheckout paypalOrderId={searchParams?.token} />

      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Credits</p>
        <PricingCreditsHeading />
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          No subscription. Browser cleanup preview is free, and each credit creates one AI Restore matcha filter removal. Unused credits stay in your account for 12 months.
        </p>
        {searchParams?.checkout === 'cancelled' ? <p className="mt-4 text-sm font-semibold text-amber-700">Checkout was cancelled. No credits were added.</p> : null}
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {creditPacks.map((pack) => (
          <article className="relative rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5" key={pack.id}>
            {pack.badge ? <span className="absolute right-6 top-6 rounded-full bg-matcha-100 px-3 py-1 text-xs font-semibold text-matcha-800">{pack.badge}</span> : null}
            <h2 className="text-2xl font-semibold text-slate-950">{pack.name}</h2>
            <p className="mt-3 text-4xl font-semibold text-matcha-700">{formatPackPrice(pack.priceCents)}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">{pack.credits} credits · 1 credit = 1 recovery</p>
            <p className="mt-4 leading-7 text-slate-600">{pack.description}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {pack.features.map((feature) => (
                <li className="flex gap-3" key={feature}>
                  <span className="mt-1 h-2 w-2 rounded-full bg-matcha-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <BuyCreditsButton packId={pack.id} />
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-matcha-50 p-6 ring-1 ring-matcha-100">
        <h2 className="text-xl font-semibold text-slate-950">Pricing guardrails</h2>
        <p className="mt-3 leading-7 text-slate-600">
          Credits pay for AI processing attempts, not a guarantee of recreating the untouched source file. Failed jobs that produce no result automatically return the used credit.
        </p>
      </section>
    </main>
  );
}
