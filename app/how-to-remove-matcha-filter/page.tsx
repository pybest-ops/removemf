import Link from 'next/link';
import { localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { createI18nMetadata } from '@/lib/i18n/metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import type { Metadata } from 'next';

// metadata 覆盖 how-to 查询意图，帮助搜索用户理解工具能力边界。
export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale);

  return createI18nMetadata(locale, '/how-to-remove-matcha-filter', dictionary.metadata.howTo);
}

// steps 解释从上传到 AI 修复的最短使用路径。
const steps = [
  {
    title: 'Upload the saved photo',
    body: 'Choose a JPG, PNG, or WEBP image that already has a visible matcha-style green or yellow cast. A clear saved copy gives the cleanup more room to work than a tiny screenshot or heavily compressed repost.'
  },
  {
    title: 'Process free in browser',
    body: 'Start with the browser cleanup before spending a credit. It is useful for light tint problems, quick comparisons, and photos where the subject already looks clear but the overall color feels wrong.'
  },
  {
    title: 'Use AI Restore if needed',
    body: 'AI Restore uses 1 credit for one stronger attempt on the selected photo. Use it when faces, whites, or backgrounds still look too green or yellow after the browser result.'
  }
];

// prepChecks 说明上传前用户可以先自查的图片状态。
const prepChecks = [
  'Use the best saved version you have, not a preview thumbnail from a chat or gallery.',
  'Check neutral areas such as white shirts, walls, paper, plates, or gray objects before judging the whole image.',
  'Avoid cropping too tightly before cleanup if the background helps show what neutral color should look like.',
  'Keep your expectation practical: the goal is a more natural-looking result, not the exact original file.'
];

// qualityChecks 说明用户判断结果是否自然的标准。
const qualityChecks = [
  'Skin should look less green or yellow without turning pink, gray, or flat.',
  'White and gray objects should move closer to neutral instead of picking up a new color cast.',
  'Plants, food, and colored clothes should still look believable after the tint reduction.',
  'The photo should feel easier to use, even if it does not match the untouched original.'
];

// mistakes 解释常见误解，避免用户把工具能力理解成原图还原。
const mistakes = [
  {
    title: 'Expecting a perfect original reconstruction',
    body: 'A saved filtered photo has already lost or changed some color information. Cleanup can reduce the cast, but it cannot know every original color with certainty.'
  },
  {
    title: 'Judging only by the overall mood',
    body: 'A photo can feel warmer or cooler for many reasons. Use known neutral objects as anchors, then decide whether the result actually looks more natural.'
  },
  {
    title: 'Spending a credit too early',
    body: 'Process free in browser first. If the basic result is already good enough, there is no reason to use AI Restore for that photo.'
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
  const locale = getRequestLocale();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Blog guide</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
          How to remove matcha filter from a saved photo
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          If a photo looks too green, yellow, muted, or cloudy after a social filter, start with a simple cleanup path. Upload the saved image, process free in browser, then use AI Restore only when the tint still needs a stronger correction.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-matcha-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-matcha-700/20" href={localizePath('/matcha-filter-remover', locale)}>
            Upload a photo
          </Link>
          <Link className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700" href={localizePath('/pricing', locale)}>
            View credits
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Before you start</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Check the photo before you spend time fixing it.</h2>
        <p className="mt-4 leading-7 text-slate-600">
          The best matcha filter cleanup starts before the upload. A better input gives any correction tool more room to work. If you have several copies of the image, pick the largest and clearest saved version. Avoid screenshots of screenshots when you can, because compression can make skin and backgrounds harder to balance.
        </p>
        <p className="mt-4 leading-7 text-slate-600">
          Then look for a neutral reference inside the image. White walls, gray clothes, paper, plates, window frames, and the whites of the eyes are useful because you already know roughly how they should look. If all of them lean green or yellow, the photo probably has a color cast rather than just a warm room light.
        </p>
        <ul className="mt-6 grid gap-3 text-sm leading-6 text-slate-600 md:grid-cols-2">
          {prepChecks.map((check) => (
            <li className="rounded-2xl bg-matcha-50 p-4 ring-1 ring-matcha-100" key={check}>{check}</li>
          ))}
        </ul>
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

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">After the preview</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">How to judge whether the result is good enough</h2>
        <p className="mt-4 leading-7 text-slate-600">
          Do not judge the result only by whether it looks brighter. A photo can be brighter and still have an odd color cast. Compare the cleaned version against the original and focus on the parts people notice first: faces, white objects, and the main subject.
        </p>
        <p className="mt-4 leading-7 text-slate-600">
          A good result usually feels calmer, not dramatic. The green or yellow cast should be reduced, but the image should not swing too far in the other direction. If the browser cleanup makes the photo usable, stop there. If the photo still looks tinted or muddy, that is the moment to consider AI Restore.
        </p>
        <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
          {qualityChecks.map((check) => (
            <li className="flex gap-3" key={check}>
              <span className="mt-2 h-2 w-2 rounded-full bg-matcha-600" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl bg-matcha-50 p-7 ring-1 ring-matcha-100">
          <h2 className="text-2xl font-semibold text-slate-950">Common mistakes</h2>
          <div className="mt-5 space-y-5">
            {mistakes.map((mistake) => (
              <section key={mistake.title}>
                <h3 className="font-semibold text-slate-950">{mistake.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{mistake.body}</p>
              </section>
            ))}
          </div>
        </article>

        <article className="rounded-3xl bg-slate-950 p-7 text-white">
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
        </article>
      </section>
    </main>
  );
}
