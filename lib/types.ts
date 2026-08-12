// JobStatus 表示图片恢复任务在异步链路中的当前状态。
export type JobStatus = 'created' | 'queued' | 'processing' | 'completed' | 'failed' | 'expired';

// Job 是前端轮询任务结果时依赖的最小任务数据结构。
export type Job = {
  jobId: string;
  status: JobStatus;
  progress: number;
  errorCode?: string;
  errorMessage?: string;
  inputPreviewUrl?: string;
  outputPreviewUrl?: string;
  createdAt: string;
  updatedAt: string;
};

// UploadSignResponse 是上传签名接口返回给前端的上传凭证。
export type UploadSignResponse = {
  uploadUrl: string | null;
  objectKey: string;
  expiresAt: string;
  maxSizeBytes: number;
  mockUpload: boolean;
};
