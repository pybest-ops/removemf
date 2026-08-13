import { clearSessionCookie } from '@/lib/googleAuth';

// POST 清理当前浏览器的站点登录态。
export async function POST(request: Request) {
  const response = Response.json({ ok: true });

  response.headers.append('Set-Cookie', clearSessionCookie(request));

  return response;
}
