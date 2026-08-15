import { getAuthenticatedUser } from '@/lib/authUser';
import { upsertUser } from '@/lib/billingStore';
import { createFeedbackAsync } from '@/lib/feedbackStore';
import type { FeedbackType } from '@/lib/feedbackStore';
import { NextResponse } from 'next/server';

type FeedbackRequestBody = {
  type?: unknown;
  message?: unknown;
  contact?: unknown;
  pagePath?: unknown;
};

// feedbackTypes 限定前端允许提交的反馈分类。
const feedbackTypes = ['idea', 'bug', 'praise', 'other'] as const;

// maxMessageLength 限制单条反馈长度，避免 D1 写入过大的用户输入。
const maxMessageLength = 2000;

// maxContactLength 限制可选联系方式长度，保留邮箱、社媒 handle 或简短说明空间。
const maxContactLength = 200;

// maxMetadataLength 限制页面路径和 user agent 这类上下文信息长度。
const maxMetadataLength = 500;

// POST 接收匿名或已登录用户反馈，并保存到当前环境可用的反馈存储。
export async function POST(request: Request) {
  let body: FeedbackRequestBody;

  try {
    body = (await request.json()) as FeedbackRequestBody;
  } catch {
    return createErrorResponse('INVALID_JSON', 'Please send valid feedback data.', 400);
  }

  const type = typeof body.type === 'string' ? body.type : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const contact = typeof body.contact === 'string' ? body.contact.trim() : '';
  const pagePath = typeof body.pagePath === 'string' ? body.pagePath.trim() : '';

  if (!isFeedbackType(type)) {
    return createErrorResponse('INVALID_FEEDBACK_TYPE', 'Choose a valid feedback type.', 400);
  }

  if (!message) {
    return createErrorResponse('MESSAGE_REQUIRED', 'Please write a message before sending feedback.', 400);
  }

  if (message.length > maxMessageLength) {
    return createErrorResponse('MESSAGE_TOO_LONG', `Feedback must be ${maxMessageLength} characters or less.`, 400);
  }

  if (contact.length > maxContactLength) {
    return createErrorResponse('CONTACT_TOO_LONG', `Contact must be ${maxContactLength} characters or less.`, 400);
  }

  const user = await getOptionalAuthenticatedUser(request);
  const userAgent = request.headers.get('user-agent')?.slice(0, maxMetadataLength) ?? undefined;

  try {
    if (user) await upsertUser(user);

    await createFeedbackAsync({
      type,
      message,
      contact: contact || undefined,
      pagePath: pagePath ? pagePath.slice(0, maxMetadataLength) : undefined,
      user,
      userAgent
    });

    return NextResponse.json({ ok: true });
  } catch {
    return createErrorResponse('FEEDBACK_SAVE_FAILED', 'Unable to save feedback right now. Please try again.', 500);
  }
}

// getOptionalAuthenticatedUser 读取可选登录态，失败时不阻断匿名反馈提交。
async function getOptionalAuthenticatedUser(request: Request) {
  try {
    return await getAuthenticatedUser(request);
  } catch {
    return null;
  }
}

// isFeedbackType 判断用户传入的反馈分类是否属于服务端白名单。
function isFeedbackType(type: string): type is FeedbackType {
  return feedbackTypes.includes(type as FeedbackType);
}

// createErrorResponse 统一反馈接口的错误响应结构。
function createErrorResponse(errorCode: string, errorMessage: string, status: number) {
  return NextResponse.json({ errorCode, errorMessage }, { status });
}
