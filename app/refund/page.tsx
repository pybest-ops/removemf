import { Footer } from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 声明退款政策页的规范地址，避免法律页面被识别为重复内容。
export const metadata: Metadata = {
  alternates: {
    canonical: '/refund'
  }
};

// refundMatrix 用于直观区分 credits 在不同状态下的退款或返还规则。
const refundMatrix = [
  {
    status: 'Unused credits',
    outcome: 'Eligible for review',
    body: 'A paid credit pack may be reviewed within 7 days of purchase when none of the credits from that pack have been used.'
  },
  {
    status: 'Used credits',
    outcome: 'Not refundable',
    body: 'Once a credit is used for AI Restore, model and infrastructure costs can be incurred immediately.'
  },
  {
    status: 'Failed jobs',
    outcome: 'Credit returned',
    body: 'If a service failure produces no result, the used credit is returned automatically as the default remedy.'
  }
];

// refundSections 描述 credits 模式下购买、使用、失败和联系审核的边界。
const refundSections = [
  {
    title: '1. Paid credit packs',
    body: 'Remove Matcha Filter sells prepaid credit packs through PayPal Checkout. There is no subscription. Free preview is included, and AI Restore uses paid credits.'
  },
  {
    title: '2. Unused credits',
    body: 'A paid credit pack may be eligible for refund review within 7 days of purchase only when none of the credits from that pack have been used.'
  },
  {
    title: '3. Used credits',
    body: 'Used credits are not refundable because AI Restore can incur model and infrastructure costs as soon as processing starts.'
  },
  {
    title: '4. Failed jobs',
    body: 'If a service error produces no result, the used credit is returned automatically. This credit return is the default remedy for failed processing.'
  },
  {
    title: '5. Output expectations',
    body: 'A result that looks different from the original is not automatically a failed job. AI Restore aims for a more balanced, natural-looking image and does not guarantee the exact original pixels.'
  },
  {
    title: '6. Contact and review',
    body: 'Refund requests require the PayPal order information and the Google email used for purchase. Contact support@removematchafilter.org for review.'
  }
];

// relatedLinks 帮助用户在退款页继续查看购买、隐私和使用条款。
const relatedLinks = [
  { href: '/pricing', label: 'View pricing' },
  { href: '/terms', label: 'Read Terms' },
  { href: '/privacy', label: 'Privacy Policy' }
];

// RefundPage 展示 Premium Legal Hub 风格的退款政策。
export default function RefundPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-matcha-200/45 blur-3xl animate-glow-drift" />
      <div className="pointer-events-none absolute right-[-9rem] top-48 -z-10 h-96 w-96 rounded-full bg-amber-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-[-10rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8 lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-10 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">Legal hub</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 md:text-6xl">
              Refund rules for credits and AI Restore.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              See how unused credits, used credits, failed jobs, and result expectations are handled before you buy a credit pack.
            </p>
          </div>
          <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Refund summary</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Free preview first, credits for AI Restore.</p>
            <p className="mt-4 leading-7 text-slate-300">
              Try Free preview before spending credits. Used credits are not refunded for normal result variation.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {refundMatrix.map((item) => (
            <article className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(31,82,44,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,82,44,0.14)]" key={item.status}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-matcha-700">{item.status}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{item.outcome}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Refund details</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">What can be reviewed or returned.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">Practical rules for prepaid credits, AI Restore usage, failed processing, and support review.</p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {refundSections.map((section) => (
              <article className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_18px_50px_rgba(31,82,44,0.08)] backdrop-blur" key={section.title}>
                <h3 className="text-lg font-semibold text-slate-950">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-8 overflow-hidden rounded-[2.5rem] bg-slate-950 p-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(143,217,154,0.26),transparent_32%),radial-gradient(circle_at_90%_55%,rgba(255,255,255,0.10),transparent_30%)]" />
          <div className="relative grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Result boundary</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Different is not automatically failed.</h2>
            </div>
            <p className="leading-7 text-slate-300">
              Natural result, not exact original. A result may be imperfect because of lighting, compression, or a heavy filter, but that does not automatically qualify as a failed job.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_24px_80px_rgba(31,82,44,0.10)] backdrop-blur-xl md:flex md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Before buying credits</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Review pricing, terms, and privacy.</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            {relatedLinks.map((link) => (
              <Link className="rounded-full border border-matcha-200 bg-white/80 px-5 py-3 text-sm font-semibold text-matcha-900 shadow-sm transition hover:-translate-y-0.5 hover:border-matcha-400 hover:shadow-md" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
