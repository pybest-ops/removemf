import { getD1Database } from './cloudflareDb';
import type { AuthenticatedUser } from './authUser';

export type FeedbackType = 'idea' | 'bug' | 'praise' | 'other';

export type CreateFeedbackInput = {
  type: FeedbackType;
  message: string;
  contact?: string;
  pagePath?: string;
  user?: AuthenticatedUser | null;
  userAgent?: string;
};

type StoredFeedback = CreateFeedbackInput & {
  id: string;
  createdAt: string;
};

type FeedbackStoreGlobal = typeof globalThis & {
  __removeMatchaFeedback?: Map<string, StoredFeedback>;
};

// feedbackStore 是本地开发缺少 D1 binding 时使用的内存反馈表。
const feedbackStore = ((globalThis as FeedbackStoreGlobal).__removeMatchaFeedback ??= new Map<string, StoredFeedback>());

// createFeedbackAsync 保存用户反馈，生产环境写入 D1，本地开发回退到内存表。
export async function createFeedbackAsync(input: CreateFeedbackInput) {
  const db = getD1Database();
  const now = new Date().toISOString();
  const feedback: StoredFeedback = {
    ...input,
    id: `feedback_${crypto.randomUUID()}`,
    createdAt: now
  };

  if (!db) {
    feedbackStore.set(feedback.id, feedback);
    return feedback;
  }

  await db
    .prepare(
      `INSERT INTO feedback (id, type, message, contact, page_path, user_id, user_email, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      feedback.id,
      feedback.type,
      feedback.message,
      feedback.contact ?? null,
      feedback.pagePath ?? null,
      feedback.user?.id ?? null,
      feedback.user?.email ?? null,
      feedback.userAgent ?? null,
      feedback.createdAt
    )
    .run();

  return feedback;
}
