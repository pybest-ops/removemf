import { localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { createI18nMetadata } from '@/lib/i18n/metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 说明博客列表页用于集中承接 matcha filter 相关教程内容。
export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale);

  return createI18nMetadata(locale, '/blog', dictionary.metadata.blog);
}

// BlogPage 汇总分散的教程文章，给 Header 的 Blog 菜单提供落点。
export default function BlogPage() {
  const locale = getRequestLocale();
  const dictionary = getDictionary(locale).blog;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-matcha-50 to-matcha-100 p-8 shadow-sm ring-1 ring-white/80 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">{dictionary.eyebrow}</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 md:text-5xl">
              {dictionary.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {dictionary.description}
            </p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(31,82,44,0.08)] backdrop-blur">
            <p className="text-sm font-semibold text-slate-950">{dictionary.pathTitle}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {dictionary.pathText}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {dictionary.posts.map((post) => (
          <article className="group flex min-h-full flex-col rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(31,82,44,0.12)]" key={post.href}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">{post.label}</p>
            <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950">{post.title}</h2>
            <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{post.description}</p>
            <Link className="mt-6 inline-flex w-fit rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(15,23,42,0.24)] transition group-hover:bg-matcha-800" href={localizePath(post.href, locale)}>
              {post.cta}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
