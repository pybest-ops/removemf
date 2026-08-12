'use client';

import { useMemo, useState } from 'react';
import type { UploadSignResponse } from '@/lib/types';
import { useJobPolling } from '@/lib/useJobPolling';

// maxSizeBytes 限制用户首版上传图片体积，避免未接存储前就放大处理成本。
const maxSizeBytes = 10 * 1024 * 1024;

// supportedTypes 是首版允许上传的图片格式白名单。
const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

// ImageUploadFlow 提供图片选择、上传任务创建和任务状态轮询的主流程。
export function ImageUploadFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { job, isPolling } = useJobPolling(jobId);

  const canSubmit = useMemo(() => Boolean(file && !isSubmitting), [file, isSubmitting]);

  // handleFileChange 负责校验文件类型和大小，并生成本地预览。
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

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

  // handleSubmit 负责创建上传凭证、上传文件并创建 AI 恢复任务。
  async function handleSubmit() {
    if (!file) return;

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

      if (!jobResponse.ok) throw new Error('job_failed');

      const jobResult = await jobResponse.json();

      setJobId(jobResult.jobId);
    } catch {
      setErrorMessage('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <label className="flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 text-center text-slate-500 transition hover:border-matcha-300 hover:bg-matcha-50">
          <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
          {localPreviewUrl ? (
            <img className="max-h-72 rounded-xl object-contain" src={localPreviewUrl} alt="Selected upload preview" />
          ) : (
            <span>Choose a JPG, PNG, or WEBP image under 10MB.</span>
          )}
        </label>

        {errorMessage ? <p className="mt-4 text-sm text-red-600">{errorMessage}</p> : null}

        <button
          className="mt-5 rounded-full bg-matcha-700 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          {isSubmitting ? 'Creating job...' : 'Restore image'}
        </button>
      </section>

      <aside className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h2 className="text-lg font-semibold text-slate-900">Result status</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {job ? `Status: ${job.status} (${job.progress}%)` : 'Upload an image to create a restoration job.'}
        </p>
        {isPolling ? <p className="mt-2 text-sm text-matcha-700">Checking result...</p> : null}
        {job?.status === 'completed' && job.outputPreviewUrl ? (
          <div className="mt-5 space-y-3">
            <img className="rounded-xl border border-slate-200" src={job.outputPreviewUrl} alt="AI restored result" />
            <a className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white" href={`/result/${job.jobId}`}>
              View result
            </a>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
