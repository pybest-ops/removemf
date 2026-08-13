import { NextResponse } from 'next/server';
import { refundJobCreditsAsync } from '@/lib/billingStore';
import { getStoredJobAsync, normalizeReplicateStatus, updateStoredJobAsync } from '@/lib/jobsStore';
import { getReplicateOutputUrl, getReplicatePrediction } from '@/lib/replicate';
import { persistRemoteImageToR2 } from '@/lib/storage';
import { getRestoreSettingsSummary } from '@/lib/restoreSettings';

// GET 查询图片恢复任务状态；有 Replicate prediction 时同步刷新状态。
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = await getStoredJobAsync(params.id);

  if (!job) {
    return NextResponse.json({ errorCode: 'JOB_NOT_FOUND' }, { status: 404 });
  }

  const restoreSummary = getRestoreSettingsSummary({
    restoreMode: job.restoreMode ?? 'natural',
    skinTonePriority: job.skinTonePriority ?? false,
    whiteBalanceMode: job.whiteBalanceMode ?? 'standard'
  });

  if (job.replicatePredictionId && job.status !== 'completed' && job.status !== 'failed') {
    const prediction = await getReplicatePrediction(job.replicatePredictionId);
    const status = normalizeReplicateStatus(prediction.status);
    const progress = status === 'completed' ? 100 : status === 'processing' ? 50 : 10;
    const outputUrl = getReplicateOutputUrl(prediction.output);

    if (status === 'completed' && outputUrl) {
      const persistedImage = await persistRemoteImageToR2(outputUrl, job.jobId);

      const completedJob = await updateStoredJobAsync(job.jobId, {
        status,
        progress: 100,
        outputObjectKey: persistedImage.objectKey,
        outputPreviewUrl: persistedImage.publicUrl
      });

      return NextResponse.json({ ...completedJob, restoreSummary });
    }

    if (status === 'failed') {
      if (job.userId && !job.creditsRefunded) {
        await refundJobCreditsAsync({ userId: job.userId, jobId: job.jobId, credits: job.costCredits });
      }

      const failedJob = await updateStoredJobAsync(job.jobId, {
        status,
        progress,
        creditsRefunded: true,
        errorCode: 'MODEL_ERROR',
        errorMessage: prediction.error ?? 'Replicate prediction failed.'
      });

      return NextResponse.json({ ...failedJob, restoreSummary });
    }

    const updatedJob = await updateStoredJobAsync(job.jobId, { status, progress });

    return NextResponse.json({ ...updatedJob, restoreSummary });
  }

  return NextResponse.json({ ...job, restoreSummary });
}
