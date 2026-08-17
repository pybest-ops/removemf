import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Footer } from '@/components/Footer';
import { localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { createI18nMetadata } from '@/lib/i18n/metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 提供首页 canonical 和社交分享标签，避免搜索引擎识别为重复页面。
export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale);

  return createI18nMetadata(locale, '/', dictionary.metadata.home);
}

export default function HomePage() {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale).home;

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-matcha-200/45 blur-3xl animate-glow-drift" />
      <div className="pointer-events-none absolute right-[-8rem] top-56 -z-10 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-[-10rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-24">
        <HeroSection dictionary={dictionary} locale={locale} />
        <ResultPreview dictionary={dictionary} />
        <HowItWorks dictionary={dictionary} />
        <FaqSection dictionary={dictionary} />
        <Footer />
      </div>
    </main>
  );
}

// HeroSection 承载首页首屏价值主张、上传转化入口和高级玻璃视觉。
function HeroSection({ dictionary, locale }: { dictionary: ReturnType<typeof getDictionary>['home']; locale: ReturnType<typeof getRequestLocale> }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/70 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.18)] backdrop-blur-xl md:p-8 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(143,217,154,0.34),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.88),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(243,251,244,0.64))]" />
      <div className="relative flex flex-col justify-center py-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-matcha-200/80 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-matcha-800 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-matcha-500 shadow-[0_0_18px_rgba(54,164,74,0.75)]" />
          {dictionary.hero.eyebrow}
        </div>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 md:text-7xl">
          {dictionary.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
          {dictionary.hero.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-matcha-800" href={localizePath('/matcha-filter-remover', locale)}>
            {dictionary.hero.primaryCta}
          </Link>
          <Link className="rounded-full border border-matcha-200 bg-white/70 px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-matcha-300 hover:bg-white" href={localizePath('/pricing', locale)}>
            {dictionary.hero.secondaryCta}
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {dictionary.heroPills.map((pill) => (
            <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur" key={pill}>
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-10 lg:mt-0">
        <div className="absolute -right-4 bottom-7 z-10 hidden w-52 rounded-3xl border border-matcha-100 bg-slate-950/90 p-4 text-white shadow-[0_25px_70px_rgba(15,23,42,0.32)] backdrop-blur-xl md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-200">{dictionary.hero.restoreLabel}</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{dictionary.hero.restoreText}</p>
        </div>
        <div className="relative rounded-[2rem] bg-gradient-to-br from-white via-matcha-50 to-matcha-100 p-3 shadow-[0_30px_90px_rgba(31,82,44,0.24)] ring-1 ring-white/80">
          <BeforeAfterSlider />
        </div>
      </div>
    </section>
  );
}

// ResultPreview 展示结果页应承载的对比、下载和边界说明。
function ResultPreview({ dictionary }: { dictionary: ReturnType<typeof getDictionary>['home'] }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(143,217,154,0.28),transparent_32%),radial-gradient(circle_at_90%_65%,rgba(255,255,255,0.12),transparent_30%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">{dictionary.result.eyebrow}</p>
          <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{dictionary.result.title}</h2>
          <p className="mt-5 leading-7 text-slate-300">
            {dictionary.result.description}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dictionary.resultFeatures.map((feature) => (
            <Feature title={feature.title} text={feature.text} key={feature.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

// HowItWorks 用三步说明降低用户对 AI 处理链路的不确定感。
function HowItWorks({ dictionary }: { dictionary: ReturnType<typeof getDictionary>['home'] }) {
  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">{dictionary.how.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">{dictionary.how.title}</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">{dictionary.how.description}</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {dictionary.steps.map((step, index) => (
          <article key={step.title} className="group rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_18px_55px_rgba(31,82,44,0.10)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,82,44,0.16)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-matcha-100 to-white text-sm font-bold text-matcha-800 shadow-inner ring-1 ring-matcha-100">{index + 1}</span>
            <h3 className="mt-6 text-xl font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// FaqSection 汇总首页转化前的核心疑问和边界说明。
function FaqSection({ dictionary }: { dictionary: ReturnType<typeof getDictionary>['home'] }) {
  return (
    <section className="grid gap-8 rounded-[2.5rem] border border-white/80 bg-white/55 p-6 shadow-[0_20px_70px_rgba(31,82,44,0.12)] backdrop-blur md:p-8 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">{dictionary.faq.eyebrow}</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{dictionary.faq.title}</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {dictionary.proofMetrics.map((metric) => (
            <div className="rounded-3xl bg-white/70 p-4 shadow-sm ring-1 ring-white/80" key={metric.value}>
              <p className="text-2xl font-semibold text-matcha-800">{metric.value}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {dictionary.faqs.map((faq) => (
          <details key={faq.question} className="group rounded-3xl border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(31,82,44,0.12)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950 [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-matcha-50 text-lg leading-none text-matcha-800 transition duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Feature 展示结果预览区内的单个能力点。
function Feature({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12]">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </article>
  );
}
