import { Footer } from '@/components/Footer';
import { MyImagesGallery } from '@/components/MyImagesGallery';
import type { Metadata } from 'next';

// metadata 声明我的图片页不需要争取 SEO，只保留规范地址。
export const metadata: Metadata = {
  alternates: {
    canonical: '/my-images'
  },
  robots: {
    follow: false,
    index: false
  },
  title: 'My Images | Remove Matcha Filter'
};

// MyImagesPage 展示当前用户私密 AI Restore 历史图库。
export default function MyImagesPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-matcha-200/45 blur-3xl animate-glow-drift" />
      <div className="pointer-events-none absolute right-[-9rem] top-48 -z-10 h-96 w-96 rounded-full bg-amber-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-[-10rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8 lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-10 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">Private Matcha Vault</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 md:text-6xl">
              My private AI restored images.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Only AI Restore results are saved here. Free preview images stay in your browser and are not added to your history.
            </p>
          </div>
          <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-300">Privacy first</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Private to your signed-in account.</p>
            <p className="mt-4 leading-7 text-slate-300">
              Your images are not shown publicly. Manage completed AI Restore results, download them again, or remove them from history.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoCard title="AI Restore results only" text="Free preview images stay local in your browser and do not appear in this gallery." />
          <InfoCard title="Private account access" text="History is loaded only after Google sign-in and scoped to your account." />
          <InfoCard title="Download or delete" text="Save a completed result again, or remove it from your image history." />
        </section>

        <div className="mt-8">
          <MyImagesGallery />
        </div>

        <Footer />
      </div>
    </main>
  );
}

// InfoCard 展示我的图片页的隐私和管理说明。
function InfoCard({ text, title }: { text: string; title: string }) {
  return (
    <article className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(31,82,44,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,82,44,0.14)]">
      <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
