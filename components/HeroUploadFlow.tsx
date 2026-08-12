'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import matchaExample from '@/app/assets/matcha-example.avif';
import normalExample from '@/app/assets/normal-example.avif';
import type { UploadSignResponse } from '@/lib/types';
import { useJobPolling } from '@/lib/useJobPolling';

// maxSizeBytes 限制首页首屏上传图片体积，控制图片处理成本。
const maxSizeBytes = 10 * 1024 * 1024;

// supportedTypes 定义首页上传支持的图片格式白名单。
const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

// HeroUploadFlow 把图片上传、任务创建和示例对比集中在首页 Hero 区域。
export function HeroUploadFlow() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { job, isPolling } = useJobPolling(jobId);

  const canSubmit = useMemo(() => Boolean(file && !isSubmitting), [file, isSubmitting]);

  // selectFile 校验首页上传文件，并生成本地预览。
  function selectFile(selectedFile: File | null) {
    setErrorMessage(null);
    setJobId(null);

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

  // handleDrop 接收用户拖拽到 Hero 上传区的图片文件。
  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0] ?? null);
  }

  // handleSubmit 创建上传凭证、上传图片并创建 AI 恢复任务。
  async function handleSubmit() {
    if (!file) return;

    if (status !== 'loading' && !session?.user) {
      showLoginWipMessage();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

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
        body: JSON.stringify({ inputObjectKey: signResult.objectKey, modelName: 'fofr/color-matcher' })
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
    <div id="upload" className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-matcha-100">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-matcha-700">Try it now</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Upload your photo</h2>
        </div>
        <span className="rounded-full bg-matcha-50 px-3 py-1 text-xs font-semibold text-matcha-800">1 credit</span>
      </div>

      <BeforeAfterSlider />

      <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-[1fr_auto]">
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-matcha-200 bg-matcha-50/60 px-5 text-center transition hover:border-matcha-400 hover:bg-matcha-50" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
          {localPreviewUrl ? (
            <img className="max-h-24 rounded-xl object-contain" src={localPreviewUrl} alt="Selected upload preview" />
          ) : (
            <span className="text-sm font-medium text-slate-700">Choose or drop a JPG, PNG, or WEBP image</span>
          )}
        </label>

        <div className="flex flex-col gap-3 sm:w-48">
          <button
            className="rounded-full bg-matcha-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-matcha-700/20 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!canSubmit}
            onClick={handleSubmit}
            type="button"
          >
            {isSubmitting ? 'Creating job...' : session?.user ? 'Restore image' : 'Sign in to restore'}
          </button>
          <Link className="rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700" href="/pricing">
            View credits
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
        {errorMessage ? <p className="text-red-600">{errorMessage === 'INSUFFICIENT_CREDITS' ? 'You need credits before restoring this image.' : errorMessage}</p> : null}
        {!errorMessage ? <p>{job ? `Status: ${job.status} (${job.progress}%)` : 'Your image stays private in this upload flow.'}</p> : null}
        {isPolling ? <p className="mt-1 text-matcha-700">Checking result...</p> : null}
        {job?.status === 'completed' && job.outputPreviewUrl ? (
          <Link className="mt-3 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white" href={`/result/${job.jobId}`}>
            View result
          </Link>
        ) : null}
      </div>
    </div>
  );
}

// showLoginWipMessage 提示用户当前登录功能仍在开发中。
function showLoginWipMessage() {
  window.alert('Feature under development. Stay tuned.');
}

// BeforeAfterSlider 用本地示例图展示滤镜移除前后的可拖动对比。
function BeforeAfterSlider() {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
      <Image alt="Matcha filter example" className="absolute inset-0 h-full w-full object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src={matchaExample} />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}>
        <Image alt="Natural color example" className="h-full w-full object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src={normalExample} />
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${sliderValue}%` }} />
      <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white">Matcha filter</div>
      <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">Restored</div>
      <label className="sr-only" htmlFor="hero-before-after-slider">Compare matcha filter and restored photo</label>
      <input
        id="hero-before-after-slider"
        aria-label="Compare matcha filter and restored photo"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        max="100"
        min="0"
        onChange={(event) => setSliderValue(Number(event.target.value))}
        type="range"
        value={sliderValue}
      />
      <div className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow" style={{ left: `${sliderValue}%` }}>
        ↔
      </div>
    </div>
  );
}
