'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { useMemo, useRef, useState } from 'react';
import type { RestoreMode, WhiteBalanceMode, UploadSignResponse } from '@/lib/types';
import type { ChangeEvent, DragEvent } from 'react';
import { useJobPolling } from '@/lib/useJobPolling';

// maxSizeBytes 限制用户首版上传图片体积，避免未接存储前就放大处理成本。
const maxSizeBytes = 10 * 1024 * 1024;

// supportedTypes 是上传页允许的图片格式白名单。
const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

// UploadPageFlow 提供免费浏览器本地基础修图，并引导用户升级到付费 AI Restore。
export function UploadPageFlow() {
  const { creditsBalance, status, user } = useCurrentUser();
  const [file, setFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [freeResultUrl, setFreeResultUrl] = useState<string | null>(null);
  const [isFreeProcessing, setIsFreeProcessing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [restoreMode, setRestoreMode] = useState<RestoreMode>('natural');
  const [skinTonePriority, setSkinTonePriority] = useState(false);
  const [whiteBalanceMode, setWhiteBalanceMode] = useState<WhiteBalanceMode>('standard');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { job, isPolling } = useJobPolling(jobId);

  const canSubmit = useMemo(() => Boolean(file && !isSubmitting), [file, isSubmitting]);

  // selectFile 校验上传图片，并生成本地预览。
  function selectFile(selectedFile: File | null) {
    setErrorMessage(null);
    setNoticeMessage(null);
    setJobId(null);
    setFreeResultUrl(null);

    if (!selectedFile) {
      setFile(null);
      setLocalPreviewUrl(null);
      return;
    }

    if (!supportedTypes.includes(selectedFile.type)) {
      setErrorMessage('Please upload a JPG, PNG, or WEBP image.');
      setFile(null);
      setLocalPreviewUrl(null);
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      setErrorMessage('Please upload an image smaller than 10MB.');
      setFile(null);
      setLocalPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    setLocalPreviewUrl(URL.createObjectURL(selectedFile));
  }

  // handleFileChange 接收文件选择器传入的图片文件。
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0] ?? null);
  }

  // handleDrop 接收用户拖拽到上传区的图片文件。
  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0] ?? null);
  }

  // applyFreeCleanup 在浏览器本地做基础白平衡和轻度色彩清理，不调用后端 AI。
  async function applyFreeCleanup() {
    if (!file || !localPreviewUrl) return;

    setIsFreeProcessing(true);
    setErrorMessage(null);

    try {
      const image = await loadImage(localPreviewUrl);
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = canvasRef.current;

      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;

      context.drawImage(image, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const pixelCount = pixels.length / 4;
      let sumRed = 0;
      let sumGreen = 0;
      let sumBlue = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        sumRed += pixels[i];
        sumGreen += pixels[i + 1];
        sumBlue += pixels[i + 2];
      }

      const meanRed = sumRed / pixelCount;
      const meanGreen = sumGreen / pixelCount;
      const meanBlue = sumBlue / pixelCount;
      const neutral = (meanRed + meanGreen + meanBlue) / 3;
      const redScale = meanRed > 0 ? neutral / meanRed : 1;
      const greenScale = meanGreen > 0 ? neutral / meanGreen : 1;
      const blueScale = meanBlue > 0 ? neutral / meanBlue : 1;
      const saturation = 0.88;
      const contrast = 1.07;

      for (let i = 0; i < pixels.length; i += 4) {
        let red = clampChannel(pixels[i] * redScale);
        let green = clampChannel(pixels[i + 1] * greenScale);
        let blue = clampChannel(pixels[i + 2] * blueScale);

        const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
        red = luminance + (red - luminance) * saturation;
        green = luminance + (green - luminance) * saturation;
        blue = luminance + (blue - luminance) * saturation;

        red = clampChannel((red - 128) * contrast + 128);
        green = clampChannel((green - 128) * contrast + 128);
        blue = clampChannel((blue - 128) * contrast + 128);

        pixels[i] = red;
        pixels[i + 1] = green;
        pixels[i + 2] = blue;
      }

      context.putImageData(imageData, 0, 0);
      setFreeResultUrl(canvas.toDataURL(file.type || 'image/png', 0.9));
    } catch {
      setErrorMessage('Free cleanup could not process this image. Please try a different JPG, PNG, or WEBP file.');
    } finally {
      setIsFreeProcessing(false);
    }
  }

  // handleSubmit 创建上传凭证、上传图片并创建付费 AI 恢复任务。
  async function handleSubmit() {
    if (!file) return;

    if (status !== 'loading' && !user) {
      startGoogleLogin('/upload');
      return;
    }

    if (status !== 'loading' && user && creditsBalance <= 0) {
      setNoticeMessage('You do not have enough credits. Redirecting to Buy credits...');
      setErrorMessage(null);
      window.setTimeout(() => {
        window.location.assign('/pricing');
      }, 1200);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setNoticeMessage(null);

    try {
      const signResponse = await fetch('/api/uploads/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, sizeBytes: file.size })
      });

      if (!signResponse.ok) throw new Error('sign_failed');

      const signResult = (await signResponse.json()) as UploadSignResponse;

      if (signResult.uploadUrl && !signResult.mockUpload) {
        const uploadResponse = await fetch(signResult.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });

        if (!uploadResponse.ok) throw new Error('upload_failed');
      } else if (signResult.mockUpload) {
        const formData = new FormData();
        formData.append('objectKey', signResult.objectKey);
        formData.append('file', file);

        const uploadResponse = await fetch('/api/uploads/direct', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) throw new Error('direct_upload_failed');
      }

      const jobResponse = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputObjectKey: signResult.objectKey,
          modelName: 'black-forest-labs/flux-kontext-pro',
          restoreMode,
          skinTonePriority,
          whiteBalanceMode
        })
      });

      if (!jobResponse.ok) {
        const errorResult = await jobResponse.json();
        if (errorResult.errorCode === 'INSUFFICIENT_CREDITS') {
          throw new Error('INSUFFICIENT_CREDITS');
        }

        if (errorResult.errorCode === 'UNAUTHORIZED') {
          throw new Error('Please sign in with Google before restoring an image.');
        }

        throw new Error(errorResult.errorMessage ?? 'job_failed');
      }

      const jobResult = await jobResponse.json();
      setJobId(jobResult.jobId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="upload" className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/65 shadow-[0_30px_100px_rgba(31,82,44,0.16)] ring-1 ring-matcha-100/50 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/70 bg-white/45 px-5 py-4 md:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-matcha-700">Free preview</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Upload your photo</h2>
        </div>
        <span className="rounded-full border border-matcha-200 bg-white/75 px-4 py-2 text-xs font-semibold text-matcha-800 shadow-sm backdrop-blur">No subscription</span>
      </div>

      <div className="p-4 md:p-6">
        {noticeMessage ? (
          <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50/85 px-4 py-3 text-sm font-semibold text-amber-800 shadow-sm backdrop-blur">
            {noticeMessage}
          </div>
        ) : null}

        <div className={file ? 'grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_24rem]' : ''}>
        <label className="group flex min-h-[22rem] cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-matcha-300/80 bg-gradient-to-br from-white/85 via-matcha-50/80 to-white/60 px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_55px_rgba(31,82,44,0.10)] transition duration-300 hover:-translate-y-1 hover:border-matcha-500 hover:shadow-[0_24px_75px_rgba(31,82,44,0.16)]" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
          {localPreviewUrl ? (
            <div className="w-full space-y-4">
              <div className="rounded-[1.6rem] border border-white/80 bg-white/80 p-3 shadow-[0_20px_60px_rgba(31,82,44,0.14)] backdrop-blur">
                <img className="max-h-[28rem] w-full rounded-[1.25rem] bg-slate-100 object-contain" src={localPreviewUrl} alt="Selected upload preview" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-matcha-700">Preview ready</p>
                <p className="text-sm font-medium text-slate-700">{file?.name ?? 'Selected image'}</p>
                <p className="text-xs leading-5 text-slate-500">Drop another JPG, PNG, or WEBP to replace it.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-md space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-2xl shadow-[0_18px_45px_rgba(31,82,44,0.12)] transition duration-300 group-hover:-translate-y-1">
                ↑
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Step 1 · Upload</p>
              <span className="block text-2xl font-semibold tracking-[-0.03em] text-slate-950">Choose or drop your photo</span>
              <p className="text-sm leading-6 text-slate-500">Use a JPG, PNG, or WEBP image under 10MB. Works best on visible green or yellow tint, especially skin, food, and white backgrounds.</p>
            </div>
          )}
        </label>

        {file ? (
          <div className="space-y-5">
            <section className="rounded-[2rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_55px_rgba(31,82,44,0.10)] backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-matcha-700">Free preview</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-950">Preview basic color cleanup</h3>
                </div>
                <button
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-matcha-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={isFreeProcessing}
                  onClick={applyFreeCleanup}
                  type="button"
                >
                  {isFreeProcessing ? 'Processing...' : freeResultUrl ? 'Refresh preview' : 'Run free preview'}
                </button>
              </div>

              {freeResultUrl ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <figure>
                    <img className="max-h-72 w-full rounded-2xl bg-white object-contain shadow-inner" src={localPreviewUrl ?? undefined} alt="Original photo" />
                    <figcaption className="mt-2 text-xs font-medium text-slate-500">Original</figcaption>
                  </figure>
                  <figure>
                    <img className="max-h-72 w-full rounded-2xl bg-white object-contain shadow-inner" src={freeResultUrl ?? undefined} alt="Free preview result" />
                    <figcaption className="mt-2 text-xs font-medium text-slate-500">Free preview</figcaption>
                  </figure>
                  <a className="inline-flex justify-center rounded-full bg-matcha-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(34,105,51,0.22)] transition hover:-translate-y-0.5 hover:bg-matcha-800 md:col-span-2" download="matcha-free-cleanup.png" href={freeResultUrl}>
                    Download free preview
                  </a>
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Run the free preview to see whether the cast is light enough to stop here or whether AI Restore is worth 1 credit.
                </p>
              )}
            </section>

            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 text-white shadow-[0_24px_75px_rgba(15,23,42,0.28)]">
              <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-matcha-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />

              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-matcha-200">AI Restore</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">Still looks too green?</h3>
                </div>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-black/10 backdrop-blur">
                  1 credit
                </span>
              </div>

              <p className="relative mt-3 text-sm leading-6 text-slate-300">
                Use AI Restore when the free preview still leaves a strong cast or when you want a more natural-looking finish.
              </p>

              <div className="relative mt-5 grid gap-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-white">Restore strength</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(['light', 'natural', 'strong'] as RestoreMode[]).map((mode) => (
                        <button
                          key={mode}
                          className={`rounded-full border px-3 py-2 text-sm font-medium transition ${restoreMode === mode ? 'border-matcha-300 bg-matcha-300 text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]' : 'border-white/10 bg-white/5 text-slate-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10'}`}
                          onClick={() => setRestoreMode(mode)}
                          type="button"
                        >
                          {mode === 'light' ? 'Light' : mode === 'natural' ? 'Natural' : 'Strong'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">White balance</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(['soft', 'standard', 'strong'] as WhiteBalanceMode[]).map((mode) => (
                        <button
                          key={mode}
                          className={`rounded-full border px-3 py-2 text-sm font-medium transition ${whiteBalanceMode === mode ? 'border-cyan-200 bg-cyan-200 text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]' : 'border-white/10 bg-white/5 text-slate-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10'}`}
                          onClick={() => setWhiteBalanceMode(mode)}
                          type="button"
                        >
                          {mode === 'soft' ? 'Soft' : mode === 'standard' ? 'Standard' : 'Strong'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 text-sm font-medium text-white">
                    <input checked={skinTonePriority} onChange={(event) => setSkinTonePriority(event.target.checked)} type="checkbox" />
                    Prioritize natural skin tones
                  </label>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className="rounded-full bg-gradient-to-r from-matcha-300 via-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    type="button"
                  >
                    {isSubmitting ? 'Creating job...' : user ? 'Restore with AI' : 'Sign in to restore'}
                  </button>
                  <Link className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10" href="/pricing">
                    View credits
                  </Link>
                </div>
              </div>

              {job?.status === 'completed' && job.outputPreviewUrl ? (
                <div className="relative mt-5 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-matcha-200">AI result ready</p>
                      <h4 className="mt-1 text-base font-semibold tracking-[-0.02em] text-white">Compare the original and restored image</h4>
                    </div>
                    <Link className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15" href={`/result/${job.jobId}`}>
                      Open full result
                    </Link>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <figure>
                      <img className="max-h-72 w-full rounded-2xl bg-slate-950 object-contain shadow-inner" src={job.inputPreviewUrl ?? localPreviewUrl ?? undefined} alt="Original before AI restore" />
                      <figcaption className="mt-2 text-xs font-medium text-slate-300">Before</figcaption>
                    </figure>
                    <figure>
                      <img className="max-h-72 w-full rounded-2xl bg-slate-950 object-contain shadow-inner" src={job.outputPreviewUrl} alt="AI restored result" />
                      <figcaption className="mt-2 text-xs font-medium text-slate-300">After · AI restored</figcaption>
                    </figure>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        ) : null}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <InfoCard title="Free preview vs AI Restore" text="Free preview is a quick browser pass; AI Restore gives the stronger paid pass." />
          <InfoCard title="Best input" text="Use photos with visible green or yellow tint. Very dark, blurry, or heavily compressed files work less well." />
          <InfoCard title="Credit model" text="There is no subscription. 1 credit creates 1 AI Restore." />
        </div>

        <canvas className="hidden" ref={canvasRef} />
      </div>

      <div className="border-t border-white/70 bg-white/45 px-5 py-4 text-sm text-slate-600 md:px-7">
        {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">{errorMessage === 'INSUFFICIENT_CREDITS' ? 'You need credits before restoring this image.' : errorMessage}</p> : null}
        {!errorMessage ? <p className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">{job ? `Status: ${job.status} (${job.progress}%)` : 'Free preview stays in your browser. AI Restore uploads the selected image for processing.'}</p> : null}
        {job?.restoreMode || job?.whiteBalanceMode || job?.skinTonePriority ? (
          <p className="mt-2 px-4 text-slate-500">
            {[job.restoreMode === 'light' ? 'Light restore' : job.restoreMode === 'strong' ? 'Strong restore' : 'Natural restore', job.whiteBalanceMode === 'soft' ? 'Soft white balance' : job.whiteBalanceMode === 'strong' ? 'Strong white balance' : 'Standard white balance', job.skinTonePriority ? 'Skin tone priority' : null].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        {isPolling ? <p className="mt-2 px-4 font-semibold text-matcha-700">Checking result...</p> : null}
      </div>
    </div>
  );
}

// startGoogleLogin 跳转到服务端 Google OAuth 发起接口。
function startGoogleLogin(returnTo: string) {
  window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
}

// loadImage 将本地预览 URL 加载为可用于 Canvas 绘制的图片对象。
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

// clampChannel 将通道值限制在 0-255 范围内。
function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}


function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_18px_50px_rgba(31,82,44,0.10)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,82,44,0.16)]">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
