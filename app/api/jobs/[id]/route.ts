import { NextResponse } from 'next/server';
import { getStoredJob, normalizeReplicateStatus, updateStoredJob } from '@/lib/jobsStore';
import { getReplicateOutputUrl, getReplicatePrediction } from '@/lib/replicate';
import { persistRemoteImageToR2 } from '@/lib/storage';

// GET 查询图片恢复任务状态；有 Replicate prediction 时同步刷新状态。
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = getStoredJob(params.id);

  if (!job) {
    return NextResponse.json({ errorCode: 'JOB_NOT_FOUND' }, { status: 404 });
  }

  if (job.replicatePredictionId && job.status !== 'completed' && job.status !== 'failed') {
    const prediction = await getReplicatePrediction(job.replicatePredictionId);
    const status = normalizeReplicateStatus(prediction.status);
    const progress = status === 'completed' ? 100 : status === 'processing' ? 50 : 10;
    const outputUrl = getReplicateOutputUrl(prediction.output);

    if (status === 'completed' && outputUrl) {
      const persistedImage = await persistRemoteImageToR2(outputUrl, job.jobId);

      const completedJob = updateStoredJob(job.jobId, {
        status,
        progress: 100,
        outputObjectKey: persistedImage.objectKey,
        outputPreviewUrl: persistedImage.publicUrl
      });

      return NextResponse.json(completedJob);
    }

    if (status === 'failed') {
      const failedJob = updateStoredJob(job.jobId, {
        status,
        progress,
        errorCode: 'MODEL_ERROR',
        errorMessage: prediction.error ?? 'Replicate prediction failed.'
      });

      return NextResponse.json(failedJob);
    }

    const updatedJob = updateStoredJob(job.jobId, { status, progress });

    return NextResponse.json(updatedJob);
  }

  return NextResponse.json(job);
}
