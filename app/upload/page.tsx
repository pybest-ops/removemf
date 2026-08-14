import { Footer } from '@/components/Footer';
import { UploadPageFlow } from '@/components/UploadPageFlow';
import Link from 'next/link';
import type { Metadata } from 'next';

// metadata 声明上传页的规范地址，避免入口页面被识别为重复内容。
export const metadata: Metadata = {
  alternates: {
    canonical: '/upload'
  }
};

// guidanceSteps 说明上传页从免费预览到 AI Restore 的完整工作流。
const guidanceSteps = [
  { title: 'Upload', text: 'Drop one photo with a visible matcha-style green or yellow cast.' },
  { title: 'Preview', text: 'Run the free preview before spending a credit.' },
  { title: 'Restore', text: 'Use AI Restore when the image still needs stronger cast reduction.' }
];

// UploadPage 展示图片清理工作流的页面级布局。
export default function UploadPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-matcha-200/45 blur-3xl animate-glow-drift" />
      <div className="pointer-events-none absolute right-[-9rem] top-44 -z-10 h-96 w-96 rounded-full bg-amber-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-[-10rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link className="rounded-full border border-matcha-200 bg-white/70 px-4 py-2 text-sm font-semibold text-matcha-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white" href="/">
            Back to home
          </Link>
          <p className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-matcha-700 shadow-sm backdrop-blur">Matcha filter remover</p>
        </div>

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
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">Photo cleanup workflow</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-slate-950 md:text-5xl">
                Upload, preview, then restore.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Start with a free preview. If the photo still has a green or yellow cast, use AI Restore with 1 credit for a stronger natural result.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-matcha-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-matcha-800 shadow-sm backdrop-blur">Free preview first</span>
                <span className="rounded-full border border-matcha-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-matcha-800 shadow-sm backdrop-blur">1 credit for AI Restore</span>
                <span className="rounded-full border border-matcha-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-matcha-800 shadow-sm backdrop-blur">Natural result, not exact original</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {guidanceSteps.map((step, index) => (
                <InfoPill key={step.title} title={`Step ${index + 1} · ${step.title}`} text={step.text} />
              ))}
            </div>
          </section>
        </div>

        <p className="text-center text-sm text-slate-500">JPG, PNG, WEBP · Free preview · AI Restore is 1 credit per photo · Natural result, not exact original</p>
        <Footer />
      </div>
    </main>
  );
}

// InfoPill 用玻璃卡片说明上传页的核心步骤。
function InfoPill({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_18px_50px_rgba(31,82,44,0.10)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,82,44,0.16)]">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
