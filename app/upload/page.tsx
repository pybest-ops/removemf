import { UploadPageFlow } from '@/components/UploadPageFlow';
import Link from 'next/link';

// UploadPage 负责把上传入口的文案层级补完整。
export default function UploadPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <Link className="text-sm font-medium text-matcha-700" href="/">
          Back to home
        </Link>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-matcha-700">Matcha filter remover</p>
      </div>

      <UploadPageFlow />

      <div>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-slate-950 md:text-5xl">
          Remove the green cast, then decide whether AI needs to go further.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Upload a JPG, PNG, or WEBP photo to preview a free browser cleanup first. If the image still looks too tinted, use AI Restore with 1 credit for a stronger result.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <InfoPill title="Step 1" text="Upload one photo with a visible matcha-style tint." />
          <InfoPill title="Step 2" text="Try the free cleanup in your browser before spending a credit." />
          <InfoPill title="Step 3" text="Use AI Restore when you want a stronger color balance." />
        </div>
        <p className="mt-4 text-sm text-slate-500">JPG, PNG, WEBP · Free browser preview · AI Restore is 1 credit per photo · Natural result, not original reconstruction</p>
      </div>
    </main>
  );
}

// InfoPill 用三段短句说明上传页的使用顺序。
function InfoPill({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
