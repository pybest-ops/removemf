import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/authUser';
import { getStoredJobAsync } from '@/lib/jobsStore';
import { createR2DownloadUrl } from '@/lib/r2';

// GET 返回当前用户结果图的短期下载地址。
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ errorCode: 'UNAUTHORIZED', errorMessage: 'Please sign in to download this image.' }, { status: 401 });
  }

  const job = await getStoredJobAsync(params.id);

  if (!job || job.userId !== user.id || job.deletedAt) {
    return NextResponse.json({ errorCode: 'JOB_NOT_FOUND' }, { status: 404 });
  }

  if (job.status !== 'completed' || !job.outputPreviewUrl) {
    return NextResponse.json({ errorCode: 'RESULT_NOT_READY' }, { status: 409 });
  }

  const signedDownloadUrl = job.outputObjectKey ? await createR2DownloadUrl(job.outputObjectKey) : null;

  return NextResponse.json({
    jobId: params.id,
    downloadUrl: signedDownloadUrl ?? job.outputPreviewUrl,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  });
}
