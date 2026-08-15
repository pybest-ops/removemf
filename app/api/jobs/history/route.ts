import { getAuthenticatedUser } from '@/lib/authUser';
import { listCompletedJobsByUserAsync } from '@/lib/jobsStore';
import { NextResponse } from 'next/server';

// GET 返回当前登录用户已完成的 AI Restore 历史图片列表。
export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ errorCode: 'UNAUTHORIZED', errorMessage: 'Please sign in to view your images.' }, { status: 401 });
  }

  const jobs = await listCompletedJobsByUserAsync(user.id);

  return NextResponse.json({
    images: jobs.map((job) => ({
      jobId: job.jobId,
      outputPreviewUrl: job.outputPreviewUrl,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      restoreMode: job.restoreMode,
      whiteBalanceMode: job.whiteBalanceMode,
      skinTonePriority: job.skinTonePriority
    }))
  });
}
