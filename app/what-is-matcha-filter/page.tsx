import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 承接 definition 查询，并澄清 matcha filter 在本站中的图片含义。
export const metadata: Metadata = {
  title: 'What Is a Matcha Filter? Green Tint Photo Filter Explained',
  description: 'A matcha filter is a greenish or yellowish photo look that can affect skin, whites, and backgrounds. Learn what it means and how to reduce it online.'
};

// symptoms 描述用户能直接识别的抹茶滤镜表现。
const symptoms = [
  'Skin can look too green, yellow, or muted.',
  'White walls, clothes, and highlights may lose a clean neutral tone.',
  'The whole image can feel soft, hazy, or less true to the original scene.'
];

// WhatIsMatchaFilterPage 解释关键词含义，并把信息型用户导向修复工具。
export default function WhatIsMatchaFilterPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">What is matcha filter?</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
          A matcha filter is a green or yellow color cast on a photo
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          On this site, matcha filter means a photo-editing look that makes an image feel greenish, yellowish, soft, or muted. It is not a tea strainer or a physical matcha tool.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-matcha-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-matcha-700/20" href="/upload">
            Remove matcha filter
          </Link>
          <Link className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700" href="/how-to-remove-matcha-filter">
            How it works
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl bg-matcha-50 p-7 ring-1 ring-matcha-100">
          <h2 className="text-2xl font-semibold text-slate-950">Common signs</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            {symptoms.map((symptom) => (
              <li className="flex gap-3" key={symptom}>
                <span className="mt-2 h-2 w-2 rounded-full bg-matcha-600" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
          <h2 className="text-2xl font-semibold text-slate-950">Can it be removed?</h2>
          <p className="mt-4 leading-7 text-slate-600">
            A saved filtered image cannot be perfectly reversed to the original file, but AI color correction can often reduce the green tint or yellow cast and create a more natural-looking result.
          </p>
          <p className="mt-4 leading-7 text-slate-600">
            Use the free browser preview first. If the image still looks too tinted, AI Restore uses 1 credit for a stronger recovery attempt.
          </p>
        </article>
      </section>
    </main>
  );
}
