import { NextResponse } from 'next/server';
import { createStoredJob, updateStoredJob } from '@/lib/jobsStore';
import { createReplicatePrediction } from '@/lib/replicate';
import { getPublicInputUrl } from '@/lib/storage';

// POST 创建图片恢复任务；有 Replicate 配置时创建真实 prediction，否则返回本地 mock job。
export async function POST(request: Request) {
  const body = await request.json();
  const inputObjectKey = String(body.inputObjectKey ?? '');

  if (!inputObjectKey.startsWith('uploads/original/')) {
    return NextResponse.json({ errorCode: 'INVALID_INPUT_OBJECT' }, { status: 400 });
  }

  const job = createStoredJob(inputObjectKey);

  const replicateApiToken = process.env.REPLICATE_API_TOKEN ?? process.env.REPLICATE_API_TOKEN_PRIVATE;

  const inputImageUrl = await getPublicInputUrl(inputObjectKey);

  if (!replicateApiToken) {
    updateStoredJob(job.jobId, {
      status: 'completed',
      progress: 100,
      inputPreviewUrl: inputImageUrl,
      outputPreviewUrl: `https://picsum.photos/seed/${encodeURIComponent(job.jobId)}/1200/900`
    });

    return NextResponse.json({
      jobId: job.jobId,
      status: 'queued',
      costCredits: 1,
      mock: true
    });
  }

  const webhookBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_PUBLIC_BASE_URL;
  const webhookUrl = webhookBaseUrl ? `${webhookBaseUrl}/api/replicate/webhook?jobId=${job.jobId}` : undefined;
  const prediction = await createReplicatePrediction(inputImageUrl, webhookUrl);

  updateStoredJob(job.jobId, {
    replicatePredictionId: prediction.id,
    status: 'processing',
    progress: 10,
    inputPreviewUrl: inputImageUrl
  });

  return NextResponse.json({
    jobId: job.jobId,
    status: 'queued',
    costCredits: 1
  });
}
