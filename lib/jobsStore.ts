import type { Job, JobStatus } from './types';

type StoredJob = Job & {
  inputObjectKey: string;
  outputObjectKey?: string;
  replicatePredictionId?: string;
};

type JobsStoreGlobal = typeof globalThis & {
  __removeMatchaJobs?: Map<string, StoredJob>;
};

// jobsStore 是本地开发用的内存任务表，后续生产环境替换成 D1。
const jobsStore = ((globalThis as JobsStoreGlobal).__removeMatchaJobs ??= new Map<string, StoredJob>());

// createStoredJob 创建图片恢复任务的本地记录。
export function createStoredJob(inputObjectKey: string): StoredJob {
  const now = new Date().toISOString();
  const job: StoredJob = {
    jobId: `job_${crypto.randomUUID()}`,
    inputObjectKey,
    status: 'queued',
    progress: 0,
    createdAt: now,
    updatedAt: now
  };

  jobsStore.set(job.jobId, job);

  return job;
}

// getStoredJob 按任务 ID 读取本地任务记录。
export function getStoredJob(jobId: string) {
  return jobsStore.get(jobId) ?? null;
}

// updateStoredJob 合并任务状态更新并刷新更新时间。
export function updateStoredJob(jobId: string, patch: Partial<StoredJob>) {
  const existingJob = jobsStore.get(jobId);

  if (!existingJob) return null;

  const nextJob: StoredJob = {
    ...existingJob,
    ...patch,
    updatedAt: new Date().toISOString()
  };

  jobsStore.set(jobId, nextJob);

  return nextJob;
}

// normalizeReplicateStatus 把 Replicate prediction 状态映射成站内任务状态。
export function normalizeReplicateStatus(status: string): JobStatus {
  if (status === 'succeeded') return 'completed';
  if (status === 'failed' || status === 'canceled') return 'failed';
  if (status === 'processing') return 'processing';
  return 'queued';
}
