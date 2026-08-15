import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 承接 definition 查询，并澄清 matcha filter 在本站中的图片含义。
export const metadata: Metadata = {
  title: 'What Is a Matcha Filter? Green Tint Photo Filter Explained',
  description: 'A matcha filter is a greenish or yellowish photo look that can affect skin, whites, and backgrounds. Learn what it means and how to reduce it online.',
  alternates: {
    canonical: '/what-is-matcha-filter'
  },
  openGraph: {
    title: 'What Is a Matcha Filter? Green Tint Photo Filter Explained',
    description: 'A matcha filter is a greenish or yellowish photo look that can affect skin, whites, and backgrounds. Learn what it means and how to reduce it online.',
    url: '/what-is-matcha-filter',
    siteName: 'Remove Matcha Filter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Remove Matcha Filter before and after preview'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is a Matcha Filter? Green Tint Photo Filter Explained',
    description: 'A matcha filter is a greenish or yellowish photo look that can affect skin, whites, and backgrounds. Learn what it means and how to reduce it online.',
    images: ['/og-image.png']
  }
};

// symptoms 描述用户能直接识别的抹茶滤镜表现。
const symptoms = [
  'Skin looks a little green, yellow, gray, or washed out instead of naturally warm.',
  'White clothes, walls, paper, plates, or highlights no longer look clean and neutral.',
  'The photo feels hazy or muted, even when the subject and lighting were probably sharper in real life.',
  'Plants, food, shadows, and indoor backgrounds pick up the same greenish cast as the face.'
];

// articleSections 组织详情页主体解释，让页面更接近博客文章。
const articleSections = [
  {
    title: 'What people usually mean by a matcha filter',
    body: [
      'On this site, a matcha filter means a photo-editing look that pushes the whole image toward green, yellow, olive, or muted beige. The name is informal. People use it because the color mood can look a bit like matcha powder mixed into the photo: soft, greenish, and slightly cloudy.',
      'That look can be intentional. Some social filters use it to make photos feel calmer, less contrasty, or more film-like. The problem starts when the filter is baked into a saved image and you no longer have the original file. At that point, the photo may look stylish in a feed, but strange when you want a clean profile picture, product photo, document image, food shot, or family photo.'
    ]
  },
  {
    title: 'Why the color cast is hard to undo perfectly',
    body: [
      'A saved filtered photo is not a layered editing file. The filter has already changed the pixels, and some original color information may be gone. That is why no cleanup tool should promise to recreate the untouched original. The honest goal is narrower: reduce the green or yellow cast and make the image look more natural.',
      'This matters most around skin, white objects, and neutral backgrounds. If a filter pushed everything green, the tool has to decide what should stay naturally green, like plants, and what should move back toward neutral, like a white shirt. That judgment is never perfect, but a careful correction can still make the photo easier to use.'
    ]
  },
  {
    title: 'A quick way to tell if the filter is the issue',
    body: [
      'Look for objects in the image that you already know should be neutral. A white wall, a gray hoodie, a paper receipt, a plate, or the whites of the eyes can reveal the problem faster than guessing from the whole photo. If those areas look yellow-green, the image probably has a color cast rather than just normal warm lighting.',
      'Also check whether the same tint appears everywhere. Real lighting usually changes from one area to another. A matcha-style filter often feels more uniform: the shadows, highlights, skin, and background all lean in the same direction.'
    ]
  }
];

// previewCases 说明免费浏览器处理更适合的图片情况。
const previewCases = [
  'The photo only needs a light color balance adjustment.',
  'The subject already looks clear, but the whole image feels too green or yellow.',
  'You want to compare a quick cleanup before spending a credit.',
  'You are not sure whether the filter is strong enough to need AI Restore.'
];

// restoreCases 说明需要升级到 AI Restore 的常见判断依据。
const restoreCases = [
  'Faces still look tinted after the browser cleanup.',
  'Whites and grays remain muddy or yellow-green.',
  'The photo has heavy filter styling, compression, or mixed indoor lighting.',
  'You need a stronger attempt at a natural-looking result and accept that exact original recovery is not possible.'
];

// WhatIsMatchaFilterPage 解释关键词含义，并把信息型用户导向修复工具。
export default function WhatIsMatchaFilterPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Blog guide</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
          What is a matcha filter on a photo?
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          A matcha filter is a green or yellow color cast that makes a photo feel soft, muted, or slightly cloudy. It can be a deliberate style, but it becomes annoying when you only have the saved filtered photo and want the image to look normal again.
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

      <article className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Plain explanation</p>
        {articleSections.map((section) => (
          <section className="mt-7 first:mt-0" key={section.title}>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p className="mt-4 leading-7 text-slate-600" key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl bg-matcha-50 p-7 ring-1 ring-matcha-100">
          <h2 className="text-2xl font-semibold text-slate-950">Common signs</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            You do not need a color chart to spot most matcha-style edits. Start with the parts of the image whose color you already understand.
          </p>
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
            It can often be reduced, but “removed” should be understood carefully. A saved filtered image cannot be perfectly reversed to the original file. The better question is whether the photo can be made more natural-looking without making skin, whites, or backgrounds look strange in a new way.
          </p>
          <p className="mt-4 leading-7 text-slate-600">
            Process free in browser first. That gives you a quick read on whether basic color correction is enough. If the image still looks too tinted, AI Restore uses 1 credit for a stronger recovery attempt.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
          <h2 className="text-2xl font-semibold text-slate-950">When browser processing may be enough</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            {previewCases.map((item) => (
              <li className="flex gap-3" key={item}>
                <span className="mt-2 h-2 w-2 rounded-full bg-matcha-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">When to try AI Restore</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            {restoreCases.map((item) => (
              <li className="flex gap-3" key={item}>
                <span className="mt-2 h-2 w-2 rounded-full bg-matcha-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
