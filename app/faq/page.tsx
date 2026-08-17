import { Footer } from '@/components/Footer';
import { localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { createI18nMetadata } from '@/lib/i18n/metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 声明 FAQ 页的规范地址，避免问答内容被识别为重复页面。
export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale);

  return createI18nMetadata(locale, '/faq', dictionary.metadata.faq);
}

// trustItems 概括 FAQ 页面最需要提前建立的用户预期。
const trustItems = ['Natural result, not exact original', 'Free preview first', 'AI Restore uses credits'];

// faqGroups 按购买前和上传前的真实疑虑组织问题。
const faqGroups = [
  {
    title: 'Results & limits',
    eyebrow: 'Output expectations',
    description: 'Understand what AI Restore can improve and what it cannot promise.',
    highlighted: true,
    items: [
      {
        question: 'What does Remove Matcha Filter do?',
        answer: 'It reduces greenish, yellowish, or matcha-style color casts from uploaded photos and aims to produce a more balanced, natural-looking result.'
      },
      {
        question: 'Can it restore the exact original photo?',
        answer: 'No. AI Restore can improve color balance, but it cannot recreate the exact original pixels.'
      },
      {
        question: 'Can a filter be removed from a saved photo?',
        answer: 'A saved filtered photo can be corrected, but it cannot be perfectly reversed. The goal is to reduce the green tint, yellow cast, or matcha-style color cast and make the image look more natural.'
      },
      {
        question: 'What if the result is not good enough?',
        answer: 'Some photos may not improve much because of lighting, compression, or heavy filters. A result that differs from the original is not automatically a failed job.'
      }
    ]
  },
  {
    title: 'Upload & privacy',
    eyebrow: 'Files and processing',
    description: 'Know what happens before and after you choose AI Restore.',
    highlighted: false,
    items: [
      {
        question: 'What image formats are supported?',
        answer: 'You can upload JPG, PNG, and WEBP images under the current size limit.'
      },
      {
        question: 'Does Free preview upload my photo?',
        answer: 'Free preview stays in your browser. It lets you test a basic color cleanup before spending a credit.'
      },
      {
        question: 'What happens when I use AI Restore?',
        answer: 'AI Restore uploads the selected image for processing so the service can create previews and downloadable results.'
      },
      {
        question: 'Is it safe to upload personal photos?',
        answer: 'Only upload photos you own or have permission to edit. Avoid sensitive content you do not want handled by the service or an AI provider.'
      }
    ]
  },
  {
    title: 'Credits & billing',
    eyebrow: 'Pricing basics',
    description: 'Use credits only when Free preview is not enough.',
    highlighted: false,
    items: [
      {
        question: 'How do credits work?',
        answer: 'There is no subscription. Free preview is included, and AI Restore uses 1 credit per photo. Purchased credits are valid for 12 months.'
      },
      {
        question: 'Do I need credits for every upload?',
        answer: 'No. You can upload and run Free preview first. Credits are only used when you choose AI Restore.'
      },
      {
        question: 'What happens if an AI Restore job fails?',
        answer: 'If a service failure produces no result, the used credit is returned automatically.'
      },
      {
        question: 'Where can I compare credit packs?',
        answer: 'Use the pricing page to compare Try, Popular, and Pro packs by credits, cost per AI Restore, and best-fit use case.'
      }
    ]
  }
];

// FaqPage 解释 AI 恢复能力、上传数据和 credits 预期。
export default function FaqPage() {
  const locale = getRequestLocale();

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-matcha-200/45 blur-3xl animate-glow-drift" />
      <div className="pointer-events-none absolute right-[-9rem] top-48 -z-10 h-96 w-96 rounded-full bg-amber-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-[-10rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-10 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">Answer hub</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 md:text-6xl">
              Questions before you remove a matcha filter.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Clear answers about results, limits, uploads, privacy, Free preview, AI Restore, and credits before you process a photo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:bg-matcha-800" href="/matcha-filter-remover">
                Upload a photo
              </Link>
              <Link className="rounded-full border border-matcha-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white" href="/pricing">
                View pricing
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">
            {trustItems.map((item) => (
              <TrustPill key={item} text={item} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-[0_18px_55px_rgba(31,82,44,0.10)] backdrop-blur-xl lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-matcha-700">Categories</p>
            <div className="mt-4 space-y-3">
              {faqGroups.map((group) => (
                <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm" key={group.title}>
                  <p className="text-sm font-semibold text-slate-950">{group.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{group.description}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            {faqGroups.map((group) => (
              <FaqGroup key={group.title} group={group} />
            ))}
          </div>
        </section>

        <CtaSection locale={locale} />
        <Footer />
      </div>
    </main>
  );
}

// TrustPill 展示 FAQ 页首屏的核心信任承诺。
function TrustPill({ text }: { text: string }) {
  return <div className="rounded-3xl border border-white/80 bg-white/70 p-4 text-sm font-semibold text-slate-700 shadow-[0_18px_50px_rgba(31,82,44,0.10)] backdrop-blur">{text}</div>;
}

// FaqGroup 展示单个 FAQ 分类，重点分类使用深色提示卡。
function FaqGroup({ group }: { group: (typeof faqGroups)[number] }) {
  return (
    <section className={`rounded-[2rem] p-6 shadow-[0_24px_75px_rgba(31,82,44,0.12)] ${group.highlighted ? 'relative overflow-hidden bg-slate-950 text-white' : 'border border-white/70 bg-white/65 backdrop-blur-xl'}`}>
      {group.highlighted ? <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(143,217,154,0.26),transparent_32%),radial-gradient(circle_at_90%_55%,rgba(255,255,255,0.10),transparent_30%)]" /> : null}
      <div className="relative">
        <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${group.highlighted ? 'text-matcha-300' : 'text-matcha-700'}`}>{group.eyebrow}</p>
        <h2 className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${group.highlighted ? 'text-white' : 'text-slate-950'}`}>{group.title}</h2>
        <p className={`mt-3 max-w-2xl leading-7 ${group.highlighted ? 'text-slate-300' : 'text-slate-600'}`}>{group.description}</p>
        {group.highlighted ? <p className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-matcha-100 backdrop-blur">AI Restore improves color balance. It is not an exact original reconstruction tool.</p> : null}
      </div>
      <div className="relative mt-6 grid gap-4 md:grid-cols-2">
        {group.items.map((item) => (
          <FaqCard key={item.question} item={item} highlighted={group.highlighted} />
        ))}
      </div>
    </section>
  );
}

// FaqCard 展示默认展开的单个问答，保持 SEO 友好和移动端可读性。
function FaqCard({ item, highlighted }: { item: { question: string; answer: string }; highlighted?: boolean }) {
  return (
    <article className={`rounded-3xl p-5 shadow-sm ${highlighted ? 'border border-white/10 bg-white/10 backdrop-blur' : 'border border-white/80 bg-white/70 backdrop-blur'}`}>
      <h3 className={`font-semibold ${highlighted ? 'text-white' : 'text-slate-950'}`}>{item.question}</h3>
      <p className={`mt-2 text-sm leading-6 ${highlighted ? 'text-slate-300' : 'text-slate-600'}`}>{item.answer}</p>
    </article>
  );
}

// CtaSection 在 FAQ 读完后给出下一步上传或查看定价入口。
function CtaSection({ locale }: { locale: ReturnType<typeof getRequestLocale> }) {
  return (
    <section className="mt-8 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 text-center shadow-[0_30px_100px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Ready to test one photo?</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Try Free preview before you spend a credit.</h2>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:bg-matcha-800" href={localizePath('/matcha-filter-remover', locale)}>
          Upload a photo
        </Link>
        <Link className="rounded-full border border-matcha-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white" href={localizePath('/pricing', locale)}>
          View pricing
        </Link>
      </div>
    </section>
  );
}
