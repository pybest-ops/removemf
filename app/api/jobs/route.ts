import { getAuthenticatedUser } from '@/lib/authUser';
import { consumeCreditsAsync, upsertUser } from '@/lib/billingStore';
import { createStoredJobAsync, updateStoredJobAsync } from '@/lib/jobsStore';
import { jobCostCredits } from '@/lib/pricing';
import { createReplicatePrediction } from '@/lib/replicate';
import { buildRestoreSettings, getRestoreSettingsSummary, isReferenceObjectKeyAllowed, serializeRestoreSettings } from '@/lib/restoreSettings';
import { getPublicInputUrl } from '@/lib/storage';
import { NextResponse } from 'next/server';

// POST 创建图片恢复任务；必须登录且有足够 credits，每次生成扣 1 credit。
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ errorCode: 'UNAUTHORIZED', errorMessage: 'Please sign in with Google before restoring an image.' }, { status: 401 });
    }

    await upsertUser(user);

    const body = await request.json();
    const inputObjectKey = String(body.inputObjectKey ?? '');
    const restoreSettings = buildRestoreSettings(body);

    if (!inputObjectKey.startsWith('uploads/original/')) {
      return NextResponse.json({ errorCode: 'INVALID_INPUT_OBJECT' }, { status: 400 });
    }

    if (restoreSettings.referenceObjectKey && !isReferenceObjectKeyAllowed(restoreSettings.referenceObjectKey)) {
      return NextResponse.json({ errorCode: 'INVALID_REFERENCE_OBJECT' }, { status: 400 });
    }

    const modelName = String(body.modelName ?? 'black-forest-labs/flux-kontext-pro');
    const restoreSettingsJson = serializeRestoreSettings(restoreSettings);
    const job = await createStoredJobAsync(inputObjectKey, user.id, jobCostCredits, modelName, restoreSettingsJson);
    const consumedCredit = await consumeCreditsAsync({ userId: user.id, jobId: job.jobId, credits: jobCostCredits });

    if (!consumedCredit) {
      await updateStoredJobAsync(job.jobId, {
        status: 'failed',
        progress: 100,
        errorCode: 'INSUFFICIENT_CREDITS',
        errorMessage: 'Buy credits before creating another restoration job.'
      });

      return NextResponse.json(
        { errorCode: 'INSUFFICIENT_CREDITS', errorMessage: 'Buy credits before creating another restoration job.' },
        { status: 402 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_TOKEN ?? process.env.REPLICATE_API_TOKEN_PRIVATE;
    const inputImageUrl = await getPublicInputUrl(inputObjectKey);
    const referenceImageUrl = restoreSettings.referenceObjectKey ? await getPublicInputUrl(restoreSettings.referenceObjectKey) : undefined;
    const restoreModelInput = {
      ...restoreSettings.modelInput,
      ...(referenceImageUrl ? { reference_image: referenceImageUrl } : {})
    };

    if (!replicateApiToken) {
      await updateStoredJobAsync(job.jobId, {
        status: 'completed',
        progress: 100,
        inputPreviewUrl: inputImageUrl,
        outputPreviewUrl: `https://picsum.photos/seed/${encodeURIComponent(job.jobId)}/1200/900`
      });

      const restoreSummary = getRestoreSettingsSummary(restoreSettings);

      return NextResponse.json({
        jobId: job.jobId,
        status: 'queued',
        costCredits: jobCostCredits,
        mock: true
      });
    }

    const webhookBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_PUBLIC_BASE_URL;
    const webhookUrl = webhookBaseUrl?.startsWith('https://')
      ? `${webhookBaseUrl}/api/replicate/webhook?jobId=${job.jobId}`
      : undefined;
    const prediction = await createReplicatePrediction(inputImageUrl, restoreModelInput, webhookUrl);

    await updateStoredJobAsync(job.jobId, {
      replicatePredictionId: prediction.id,
      status: 'processing',
      progress: 10,
      inputPreviewUrl: inputImageUrl
    });

    const restoreSummary = getRestoreSettingsSummary(restoreSettings);

    return NextResponse.json({
      jobId: job.jobId,
      status: 'queued',
      costCredits: jobCostCredits,
      restoreSummary
    });
  } catch (error) {
    return NextResponse.json(
      {
        errorCode: 'JOB_CREATE_FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown job creation error.'
      },
      { status: 500 }
    );
  }
}
