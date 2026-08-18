import { Footer } from '@/components/Footer';
import { PlatformExamples, youtubeExamples } from '@/components/PlatformExamples';
import { UploadPageFlow } from '@/components/UploadPageFlow';
import { localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { createI18nMetadata } from '@/lib/i18n/metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 承接 YouTube 长尾词搜索意图，声明页面规范地址。
export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale);

  return createI18nMetadata(locale, '/youtube-remove-matcha-filter', dictionary.metadata.youtube);
}

// YoutubeRemoveMatchaFilterPage 面向 YouTube 用户，复用上传组件并补充平台专属内容。
export default function YoutubeRemoveMatchaFilterPage() {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale).youtube;

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-matcha-200/45 blur-3xl animate-glow-drift" />
      <div className="pointer-events-none absolute right-[-9rem] top-44 -z-10 h-96 w-96 rounded-full bg-amber-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-[-10rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link className="rounded-full border border-matcha-200 bg-white/70 px-4 py-2 text-sm font-semibold text-matcha-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white" href={localizePath('/', locale)}>
            ← Back to home
          </Link>
          <p className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-matcha-700 shadow-sm backdrop-blur">YouTube matcha filter remover</p>
        </div>

        {/* 顶部：复用移除组件 */}
        <div>
          <UploadPageFlow />

          <div className="pointer-events-none relative h-8" aria-hidden="true">
            <div className="hidden md:block">
              <span className="absolute left-10 top-0 h-8 border-l-2 border-dashed border-matcha-300/55 lg:left-14">
                <span className="absolute -left-[0.32rem] -top-1 h-2.5 w-2.5 rounded-full bg-matcha-300/80 shadow-[0_0_18px_rgba(143,217,154,0.6)]" />
                <span className="absolute -bottom-1 -left-[0.32rem] h-2.5 w-2.5 rounded-full bg-matcha-300/80 shadow-[0_0_18px_rgba(143,217,154,0.6)]" />
              </span>
              <span className="absolute right-10 top-0 h-8 border-l-2 border-dashed border-matcha-300/55 lg:right-14">
                <span className="absolute -left-[0.32rem] -top-1 h-2.5 w-2.5 rounded-full bg-matcha-300/80 shadow-[0_0_18px_rgba(143,217,154,0.6)]" />
                <span className="absolute -bottom-1 -left-[0.32rem] h-2.5 w-2.5 rounded-full bg-matcha-300/80 shadow-[0_0_18px_rgba(143,217,154,0.6)]" />
              </span>
            </div>
            <span className="absolute left-1/2 top-0 h-8 -translate-x-1/2 border-l-2 border-dashed border-matcha-300/55 md:hidden">
              <span className="absolute -left-[0.32rem] -top-1 h-2.5 w-2.5 rounded-full bg-matcha-300/80 shadow-[0_0_18px_rgba(143,217,154,0.6)]" />
              <span className="absolute -bottom-1 -left-[0.32rem] h-2.5 w-2.5 rounded-full bg-matcha-300/80 shadow-[0_0_18px_rgba(143,217,154,0.6)]" />
            </span>
          </div>

          <section className="relative grid gap-6 rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">{dictionary.eyebrow}</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-slate-950 md:text-5xl">
                {dictionary.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                {dictionary.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:bg-matcha-800" href="#upload-tool">
                  {dictionary.cta}
                </Link>
                <Link className="rounded-full border border-matcha-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white" href={localizePath('/how-to-remove-matcha-filter', locale)}>
                  {dictionary.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <InfoCard title="Step 1 · Save or screenshot" text="Save the YouTube thumbnail, or take a screenshot of the video frame with the matcha-style color cast." />
              <InfoCard title="Step 2 · Upload here" text="Drop the saved image above. The free browser preview reduces light color casts instantly." />
              <InfoCard title="Step 3 · AI Restore if needed" text="If the tint is still too green or yellow, use AI Restore for stronger correction (1 credit)." />
            </div>
          </section>
        </div>

        {/* 中间：什么是 YouTube matcha filter */}
        <section className="rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">{dictionary.whatIs.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">{dictionary.whatIs.title}</h2>
          <div className="mt-5 space-y-4">
            {dictionary.whatIs.paragraphs.map((paragraph) => (
              <p className="text-base leading-7 text-slate-600" key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>


        {/* Before/After 示例展示 */}
        <PlatformExamples platform="youtube" examples={youtubeExamples} />

        {/* 中间：图片尺寸指南 + 使用场景 */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-[0_24px_75px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">{dictionary.imageGuide.eyebrow}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{dictionary.imageGuide.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{dictionary.imageGuide.description}</p>
            <div className="mt-5 space-y-3">
              {dictionary.imageGuide.specs.map((spec) => (
                <div className="flex items-center justify-between rounded-2xl bg-matcha-50 px-4 py-3 ring-1 ring-matcha-100" key={spec.label}>
                  <span className="text-sm font-semibold text-slate-950">{spec.label}</span>
                  <span className="text-sm text-matcha-800">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-[0_24px_75px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">{dictionary.examples.eyebrow}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{dictionary.examples.title}</h2>
            <div className="mt-5 space-y-4">
              {dictionary.examples.items.map((item) => (
                <div key={item.title}>
                  <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 底部：YouTube FAQ */}
        <section className="rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">{dictionary.faq.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">{dictionary.faq.title}</h2>
          <div className="mt-6 space-y-4">
            {dictionary.faq.items.map((faq) => (
              <details className="group rounded-3xl border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(31,82,44,0.12)]" key={faq.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950 [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-matcha-50 text-lg leading-none text-matcha-800 transition duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 相关工具链接 */}
        <section className="grid gap-4 md:grid-cols-3">
          <Link className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,82,44,0.12)]" href={localizePath('/tiktok-remove-matcha-filter', locale)}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">Also available</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">TikTok Remove Matcha Filter →</p>
          </Link>
          <Link className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,82,44,0.12)]" href={localizePath('/what-is-matcha-filter', locale)}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">Learn more</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">What is a matcha filter? →</p>
          </Link>
          <Link className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,82,44,0.12)]" href={localizePath('/how-to-remove-matcha-filter', locale)}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">Guide</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">How to remove matcha filter →</p>
          </Link>
        </section>

        <Footer />
      </div>
    </main>
  );
}

// InfoCard 用玻璃卡片说明步骤或要点，复用 upload 页的视觉模式。
function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_18px_50px_rgba(31,82,44,0.10)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,82,44,0.16)]">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
