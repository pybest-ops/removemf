import { NextResponse } from 'next/server';
import { normalizeReplicateStatus, updateStoredJob } from '@/lib/jobsStore';
import { getReplicateOutputUrl } from '@/lib/replicate';
import { persistRemoteImageToR2 } from '@/lib/storage';

// POST 接收 Replicate webhook，并把 prediction 结果回写到站内任务。
export async function POST(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ errorCode: 'JOB_ID_REQUIRED' }, { status: 400 });
  }

  const prediction = await request.json();
  const status = normalizeReplicateStatus(String(prediction.status ?? ''));
  const outputUrl = getReplicateOutputUrl(prediction.output);

  if (status === 'completed' && outputUrl) {
    const persistedImage = await persistRemoteImageToR2(outputUrl, jobId);

    updateStoredJob(jobId, {
      status,
      progress: 100,
      outputObjectKey: persistedImage.objectKey,
      outputPreviewUrl: persistedImage.publicUrl
    });

    return NextResponse.json({ ok: true });
  }

  if (status === 'failed') {
    updateStoredJob(jobId, {
      status,
      progress: 100,
      errorCode: 'MODEL_ERROR',
      errorMessage: String(prediction.error ?? 'Replicate prediction failed.')
    });

    return NextResponse.json({ ok: true });
  }

  updateStoredJob(jobId, { status, progress: status === 'processing' ? 50 : 10 });

  return NextResponse.json({ ok: true });
}
