import { getCurrentUser } from '@/lib/googleAuth';

// GET 返回当前浏览器的 Google 登录用户。
export async function GET(request: Request) {
  return Response.json({ user: await getCurrentUser(request) });
}
