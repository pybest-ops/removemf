'use client';

import { useEffect, useState } from 'react';
import type { Job } from './types';

// useJobPolling 负责按任务 ID 轮询后端任务状态，直到任务进入终态。
export function useJobPolling(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setIsPolling(false);
      return;
    }

    let shouldStop = false;
    let timeoutId: number | undefined;

    async function fetchJob() {
      if (shouldStop) return;

      setIsPolling(true);

      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const nextJob = (await response.json()) as Job;

        if (shouldStop) return;

        setJob(nextJob);

        if (nextJob.status === 'completed' || nextJob.status === 'failed' || nextJob.status === 'expired') {
          setIsPolling(false);
          return;
        }

        timeoutId = window.setTimeout(fetchJob, 1500);
      } catch {
        if (!shouldStop) setIsPolling(false);
      }
    }

    fetchJob();

    return () => {
      shouldStop = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [jobId]);

  return { job, isPolling };
}
