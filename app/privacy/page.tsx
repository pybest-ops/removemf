import { Footer } from '@/components/Footer';
import { localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { createI18nMetadata } from '@/lib/i18n/metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 声明隐私政策页的规范地址，避免法律页面被识别为重复内容。
export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale);

  return createI18nMetadata(locale, '/privacy', dictionary.metadata.privacy);
}

// privacyHighlights 用于在首屏快速说明用户最关心的数据处理边界。
const privacyHighlights = [
  {
    label: 'Free preview',
    value: 'Stays in your browser',
    body: 'The basic color cleanup preview runs locally before you choose AI Restore.'
  },
  {
    label: 'AI Restore',
    value: 'Uploads selected image',
    body: 'The selected photo is sent for processing only when you start an AI Restore.'
  },
  {
    label: 'Payments',
    value: 'Handled by PayPal',
    body: 'This site stores order and credit records, not card or PayPal account credentials.'
  }
];

// privacySections 描述隐私政策中公开用户需要理解的数据处理主题。
const privacySections = [
  {
    title: '1. What this policy covers',
    body: 'Remove Matcha Filter helps reduce greenish, yellowish, or matcha-style color casts in photos. This Privacy Policy explains how the service handles uploaded images, AI Restore results, credits, PayPal order records, Google login data, and service operations.'
  },
  {
    title: '2. Information we process',
    body: 'We may process images you choose to upload for AI Restore, job status metadata, basic device or request information, Google account profile data used for login, and credit or order metadata. PayPal handles payment details directly.'
  },
  {
    title: '3. Free preview and AI Restore',
    body: 'Free preview stays in your browser and lets you test a basic cleanup before spending credits. AI Restore uploads the selected image so the service can process it, show before / after previews, and provide a downloadable result.'
  },
  {
    title: '4. Third-party services',
    body: 'The service may use an AI provider for image processing, Cloudflare infrastructure for hosting and API routes, R2-compatible storage for uploaded or generated files, Google for login, and PayPal for checkout. These providers process data as needed to provide the service.'
  },
  {
    title: '5. Retention',
    body: 'Uploaded images, generated results, and job records are retained only for the period needed to provide downloads, troubleshooting, abuse prevention, cost review, and service operations. We aim to limit retention to what is necessary for those purposes.'
  },
  {
    title: '6. Your choices',
    body: 'Only upload images you own or have permission to edit. Avoid sensitive, illegal, or private images that you do not want handled by the service or an AI provider. For privacy or deletion requests, contact support@removematchafilter.org.'
  }
];

// relatedLinks 帮助用户在三个 legal 页面和核心转化页面之间跳转。
const relatedLinks = [
  { href: '/terms', label: 'Read Terms' },
  { href: '/refund', label: 'Refund rules' },
  { href: '/matcha-filter-remover', label: 'Upload a photo' }
];

// PrivacyPage 展示 Premium Legal Hub 风格的隐私政策。
export default function PrivacyPage() {
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
              Privacy Policy for photo cleanup and AI Restore.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Understand what stays in your browser, what is uploaded for AI Restore, and which services help process payments, login, storage, and generated results.
            </p>
          </div>
          <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Privacy promise</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Free preview stays local.</p>
            <p className="mt-4 leading-7 text-slate-300">
              AI Restore uploads only the selected image for processing. Natural result, not exact original.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {privacyHighlights.map((item) => (
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Privacy details</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">How your data is handled.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">Short, practical explanations for images, AI Restore processing, payments, login, and retention.</p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {privacySections.map((section) => (
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Important boundary</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Use care with personal photos.</h2>
            </div>
            <p className="leading-7 text-slate-300">
              Free preview can be tested locally first. Choose AI Restore only for images you are comfortable uploading for processing, storage, preview, and download delivery.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_24px_80px_rgba(31,82,44,0.10)] backdrop-blur-xl md:flex md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Related policies</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Review the rest of the legal hub.</h2>
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
