import { NextResponse } from 'next/server';
import { getStoredJob } from '@/lib/jobsStore';

// GET 返回结果图下载地址；当前返回已持久化的 preview URL，后续替换成 R2 签名下载 URL。
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = getStoredJob(params.id);

  if (!job) {
    return NextResponse.json({ errorCode: 'JOB_NOT_FOUND' }, { status: 404 });
  }

  if (job.status !== 'completed' || !job.outputPreviewUrl) {
    return NextResponse.json({ errorCode: 'RESULT_NOT_READY' }, { status: 409 });
  }

  return NextResponse.json({
    jobId: params.id,
    downloadUrl: job.outputPreviewUrl,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  });
}
