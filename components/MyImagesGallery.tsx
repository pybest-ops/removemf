'use client';

import { useEffect, useState } from 'react';
import { localizePath } from '@/lib/i18n/config';
import { interpolate } from '@/lib/i18n/dictionaries';
import { useI18n } from './i18n/I18nProvider';

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
  const { dictionary, locale } = useI18n();
  const copy = dictionary.myImages.gallery;
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

        setErrorMessage(copy.error.title);
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
      setErrorMessage(copy.error.title);
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
      setErrorMessage(copy.error.title);
    } finally {
      setDeletingJobId(null);
    }
  }

  if (status === 'loading') {
    return <GalleryShell eyebrow={copy.loading.eyebrow} title={copy.loading.title} text={copy.loading.text} />;
  }

  if (status === 'unauthenticated') {
    return (
      <GalleryShell eyebrow={copy.signedOut.eyebrow} title={copy.signedOut.title} text={copy.signedOut.text}>
        <button className="mt-6 rounded-full bg-gradient-to-r from-matcha-500 via-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(34,197,94,0.22)] transition hover:-translate-y-0.5 hover:brightness-105" onClick={() => startGoogleLogin(localizePath('/my-images', locale))} type="button">
          {copy.signedOut.cta}
        </button>
      </GalleryShell>
    );
  }

  if (status === 'error') {
    return <GalleryShell eyebrow={copy.error.eyebrow} title={copy.error.title} text={errorMessage ?? copy.error.retry} />;
  }

  if (!images.length) {
    return (
      <GalleryShell eyebrow={copy.empty.eyebrow} title={copy.empty.title} text={copy.empty.text}>
        <a className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-matcha-800" href={localizePath('/matcha-filter-remover', locale)}>
          {copy.empty.cta}
        </a>
      </GalleryShell>
    );
  }

  return (
    <section className="rounded-[2.5rem] border border-white/70 bg-white/65 p-5 shadow-[0_30px_100px_rgba(31,82,44,0.12)] backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-matcha-700">{copy.title}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">{dictionary.myImages.title}</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">{interpolate(copy.subtitle, { count: images.length })}</p>
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
              <p className="mt-3 rounded-2xl bg-matcha-50 px-3 py-2 text-xs font-medium leading-5 text-matcha-900">{formatRestoreSummary(image, copy)}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-matcha-800" onClick={() => void handleDownload(image)} type="button">
                  {copy.download}
                </button>
                <button className="rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60" disabled={deletingJobId === image.jobId} onClick={() => void handleDelete(image)} type="button">
                  {deletingJobId === image.jobId ? copy.deleting : copy.delete}
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
function formatRestoreSummary(image: HistoryImage, copy: ReturnType<typeof useI18n>['dictionary']['myImages']['gallery']) {
  return [image.restoreMode === 'light' ? copy.modes.light : image.restoreMode === 'strong' ? copy.modes.strong : copy.modes.natural, image.whiteBalanceMode === 'soft' ? copy.modes.soft : image.whiteBalanceMode === 'strong' ? copy.modes.strongWhite : copy.modes.standard, image.skinTonePriority ? copy.modes.skin : null].filter(Boolean).join(' · ');
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
