import { ImageUploadFlow } from '@/components/ImageUploadFlow';

export default function UploadPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Upload a photo</h1>
        <p className="mt-2 text-slate-600">Send one image to restore a more natural color balance.</p>
      </header>

      <ImageUploadFlow />
    </main>
  );
}
