'use client';

import { useEffect, useState } from 'react';

// HistoryImage 表示我的图片页展示所需的最小 AI Restore 结果字段。
type HistoryImage = {
  createdAt: string;
  jobId: string;
  outputPreviewUrl: string;
  restoreMode?: 'light' | 'natural' | 'strong';
  skinTonePriority?: boolean;
  updatedAt: string;
  whiteBalanceMode?: 'soft' | 'standard' | 'strong';
};

// GalleryStatus 表示历史图库加载阶段。
type GalleryStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// MyImagesGallery 展示当前用户已完成的 AI Restore 历史图片。
export function MyImagesGallery() {
  const [images, setImages] = useState<HistoryImage[]>([]);
  const [status, setStatus] = useState<GalleryStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadImages() {
      try {
        const response = await fetch('/api/jobs/history', { credentials: 'include' });

        if (response.status === 401) {
          if (!isActive) return;
          setStatus('unauthenticated');
          setImages([]);
          return;
        }

        if (!response.ok) throw new Error('history_failed');

        const result = (await response.json()) as { images?: HistoryImage[] };

        if (!isActive) return;

        setImages(result.images ?? []);
        setStatus('authenticated');
      } catch {
        if (!isActive) return;

        setErrorMessage('Your images could not be loaded. Please refresh and try again.');
        setStatus('error');
      }
    }

    void loadImages();

    return () => {
      isActive = false;
    };
  }, []);

  // handleDownload 请求受保护的短期下载地址，再触发浏览器下载。
  async function handleDownload(image: HistoryImage) {
    try {
      const response = await fetch(`/api/jobs/${image.jobId}/download`, { credentials: 'include' });

      if (!response.ok) throw new Error('download_failed');

      const result = (await response.json()) as { downloadUrl?: string };

      if (!result.downloadUrl) throw new Error('download_url_missing');

      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = `matcha-ai-restore-${image.jobId}.png`;
      link.rel = 'noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setErrorMessage('Download could not start. Please try again.');
    }
  }

  // handleDelete 软删除用户自己的历史图片，并从当前列表移除。
  async function handleDelete(image: HistoryImage) {
    const confirmed = window.confirm('Remove this AI Restore result from your image history? This does not refund credits.');

    if (!confirmed) return;

    const previousImages = images;
    setDeletingJobId(image.jobId);
    setImages((currentImages) => currentImages.filter((currentImage) => currentImage.jobId !== image.jobId));
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/jobs/${image.jobId}`, { credentials: 'include', method: 'DELETE' });

      if (!response.ok) throw new Error('delete_failed');
    } catch {
      setImages(previousImages);
      setErrorMessage('This image could not be deleted. Please try again.');
    } finally {
      setDeletingJobId(null);
    }
  }

  if (status === 'loading') {
    return <GalleryShell eyebrow="Loading vault" title="Checking your private image history." text="We are looking for completed AI Restore results from your signed-in account." />;
  }

  if (status === 'unauthenticated') {
    return (
      <GalleryShell eyebrow="Sign in required" title="Your image history is private." text="Sign in with Google to view AI Restore results saved to your account.">
        <button className="mt-6 rounded-full bg-gradient-to-r from-matcha-500 via-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(34,197,94,0.22)] transition hover:-translate-y-0.5 hover:brightness-105" onClick={() => startGoogleLogin('/my-images')} type="button">
          Sign in to view images
        </button>
      </GalleryShell>
    );
  }

  if (status === 'error') {
    return <GalleryShell eyebrow="Loading failed" title="Your image history is temporarily unavailable." text={errorMessage ?? 'Please refresh and try again.'} />;
  }

  if (!images.length) {
    return (
      <GalleryShell eyebrow="No AI Restore images yet" title="Your private gallery is empty." text="Only completed AI Restore results appear here. Free preview images stay in your browser and are not saved to history.">
        <a className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-matcha-800" href="/upload">
          Upload a photo
        </a>
      </GalleryShell>
    );
  }

  return (
    <section className="rounded-[2.5rem] border border-white/70 bg-white/65 p-5 shadow-[0_30px_100px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-matcha-700">Private gallery</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">Your AI Restore history.</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">{images.length} saved AI Restore {images.length === 1 ? 'result' : 'results'} · Free preview images are not stored here.</p>
      </div>

      {errorMessage ? <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p> : null}

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {images.map((image) => (
          <article className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_18px_55px_rgba(31,82,44,0.10)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(31,82,44,0.16)]" key={image.jobId}>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-950">
              <img className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]" src={image.outputPreviewUrl} alt="AI Restore result" />
              <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Private</div>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-matcha-700">AI Restore</p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">Restored image</h3>
              <p className="mt-2 text-sm text-slate-500">Created {formatDate(image.createdAt)}</p>
              <p className="mt-3 rounded-2xl bg-matcha-50 px-3 py-2 text-xs font-medium leading-5 text-matcha-900">{formatRestoreSummary(image)}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-matcha-800" onClick={() => void handleDownload(image)} type="button">
                  Download
                </button>
                <button className="rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60" disabled={deletingJobId === image.jobId} onClick={() => void handleDelete(image)} type="button">
                  {deletingJobId === image.jobId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// GalleryShell 统一展示加载、未登录、空历史和错误状态。
function GalleryShell({ children, eyebrow, text, title }: { children?: React.ReactNode; eyebrow: string; text: string; title: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/65 p-8 text-center shadow-[0_30px_100px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-12">
      <div className="pointer-events-none absolute left-1/2 top-6 h-32 w-32 -translate-x-1/2 rounded-full bg-matcha-200/50 blur-3xl" />
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-2xl text-white shadow-[0_20px_55px_rgba(15,23,42,0.22)]">✦</div>
      <p className="relative mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-matcha-700">{eyebrow}</p>
      <h2 className="relative mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">{title}</h2>
      <p className="relative mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">{text}</p>
      {children}
    </section>
  );
}

// formatRestoreSummary 把 AI Restore 设置转换成图片卡片内的短说明。
function formatRestoreSummary(image: HistoryImage) {
  return [image.restoreMode === 'light' ? 'Light restore' : image.restoreMode === 'strong' ? 'Strong restore' : 'Natural restore', image.whiteBalanceMode === 'soft' ? 'Soft white balance' : image.whiteBalanceMode === 'strong' ? 'Strong white balance' : 'Standard white balance', image.skinTonePriority ? 'Skin tone priority' : null].filter(Boolean).join(' · ');
}

// formatDate 把服务端时间转换为用户本地可读日期。
function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'recently';

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

// startGoogleLogin 跳转到服务端 Google OAuth 发起接口。
function startGoogleLogin(returnTo: string) {
  window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
}
