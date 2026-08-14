import { BuyCreditsButton } from '@/components/BuyCreditsButton';
import { CaptureCheckout } from '@/components/CaptureCheckout';
import { Footer } from '@/components/Footer';
import { PricingCreditsHeading } from '@/components/PricingCreditsHeading';
import { creditPacks, formatPackPrice } from '@/lib/pricing';
import type { Metadata } from 'next';

// metadata 声明价格页的规范地址，避免套餐页面被识别为重复内容。
export const metadata: Metadata = {
  alternates: {
    canonical: '/pricing'
  }
};

// trustItems 汇总购买前最重要的确定性信息。
const trustItems = ['No subscription', 'Credits valid 12 months', 'Failed jobs return credit'];

// packUseCases 用于让三个套餐的适用场景一眼可区分。
const packUseCases = {
  try_499_8: 'Best for testing a few photos',
  popular_1499_45: 'Best for small photo sets',
  pro_3999_160: 'Best for larger batches'
};

// pricingFaqs 回答用户购买 credits 前的关键疑问。
const pricingFaqs = [
  {
    question: 'Do I need a subscription?',
    answer: 'No. Buy credits only when you need AI Restore. There is no monthly plan or automatic renewal.'
  },
  {
    question: 'What does 1 credit do?',
    answer: '1 credit creates 1 AI Restore for one uploaded photo. Free preview does not use credits.'
  },
  {
    question: 'Is Free preview included?',
    answer: 'Yes. Free preview runs in your browser. AI Restore uploads the selected image for stronger processing and uses credits.'
  },
  {
    question: 'Do credits expire?',
    answer: 'Purchased credits are valid for 12 months from purchase.'
  },
  {
    question: 'What happens if a job fails?',
    answer: 'If a service failure produces no result, the used credit is returned automatically.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'Unused credit packs may be reviewed within 7 days of purchase. Used credits are not refundable because processing costs can be incurred immediately.'
  }
];

// PricingPage 展示无订阅积分包，并处理 PayPal 回跳后的订单捕获提示。
export default function PricingPage({ searchParams }: { searchParams?: { token?: string; checkout?: string } }) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-matcha-200/45 blur-3xl animate-glow-drift" />
      <div className="pointer-events-none absolute right-[-9rem] top-48 -z-10 h-96 w-96 rounded-full bg-amber-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-[-10rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <CaptureCheckout paypalOrderId={searchParams?.token} />

        <section className="rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-10 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">Premium credits</p>
            <PricingCreditsHeading />
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Free preview is included. Pay only when you need AI Restore for stronger matcha filter removal, with credits that stay valid for 12 months.
            </p>
            {searchParams?.checkout === 'cancelled' ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/85 px-4 py-3 text-sm font-semibold text-amber-800 shadow-sm backdrop-blur">Checkout was cancelled. No credits were added.</p> : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:mt-0">
            {trustItems.map((item) => (
              <div className="rounded-3xl border border-white/80 bg-white/70 p-4 text-sm font-semibold text-slate-700 shadow-[0_18px_50px_rgba(31,82,44,0.10)] backdrop-blur" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3 md:items-stretch">
          {creditPacks.map((pack) => {
            const isRecommended = Boolean(pack.badge);
            const pricePerRestore = `$${(pack.priceCents / 100 / pack.credits).toFixed(2)}`;

            return (
              <article className={`relative flex flex-col rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1 ${isRecommended ? 'overflow-hidden border border-matcha-300/60 bg-gradient-to-br from-slate-950 via-matcha-900 to-emerald-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.30)]' : 'border border-white/80 bg-white/72 text-slate-950 shadow-[0_20px_65px_rgba(31,82,44,0.12)] backdrop-blur-xl'}`} key={pack.id}>
                {isRecommended ? <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-matcha-300/25 blur-3xl" /> : null}
                {pack.badge ? <span className="relative mb-5 w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-matcha-100 shadow-sm backdrop-blur">{pack.badge}</span> : null}
                <h2 className={`relative text-2xl font-semibold ${isRecommended ? 'text-white' : 'text-slate-950'}`}>{pack.name}</h2>
                <p className={`relative mt-2 text-sm font-semibold ${isRecommended ? 'text-matcha-100' : 'text-matcha-800'}`}>{packUseCases[pack.id]}</p>
                <p className={`relative mt-3 text-5xl font-semibold tracking-[-0.05em] ${isRecommended ? 'text-white' : 'text-matcha-700'}`}>{formatPackPrice(pack.priceCents)}</p>
                <p className={`relative mt-2 text-sm font-semibold ${isRecommended ? 'text-matcha-100' : 'text-matcha-800'}`}>{pricePerRestore} / AI Restore</p>
                <p className={`relative mt-2 text-sm font-medium ${isRecommended ? 'text-slate-300' : 'text-slate-500'}`}>{pack.credits} credits · 1 credit = 1 AI Restore</p>
                <p className={`relative mt-5 leading-7 ${isRecommended ? 'text-slate-300' : 'text-slate-600'}`}>{pack.description}</p>
                <ul className={`relative mt-6 flex-1 space-y-3 text-sm ${isRecommended ? 'text-slate-200' : 'text-slate-600'}`}>
                  {pack.features.map((feature) => (
                    <li className="flex gap-3" key={feature}>
                      <span className={`mt-1 h-2 w-2 rounded-full ${isRecommended ? 'bg-matcha-300' : 'bg-matcha-600'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <BuyCreditsButton packId={pack.id} />
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Pricing FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">Questions before you buy credits.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">Short answers for credits, Free preview, AI Restore, expiry, failed jobs, and refunds.</p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {pricingFaqs.map((faq) => (
              <article className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(31,82,44,0.08)] backdrop-blur" key={faq.question}>
                <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-8 overflow-hidden rounded-[2.5rem] bg-slate-950 p-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(143,217,154,0.26),transparent_32%),radial-gradient(circle_at_90%_55%,rgba(255,255,255,0.10),transparent_30%)]" />
          <div className="relative grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Pricing guardrails</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Credits buy AI Restore processing.</h2>
            </div>
            <p className="leading-7 text-slate-300">
              AI Restore can reduce green or yellow cast, but it cannot guarantee exact original reconstruction. If a service failure produces no result, the used credit is returned automatically.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
