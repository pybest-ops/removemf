import { Footer } from '@/components/Footer';
import { localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { createI18nMetadata } from '@/lib/i18n/metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 声明服务条款页的规范地址，避免法律页面被识别为重复内容。
export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale);

  return createI18nMetadata(locale, '/terms', dictionary.metadata.terms);
}

// termsHighlights 用于在首屏快速说明服务条款的核心使用边界。
const termsHighlights = [
  {
    label: 'Use rights',
    value: 'Upload photos you can edit',
    body: 'You are responsible for having the rights and permissions needed to process each image.'
  },
  {
    label: 'AI Restore',
    value: 'Natural result, not exact original',
    body: 'The service reduces color cast but cannot recreate the exact original pixels.'
  },
  {
    label: 'Credits',
    value: '1 credit = 1 AI Restore',
    body: 'Free preview is included. Credits are used only when you start AI Restore.'
  }
];

// termsSections 描述用户使用服务前需要理解的主要规则。
const termsSections = [
  {
    title: '1. Service overview',
    body: 'Remove Matcha Filter provides an AI-assisted workflow for reducing greenish, yellowish, or matcha-style color casts in uploaded photos. The service is designed to create a more balanced image, not to recreate the exact original file.'
  },
  {
    title: '2. User responsibilities',
    body: 'You are responsible for the images you upload and must have the rights and permissions needed to process them. Do not upload illegal content, content that violates another person\'s privacy, or content you are not allowed to modify.'
  },
  {
    title: '3. AI output limits',
    body: 'AI results can vary based on the input image, lighting, compression, and color cast. AI Restore can improve color balance, but it does not guarantee the exact original pixels or suitability for professional editing, legal, identity, medical, or archival use.'
  },
  {
    title: '4. Credits and paid use',
    body: 'The service sells prepaid credit packs through PayPal Checkout. There is no subscription. Free preview is included, and 1 credit = 1 AI Restore. Purchased credits are valid for 12 months from purchase.'
  },
  {
    title: '5. Storage and downloads',
    body: 'Uploaded images and generated results may be stored temporarily so the service can process AI Restore requests, show previews, and provide downloads. Result availability can be limited by storage, provider availability, or operational issues.'
  },
  {
    title: '6. Prohibited use',
    body: 'You may not use the service to process illegal content, infringe intellectual property rights, harass others, bypass platform rules, misrepresent AI-generated results, or overload the service infrastructure.'
  },
  {
    title: '7. Changes and availability',
    body: 'Features, models, credits, pricing, storage periods, and availability may be updated over time. We may pause, limit, or change parts of the service when needed for reliability, security, abuse prevention, or operational reasons.'
  }
];

// relatedLinks 帮助用户在条款页完成隐私、退款和购买前确认。
const relatedLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/pricing', label: 'View pricing' }
];

// TermsPage 展示 Premium Legal Hub 风格的服务条款。
export default function TermsPage() {
  const locale = getRequestLocale();

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
              Terms for using AI Restore responsibly.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              These terms explain image rights, AI output limits, credits, service availability, and the rules for using Remove Matcha Filter.
            </p>
          </div>
          <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Core boundary</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Improve color, not history.</p>
            <p className="mt-4 leading-7 text-slate-300">
              AI Restore can reduce a matcha-style color cast, but it cannot verify or recreate the original untouched photo.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {termsHighlights.map((item) => (
            <article className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(31,82,44,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,82,44,0.14)]" key={item.label}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-matcha-700">{item.label}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{item.value}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Service rules</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">What you agree to when using the tool.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">Clear terms for image rights, Free preview, AI Restore, credits, storage, prohibited use, and availability.</p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {termsSections.map((section) => (
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Result limits</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">AI output is not proof.</h2>
            </div>
            <p className="leading-7 text-slate-300">
              Do not use AI Restore results as legal, identity, medical, archival, or professional proof. The service is a visual color cleanup tool.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_24px_80px_rgba(31,82,44,0.10)] backdrop-blur-xl md:flex md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Before you continue</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Check privacy, refunds, or credit packs.</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            {relatedLinks.map((link) => (
              <Link className="rounded-full border border-matcha-200 bg-white/80 px-5 py-3 text-sm font-semibold text-matcha-900 shadow-sm transition hover:-translate-y-0.5 hover:border-matcha-400 hover:shadow-md" href={localizePath(link.href, locale)} key={link.href}>
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
