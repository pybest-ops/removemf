import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 说明博客列表页用于集中承接 matcha filter 相关教程内容。
export const metadata: Metadata = {
  title: 'Matcha Filter Blog: Guides and Photo Cleanup Tips',
  description: 'Read guides about matcha filters, green tint, yellow cast, free browser processing, and AI Restore for natural photo cleanup.',
  alternates: {
    canonical: '/blog'
  },
  openGraph: {
    title: 'Matcha Filter Blog: Guides and Photo Cleanup Tips',
    description: 'Read guides about matcha filters, green tint, yellow cast, free browser processing, and AI Restore for natural photo cleanup.',
    url: '/blog',
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
    title: 'Matcha Filter Blog: Guides and Photo Cleanup Tips',
    description: 'Read guides about matcha filters, green tint, yellow cast, free browser processing, and AI Restore for natural photo cleanup.',
    images: ['/og-image.png']
  }
};

// blogPosts 定义博客列表页展示的可访问文章入口。
const blogPosts = [
  {
    href: '/what-is-matcha-filter',
    label: 'Definition guide',
    title: 'What Is a Matcha Filter? Green Tint Photo Filter Explained',
    description: 'Learn what a matcha-style filter means for photos, how it affects skin tones and whites, and when cleanup can help.',
    cta: 'Read the explanation'
  },
  {
    href: '/how-to-remove-matcha-filter',
    label: 'How-to guide',
    title: 'How to Remove Matcha Filter from a Photo Online',
    description: 'Follow the shortest path: upload a saved photo, process free in browser, then use AI Restore if the tint needs stronger correction.',
    cta: 'Read the steps'
  }
];

// BlogPage 汇总分散的教程文章，给 Header 的 Blog 菜单提供落点。
export default function BlogPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-matcha-50 to-matcha-100 p-8 shadow-sm ring-1 ring-white/80 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Matcha filter blog</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 md:text-5xl">
              Guides for understanding and reducing matcha-style photo filters.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Start here if a saved photo looks too green, yellow, muted, or hazy. These articles explain the filter and the safest cleanup workflow.
            </p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(31,82,44,0.08)] backdrop-blur">
            <p className="text-sm font-semibold text-slate-950">Recommended path</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Process free in browser first, then spend 1 credit on AI Restore only when basic cleanup is not enough.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {blogPosts.map((post) => (
          <article className="group flex min-h-full flex-col rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(31,82,44,0.12)]" key={post.href}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">{post.label}</p>
            <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950">{post.title}</h2>
            <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{post.description}</p>
            <Link className="mt-6 inline-flex w-fit rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(15,23,42,0.24)] transition group-hover:bg-matcha-800" href={post.href}>
              {post.cta}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
