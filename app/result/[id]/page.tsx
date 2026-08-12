import Link from 'next/link';

// ResultPage 说明单个恢复任务结果页应展示的核对和下载信息。
export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Result</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950">Review your natural restoration result.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Job ID: <span className="font-mono text-slate-800">{params.id}</span>. This page explains what a completed result should show while the live preview is fetched by the upload flow.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-slate-950 p-6 text-white">
          <h2 className="text-2xl font-semibold">Before / after checklist</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <PreviewPanel label="Before" description="Green or yellow cast visible in the uploaded image." tone="bg-[linear-gradient(135deg,#dfe8c8,#9ebf8e)]" />
            <PreviewPanel label="After" description="More balanced color with a natural-looking output." tone="bg-[linear-gradient(135deg,#f1dfc8,#d2ad87)]" />
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-2xl font-semibold text-slate-950">Download guidance</h2>
          <p className="mt-4 leading-7 text-slate-600">
            When a job completes, the upload flow links to the generated image. If the result is not ready or has expired, retry the upload with a clear photo.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p>Do not treat the output as the exact original file.</p>
            <p>Use the result only if the color balance meets your needs.</p>
            <p>Check the Refund Policy before buying paid credits.</p>
          </div>
          <Link className="mt-7 inline-flex rounded-full bg-matcha-700 px-5 py-2.5 text-sm font-semibold text-white" href="/#upload">
            Restore another photo
          </Link>
        </aside>
      </section>
    </main>
  );
}

// PreviewPanel 用于展示结果页 before / after 的视觉占位模块。
function PreviewPanel({ label, description, tone }: { label: string; description: string; tone: string }) {
  return (
    <article className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className={`h-52 rounded-2xl ${tone}`} />
      <h3 className="mt-4 text-lg font-semibold">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}
