import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import Link from 'next/link';

// steps 说明首页上传到下载的核心用户路径。
const steps = [
  { title: 'Upload', text: 'Choose one JPG, PNG, or WEBP photo with a visible matcha-style cast.' },
  { title: 'AI correction', text: 'The model reduces green and yellow tint while keeping the image natural.' },
  { title: 'Download', text: 'Preview the result, compare the change, and save the restored image.' }
];

// faqs 回答用户转化前最常见的顾虑。
const faqs = [
  {
    question: 'What is a matcha filter?',
    answer: 'It is a soft green or yellow color cast that can make skin, backgrounds, and whites look less natural.'
  },
  {
    question: 'Can AI restore the original photo?',
    answer: 'No tool can guarantee the exact original. This service aims to create a more balanced, natural-looking result.'
  },
  {
    question: 'How do credits work?',
    answer: 'There is no subscription and no free generation. Buy credits when you need them; 1 credit creates 1 matcha filter removal.'
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 py-8">
      <HeroSection />
      <ResultPreview />
      <HowItWorks />
      <FaqSection />
      <Footer />
    </main>
  );
}

// HeroSection 承载首页首屏价值主张和上传转化入口。
function HeroSection() {
  return (
    <section className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-matcha-700">Remove Matcha Filter</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
          Remove Matcha Filter from Your Photo
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Upload a photo and let AI reduce greenish, yellowish, or matcha-style color casts while keeping the result natural.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-matcha-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-matcha-700/20" href="/upload">
            Upload a photo
          </Link>
          <Link className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700" href="/pricing">
            View credits
          </Link>
        </div>
        <p className="mt-5 text-sm text-slate-500">JPG, PNG, WEBP · Single-photo recovery · Natural output, not original reconstruction</p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] shadow-sm ring-1 ring-black/5">
        <BeforeAfterSlider />
      </div>
    </section>
  );
}

// ResultPreview 展示结果页应承载的对比、下载和边界说明。
function ResultPreview() {
  return (
    <section className="rounded-[2rem] bg-slate-950 p-8 text-white lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Result preview</p>
          <h2 className="mt-3 text-3xl font-semibold">Compare before you download.</h2>
          <p className="mt-4 leading-7 text-slate-300">
            Results should be judged by natural color balance, not by a promise to recreate the untouched original file.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="Before / After" text="Check how much green or yellow cast was reduced." />
          <Feature title="Download" text="Save the restored image when the result is ready." />
          <Feature title="Failure state" text="If AI cannot improve the photo, retry with clearer input." />
        </div>
      </div>
    </section>
  );
}

// HowItWorks 用三步说明降低用户对 AI 处理链路的不确定感。
function HowItWorks() {
  return (
    <section>
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">How it works</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">Three steps from cast to balance.</h2>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-matcha-100 text-sm font-bold text-matcha-800">{index + 1}</span>
            <h3 className="mt-5 text-xl font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// FaqSection 汇总首页转化前的核心疑问和边界说明。
function FaqSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">Know the limits before you upload.</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="font-semibold text-slate-950">{faq.question}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// Feature 展示结果预览区内的单个能力点。
function Feature({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </article>
  );
}

// Footer 提供上线前必须保留的合规入口。
function Footer() {
  return (
    <footer className="flex flex-col gap-4 border-t border-slate-200 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
      <p>Remove Matcha Filter · AI natural photo recovery</p>
      <nav className="flex gap-5">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/refund">Refund</Link>
      </nav>
    </footer>
  );
}
