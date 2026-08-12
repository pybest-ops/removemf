import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-10">
      <section className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-matcha-700">Remove Matcha Filter</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-slate-900">
          Restore a natural look from matcha-toned photos.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Upload a photo, let AI reduce the greenish cast, and download a more natural result in seconds.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-matcha-700 px-6 py-3 text-sm font-semibold text-white" href="/upload">
            Upload a photo
          </Link>
          <Link className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700" href="/pricing">
            View credits
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Feature title="Fast" text="Single-photo AI restoration with a simple upload flow." />
        <Feature title="Natural" text="Reduce matcha-style tint without overprocessing the image." />
        <Feature title="Simple" text="Preview before and after, then download the result." />
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
