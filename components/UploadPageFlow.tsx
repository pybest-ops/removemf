'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { useMemo, useRef, useState } from 'react';
import type { Job, RestoreMode, WhiteBalanceMode, UploadSignResponse } from '@/lib/types';
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

  // activeAiStatuses 表示用户仍在等待 AI Restore 输出的非终态任务。
  const activeAiStatuses = ['created', 'queued', 'processing'];
  // isAiRunning 保持按钮与进度卡同步，避免创建任务后按钮过早恢复普通状态。
  const isAiRunning = isSubmitting || Boolean(jobId && !job) || Boolean(job && activeAiStatuses.includes(job.status));
  // aiProgressPercent 为提交初期和轮询阶段提供稳定的前端展示百分比。
  const aiProgressPercent = isSubmitting && !job ? 5 : job?.progress ?? 0;
  const canSubmit = useMemo(() => Boolean(file && !isAiRunning), [file, isAiRunning]);
  const aiRestoreSummary = getAiRestoreSummary({ restoreMode, whiteBalanceMode, skinTonePriority });

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
      startGoogleLogin('/matcha-filter-remover');
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
      const signResponse = await fetch('/api/matcha-filter-removers/sign', {
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

        const uploadResponse = await fetch('/api/matcha-filter-removers/direct', {
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

              {isSubmitting || job ? <AiProgressPanel job={job} isPolling={isPolling} isSubmitting={isSubmitting} progress={aiProgressPercent} restoreSummary={aiRestoreSummary} /> : null}

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
                    {isAiRunning ? `AI Restore running · ${aiProgressPercent}%` : user ? 'Restore with AI' : 'Sign in to restore'}
                  </button>
                  <Link className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10" href="/pricing">
                    View credits
                  </Link>
                </div>
              </div>
            </section>
          </div>
        ) : null}
        </div>

        {job?.status === 'completed' && job.outputPreviewUrl ? <AiResultStudio job={job} originalUrl={job.inputPreviewUrl ?? localPreviewUrl ?? undefined} /> : null}

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <InfoCard title="Free preview vs AI Restore" text="Free preview is a quick browser pass; AI Restore gives the stronger paid pass." />
          <InfoCard title="Best input" text="Use photos with visible green or yellow tint. Very dark, blurry, or heavily compressed files work less well." />
          <InfoCard title="Credit model" text="There is no subscription. 1 credit creates 1 AI Restore." />
        </div>

        <canvas className="hidden" ref={canvasRef} />
      </div>

      <div className="border-t border-white/70 bg-white/45 px-5 py-4 text-sm text-slate-600 md:px-7">
        {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">{errorMessage === 'INSUFFICIENT_CREDITS' ? 'You need credits before restoring this image.' : errorMessage}</p> : null}
        {!errorMessage && !job ? <p className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">Free preview stays in your browser. AI Restore uploads the selected image for processing.</p> : null}
      </div>
    </div>
  );
}

// getJobStageLabel 将任务状态和进度转换为用户可理解的处理阶段。
function getJobStageLabel({ isPolling, isSubmitting, job, progress }: { isPolling: boolean; isSubmitting: boolean; job: Job | null; progress: number }) {
  if (isSubmitting && !job) return 'Creating job';
  if (!job) return 'Ready to start';
  if (job.status === 'created') return 'Queued';
  if (job.status === 'queued') return 'Queued';
  if (job.status === 'processing' && progress >= 90) return 'Finalizing';
  if (job.status === 'processing') return isPolling ? 'Processing' : 'Checking result';
  if (job.status === 'completed') return 'Result ready';
  if (job.status === 'failed') return 'Failed';
  if (job.status === 'expired') return 'Expired';
  return 'Checking result';
}

// getAiRestoreSummary 汇总用户选择的 AI Restore 参数，方便在进度卡中持续展示。
function getAiRestoreSummary({ restoreMode, skinTonePriority, whiteBalanceMode }: { restoreMode: RestoreMode; skinTonePriority: boolean; whiteBalanceMode: WhiteBalanceMode }) {
  return [restoreMode === 'light' ? 'Light restore' : restoreMode === 'strong' ? 'Strong restore' : 'Natural restore', whiteBalanceMode === 'soft' ? 'Soft white balance' : whiteBalanceMode === 'strong' ? 'Strong white balance' : 'Standard white balance', skinTonePriority ? 'Skin tone priority' : null].filter(Boolean).join(' · ');
}

// AiProgressPanel 在 AI Restore 面板内展示强视觉进度，避免用户错过底部状态。
function AiProgressPanel({ isPolling, isSubmitting, job, progress, restoreSummary }: { isPolling: boolean; isSubmitting: boolean; job: Job | null; progress: number; restoreSummary: string }) {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const stageLabel = getJobStageLabel({ isPolling, isSubmitting, job, progress: safeProgress });
  const isTerminalError = job?.status === 'failed' || job?.status === 'expired';
  const panelTone = isTerminalError ? 'border-red-300/30 bg-red-950/25' : job?.status === 'completed' ? 'border-matcha-300/30 bg-matcha-300/10' : 'border-white/10 bg-white/10';

  return (
    <div className={`relative mt-5 overflow-hidden rounded-[1.5rem] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur ${panelTone}`}>
      <div className="pointer-events-none absolute -right-8 top-2 h-20 w-20 rounded-full bg-cyan-300/20 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-matcha-200">AI processing</p>
          <h4 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white">{stageLabel}</h4>
          <p className="mt-2 text-xs leading-5 text-slate-300">{isTerminalError ? job?.errorMessage ?? 'The AI Restore did not produce a result. You can retry with the same photo.' : restoreSummary}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-semibold tracking-[-0.06em] text-white">{safeProgress}%</p>
          <p className="mt-1 text-xs font-medium text-slate-400">{job?.jobId ? 'Job active' : 'Starting'}</p>
        </div>
      </div>
      <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-matcha-300 via-emerald-300 to-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.35)] transition-all duration-700" style={{ width: `${safeProgress}%` }} />
      </div>
      <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>{job?.status ? `Status: ${job.status}` : 'Creating upload and job records'}</span>
        {job?.status === 'completed' && job.outputPreviewUrl ? (
          <a className="rounded-full bg-gradient-to-r from-matcha-300 via-emerald-300 to-cyan-300 px-4 py-2 font-semibold text-slate-950 shadow-[0_14px_35px_rgba(103,232,249,0.22)] transition hover:-translate-y-0.5 hover:brightness-105" href="#ai-result-studio">
            View AI Result Studio ↓
          </a>
        ) : (
          <span>{isPolling ? 'Checking result automatically' : 'Waiting for next step'}</span>
        )}
      </div>
    </div>
  );
}

// AiResultStudio 在上传页直接展示完整 AI 结果，不强制用户跳转到结果页。
function AiResultStudio({ job, originalUrl }: { job: Job; originalUrl?: string }) {
  return (
    <section className="mt-5 scroll-mt-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_24px_80px_rgba(31,82,44,0.14)] backdrop-blur-xl md:p-6" id="ai-result-studio">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-matcha-700">AI Result Studio</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Your restored image is ready here.</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Review the AI Restore output directly on this page. Natural result, not exact original.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a className="inline-flex justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-matcha-800" href={job.outputPreviewUrl} rel="noreferrer" target="_blank">
            Open image in new tab
          </a>
          <a className="inline-flex justify-center rounded-full bg-gradient-to-r from-matcha-500 via-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(34,197,94,0.22)] transition hover:-translate-y-0.5 hover:brightness-105" download="matcha-ai-restore.png" href={job.outputPreviewUrl}>
            Download image
          </a>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <figure className="rounded-[1.5rem] border border-white/80 bg-white/70 p-3 shadow-inner">
          {originalUrl ? <img className="max-h-[24rem] w-full rounded-[1.15rem] bg-slate-100 object-contain" src={originalUrl} alt="Original before AI restore" /> : <div className="flex h-72 items-center justify-center rounded-[1.15rem] bg-slate-100 text-sm text-slate-500">Original image not available</div>}
          <figcaption className="mt-3 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Before</figcaption>
        </figure>
        <figure className="relative overflow-hidden rounded-[1.5rem] border border-matcha-200/70 bg-slate-950 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-matcha-300/20 blur-3xl" />
          <img className="relative max-h-[34rem] w-full rounded-[1.15rem] bg-slate-900 object-contain" src={job.outputPreviewUrl} alt="AI restored full result" />
          <figcaption className="relative mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-matcha-200">
            <span>After · AI restored</span>
            <span>{job.progress}% complete</span>
          </figcaption>
        </figure>
      </div>
    </section>
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
