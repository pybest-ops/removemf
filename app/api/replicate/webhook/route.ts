import { NextResponse } from 'next/server';
import { refundJobCreditsAsync } from '@/lib/billingStore';
import { getStoredJobAsync, normalizeReplicateStatus, updateStoredJobAsync } from '@/lib/jobsStore';
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

    await updateStoredJobAsync(jobId, {
      status,
      progress: 100,
      outputObjectKey: persistedImage.objectKey,
      outputPreviewUrl: persistedImage.publicUrl
    });

    return NextResponse.json({ ok: true });
  }

  if (status === 'failed') {
    const job = await getStoredJobAsync(jobId);

    if (job?.userId && !job.creditsRefunded) {
      await refundJobCreditsAsync({ userId: job.userId, jobId: job.jobId, credits: job.costCredits });
    }

    await updateStoredJobAsync(jobId, {
      status,
      progress: 100,
      creditsRefunded: true,
      errorCode: 'MODEL_ERROR',
      errorMessage: String(prediction.error ?? 'Replicate prediction failed.')
    });

    return NextResponse.json({ ok: true });
  }

  await updateStoredJobAsync(jobId, { status, progress: status === 'processing' ? 50 : 10 });

  return NextResponse.json({ ok: true });
}
