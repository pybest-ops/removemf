import type { Job, JobStatus } from './types';
import { getD1Database } from './cloudflareDb';

type StoredJob = Job & {
  userId?: string;
  costCredits: number;
  inputObjectKey: string;
  outputObjectKey?: string;
  replicatePredictionId?: string;
  creditsRefunded?: boolean;
};

type JobsStoreGlobal = typeof globalThis & {
  __removeMatchaJobs?: Map<string, StoredJob>;
};

type JobRow = {
  id: string;
  user_id?: string;
  input_object_key: string;
  output_object_key?: string;
  status: JobStatus;
  model_name?: string;
  cost_credits: number;
  progress: number;
  error_code?: string;
  error_message?: string;
  input_preview_url?: string;
  output_preview_url?: string;
  replicate_prediction_id?: string;
  credits_refunded: number;
  created_at: string;
  updated_at: string;
};

// jobsStore 是本地开发用的内存任务表，后续生产环境替换成 D1。
const jobsStore = ((globalThis as JobsStoreGlobal).__removeMatchaJobs ??= new Map<string, StoredJob>());

// createStoredJob 创建图片恢复任务的本地记录。
export function createStoredJob(inputObjectKey: string, userId?: string, costCredits = 1): StoredJob {
  const now = new Date().toISOString();
  const job: StoredJob = {
    jobId: `job_${crypto.randomUUID()}`,
    userId,
    inputObjectKey,
    costCredits,
    status: 'queued',
    progress: 0,
    createdAt: now,
    updatedAt: now
  };

  jobsStore.set(job.jobId, job);

  return job;
}

// createStoredJobAsync 优先把任务写入 D1，本地开发时回退到内存任务表。
export async function createStoredJobAsync(inputObjectKey: string, userId?: string, costCredits = 1, modelName?: string) {
  const db = getD1Database();

  if (!db) return createStoredJob(inputObjectKey, userId, costCredits);

  const now = new Date().toISOString();
  const job: StoredJob = {
    jobId: `job_${crypto.randomUUID()}`,
    userId,
    inputObjectKey,
    costCredits,
    status: 'queued',
    progress: 0,
    createdAt: now,
    updatedAt: now
  };

  await db
    .prepare(
      `INSERT INTO jobs (id, user_id, input_object_key, status, model_name, cost_credits, progress, credits_refunded, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    )
    .bind(job.jobId, userId ?? null, inputObjectKey, job.status, modelName ?? null, costCredits, job.progress, now, now)
    .run();

  return job;
}

// getStoredJob 按任务 ID 读取本地任务记录。
export function getStoredJob(jobId: string) {
  return jobsStore.get(jobId) ?? null;
}

// getStoredJobAsync 优先从 D1 读取任务，本地开发时回退到内存任务表。
export async function getStoredJobAsync(jobId: string) {
  const db = getD1Database();

  if (!db) return getStoredJob(jobId);

  const row = await db
    .prepare(
      `SELECT id, user_id, input_object_key, output_object_key, status, model_name, cost_credits, progress, error_code, error_message, input_preview_url, output_preview_url, replicate_prediction_id, credits_refunded, created_at, updated_at
       FROM jobs
       WHERE id = ?
       LIMIT 1`
    )
    .bind(jobId)
    .first<JobRow>();

  return row ? mapJobRow(row) : null;
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

// updateStoredJobAsync 优先更新 D1 任务，本地开发时回退到内存任务表。
export async function updateStoredJobAsync(jobId: string, patch: Partial<StoredJob>) {
  const db = getD1Database();

  if (!db) return updateStoredJob(jobId, patch);

  const fieldMap: Partial<Record<keyof StoredJob, string>> = {
    status: 'status',
    progress: 'progress',
    errorCode: 'error_code',
    errorMessage: 'error_message',
    inputPreviewUrl: 'input_preview_url',
    outputPreviewUrl: 'output_preview_url',
    outputObjectKey: 'output_object_key',
    replicatePredictionId: 'replicate_prediction_id',
    creditsRefunded: 'credits_refunded'
  };
  const entries = Object.entries(patch).filter(([key]) => fieldMap[key as keyof StoredJob]);

  if (!entries.length) return getStoredJobAsync(jobId);

  const updatedAt = new Date().toISOString();
  const assignments = entries.map(([key]) => `${fieldMap[key as keyof StoredJob]} = ?`);
  const values = entries.map(([, value]) => (typeof value === 'boolean' ? (value ? 1 : 0) : value));

  await db
    .prepare(`UPDATE jobs SET ${assignments.join(', ')}, updated_at = ? WHERE id = ?`)
    .bind(...values, updatedAt, jobId)
    .run();

  return getStoredJobAsync(jobId);
}

// normalizeReplicateStatus 把 Replicate prediction 状态映射成站内任务状态。
export function normalizeReplicateStatus(status: string): JobStatus {
  if (status === 'succeeded') return 'completed';
  if (status === 'failed' || status === 'canceled') return 'failed';
  if (status === 'processing') return 'processing';
  return 'queued';
}

// mapJobRow 把 D1 snake_case 任务行转换成前端使用的 Job 结构。
function mapJobRow(row: JobRow): StoredJob {
  return {
    jobId: row.id,
    userId: row.user_id,
    inputObjectKey: row.input_object_key,
    outputObjectKey: row.output_object_key,
    status: row.status,
    costCredits: row.cost_credits,
    progress: row.progress,
    errorCode: row.error_code,
    errorMessage: row.error_message,
    inputPreviewUrl: row.input_preview_url,
    outputPreviewUrl: row.output_preview_url,
    replicatePredictionId: row.replicate_prediction_id,
    creditsRefunded: Boolean(row.credits_refunded),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
