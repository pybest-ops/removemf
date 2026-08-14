import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 覆盖 how-to 查询意图，帮助搜索用户理解工具能力边界。
export const metadata: Metadata = {
  title: 'How to Remove Matcha Filter from a Photo Online',
  description: 'Learn how to reduce a matcha filter, green tint, yellow cast, or color cast from a saved photo with browser preview and AI Restore.'
};

// steps 解释从上传到 AI 修复的最短使用路径。
const steps = [
  {
    title: 'Upload the saved photo',
    body: 'Choose a JPG, PNG, or WEBP image that already has a visible matcha-style green or yellow cast.'
  },
  {
    title: 'Preview a browser cleanup',
    body: 'Use the free browser preview to check whether basic color correction is enough before spending a credit.'
  },
  {
    title: 'Use AI Restore if needed',
    body: 'AI Restore uses 1 credit to make a stronger attempt at reducing the tint and balancing the image.'
  }
];

// limits 说明保存后图片修复的效果边界，避免承诺原图还原。
const limits = [
  'A saved filtered photo does not contain the untouched original pixels.',
  'The goal is a more natural-looking color balance, not exact original reconstruction.',
  'Very heavy filters, compression, and unusual lighting can limit the final result.'
];

// HowToRemoveMatchaFilterPage 承接 how-to 搜索并引导用户上传图片。
export default function HowToRemoveMatchaFilterPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">How to remove matcha filter</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
          How to remove matcha filter from a saved photo
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Upload your photo, preview a free browser cleanup, then use AI Restore when the green tint, yellow cast, or matcha-style color cast still needs stronger correction.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-matcha-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-matcha-700/20" href="/upload">
            Upload a photo
          </Link>
          <Link className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700" href="/pricing">
            View credits
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5" key={step.title}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-matcha-100 text-sm font-bold text-matcha-800">{index + 1}</span>
            <h2 className="mt-5 text-xl font-semibold text-slate-950">{step.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-[2rem] bg-slate-950 p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Important limit</p>
        <h2 className="mt-3 text-3xl font-semibold">Removing a filter is not the same as restoring the original file.</h2>
        <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
          {limits.map((limit) => (
            <li className="flex gap-3" key={limit}>
              <span className="mt-2 h-2 w-2 rounded-full bg-matcha-300" />
              <span>{limit}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
